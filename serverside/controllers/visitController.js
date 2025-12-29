import { pool } from "../config/db.js";

// Log a visit
export const logVisit = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;
    const userName = req.user?.name || "Anonymous";
    const userRole = req.user?.role || "guest";
    const pageVisited = req.body?.page || "dashboard";
    const ipAddress =
      req.headers["x-forwarded-for"] || req.connection?.remoteAddress || null;
    const userAgent = req.headers["user-agent"] || null;

    await pool.query(
      `INSERT INTO visits (user_id, user_name, user_role, page_visited, ip_address, user_agent) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, userName, userRole, pageVisited, ipAddress, userAgent]
    );

    res.status(201).json({ message: "Visit logged" });
  } catch (err) {
    console.error("Error logging visit:", err);
    // Don't fail the request if logging fails
    res.status(200).json({ message: "Visit logging skipped" });
  }
};

// Get visit statistics for charts
export const getVisitStats = async (req, res, next) => {
  try {
    const { range = "week" } = req.query;

    let query;
    let params = [];

    if (range === "hour" || range === "day") {
      // Last 24 hours, grouped by hour - shows when users logged in today
      query = `
        SELECT 
          DATE_FORMAT(visit_time, '%Y-%m-%d %H:00:00') as time_period,
          COUNT(*) as visits,
          COUNT(DISTINCT user_id) as unique_users
        FROM visits 
        WHERE visit_time >= NOW() - INTERVAL 24 HOUR 
        GROUP BY time_period 
        ORDER BY time_period
      `;
    } else if (range === "week") {
      // Last 7 days, grouped by day
      query = `
        SELECT 
          DATE(visit_time) as time_period,
          COUNT(*) as visits,
          COUNT(DISTINCT user_id) as unique_users
        FROM visits 
        WHERE visit_time >= NOW() - INTERVAL 7 DAY 
        GROUP BY time_period 
        ORDER BY time_period
      `;
    } else if (range === "month") {
      // Last 30 days, grouped by day
      query = `
        SELECT 
          DATE(visit_time) as time_period,
          COUNT(*) as visits,
          COUNT(DISTINCT user_id) as unique_users
        FROM visits 
        WHERE visit_time >= NOW() - INTERVAL 30 DAY 
        GROUP BY time_period 
        ORDER BY time_period
      `;
    } else if (range === "year") {
      // Last 12 months, grouped by month
      query = `
        SELECT 
          DATE_FORMAT(visit_time, '%Y-%m') as time_period,
          COUNT(*) as visits,
          COUNT(DISTINCT user_id) as unique_users
        FROM visits 
        WHERE visit_time >= NOW() - INTERVAL 12 MONTH 
        GROUP BY time_period 
        ORDER BY time_period
      `;
    } else if (range === "all") {
      // All time data for zoomable chart - grouped by day
      query = `
        SELECT 
          DATE(visit_time) as time_period,
          COUNT(*) as visits,
          COUNT(DISTINCT user_id) as unique_users
        FROM visits 
        GROUP BY time_period 
        ORDER BY time_period
      `;
    }

    const [rows] = await pool.query(query);

    // Also get summary stats
    const [summaryRows] = await pool.query(`
      SELECT 
        COUNT(*) as total_visits,
        COUNT(DISTINCT user_id) as total_unique_users,
        (SELECT COUNT(*) FROM visits WHERE visit_time >= NOW() - INTERVAL 24 HOUR) as visits_today,
        (SELECT COUNT(*) FROM visits WHERE visit_time >= NOW() - INTERVAL 7 DAY) as visits_this_week,
        (SELECT COUNT(DISTINCT user_id) FROM visits WHERE visit_time >= NOW() - INTERVAL 24 HOUR) as unique_today
      FROM visits
    `);

    res.json({
      data: rows,
      summary: summaryRows[0] || {
        total_visits: 0,
        total_unique_users: 0,
        visits_today: 0,
        visits_this_week: 0,
        unique_today: 0,
      },
    });
  } catch (err) {
    console.error("Error getting visit stats:", err);
    next(err);
  }
};

// Get hourly breakdown for a specific day (for detailed zoom)
export const getHourlyVisits = async (req, res, next) => {
  try {
    const { date } = req.query; // Format: YYYY-MM-DD

    const query = `
      SELECT 
        DATE_FORMAT(visit_time, '%Y-%m-%d %H:00:00') as time_period,
        COUNT(*) as visits,
        COUNT(DISTINCT user_id) as unique_users
      FROM visits 
      WHERE DATE(visit_time) = ?
      GROUP BY time_period 
      ORDER BY time_period
    `;

    const [rows] = await pool.query(query, [date]);
    res.json({ data: rows });
  } catch (err) {
    console.error("Error getting hourly visits:", err);
    next(err);
  }
};
