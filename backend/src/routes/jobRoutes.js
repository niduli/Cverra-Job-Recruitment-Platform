import express from "express";
// import { createJob } from "../controllers/jobController.js";
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

router.get("/", getAllJobs);

export default router;
