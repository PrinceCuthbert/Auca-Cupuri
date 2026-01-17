// config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Validate Cloudinary configuration on startup
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error("⚠️  WARNING: Cloudinary credentials not configured!");
  console.error("Required environment variables:");
  console.error("  - CLOUDINARY_CLOUD_NAME");
  console.error("  - CLOUDINARY_API_KEY");
  console.error("  - CLOUDINARY_API_SECRET");
  console.error("File uploads will fail without these credentials.");
} else {
  console.log("✅ Cloudinary configured successfully");
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for multer
export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "cupuri-exams", // Folder name in Cloudinary
    allowed_formats: ["pdf", "doc", "docx", "jpg", "jpeg", "png"],
    resource_type: "auto", // Automatically detect file type
  },
});

export default cloudinary;
