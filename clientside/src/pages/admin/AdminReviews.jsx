import React, { useState, useEffect, useMemo } from "react";
import {
  Star,
  User,
  Calendar,
  MessageSquare,
  Trash2,
  Eye,
  Send,
  Edit,
  X,
  Search,
  Filter,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../api/api";
import { toast } from "react-toastify";
import { Modal, notification } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

const AdminReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [isResponding, setIsResponding] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    if (user?.role === "admin") {
      fetchReviews();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${BASE_URL}/reviews/general`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unauthorized");
      }

      const data = await response.json();
      setReviews(data);
    } catch {
      // Silent fail - reviews will be empty
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const handleDeleteReview = (reviewId) => {
    Modal.confirm({
      title: "Delete Review",
      icon: <ExclamationCircleOutlined />,
      content:
        "Are you sure you want to delete this review? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          const response = await fetch(
            `${BASE_URL}/reviews/general/${reviewId}`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );

          if (response.ok) {
            setReviews(reviews.filter((review) => review.id !== reviewId));
            notification.success({
              message: "Success",
              description: "Review deleted successfully",
              placement: "topRight",
              duration: 3,
            });
          } else {
            const errorData = await response.json();
            notification.error({
              message: "Error",
              description: errorData.message || "Failed to delete review",
              placement: "topRight",
              duration: 3,
            });
          }
        } catch {
          notification.error({
            message: "Error",
            description: "Error deleting review",
            placement: "topRight",
            duration: 3,
          });
        }
      },
    });
  };

  const handleDeleteResponse = async (reviewId) => {
    Modal.confirm({
      title: "Delete Response",
      icon: <ExclamationCircleOutlined />,
      content:
        "Are you sure you want to delete this response? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          const response = await fetch(
            `${BASE_URL}/reviews/${reviewId}/response`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );

          if (response.ok) {
            notification.success({
              message: "Success",
              description: "Response deleted successfully",
              placement: "topRight",
              duration: 3,
            });
            fetchReviews();
          } else {
            const error = await response.json();
            notification.error({
              message: "Error",
              description: error.message || "Failed to delete response",
              placement: "topRight",
              duration: 3,
            });
          }
        } catch {
          notification.error({
            message: "Error",
            description: "Error deleting response",
            placement: "topRight",
            duration: 3,
          });
        }
      },
    });
  };

  const openResponseModal = (review) => {
    setSelectedReview(review);
    setResponseText(review.admin_response || "");
    setShowResponseModal(true);
  };

  const closeResponseModal = () => {
    setSelectedReview(null);
    setResponseText("");
    setShowResponseModal(false);
  };

  const handleResponseSubmit = async () => {
    if (!selectedReview || !responseText.trim()) return;

    setIsResponding(true);
    try {
      const isEdit = !!selectedReview.admin_response;
      const response = await fetch(
        `${BASE_URL}/reviews/${selectedReview.id}/response`,
        {
          method: isEdit ? "PUT" : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ response: responseText }),
        }
      );

      if (response.ok) {
        notification.success({
          message: "Success",
          description: isEdit
            ? "Response updated successfully"
            : "Response added successfully",
          placement: "topRight",
          duration: 3,
        });
        closeResponseModal();
        fetchReviews();
      } else {
        const error = await response.json();
        notification.error({
          message: "Error",
          description:
            error.message || `Failed to ${isEdit ? "update" : "add"} response`,
          placement: "topRight",
          duration: 3,
        });
      }
    } catch {
      notification.error({
        message: "Error",
        description: "Error processing response",
        placement: "topRight",
        duration: 3,
      });
    } finally {
      setIsResponding(false);
    }
  };

  const reviewCounts = useMemo(() => {
    const withResponse = reviews.filter((r) => r.admin_response).length;
    const withoutResponse = reviews.filter((r) => !r.admin_response).length;
    return { withResponse, withoutResponse };
  }, [reviews]);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "with_response" &&
        review.admin_response !== null &&
        review.admin_response !== undefined &&
        review.admin_response !== "") ||
      (filter === "without_response" &&
        (!review.admin_response ||
          review.admin_response === null ||
          review.admin_response === undefined));

    return matchesSearch && matchesFilter;
  });

  if (initialLoad && loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#008767] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Access Denied
          </h2>
          <p className="text-slate-600">
            You need admin privileges to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-[#008767] rounded-xl flex items-center justify-center shadow-sm">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Reviews Management
              </h1>
              <p className="text-slate-500 text-base mt-1">
                Manage and respond to user feedback
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search reviews by name, title, or comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008767] focus:bg-white focus:border-transparent outline-none transition-all text-base"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                filter === "all"
                  ? "bg-[#008767] text-white shadow-lg shadow-emerald-900/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}>
              All Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setFilter("with_response")}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                filter === "with_response"
                  ? "bg-[#008767] text-white shadow-lg shadow-emerald-900/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}>
              With Response ({reviewCounts.withResponse})
            </button>
            <button
              onClick={() => setFilter("without_response")}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                filter === "without_response"
                  ? "bg-[#008767] text-white shadow-lg shadow-emerald-900/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}>
              Without Response ({reviewCounts.withoutResponse})
            </button>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.15,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {review.user_name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(review.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={
                        star <= review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {review.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {review.comment}
                </p>
                {review.category && (
                  <span className="inline-block mt-3 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
                    {review.category}
                  </span>
                )}
              </div>

              {/* Admin Response */}
              {review.admin_response && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                      Admin Response
                    </span>
                    <span className="text-xs text-blue-600">
                      {new Date(review.admin_response_date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    {review.admin_response}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openResponseModal(review)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-200 transition">
                      <Edit size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteResponse(review.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 transition">
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => openResponseModal(review)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#008767] text-white rounded-xl font-semibold text-sm hover:bg-[#006d53] transition-all shadow-sm">
                  <MessageSquare size={16} />
                  {review.admin_response ? "Edit Response" : "Respond"}
                </button>
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-100 border border-red-100 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Reviews State */}
        {filteredReviews.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
            <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No reviews found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search or filter criteria.
            </p>
          </motion.div>
        )}
      </div>

      {/* Response Modal */}
      <AnimatePresence>
        {showResponseModal && selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeResponseModal}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#008767] rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {selectedReview.admin_response
                        ? "Edit Response"
                        : "Add Response"}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Respond to {selectedReview.user_name}'s review
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeResponseModal}
                  className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition">
                  <X size={20} />
                </button>
              </div>

              {/* Review Details */}
              <div className="p-6 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200">
                      <User className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="font-semibold text-slate-900">
                      {selectedReview.user_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={
                          star <= selectedReview.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }
                      />
                    ))}
                  </div>
                </div>
                <h4 className="font-bold text-slate-900 mb-2">
                  {selectedReview.title}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedReview.comment}
                </p>
                {selectedReview.category && (
                  <span className="inline-block mt-3 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
                    {selectedReview.category}
                  </span>
                )}
              </div>

              {/* Response Input */}
              <div className="p-6">
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  Your Response
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Enter your response to this review..."
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008767] focus:bg-white focus:border-transparent outline-none transition-all text-sm resize-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
                <button
                  onClick={closeResponseModal}
                  disabled={isResponding}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition disabled:opacity-50">
                  Cancel
                </button>
                <button
                  onClick={handleResponseSubmit}
                  disabled={isResponding || !responseText.trim()}
                  className="px-6 py-2.5 bg-[#008767] text-white rounded-xl font-semibold text-sm hover:bg-[#006d53] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-emerald-900/20">
                  {isResponding ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Response
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminReviews;
