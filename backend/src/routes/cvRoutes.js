import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import { getMyCVs, uploadCV } from "../controllers/cvController.js";

const router = express.Router();

// GET /api/cv/my
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("jobseeker"),
  getMyCVs
);

// POST /api/cv/upload
router.post(
  "/upload",
  authMiddleware,
  roleMiddleware("jobseeker"),
  upload.single("cv"),
  uploadCV
);

export default router;
