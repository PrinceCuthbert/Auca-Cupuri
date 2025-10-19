import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

async function migrateReviews() {
  let connection;
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Cuthbert@123",
      database: "auca_cupuri_portal",
    });

    console.log("Connected to database");

    // Read SQL file
    const sqlPath = path.join(process.cwd(), "sql", "create_reviews_table.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    // Split by semicolon and execute each statement
    const statements = sql.split(";").filter((stmt) => stmt.trim().length > 0);

    for (const statement of statements) {
      if (statement.trim()) {
        const trimmedStatement = statement.trim();
        console.log("Executing:", trimmedStatement.substring(0, 50) + "...");

        // Handle USE statement differently
        if (trimmedStatement.toUpperCase().startsWith("USE ")) {
          await connection.query(trimmedStatement);
        } else {
          await connection.execute(trimmedStatement);
        }
      }
    }

    console.log("✅ Database migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed");
    }
  }
}

migrateReviews();
