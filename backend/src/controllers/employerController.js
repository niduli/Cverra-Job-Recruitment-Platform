import firestoreService from "../services/firestoreService.js";
import { collection as jobCollection } from "../models/jobModel.js";
import { collection as applicationCollection } from "../models/applicationModel.js";
import { collection as userCollection } from "../models/userModel.js";

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
    const activePostings = jobs.filter((job) => job.status === "active").length;

    // Calculate total views across all jobs
    const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0);

    // Get all applications for this employer
    const applications =
      await firestoreService.getAllDocuments(applicationCollection);

    const employerJobIds = jobs.map((job) => job.id);
    const employerApplications = applications.filter((app) =>
      employerJobIds.includes(app.jobId)
    );

    const totalApplications = employerApplications.length;

    // Calculate applications per job
    const applicationsPerJob = {};
    employerApplications.forEach((app) => {
      applicationsPerJob[app.jobId] = (applicationsPerJob[app.jobId] || 0) + 1;
    });

    // Calculate trends (today's data)
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayStartSeconds = Math.floor(todayStart.getTime() / 1000);

    const jobsCreatedToday = jobs.filter((job) => {
      const jobSeconds = job.createdAt?._seconds || job.createdAt?.seconds || 0;
      return jobSeconds >= todayStartSeconds;
    }).length;

    const newApplicationsToday = employerApplications.filter((app) => {
      const appSeconds = app.createdAt?._seconds || app.createdAt?.seconds || 0;
      return appSeconds >= todayStartSeconds;
    }).length;

    // Calculate employer rating (average from user ratings if exists, otherwise default)
    // TODO: Implement user rating system in future
    const employerRating = 4.8; // Placeholder until rating system is implemented

    // Sort recent applications
    const recentApplications = employerApplications
      .sort((a, b) => {
        const aSeconds = a.createdAt?._seconds || a.createdAt?.seconds || 0;
        const bSeconds = b.createdAt?._seconds || b.createdAt?.seconds || 0;
        return bSeconds - aSeconds;
      })
      .slice(0, 5);

    const enrichedRecentApplications = await Promise.all(
      recentApplications.map(async (app) => {
        if (!app.applicantId) return app;

        try {
          const user = await firestoreService.getDocument(userCollection, app.applicantId);
          return {
            ...app,
            applicantName: user?.name || app.applicantName,
          };
        } catch {
          return app;
        }
      })
    );

    // Get top candidates per job
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

    // Build job stats map
    const jobStats = {};
    jobs.forEach((job) => {
      jobStats[job.id] = {
        views: job.views || 0,
        applications: applicationsPerJob[job.id] || 0,
      };
    });

    res.json({
      success: true,
      data: {
        totalJobs,
        activePostings,
        totalApplications,
        totalViews,
        employerRating,
        trends: {
          jobsCreatedToday,
          newApplicationsToday,
        },
        jobStats,
        recentApplications: enrichedRecentApplications,
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