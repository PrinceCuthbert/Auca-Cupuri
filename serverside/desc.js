import { pool } from "./config/db.js";

async function run() {
    try {
        const [rows] = await pool.query("DESCRIBE exams");
        console.log(rows);
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

run();
