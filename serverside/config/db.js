// config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Test database connection
const testConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "Cuthbert@123",
      database: process.env.DB_NAME || "auca_cupuri_portal",
    });

    console.log("✅ Database connected successfully!");
    await connection.end();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.log("\n🔧 Please check:");
    console.log("1. MySQL server is running");
    console.log("2. Database 'auca_cupuri_portal' exists");
    console.log("3. User 'root' has correct password");
    console.log("4. .env file is configured properly");
  }
};

export const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  user: process.env.MYSQLUSER || process.env.DB_USER || "root",
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "PrinceCuthbert@123",
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || "auca_cupuri_portal",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection on startup
testConnection();
