// middleware/upload.js
import multer from 'multer';

// Store files temporarily in memory (Cloudinary stream use karega)
const storage = multer.memoryStorage();

// File type filter (optional but recommended)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WEBP images are allowed'), false);
  }
};

// Multer instance (with limits)
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // max 5MB per file
    files: 5, // max 5 images per product
  },
});
