import firestoreService from "../services/firestoreService.js";
import { collection as userCollection } from "../models/userModel.js";
import bcrypt from "bcryptjs";

// Helper: remove sensitive fields
const sanitizeUser = (user) => {
  if (!user) return null;

  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

// =====================================================
// GET /api/profile/me
// =====================================================
export const getMyProfile = async (req, res, next) => {
  try {
    const user = await firestoreService.getDocument(
      userCollection,
      req.user.userId
    );

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({
      success: true,
      data: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

// =====================================================
// PATCH /api/profile/update
// =====================================================
export const updateMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const allowedFields = [
      "name",
      "bio",
      "skills",
      "location",
      "phone",
      "experience",
      "education",
      "linkedin",
      "profileVisibility",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: "No valid fields provided for update.",
      });
    }

    updates.updatedAt = new Date();

    await firestoreService.updateDocument(
      userCollection,
      userId,
      updates
    );

    const updatedUser = await firestoreService.getDocument(
      userCollection,
      userId
    );

    res.json({
      success: true,
      message: "Profile updated successfully.",
      data: sanitizeUser(updatedUser),
    });
  } catch (err) {
    next(err);
  }
};

// =====================================================
// GET /api/profile/:id  (Public Profile)
// =====================================================
export const getPublicProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await firestoreService.getDocument(
      userCollection,
      id
    );

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.profileVisibility === "private") {
      return res.status(403).json({
        error: "This profile is private.",
      });
    }

    res.json({
      success: true,
      data: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

// =====================================================
// POST /api/profile/change-password
// =====================================================
export const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    console.log("🔐 Password Change Request for userId:", userId);

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "New password must be at least 6 characters long.",
      });
    }

    // Get user
    const user = await firestoreService.getDocument(userCollection, userId);

    if (!user) {
      console.log("❌ User not found:", userId);
      return res.status(404).json({ error: "User not found." });
    }

    console.log("✅ User found:", user.email);

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    console.log("🔑 Current password valid:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("❌ Current password incorrect for user:", userId);
      return res.status(401).json({
        error: "Current password is incorrect.",
      });
    }

    // Hash new password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("🔐 New password hashed successfully");

    // Update password
    await firestoreService.updateDocument(userCollection, userId, {
      passwordHash: newHashedPassword,
      updatedAt: new Date(),
    });

    console.log("✅ Password updated successfully for user:", userId);

    // Verify the update by fetching the user again
    const updatedUser = await firestoreService.getDocument(
      userCollection,
      userId
    );

    const verifyNewPassword = await bcrypt.compare(
      newPassword,
      updatedUser.passwordHash
    );

    console.log(
      "✅ Password verification after update:",
      verifyNewPassword
    );

    if (!verifyNewPassword) {
      console.log("⚠️ WARNING: Password verification failed after update!");
      return res.status(500).json({
        error: "Password update verification failed. Please try again.",
      });
    }

    res.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (err) {
    console.error("❌ Password Change Error:", err);
    next(err);
  }
};
