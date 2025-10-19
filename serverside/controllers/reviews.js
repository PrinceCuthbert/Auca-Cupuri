import Review from "../models/Review.js"; // create a Review model/schema

import { pool } from "../config/db.js";
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ sort: { createdAt: -1 } });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

export const addReview = async (req, res) => {
  try {
    const { userId, rating, text } = req.body;
    const newReview = await Review.create({
      userId,
      rating,
      text,
      createdAt: new Date(),
    });
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: "Failed to add review" });
  }
};
