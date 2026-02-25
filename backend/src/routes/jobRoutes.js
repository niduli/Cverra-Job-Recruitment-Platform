import express from "express";
// import { createJob } from "../controllers/jobController.js";
import { getRecommendedJobs, updateJob, getJobById, getEmployerJobs } from "../controllers/jobController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import { createJob, getAllJobs } from "../controllers/jobController.js";


const router = express.Router();

/**
 * Create job
 * Only employer allowed
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("employer"),
  createJob
);

/**
 * Get all jobs (public)
 */
router.get("/", getAllJobs);

/**
 * Get employer's own jobs
 * Only authenticated employers
 */
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("employer"),
  getEmployerJobs
);

/**
 * Get recommended jobs
 */
router.get("/recommended", authMiddleware, getRecommendedJobs);

/**
 * Get single job by ID
 */
router.get("/:jobId", getJobById);

/**
 * Update job
 * Only employer allowed (must own the job)
 */
router.put(
  "/:jobId",
  authMiddleware,
  roleMiddleware("employer"),
  updateJob
);

export default router;
