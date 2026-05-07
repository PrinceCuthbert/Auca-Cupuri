import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

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
};

async function alterTable() {
  try {
    const connection = await mysql.createConnection(poolConfig);
    console.log("Connected to DB...");
    
    // Modify filePath to handle an array of very long Cloudinary URLs
    await connection.query("ALTER TABLE exams MODIFY COLUMN filePath LONGTEXT;");
    console.log("Successfully altered column filePath to LONGTEXT");
    
    process.exit(0);
  } catch (err) {
    console.error("Error altering table:", err);
    process.exit(1);
  }
}

alterTable();
