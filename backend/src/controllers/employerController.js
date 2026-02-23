import firestoreService from "../services/firestoreService.js";
import { collection as jobCollection } from "../models/jobModel.js";
import { collection as applicationCollection } from "../models/applicationModel.js";

// =====================================================
// GET /api/employer/dashboard
// =====================================================
export const getEmployerDashboard = async (req, res, next) => {
  try {
    const employerId = req.user.userId;

    // Get employer's jobs
    const jobs = await firestoreService.queryDocuments(
      jobCollection,
      "employerId",
      "==",
      employerId
    );

    const totalJobs = jobs.length;

    // Get all applications
    const applications =
      await firestoreService.getAllDocuments(applicationCollection);

    // Filter applications belonging to employer's jobs
    const employerJobIds = jobs.map((job) => job.id);

    const employerApplications = applications.filter((app) =>
      employerJobIds.includes(app.jobId)
    );

    const totalApplications = employerApplications.length;

    // Recent applications (latest 5)
    const recentApplications = employerApplications
      .sort(
        (a, b) =>
          b.createdAt._seconds - a.createdAt._seconds
      )
      .slice(0, 5);

    // Top candidate per job (based on rankScore if exists)
    const topCandidates = {};

    employerApplications.forEach((app) => {
      if (!topCandidates[app.jobId]) {
        topCandidates[app.jobId] = app;
      } else {
        if ((app.rankScore || 0) > (topCandidates[app.jobId].rankScore || 0)) {
          topCandidates[app.jobId] = app;
        }
      }
    });

    res.json({
      success: true,
      data: {
        totalJobs,
        totalApplications,
        recentApplications,
        topCandidates: Object.values(topCandidates),
      },
    });
  } catch (err) {
    next(err);
  }
};

// =====================================================
// GET /api/employer/job/:jobId/analytics
// =====================================================
export const getJobAnalytics = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const employerId = req.user.userId;

    const job = await firestoreService.getDocument(jobCollection, jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    if (job.employerId !== employerId) {
      return res.status(403).json({
        error: "Not authorized to view this job analytics.",
      });
    }

    const applications = await firestoreService.queryDocuments(
      applicationCollection,
      "jobId",
      "==",
      jobId
    );

    const totalApplications = applications.length;

    let highestRank = 0;
    let totalRank = 0;

    const statusBreakdown = {
      applied: 0,
      reviewed: 0,
      accepted: 0,
      rejected: 0,
    };

    applications.forEach((app) => {
      const score = app.rankScore || 0;

      if (score > highestRank) highestRank = score;

      totalRank += score;

      if (statusBreakdown[app.status] !== undefined) {
        statusBreakdown[app.status]++;
      }
    });

    const averageRank =
      totalApplications > 0 ? totalRank / totalApplications : 0;

    res.json({
      success: true,
      data: {
        totalApplications,
        highestRank,
        averageRank,
        statusBreakdown,
      },
    });
  } catch (err) {
    next(err);
  }
};