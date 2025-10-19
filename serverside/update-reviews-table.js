import mysql from "mysql2/promise";

async function updateReviewsTable() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Cuthbert@123",
      database: "auca_cupuri_portal",
    });

    console.log("Connected to database");

    // Add missing columns to reviews table
    const alterQueries = [
      "ALTER TABLE reviews ADD COLUMN IF NOT EXISTS title VARCHAR(255) AFTER rating",
      "ALTER TABLE reviews ADD COLUMN IF NOT EXISTS category ENUM('General Feedback', 'Usability', 'Content Quality', 'Performance', 'Feature Request', 'Bug Report') DEFAULT 'General Feedback' AFTER title",
      "ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT FALSE AFTER category",
      "ALTER TABLE reviews CHANGE COLUMN text comment TEXT AFTER is_anonymous",
    ];

    for (const query of alterQueries) {
      try {
        console.log("Executing:", query);
        await connection.execute(query);
        console.log("✅ Success");
      } catch (error) {
        if (
          error.code === "ER_DUP_FIELDNAME" ||
          error.code === "ER_CANT_DROP_FIELD"
        ) {
          console.log(
            "⚠️ Column already exists or cannot be modified, skipping..."
          );
        } else {
          console.log("❌ Error:", error.message);
        }
      }
    }

    console.log("✅ Database update completed successfully!");
  } catch (error) {
    console.error("❌ Update failed:", error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed");
    }
  }
}

updateReviewsTable();
