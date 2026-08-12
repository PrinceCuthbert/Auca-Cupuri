import { pool } from "../config/db.js";
import fs from "fs";
import path from "path";
import https from "https";
import cloudinary from "../config/cloudinary.js"; // Import Cloudinary

// GET all exams
// / GET exams with Pagination and Search
export const getExams = async (req, res, next) => {
  try {
    // 1. Get query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const faculty = req.query.faculty || "All Faculties";
    const course = req.query.course || "All Courses";
    const examType = req.query.examType || "All Types";

    const offset = (page - 1) * limit;

    // 2. Build the WHERE clause dynamically for SQL
    let query = "SELECT * FROM exams WHERE 1=1";
    let countQuery = "SELECT COUNT(*) as total FROM exams WHERE 1=1";
    const queryParams = [];

    if (search) {
      const searchPattern = `%${search}%`;
      query += " AND (title LIKE ? OR course LIKE ? OR faculty LIKE ?)";
      countQuery += " AND (title LIKE ? OR course LIKE ? OR faculty LIKE ?)";
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }

    if (faculty !== "All Faculties") {
      query += " AND faculty = ?";
      countQuery += " AND faculty = ?";
      queryParams.push(faculty);
    }

    if (course !== "All Courses") {
      query += " AND course = ?";
      countQuery += " AND course = ?";
      queryParams.push(course);
    }

    if (examType !== "All Types") {
      query += " AND examType = ?";
      countQuery += " AND examType = ?";
      queryParams.push(examType);
    }

    // 3. Get Total Count for Frontend Pagination UI
    const [countResult] = await pool.query(countQuery, queryParams);
    const totalExams = countResult[0].total;

    // 4. Get Paginated Data
    query += " ORDER BY uploadDate DESC LIMIT ? OFFSET ?";
    const [rows] = await pool.query(query, [...queryParams, limit, offset]);

    // 5. Return structured response
    res.json({
      exams: rows,
      pagination: {
        totalExams,
        totalPages: Math.ceil(totalExams / limit),
        currentPage: page,
        limit
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET exam by ID
export const getExamById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM exams WHERE id=?", [id]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// CREATE exam
export const createExam = async (req, res, next) => {
  try {
    const { title, course_id, date } = req.body;
    await pool.query(
      "INSERT INTO exams (title, course_id, date) VALUES (?, ?, ?)",
      [title, course_id, date],
    );
    res.status(201).json({ message: "Exam created" });
  } catch (err) {
    next(err);
  }
};

// UPDATE exam
export const updateExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, course_id, date } = req.body;
    await pool.query(
      "UPDATE exams SET title=?, course_id=?, date=? WHERE id=?",
      [title, course_id, date, id],
    );
    res.json({ message: "Exam updated" });
  } catch (err) {
    next(err);
  }
};

// DELETE exam (handles single or multiple files)
export const deleteExam = async (req, res, next) => {
  try {
    const { id } = req.params;

    // First, get the file path before deleting
    const [rows] = await pool.query("SELECT filePath FROM exams WHERE id=?", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const filePath = rows[0].filePath;

    // Delete from database
    await pool.query("DELETE FROM exams WHERE id=?", [id]);

    // Delete the file(s) from filesystem if they exist
    if (filePath) {
      // Check if it's a JSON array (multiple files) or single file
      let filesToDelete = [];
      try {
        const parsed = JSON.parse(filePath);
        if (Array.isArray(parsed)) {
          filesToDelete = parsed;
        } else {
          filesToDelete = [filePath];
        }
      } catch {
        // Not JSON, single file
        filesToDelete = [filePath];
      }

      // Delete each file
      for (const fileName of filesToDelete) {
        const fullPath = path.join(process.cwd(), "uploads", fileName);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    }

    // Broadcast real-time WebSocket delete event to all connected clients
    const io = req.app.get("io");
    if (io) {
      io.emit("exam_deleted", {
        examId: parseInt(id),
        message: "An exam was deleted.",
      });
    }

    res.json({ message: "Exam deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    next(err);
  }
};

// UPLOAD exam with file (supports single or multiple files)
export const uploadExam = async (req, res, next) => {
  try {
    const { title, faculty, course, examType } = req.body;
    const files = req.files; // Array of files

    // console.log("📤 Upload request received:", {
    //   title,
    //   faculty,
    //   course,
    //   examType,
    //   filesCount: files?.length || 0,
    // });

    // Validate file upload
    if (!files || files.length === 0) {
      console.error("❌ No files uploaded");
      return res.status(400).json({
        message: "No file uploaded. Please select at least one file.",
      });
    }

    // Validate required fields
    if (!title || !faculty || !course || !examType) {
      console.error("❌ Missing required fields:", {
        title: !!title,
        faculty: !!faculty,
        course: !!course,
        examType: !!examType,
      });
      return res.status(400).json({
        message: "All fields are required (title, faculty, course, examType).",
        missing: {
          title: !title,
          faculty: !faculty,
          course: !course,
          examType: !examType,
        },
      });
    }

    // Check if Cloudinary upload was successful
    if (!files[0].path) {
      console.error("❌ Cloudinary upload failed - no file path");
      return res.status(500).json({
        message:
          "File upload to cloud storage failed. Please check Cloudinary configuration.",
        error:
          process.env.NODE_ENV === "development"
            ? "Cloudinary path is missing"
            : undefined,
      });
    }

    // Handle single file vs multiple files - store Cloudinary URLs
    let filePath;
    let totalFileSize = 0;

    try {
      if (files.length === 1) {
        // Single file - store Cloudinary URL
        filePath = files[0].path; // Cloudinary URL
        totalFileSize = files[0].size;
        // console.log("✅ Single file uploaded:", filePath);
      } else {
        // Multiple files - store as JSON array of Cloudinary URLs
        const fileUrls = files.map((f) => f.path);
        filePath = JSON.stringify(fileUrls);
        totalFileSize = files.reduce((sum, f) => sum + f.size, 0);
        // console.log(`✅ ${files.length} files uploaded`);
      }
    } catch (fileProcessError) {
      console.error("❌ File processing error:", fileProcessError);
      return res.status(500).json({
        message: "Failed to process uploaded files.",
        error:
          process.env.NODE_ENV === "development"
            ? fileProcessError.message
            : undefined,
      });
    }

    // Insert exam record with Cloudinary URL and file size
    try {
      const [result] = await pool.query(
        "INSERT INTO exams (title, faculty, course, examType, filePath, fileSize, uploadDate) VALUES (?, ?, ?, ?, ?, ?, NOW())",
        [title, faculty, course, examType, filePath, totalFileSize],
      );

      console.log("✅ Exam inserted successfully:", result.insertId);

      // Broadcast real-time WebSocket event to all connected clients
      const io = req.app.get("io");
      if (io) {
        io.emit("new_exam_uploaded", {
          message: `New exam uploaded: ${title} (${course})`,
          examId: result.insertId,
          title,
          course,
          faculty,
          examType,
          createdAt: new Date(),
        });
      }

      res.status(201).json({
        message: "Exam uploaded successfully",
        examId: result.insertId,
        filePath: filePath,
        fileSize: totalFileSize,
        fileCount: files.length,
      });
    } catch (dbError) {
      console.error("❌ Database insertion error:", dbError);

      // Specific database error handling
      if (dbError.code === "ECONNREFUSED") {
        return res.status(503).json({
          message:
            "Database connection refused. The database server may be down.",
          error:
            process.env.NODE_ENV === "development"
              ? dbError.message
              : undefined,
        });
      }

      if (dbError.code === "ETIMEDOUT" || dbError.code === "ENOTFOUND") {
        return res.status(503).json({
          message: "Database connection timeout. Please try again in a moment.",
          error:
            process.env.NODE_ENV === "development"
              ? dbError.message
              : undefined,
        });
      }

      if (dbError.code === "ER_NO_SUCH_TABLE") {
        return res.status(500).json({
          message: "Database table not found. Please contact support.",
          error:
            process.env.NODE_ENV === "development"
              ? dbError.message
              : undefined,
        });
      }

      if (dbError.code === "ER_BAD_FIELD_ERROR") {
        return res.status(500).json({
          message: "Database schema mismatch. Please contact support.",
          error:
            process.env.NODE_ENV === "development"
              ? dbError.message
              : undefined,
        });
      }

      // Generic database error
      return res.status(500).json({
        message: "Failed to save exam to database.",
        error:
          process.env.NODE_ENV === "development" ? dbError.message : undefined,
      });
    }
  } catch (err) {
    console.error("❌ Unexpected upload error:", err);

    // Catch-all for any unexpected errors
    res.status(500).json({
      message: "An unexpected error occurred during upload. Please try again.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// DOWNLOAD exam (Proxy through backend to handle CORS/Auth/Cloudinary)
export const downloadExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM exams WHERE id=?", [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const exam = rows[0];
    let filePath = exam.filePath;
    
    // Handle JSON array vs single string
    let filePaths = [];
    try {
        const parsed = JSON.parse(exam.filePath);
        if (Array.isArray(parsed) && parsed.length > 0) {
            filePaths = parsed;
        } else {
            filePaths = [exam.filePath];
        }
    } catch {
        filePaths = [exam.filePath];
    }

    if (filePaths[0].startsWith("http")) { 
        const safeTitle = exam.title.replace(/[^a-z0-9]/gi, '_');
        
        let versionStr = undefined;
        // Extract public IDs for all files
        const publicIds = filePaths.map((filePath) => {
            let publicId = '';
            const uploadIndex = filePath.indexOf('/upload/');
            if (uploadIndex === -1) return null;
            
            const pathAfterUpload = filePath.substring(uploadIndex + 8);
            
            const versionMatch = pathAfterUpload.match(/^(v\d+)\//);
            if (versionMatch) {
                publicId = pathAfterUpload.substring(versionMatch[0].length);
                versionStr = versionMatch[1].replace('v', '');
            } else {
                publicId = pathAfterUpload;
            }
            
            const lastDotIndex = publicId.lastIndexOf('.');
            if (lastDotIndex !== -1) {
                publicId = publicId.substring(0, lastDotIndex);
            }
            
            if (publicId.startsWith("v1/")) publicId = publicId.replace("v1/", "");
            return publicId;
        }).filter(id => id !== null);

        if (publicIds.length === 0) {
            return res.status(500).json({ message: "Could not generate download URL" });
        }

        if (publicIds.length > 1) {
            // 🚀 AUTOMATIC ZIP FOR MULTIPLE FILES (Cloudinary side)
            const zipUrl = cloudinary.utils.download_zip_url({
                public_ids: publicIds,
                target_public_id: safeTitle,
                flatten_folders: true
            });
            res.json({ downloadUrl: zipUrl });
        } else {
            // 📦 SINGLE FILE DOWNLOAD
            // Detect actual resource_type from the stored Cloudinary URL
            // /raw/upload/ = PDF, DOC, DOCX (uploaded via resource_type:auto)
            // /image/upload/ = JPG, PNG, HEIC, etc.
            const isRawFile = filePaths[0].includes("/raw/upload/");
            const resourceType = isRawFile ? "raw" : "image";

            let ext = filePaths[0].split(".").pop().toLowerCase();
            if (ext === 'heic' || ext === 'heif') ext = 'jpg';

            const signedUrl = cloudinary.url(publicIds[0], {
                resource_type: resourceType,  // ← was always 'image' — caused double-URL for raw files
                format: isRawFile ? undefined : ext, // raw files keep their original format
                flags: "attachment",
                sign_url: true,
                type: "upload",
                secure: true,
                version: versionStr
            });

            res.json({ downloadUrl: signedUrl });

            /* 
            // PREVIOUS BACKEND PROXY LOGIC (Uncomment if Cloudinary blocks PDFs again)
            https.get(signedFetchUrl, (streamRes) => {
                if (streamRes.statusCode !== 200) {
                    return res.status(streamRes.statusCode).json({ message: "Error fetching file from cloud" });
                }
                res.setHeader('Content-Type', streamRes.headers['content-type'] || 'application/octet-stream');
                res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.${ext}"`);
                streamRes.pipe(res);
            }).on('error', (err) => {
                console.error("Backend Proxy Stream Error:", err);
                res.status(500).json({ message: "Failed to download file" });
            });
            */
        }
    } else {
        // Local file logic remains
        const fullPath = path.join(process.cwd(), "uploads", filePath);
        if (!fs.existsSync(fullPath)) {
            return res.status(404).json({ message: "File not found on server" });
        }
        res.download(fullPath, filename);
    }
  } catch (err) {
    console.error("Download proxy error:", err);
    next(err);
  }
};
