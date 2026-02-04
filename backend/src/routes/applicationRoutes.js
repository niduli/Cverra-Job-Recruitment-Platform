import express from "express"; 
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

import {
  applyForJob,
  getApplicationsForJob,
  updateApplicationStatus,
  getMyApplications,

} from "../controllers/applicationController.js";



const router = express.Router();

// Only jobseekers can apply
router.post(
  "/apply/:jobId",
  authenticate,
  authorizeRoles("jobseeker"),
  applyForJob
);

router.get(
  "/job/:jobId",
  authenticate,
  authorizeRoles("employer", "admin"),
  getApplicationsForJob
);

router.patch(
  "/:applicationId/status",
  authenticate,
  authorizeRoles("employer", "admin"),
  updateApplicationStatus
);

router.get(
  "/my",
  authenticate,
  authorizeRoles("jobseeker"),
  getMyApplications
);


export default router;
