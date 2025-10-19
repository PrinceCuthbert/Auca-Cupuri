import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Modal, Button, notification } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import ResponseModal from "../../components/ResponseModal";
import "./AdminReviews.css";

const AdminReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [isResponding, setIsResponding] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchReviews();
    }
  }, [user]);

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
      } else {
        console.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = (reviewId) => {
    console.log("Delete button clicked for review ID:", reviewId);

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
        console.log("Delete confirmed for review ID:", reviewId);
        try {
          const user = JSON.parse(localStorage.getItem("auca-cupuri-user"));
          if (!user?.token) {
            console.error("No user token found");
            return;
          }

          console.log(
            "Sending delete request to:",
            `http://localhost:3009/api/reviews/general/${reviewId}`
          );

          const response = await fetch(
            `http://localhost:3009/api/reviews/general/${reviewId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

          console.log("Delete response status:", response.status);

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
            console.error("Delete failed:", errorData);
            notification.error({
              message: "Error",
              description: errorData.message || "Failed to delete review",
              placement: "topRight",
              duration: 3,
            });
          }
        } catch (error) {
          console.error("Error deleting review:", error);
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
      onOk: async () => {
        try {
          const user = JSON.parse(localStorage.getItem("auca-cupuri-user"));
          if (!user?.token) return;

          const response = await fetch(
            `http://localhost:3009/api/reviews/${reviewId}/response`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

          if (response.ok) {
            notification.success({
              message: "Success",
              description: "Response deleted successfully",
              placement: "topRight",
              duration: 3,
            });
            fetchReviews(); // Refresh reviews to remove the response
          } else {
            const error = await response.json();
            notification.error({
              message: "Error",
              description: error.message || "Failed to delete response",
              placement: "topRight",
              duration: 3,
            });
          }
        } catch (error) {
          console.error("Error deleting response:", error);
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
    setShowResponseModal(true);
  };

  const closeResponseModal = () => {
    setSelectedReview(null);
    setShowResponseModal(false);
  };

  const handleResponseSubmit = async (responseText) => {
    if (!selectedReview) return;

    setIsResponding(true);
    try {
      const user = JSON.parse(localStorage.getItem("auca-cupuri-user"));
      if (!user?.token) return;

      const isEdit = !!selectedReview.admin_response;
      const response = await fetch(
        `http://localhost:3009/api/reviews/${selectedReview.id}/response`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ response: responseText }),
        }
      );

      if (response.ok) {
        toast.success(
          isEdit
            ? "Response updated successfully"
            : "Response added successfully"
        );
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
    } catch (error) {
      console.error("Error with response:", error);
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

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "with_response" && review.admin_response) ||
      (filter === "without_response" && !review.admin_response);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="admin-reviews-page">
        <div className="loading">Loading reviews...</div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="admin-reviews-page">
        <div className="error-state">
          <h2>Access Denied</h2>
          <p>You need admin privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-reviews-page">
      <div className="page-header">
        <h1>Admin Reviews Management</h1>
        <p>Manage all user reviews and respond to feedback</p>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}>
            All Reviews
          </button>
          <button
            className={filter === "with_response" ? "active" : ""}
            onClick={() => setFilter("with_response")}>
            With Response
          </button>
          <button
            className={filter === "without_response" ? "active" : ""}
            onClick={() => setFilter("without_response")}>
            Without Response
          </button>
        </div>
      </div>

      <div className="reviews-grid">
        {filteredReviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="reviewer-info">
                <User size={16} />
                <span>{review.user_name}</span>
                <span className="review-date">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="review-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= review.rating ? "filled" : "empty"}
                  />
                ))}
              </div>
            </div>

            <div className="review-content">
              <h3 className="review-title">{review.title}</h3>
              <p className="review-comment">{review.comment}</p>
              {review.category && (
                <span className="category-tag">{review.category}</span>
              )}
            </div>

            {review.admin_response && (
              <div className="admin-response">
                <div className="response-header">
                  <span className="response-label">Admin Response</span>
                  <span className="response-date">
                    {new Date(review.admin_response_date).toLocaleDateString()}
                  </span>
                </div>
                <p className="response-text">{review.admin_response}</p>
                <div className="response-actions">
                  <button
                    className="edit-response-btn"
                    onClick={() => openResponseModal(review)}>
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    className="delete-response-btn"
                    onClick={() => handleDeleteResponse(review.id)}>
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            )}

            <div className="review-actions">
              <button
                className="respond-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Respond button clicked for review:", review.id);
                  openResponseModal(review);
                }}>
                <MessageSquare size={16} />
                {review.admin_response ? "Edit Response" : "Respond"}
              </button>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Delete button clicked for review:", review.id);
                  handleDeleteReview(review.id);
                }}>
                <Trash2 size={16} />
                Delete Review
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="no-reviews">
          <MessageSquare size={48} />
          <h3>No reviews found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Response Modal */}
      <ResponseModal
        isOpen={showResponseModal}
        onClose={closeResponseModal}
        onSubmit={handleResponseSubmit}
        review={selectedReview}
        isEdit={selectedReview?.admin_response ? true : false}
        isLoading={isResponding}
      />
    </div>
  );
};

export default AdminReviews;
