import firestoreService from "../services/firestoreService.js";
import {
  collection as applicationCollection,
  createApplicationModel,
} from "../models/applicationModel.js";
import { collection as jobCollection } from "../models/jobModel.js";
import { collection as userCollection } from "../models/userModel.js";

// POST /api/applications/apply/:jobId
export const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({ error: "Job ID required." });
    }

    // ensure job exists
    const job = await firestoreService.getDocument(jobCollection, jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    // fetch applicant info
    const user = await firestoreService.getDocument(
      userCollection,
      req.user.userId
    );

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // create application
    const application = createApplicationModel({
      jobId,
      applicantId: req.user.userId,
      applicantName: user.name,
    });

    await firestoreService.createDocument(
      applicationCollection,
      application.id,
      application
    );

    res.status(201).json({
      message: "Application submitted successfully",
      applicationId: application.id,
    });
  } catch (err) {
    next(err);
  }
};


// GET /api/applications/job/:jobId
export const getApplicationsForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({ error: "Job ID required." });
    }

    const applications = await firestoreService.getAllDocuments(
      applicationCollection
    );

    const filtered = applications.filter(
      (app) => app.jobId === jobId
    );

    res.json({
      success: true,
      data: filtered,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/applications/:applicationId/status
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        error: "Status is required.",
      });
    }

    const application = await firestoreService.getDocument(
      applicationCollection,
      applicationId
    );

    if (!application) {
      return res.status(404).json({
        error: "Application not found.",
      });
    }

    application.status = status;
    application.updatedAt = new Date();

    await firestoreService.updateDocument(
      applicationCollection,
      applicationId,
      application
    );

    res.json({
      message: "Application status updated",
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/applications/my
export const getMyApplications = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const applications =
      await firestoreService.getAllDocuments(applicationCollection);

    const myApplications = applications.filter(
      (app) => app.applicantId === userId
    );

    res.json({
      success: true,
      data: myApplications,
    });
  } catch (err) {
    next(err);
  }
};

