import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Send, User, Calendar, Tag } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./StudentReviews.css";

const StudentReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("General Feedback");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    "General Feedback",
    "Usability",
    "Content Quality",
    "Performance",
    "Feature Request",
    "Bug Report",
  ];

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, []);

  const fetchReviews = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("auca-cupuri-user"));
      if (!user?.token) return;

      const response = await fetch(
        "http://localhost:3009/api/reviews/general",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("auca-cupuri-user"));
      if (!user?.token) return;

      const response = await fetch(
        "http://localhost:3009/api/reviews/general/stats",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || !title.trim() || !comment.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem("auca-cupuri-user"));
      if (!user?.token) {
        toast.error("Please login to submit a review");
        return;
      }

      const response = await fetch(
        "http://localhost:3009/api/reviews/general",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            rating,
            title: title.trim(),
            comment: comment.trim(),
            category,
            isAnonymous,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message || "Review submitted successfully!");
        setRating(0);
        setTitle("");
        setComment("");
        setCategory("General Feedback");
        setIsAnonymous(false);
        fetchReviews();
        fetchStats();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      "General Feedback": "#6b7280",
      Usability: "#3b82f6",
      "Content Quality": "#10b981",
      Performance: "#f59e0b",
      "Feature Request": "#8b5cf6",
      "Bug Report": "#ef4444",
    };
    return colors[category] || "#6b7280";
  };

  if (loading) {
    return (
      <div className="student-reviews-page">
        <div className="loading">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="student-reviews-page">
      {/* Header */}
      <div className="reviews-header">
        <div className="header-content">
          <div className="header-icon">
            <MessageSquare size={32} />
          </div>
          <div className="header-text">
            <h1>Reviews & Feedback</h1>
            <p>
              Share your experience with the AUCA CUPURI portal and help us
              improve our services for all students.
            </p>
          </div>
        </div>
      </div>

      <div className="reviews-content">
        {/* Review Summary */}
        <div className="review-summary">
          <div className="summary-card">
            <h3>Overall Rating</h3>
            <div className="rating-display">
              <span className="rating-number">
                {stats?.average_rating
                  ? Number(stats.average_rating).toFixed(1)
                  : "0.0"}
              </span>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    className={`star ${
                      star <= (Number(stats?.average_rating) || 0)
                        ? "filled"
                        : "empty"
                    }`}
                  />
                ))}
              </div>
              <span className="total-reviews">
                Based on {stats?.total_reviews || 0} reviews
              </span>
            </div>
          </div>

          <div className="rating-breakdown">
            <h4>Rating Distribution</h4>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats?.[`${star}_star`] || 0;
              const percentage =
                stats?.total_reviews > 0
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

        <div className="reviews-main">
          {/* Submit Review Form */}
          <div className="submit-review-section">
            <h2>Submit Your Review</h2>
            <form onSubmit={handleSubmit} className="review-form">
              <div className="form-group">
                <label>Overall Rating *</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-button ${
                        star <= (hover || rating) ? "filled" : "empty"
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}>
                      <Star size={32} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="title">Review Title *</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="comment">Your Review *</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your detailed feedback..."
                  rows={4}
                  required
                />
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Submit anonymously
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting || rating === 0}
                className="submit-button">
                <Send size={20} />
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>

          {/* Recent Reviews */}
          <div className="recent-reviews-section">
            <h2>Recent Reviews</h2>
            <div className="reviews-list">
              {reviews.length === 0 ? (
                <div className="no-reviews">
                  <MessageSquare size={48} />
                  <h3>No reviews yet</h3>
                  <p>Be the first to share your experience!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    {review.admin_response && (
                      <div className="admin-response">
                        <div className="admin-header">
                          <div className="admin-badge-container">
                            <div className="admin-icon">👨‍💼</div>
                            <span className="admin-badge">Admin Response</span>
                          </div>
                          <span className="admin-date">
                            {formatDate(review.admin_response_date)}
                          </span>
                        </div>
                        <div className="admin-message">
                          <p>{review.admin_response}</p>
                        </div>
                        <div className="admin-footer">
                          <span className="admin-name">
                            - {review.admin_name || "Administrator"}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="review-content">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <User size={16} />
                          <span>
                            {review.is_anonymous
                              ? "Anonymous User"
                              : review.user_name}
                          </span>
                        </div>
                        <div className="review-meta">
                          <div className="review-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                className={`star ${
                                  star <= review.rating ? "filled" : "empty"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="review-date">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                      </div>

                      <h3 className="review-title">{review.title}</h3>
                      <p className="review-comment">{review.comment}</p>

                      <div className="review-footer">
                        <span
                          className="category-tag"
                          style={{
                            backgroundColor: getCategoryColor(review.category),
                          }}>
                          <Tag size={12} />
                          {review.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentReviews;
