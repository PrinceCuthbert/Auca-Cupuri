// config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";

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
// NOTE: For raw files (.docx, .pdf), we preserve the original extension in public_id
// so Cloudinary URLs retain .docx / .pdf extensions for easy browser downloading & previewing.
export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
    const isRaw = ["pdf", "doc", "docx"].includes(ext);
    const cleanName = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9_-]/g, "_");

    return {
      folder: "cupuri-exams",
      resource_type: isRaw ? "raw" : "image",
      public_id: `${Date.now()}_${cleanName}.${ext}`,
    };
  },
});

export default cloudinary;
