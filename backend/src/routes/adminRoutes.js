import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import {
  getAllUsers,
  getAllJobs,
  approveEmployer,
  getSystemAnalytics,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware("admin"));

router.get("/users", getAllUsers);
router.get("/jobs", getAllJobs);
router.patch("/approve/:userId", approveEmployer);
router.get("/analytics", getSystemAnalytics);

export default router;