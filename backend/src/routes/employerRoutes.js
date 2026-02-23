import express from "express";
import {
  getEmployerDashboard,
  getJobAnalytics,
} from "../controllers/employerController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Dashboard
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("employer"),
  getEmployerDashboard
);

// Job analytics
router.get(
  "/job/:jobId/analytics",
  authMiddleware,
  roleMiddleware("employer"),
  getJobAnalytics
);

export default router;