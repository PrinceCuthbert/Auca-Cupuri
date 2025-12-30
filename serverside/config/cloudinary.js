// config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

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
