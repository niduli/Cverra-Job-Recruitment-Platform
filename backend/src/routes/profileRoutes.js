import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  getPublicProfile,
  changePassword,
} from "../controllers/profileController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /api/profile/me
router.get("/me", authMiddleware, getMyProfile);

// PATCH /api/profile/update
router.patch("/update", authMiddleware, updateMyProfile);

// POST /api/profile/change-password
router.post("/change-password", authMiddleware, changePassword);

// GET /api/profile/:id
router.get("/:id", getPublicProfile);

export default router;
