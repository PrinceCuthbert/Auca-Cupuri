import React, { useState, useEffect } from "react";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ReviewComponent = ({ examId, onReviewSubmit }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [existingReview, setExistingReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  // Fetch existing review and stats
  useEffect(() => {
    if (examId) {
      fetchUserReview();
      fetchReviewStats();
    }
  }, [examId]);

  const fetchUserReview = async () => {
    try {
      if (!user) return;

      const response = await fetch(
        `http://localhost:3009/api/reviews/exam/${examId}/user`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const review = await response.json();
        if (review) {
          setExistingReview(review);
          setRating(review.rating);
          setComment(review.comment || "");
        }
      }
    } catch (error) {
      console.error("Error fetching user review:", error);
    }
  };

  const fetchReviewStats = async () => {
    try {
      if (!user) return;

      const response = await fetch(
        `http://localhost:3009/api/reviews/exam/${examId}/stats`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const stats = await response.json();
        setStats(stats);
      }
    } catch (error) {
      console.error("Error fetching review stats:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    console.log("🔍 Review Submit Debug:");
    console.log("User object:", user);
    console.log("User exists?", !!user);
    console.log("Rating:", rating);
    console.log("Comment:", comment);
    console.log("Exam ID:", examId);

    if (!user) {
      console.error("❌ User is null/undefined - not authenticated");
      alert("Please login to submit a review");
      return;
    }

    setLoading(true);
    try {
      console.log(
        "📤 Sending review to:",
        `http://localhost:3009/api/reviews/exam/${examId}`
      );
      const response = await fetch(
        `http://localhost:3009/api/reviews/exam/${examId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating, comment }),
        }
      );

      console.log("📥 Response status:", response.status);
      console.log("Response ok?", response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Success:", result);
        alert(result.message);
        fetchUserReview();
        fetchReviewStats();
        if (onReviewSubmit) onReviewSubmit();
      } else {
        const error = await response.json();
        console.error("❌ Error response:", error);
        console.error("Error status:", response.status);
        console.error("Error message:", error.message);
        alert(error.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("💥 Exception caught:", error);
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
      alert("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your review?")) return;

    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3009/api/reviews/exam/${examId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        setExistingReview(null);
        setRating(0);
        setComment("");
        fetchReviewStats();
        if (onReviewSubmit) onReviewSubmit();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="review-login-prompt">
        <p>Please login to leave a review</p>
      </div>
    );
  }

  return (
    <div className="review-component">
      {/* Review Stats */}
      {stats && (
        <div className="review-stats">
          <div className="stats-header">
            <h3>Reviews</h3>
            <div className="average-rating">
              <span className="rating-number">
                {stats.average_rating?.toFixed(1) || 0}
              </span>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={`star ${
                      star <= (stats.average_rating || 0) ? "filled" : "empty"
                    }`}
                  />
                ))}
              </div>
              <span className="total-reviews">
                ({stats.total_reviews} reviews)
              </span>
            </div>
          </div>

          <div className="rating-breakdown">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats[`${star}_star`] || 0;
              const percentage =
                stats.total_reviews > 0
                  ? (count / stats.total_reviews) * 100
                  : 0;
              return (
                <div key={star} className="rating-bar">
                  <span className="star-label">{star}★</span>
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review Form */}
      <div className="review-form">
        <h3>{existingReview ? "Update Your Review" : "Write a Review"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="rating-input">
            <label>Rating:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-button ${
                    star <= rating ? "filled" : "empty"
                  }`}
                  onClick={() => setRating(star)}>
                  <Star size={24} />
                </button>
              ))}
            </div>
          </div>

          <div className="comment-input">
            <label htmlFor="comment">Comment (optional):</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this exam..."
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={rating === 0 || loading}
              className="submit-button">
              {loading
                ? "Submitting..."
                : existingReview
                ? "Update Review"
                : "Submit Review"}
            </button>

            {existingReview && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="delete-button">
                Delete Review
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewComponent;
