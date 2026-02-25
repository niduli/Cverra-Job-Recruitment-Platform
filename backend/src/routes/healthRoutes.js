import express from "express";
import { checkMLServices } from "../services/mlHealthCheck.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});

/**
 * Comprehensive health check including ML services
 */
router.get("/full", async (req, res) => {
  const health = {
    timestamp: new Date().toISOString(),
    backend: {
      status: "healthy",
      message: "Backend is running"
    },
    ml: {}
  };

  try {
    const mlHealth = await checkMLServices();
    health.ml = mlHealth;
    health.overall = health.ml.allHealthy ? "healthy" : "degraded";
    const statusCode = health.ml.allHealthy ? 200 : 206; // 206 Partial Content
    res.status(statusCode).json(health);
  } catch (error) {
    health.ml.status = "error";
    health.ml.message = error.message;
    health.overall = "unhealthy";
    res.status(503).json(health);
  }
});

export default router;
