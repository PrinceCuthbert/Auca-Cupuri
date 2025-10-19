import { pool } from "../config/db.js";

export default class Review {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.rating = data.rating;
    this.text = data.text;
    this.createdAt = data.createdAt;
  }

  static async find(options = {}) {
    try {
      let query = "SELECT * FROM reviews";
      let params = [];

      if (options.sort) {
        if (options.sort.createdAt === -1) {
          query += " ORDER BY created_at DESC";
        } else if (options.sort.createdAt === 1) {
          query += " ORDER BY created_at ASC";
        }
      }

      if (options.limit) {
        query += " LIMIT ?";
        params.push(options.limit);
      }

      const [rows] = await pool.execute(query, params);
      return rows.map(
        (row) =>
          new Review({
            id: row.id,
            userId: row.user_id,
            rating: row.rating,
            text: row.text,
            createdAt: row.created_at,
          })
      );
    } catch (error) {
      throw new Error(`Failed to fetch reviews: ${error.message}`);
    }
  }

  static async create(data) {
    try {
      const { userId, rating, text, createdAt } = data;
      const query = `
        INSERT INTO reviews (user_id, rating, text, created_at) 
        VALUES (?, ?, ?, ?)
      `;
      const params = [userId, rating, text, createdAt || new Date()];

      const [result] = await pool.execute(query, params);

      // Return the created review
      const [rows] = await pool.execute("SELECT * FROM reviews WHERE id = ?", [
        result.insertId,
      ]);

      if (rows.length === 0) {
        throw new Error("Failed to retrieve created review");
      }

      const row = rows[0];
      return new Review({
        id: row.id,
        userId: row.user_id,
        rating: row.rating,
        text: row.text,
        createdAt: row.created_at,
      });
    } catch (error) {
      throw new Error(`Failed to create review: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute("SELECT * FROM reviews WHERE id = ?", [
        id,
      ]);

      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];
      return new Review({
        id: row.id,
        userId: row.user_id,
        rating: row.rating,
        text: row.text,
        createdAt: row.created_at,
      });
    } catch (error) {
      throw new Error(`Failed to find review: ${error.message}`);
    }
  }

  static async update(id, data) {
    try {
      const fields = [];
      const values = [];

      if (data.rating !== undefined) {
        fields.push("rating = ?");
        values.push(data.rating);
      }
      if (data.text !== undefined) {
        fields.push("text = ?");
        values.push(data.text);
      }

      if (fields.length === 0) {
        throw new Error("No fields to update");
      }

      values.push(id);
      const query = `UPDATE reviews SET ${fields.join(", ")} WHERE id = ?`;

      await pool.execute(query, values);

      return await this.findById(id);
    } catch (error) {
      throw new Error(`Failed to update review: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute("DELETE FROM reviews WHERE id = ?", [
        id,
      ]);

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Failed to delete review: ${error.message}`);
    }
  }
}
