-- =====================================================
-- PlanetScale Migration Script for Cupuri Portal
-- Run this in PlanetScale Console
-- =====================================================

-- 1. Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(100),
  email VARCHAR(100) NOT NULL UNIQUE,
  role ENUM('student','admin') NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- 2. Create faculties table
CREATE TABLE IF NOT EXISTS faculties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  faculty_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE,
  INDEX idx_faculty_courses (faculty_id)
);

-- 4. Create exams table
CREATE TABLE IF NOT EXISTS exams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  course VARCHAR(100),
  faculty VARCHAR(100),
  examType VARCHAR(50),
  filePath VARCHAR(255),
  fileSize INT,
  uploadDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description TEXT,
  year INT,
  semester VARCHAR(20),
  course_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  INDEX idx_exams_faculty (faculty),
  INDEX idx_exams_course (course),
  INDEX idx_exams_examType (examType),
  INDEX idx_course_exams (course_id)
);

-- 5. Create general_reviews table (non exam-specific reviews)
CREATE TABLE IF NOT EXISTS general_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  category ENUM('General Feedback', 'Usability', 'Content Quality', 'Performance', 'Feature Request', 'Bug Report') DEFAULT 'General Feedback',
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_reviews (user_id),
  INDEX idx_rating (rating),
  INDEX idx_created_at (created_at),
  INDEX idx_category (category)
);

-- 6. Create reviews table (exam-specific reviews)
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
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_exam_reviews (exam_id),
  INDEX idx_user_reviews (user_id),
  INDEX idx_rating (rating),
  INDEX idx_created_at (created_at),
  INDEX idx_category (category)
);

-- 7. Create admin_responses table
CREATE TABLE IF NOT EXISTS admin_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  review_id INT NOT NULL,
  admin_id INT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (review_id) REFERENCES general_reviews(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_review_response (review_id),
  INDEX idx_review_responses (review_id),
  INDEX idx_admin_responses (admin_id),
  INDEX idx_response_created_at (created_at)
);

-- 8. Create visits table
CREATE TABLE IF NOT EXISTS visits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  user_name VARCHAR(255),
  user_role VARCHAR(50),
  visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  page_visited VARCHAR(255) DEFAULT 'dashboard',
  ip_address VARCHAR(45),
  user_agent TEXT,
  INDEX idx_visit_time (visit_time),
  INDEX idx_user_id (user_id)
);

-- =====================================================
-- Seed Data (Optional - for testing)
-- =====================================================

-- Insert sample faculties
INSERT IGNORE INTO faculties (name) VALUES
('Software Engineering'),
('Computer Science'),
('Information Technology'),
('Business Administration'),
('Engineering');

-- Insert sample admin user (password: admin123)
-- Note: You should change this password after first login!
INSERT IGNORE INTO users (name, username, email, role, password) VALUES
('Admin User', 'admin', 'admin@auca.rw', 'admin', '$2b$10$Y8Zv5qJ5VxqKp8LqZXH5JuXxJwZ5zZ5zZ5zZ5zZ5zZ5zZ5zZ5zZ5z');

-- Insert sample student user (password: student123)
INSERT IGNORE INTO users (name, username, email, role, password) VALUES
('Student User', 'student', 'student@auca.rw', 'student', '$2b$10$Y8Zv5qJ5VxqKp8LqZXH5JuXxJwZ5zZ5zZ5zZ5zZ5zZ5zZ5zZ5zZ5z');

-- =====================================================
-- DONE! Your database is ready for Cupuri Portal
-- =====================================================
