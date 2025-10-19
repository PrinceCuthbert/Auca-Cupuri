import React, { useState, useEffect } from "react";
import { MessageSquare, Send, X, Star } from "lucide-react";
import "./ResponseModal.css";

const ResponseModal = ({
  isOpen,
  onClose,
  onSubmit,
  review,
  isEdit = false,
  isLoading = false,
}) => {
  const [response, setResponse] = useState("");

  useEffect(() => {
    if (isOpen && review) {
      setResponse(review.admin_response || "");
    }
  }, [isOpen, review]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!response.trim()) return;
    onSubmit(response.trim());
  };

  const handleClose = () => {
    setResponse("");
    onClose();
  };

  if (!isOpen || !review) return null;

  return (
    <div className="response-modal-overlay" onClick={handleClose}>
      <div
        className="response-modal"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <MessageSquare size={24} />
            </div>
            <div className="header-text">
              <h3>{isEdit ? "Edit Response" : "Add Response"}</h3>
              <p>Respond to this review</p>
            </div>
          </div>
          <button className="close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="review-preview">
            <div className="review-header">
              <div className="reviewer-info">
                <span className="reviewer-name">
                  {review.is_anonymous ? "Anonymous User" : review.user_name}
                </span>
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
              </div>
              <span className="review-date">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            <h4 className="review-title">{review.title}</h4>
            <p className="review-comment">{review.comment}</p>
            {review.category && (
              <span className="category-tag">{review.category}</span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="response-form">
            <div className="form-group">
              <label htmlFor="response">Your Response</label>
              <textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Enter your response to this review..."
                rows={4}
                required
              />
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="cancel-btn"
            onClick={handleClose}
            disabled={isLoading}>
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            onClick={handleSubmit}
            disabled={isLoading || !response.trim()}>
            <Send size={16} />
            {isLoading
              ? "Saving..."
              : isEdit
              ? "Update Response"
              : "Send Response"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponseModal;
