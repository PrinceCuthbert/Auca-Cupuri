// config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Test database connection
const testConnection = async () => {
  try {
    const config = {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "Cuthbert@123",
      database: process.env.DB_NAME || "auca_cupuri_portal",
    };

    // Add SSL for PlanetScale or Aiven (production)
    if (
      (process.env.DB_HOST && process.env.DB_HOST.includes("psdb.cloud")) ||
      (process.env.DB_HOST && process.env.DB_HOST.includes("aivencloud.com"))
    ) {
      config.ssl = {
        rejectUnauthorized: true,
        // For Aiven, we need to handle self-signed certificates
        ...(process.env.DB_HOST.includes("aivencloud.com") && {
          rejectUnauthorized: false,
        }),
      };
    }

    const connection = await mysql.createConnection(config);
    console.log("✅ Database connected successfully!");
    await connection.end();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.log("\n🔧 Please check your database configuration");
  }
};

// Database pool configuration
const poolConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  user: process.env.MYSQLUSER || process.env.DB_USER || "root",
  password:
    process.env.MYSQLPASSWORD ||
    process.env.DB_PASSWORD ||
    "PrinceCuthbert@123",
  database:
    process.env.MYSQLDATABASE || process.env.DB_NAME || "auca_cupuri_portal",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Add SSL for PlanetScale or Aiven (production)
if (
  poolConfig.host.includes("psdb.cloud") ||
  poolConfig.host.includes("aivencloud.com")
) {
  poolConfig.ssl = {
    rejectUnauthorized: true,
    // For Aiven, we need to handle self-signed certificates
    ...(poolConfig.host.includes("aivencloud.com") && {
      rejectUnauthorized: false,
    }),
  };
}

export const pool = mysql.createPool(poolConfig);

// Test connection on startup
testConnection();
