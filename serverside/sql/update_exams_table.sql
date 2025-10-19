-- Update exams table to support file uploads
USE auca_cupuri_portal;

-- Add new columns to exams table
ALTER TABLE exams 
ADD COLUMN IF NOT EXISTS faculty VARCHAR(100),
ADD COLUMN IF NOT EXISTS course VARCHAR(100),
ADD COLUMN IF NOT EXISTS examType VARCHAR(50),
ADD COLUMN IF NOT EXISTS filePath VARCHAR(255),
ADD COLUMN IF NOT EXISTS uploadDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Update existing records if any
UPDATE exams 
SET faculty = 'Software Engineering', 
    course = 'Unknown', 
    examType = 'Final',
    uploadDate = NOW()
WHERE faculty IS NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_exams_faculty ON exams(faculty);
CREATE INDEX IF NOT EXISTS idx_exams_course ON exams(course);
CREATE INDEX IF NOT EXISTS idx_exams_examType ON exams(examType);
