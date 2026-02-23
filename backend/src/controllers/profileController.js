import firestoreService from "../services/firestoreService.js";
import { collection as userCollection } from "../models/userModel.js";

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
