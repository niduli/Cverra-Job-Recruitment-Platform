import express from "express";
import {
  insertTestData,
  getTestData,
  debugApplications,
  debugJobs,
  debugJobAnalytics,
  debugEmployerDashboard,
  testPasswordHash,
} from "../controllers/testController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import firestoreService from "../services/firestoreService.js";

const router = express.Router();

router.post("/insert", insertTestData);
router.get("/all", getTestData);
router.get("/applications", debugApplications);
router.get("/jobs", debugJobs);
router.get("/job-analytics", debugJobAnalytics);
router.get("/employer-dashboard", authMiddleware, debugEmployerDashboard);
router.get("/employer-dashboard-debug", async (req, res) => {
  const { employerId } = req.query;
  req.user = { userId: employerId };
  return debugEmployerDashboard(req, res);
});
router.get("/user-profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await firestoreService.getDocument("users", userId);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/password-hash", testPasswordHash);

export default router;
