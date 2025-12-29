-- Add fileSize column to exams table
ALTER TABLE exams ADD COLUMN fileSize BIGINT DEFAULT NULL;

-- Optional: Update existing records with file sizes (you'll need to do this manually or via a script)
-- UPDATE exams SET fileSize = 0 WHERE fileSize IS NULL;
