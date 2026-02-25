import express from "express";
import {
  getJobSeekerDashboard,
  saveJob,
  unsaveJob,
  getSavedJobs,
} from "../controllers/jobseekerController.js";
import { authenticate as authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles as roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// All routes require authentication as jobseeker
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("jobseeker"),
  getJobSeekerDashboard
);

router.post(
  "/save-job/:jobId",
  authMiddleware,
  roleMiddleware("jobseeker"),
  saveJob
);

router.delete(
  "/unsave-job/:jobId",
  authMiddleware,
  roleMiddleware("jobseeker"),
  unsaveJob
);

router.get(
  "/saved-jobs",
  authMiddleware,
  roleMiddleware("jobseeker"),
  getSavedJobs
);

export default router;
