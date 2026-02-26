import express from "express";
import multer from "multer";
import {
  getMyProfile,
  updateMyProfile,
  getPublicProfile,
  changePassword,
  uploadProfilePhoto,
} from "../controllers/profileController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

const profilePhotoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, and WEBP images are allowed."));
    }
  },
});

// GET /api/profile/me
router.get("/me", authMiddleware, getMyProfile);

// PATCH /api/profile/update
router.patch("/update", authMiddleware, updateMyProfile);

// POST /api/profile/change-password
router.post("/change-password", authMiddleware, changePassword);

// POST /api/profile/upload-photo
router.post(
  "/upload-photo",
  authMiddleware,
  profilePhotoUpload.single("photo"),
  uploadProfilePhoto
);

// GET /api/profile/:id
router.get("/:id", getPublicProfile);

export default router;
