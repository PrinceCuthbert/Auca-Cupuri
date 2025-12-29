import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Send, User, Tag } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

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
      if (!user) return;

      const response = await fetch(
        "http://localhost:3009/api/reviews/general",
        {
          credentials: "include",
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
      if (!user) return;

      const response = await fetch(
        "http://localhost:3009/api/reviews/general/stats",
        {
          credentials: "include",
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

    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(
        "http://localhost:3009/api/reviews/general",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
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
      "General Feedback": "bg-gray-100 text-gray-700",
      Usability: "bg-blue-100 text-blue-700",
      "Content Quality": "bg-green-100 text-green-700",
      Performance: "bg-amber-100 text-amber-700",
      "Feature Request": "bg-purple-100 text-purple-700",
      "Bug Report": "bg-red-100 text-red-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Reviews & Feedback
            </h1>
          </div>
          <p className="text-gray-600 text-sm">
            Share your experience with the AUCA CUPURI portal and help us
            improve our services for all students.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Overall Rating & Submit Form */}
          <div className="lg:col-span-1 space-y-6">
            {/* Overall Rating Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Overall Rating
              </h3>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-amber-500 mb-2">
                  {stats?.average_rating
                    ? Number(stats.average_rating).toFixed(1)
                    : "0.0"}
                </div>
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const avgRating = Number(stats?.average_rating) || 0;
                    const isFilled = star <= Math.floor(avgRating);
                    return (
                      <Star
                        key={star}
                        size={20}
                        fill={isFilled ? "#f59e0b" : "none"}
                        stroke="#f59e0b"
                        strokeWidth={2}
                      />
                    );
                  })}
                </div>
                <p className="text-sm text-gray-600">
                  Based on {stats?.total_reviews || 0} reviews
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats?.[`${star}_star`] || 0;
                  const percentage =
                    stats?.total_reviews > 0
                      ? (count / stats.total_reviews) * 100
                      : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="text-gray-700 font-medium w-8">
                        {star}★
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-amber-400 h-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-gray-600 w-8 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Review Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Submit Your Review
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Star Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overall Rating *
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="focus:outline-none transition-transform hover:scale-110">
                        <Star
                          size={28}
                          fill={star <= (hover || rating) ? "#f59e0b" : "none"}
                          stroke="#f59e0b"
                          strokeWidth={2}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-2">
                    Review Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your experience..."
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition bg-white">
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Comment */}
                <div>
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your detailed feedback..."
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition resize-none"
                  />
                </div>

                {/* Anonymous Checkbox */}
                <div className="flex items-center">
                  <input
                    id="anonymous"
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <label
                    htmlFor="anonymous"
                    className="ml-2 text-sm text-gray-700">
                    Submit anonymously
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || rating === 0}
                  className="w-full px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <Send size={18} />
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Recent Reviews */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Recent Reviews
              </h3>
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-gray-900 font-medium mb-1">
                      No reviews yet
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Be the first to share your experience!
                    </p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                      {/* Admin Response (if exists) */}
                      {review.admin_response && (
                        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs">
                                👨‍💼
                              </div>
                              <span className="text-sm font-semibold text-teal-900">
                                Admin Response
                              </span>
                            </div>
                            <span className="text-xs text-teal-700">
                              {formatDate(review.admin_response_date)}
                            </span>
                          </div>
                          <p className="text-sm text-teal-900 mb-2">
                            {review.admin_response}
                          </p>
                          <p className="text-xs text-teal-700 font-medium">
                            - {review.admin_name || "Administrator"}
                          </p>
                        </div>
                      )}

                      {/* Review Content */}
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {review.is_anonymous
                                ? "Anonymous User"
                                : review.user_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={14}
                                  fill={
                                    star <= review.rating ? "#f59e0b" : "none"
                                  }
                                  stroke="#f59e0b"
                                  strokeWidth={2}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatDate(review.created_at)}
                            </span>
                          </div>
                        </div>

                        <h4 className="text-base font-semibold text-gray-900 mb-2">
                          {review.title}
                        </h4>
                        <p className="text-sm text-gray-700 mb-3">
                          {review.comment}
                        </p>

                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                            review.category
                          )}`}>
                          <Tag size={12} />
                          {review.category}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentReviews;
