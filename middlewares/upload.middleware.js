import multer from "multer";
import path from "path";


// Multer storage configuration for handling file uploads
const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, "uploads/");
    },
    filename:(req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});


// File filter to allow only images and PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only image or PDFs are allowed!"), false);
  }
};


// Multer middleware for handling file uploads with storage, file type filtering, and size limits
export const upload = multer({
     storage, 
     fileFilter, 
     limits: { fileSize: 5 * 1024 * 1024 }
     }); // 5MB limit