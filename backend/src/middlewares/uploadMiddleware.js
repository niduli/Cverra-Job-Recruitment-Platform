import multer from "multer";
import path from "path";

// Store files temporarily in memory
const storage = multer.memoryStorage();

// Allow only CV formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".doc", ".docx"];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF/DOC/DOCX files are allowed."));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});

export default upload;
