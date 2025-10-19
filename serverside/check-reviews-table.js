import mysql from "mysql2/promise";

async function checkReviewsTable() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Cuthbert@123",
      database: "auca_cupuri_portal",
    });

    console.log("Connected to database");

    // Check if reviews table exists
    const [tables] = await connection.query("SHOW TABLES LIKE 'reviews'");
    console.log("Reviews table exists:", tables.length > 0);

    if (tables.length > 0) {
      // Get table structure
      const [columns] = await connection.query("DESCRIBE reviews");
      console.log("Reviews table structure:");
      columns.forEach((col) => {
        console.log(
          `- ${col.Field}: ${col.Type} ${
            col.Null === "NO" ? "NOT NULL" : "NULL"
          } ${col.Key ? `(${col.Key})` : ""}`
        );
      });
    }

    // Check if admin_responses table exists
    const [adminTables] = await connection.query(
      "SHOW TABLES LIKE 'admin_responses'"
    );
    console.log("Admin responses table exists:", adminTables.length > 0);

    if (adminTables.length > 0) {
      const [adminColumns] = await connection.query("DESCRIBE admin_responses");
      console.log("Admin responses table structure:");
      adminColumns.forEach((col) => {
        console.log(
          `- ${col.Field}: ${col.Type} ${
            col.Null === "NO" ? "NOT NULL" : "NULL"
          } ${col.Key ? `(${col.Key})` : ""}`
        );
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkReviewsTable();
