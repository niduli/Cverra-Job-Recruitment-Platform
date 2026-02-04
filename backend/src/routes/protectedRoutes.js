import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// All logged users
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});

// Employer-only example
router.get(
  "/employer-area",
  authMiddleware,
  roleMiddleware("employer"),
  (req, res) => {
    res.json({
      message: "Welcome employer",
    });
  }
);

// Admin-only example
router.get(
  "/admin-area",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({
      message: "Welcome admin",
    });
  }
);

export default router;
