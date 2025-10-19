USE auca_cupuri_portal;

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  exam_id INT,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  category ENUM('General Feedback', 'Usability', 'Content Quality', 'Performance', 'Feature Request', 'Bug Report') DEFAULT 'General Feedback',
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign key constraints
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- Indexes for better performance
  INDEX idx_exam_reviews (exam_id),
  INDEX idx_user_reviews (user_id),
  INDEX idx_rating (rating),
  INDEX idx_created_at (created_at),
  INDEX idx_category (category)
);

-- Create admin responses table
CREATE TABLE IF NOT EXISTS admin_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  review_id INT NOT NULL,
  admin_id INT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign key constraints
  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- Ensure one response per review
  UNIQUE KEY unique_review_response (review_id),
  
  -- Indexes for better performance
  INDEX idx_review_responses (review_id),
  INDEX idx_admin_responses (admin_id),
  INDEX idx_response_created_at (created_at)
);

-- Add some sample reviews for testing
INSERT INTO reviews (user_id, rating, title, comment, category, is_anonymous) VALUES
(2, 5, 'Perfect for Software Engineering students', 'As a Software Engineering student, I find all the past papers I need here. The organization by faculty and course is perfect.', 'Content Quality', FALSE),
(1, 4, 'Good but could use more features', 'The portal is useful but I would love to see more interactive features like discussion forums for each subject.', 'Feature Request', TRUE),
(3, 5, 'Excellent portal design', 'The interface is clean and easy to navigate. Great work on the user experience!', 'Usability', FALSE);

-- Add sample admin responses
INSERT INTO admin_responses (review_id, admin_id, response) VALUES
(1, 2, 'Thank you for your positive feedback! We are glad the portal is helping with your studies. We will continue to improve the organization and add more content.'),
(2, 2, 'Thank you for the suggestion! We are working on adding discussion forums and more interactive features. Stay tuned for updates!');
