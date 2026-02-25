import firestoreService from "../services/firestoreService.js";
import { collection as applicationCollection } from "../models/applicationModel.js";
import { collection as savedJobCollection } from "../models/savedJobModel.js";
import { collection as userCollection } from "../models/userModel.js";

// =====================================================
// GET /api/jobseeker/dashboard
// =====================================================
export const getJobSeekerDashboard = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Get user's applications
    const applications = await firestoreService.queryDocuments(
      applicationCollection,
      "applicantId",
      "==",
      userId
    );

    const totalApplications = applications.length;

    // Get saved jobs count
    const savedJobs = await firestoreService.queryDocuments(
      savedJobCollection,
      "userId",
      "==",
      userId
    );

    const totalSavedJobs = savedJobs.length;

    // Profile views (placeholder - would need a profile views collection in future)
    // TODO: Implement profile views tracking system
    const profileViews = 0;

    // Messages (placeholder - would need a messages collection in future)
    // TODO: Implement messaging system
    const unreadMessages = 0;

    res.json({
      success: true,
      data: {
        totalApplications,
        totalSavedJobs,
        profileViews,
        unreadMessages,
      },
    });
  } catch (err) {
    next(err);
  }
};

// =====================================================
// POST /api/jobseeker/save-job/:jobId
// =====================================================
export const saveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.userId;

    // Check if already saved
    const existing = await firestoreService.queryDocuments(
      savedJobCollection,
      "userId",
      "==",
      userId
    );

    const alreadySaved = existing.find((item) => item.jobId === jobId);

    if (alreadySaved) {
      return res.status(400).json({
        error: "Job already saved.",
      });
    }

    // Create saved job
    const { createSavedJobModel } = await import("../models/savedJobModel.js");
    const savedJob = createSavedJobModel({ userId, jobId });

    await firestoreService.createDocument(
      savedJobCollection,
      savedJob.id,
      savedJob
    );

    res.status(201).json({
      success: true,
      message: "Job saved successfully.",
      data: savedJob,
    });
  } catch (err) {
    next(err);
  }
};

// =====================================================
// DELETE /api/jobseeker/unsave-job/:jobId
// =====================================================
export const unsaveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.userId;

    // Find saved job
    const savedJobs = await firestoreService.queryDocuments(
      savedJobCollection,
      "userId",
      "==",
      userId
    );

    const savedJob = savedJobs.find((item) => item.jobId === jobId);

    if (!savedJob) {
      return res.status(404).json({
        error: "Saved job not found.",
      });
    }

    await firestoreService.deleteDocument(savedJobCollection, savedJob.id);

    res.json({
      success: true,
      message: "Job unsaved successfully.",
    });
  } catch (err) {
    next(err);
  }
};

// =====================================================
// GET /api/jobseeker/saved-jobs
// =====================================================
export const getSavedJobs = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Get saved jobs
    const savedJobs = await firestoreService.queryDocuments(
      savedJobCollection,
      "userId",
      "==",
      userId
    );

    // Get job details for each saved job
    const { collection: jobCollection } = await import("../models/jobModel.js");
    const jobDetailsPromises = savedJobs.map(async (saved) => {
      const job = await firestoreService.getDocument(jobCollection, saved.jobId);
      return {
        ...saved,
        job,
      };
    });

    const savedJobsWithDetails = await Promise.all(jobDetailsPromises);

    // Filter out any where job no longer exists
    const validSavedJobs = savedJobsWithDetails.filter((item) => item.job !== null);

    res.json({
      success: true,
      data: validSavedJobs,
    });
  } catch (err) {
    next(err);
  }
};
