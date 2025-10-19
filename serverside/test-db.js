// Test database connection
import { pool } from "./config/db.js";
import bcrypt from "bcryptjs";

async function testDatabase() {
  try {
    console.log("Testing database connection...");

    // Test basic connection
    const [rows] = await pool.query("SELECT 1 as test");
    console.log("✅ Database connection successful:", rows);

    // Test if users table exists
    const [tables] = await pool.query("SHOW TABLES LIKE 'users'");
    if (tables.length > 0) {
      console.log("✅ Users table exists");

      // Test table structure
      const [columns] = await pool.query("DESCRIBE users");
      console.log("📋 Users table structure:", columns);

      // Test if we can insert a test user
      const testEmail = "test@example.com";
      const [existing] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [testEmail]
      );

      if (existing.length === 0) {
        console.log("🧪 Testing user insertion...");
        const hashedPassword = await bcrypt.hash("testpassword", 10);
        await pool.query(
          "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
          ["Test User", testEmail, hashedPassword, "student"]
        );
        console.log("✅ Test user created successfully");

        // Clean up test user
        await pool.query("DELETE FROM users WHERE email = ?", [testEmail]);
        console.log("🧹 Test user cleaned up");
      } else {
        console.log("ℹ️ Test user already exists, skipping insertion test");
      }
    } else {
      console.log(
        "❌ Users table does not exist. Please run the SQL commands to create it."
      );
    }
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    console.log("\n🔧 Please check:");
    console.log("1. MySQL server is running");
    console.log("2. Database 'auca_cupuri_portal' exists");
    console.log("3. User 'root' has correct password");
    console.log("4. .env file is configured properly");
  } finally {
    await pool.end();
    process.exit(0);
  }
}

testDatabase();
