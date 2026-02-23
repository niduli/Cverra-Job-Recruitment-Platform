import express from "express";

import authRoutes from "./authRoutes.js";
import jobRoutes from "./jobRoutes.js";
import applicationRoutes from "./applicationRoutes.js";
import cvRoutes from "./cvRoutes.js";
import profileRoutes from "./profileRoutes.js";
import healthRoutes from "./healthRoutes.js";
import employerRoutes from "./employerRoutes.js";
import adminRoutes from "./adminRoutes.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

router.use("/auth", authRoutes);
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);
router.use("/cv", cvRoutes);
router.use("/profile", profileRoutes);
router.use("/health", healthRoutes);
router.use("/employer", employerRoutes);
router.use("/admin", adminRoutes);

export default router;
