-- Create visits table to track user activity
CREATE TABLE IF NOT EXISTS visits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    user_name VARCHAR(255),
    user_role VARCHAR(50),
    visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    page_visited VARCHAR(255) DEFAULT 'dashboard',
    ip_address VARCHAR(45),
    user_agent TEXT,
    INDEX idx_visit_time (visit_time),
    INDEX idx_user_id (user_id)
);

-- Example query to get visits per hour for the last 24 hours
-- SELECT DATE_FORMAT(visit_time, '%Y-%m-%d %H:00:00') as hour, COUNT(*) as visits 
-- FROM visits 
-- WHERE visit_time >= NOW() - INTERVAL 24 HOUR 
-- GROUP BY hour 
-- ORDER BY hour;

-- Example query to get visits per day for the last 30 days
-- SELECT DATE(visit_time) as day, COUNT(*) as visits 
-- FROM visits 
-- WHERE visit_time >= NOW() - INTERVAL 30 DAY 
-- GROUP BY day 
-- ORDER BY day;
