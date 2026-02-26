import firestoreService from "../services/firestoreService.js";
import {
  collection as applicationCollection,
  createApplicationModel,
} from "../models/applicationModel.js";
import { collection as jobCollection } from "../models/jobModel.js";
import { collection as userCollection } from "../models/userModel.js";

// import { getCVRankingScore } from "../services/mlCVRankingService.js";
import { getRolePrediction } from "../services/mlCVRankingService.js";
import { extractTextFromPDF } from "../utils/pdfTextExtractor.js";


// =======================================================
// POST /api/applications/apply/:jobId
// =======================================================
export const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { cvId } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: "Job ID required." });
    }

    if (!cvId) {
      return res.status(400).json({ error: "CV ID required." });
    }

    // Check job exists
    const job = await firestoreService.getDocument(jobCollection, jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    // Check user exists
    const user = await firestoreService.getDocument(
      userCollection,
      req.user.userId
    );

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Get selected CV
    const cv = await firestoreService.getDocument("cvs", cvId);

    if (!cv) {
      return res.status(404).json({ error: "CV not found." });
    }

    // Ensure CV belongs to logged-in user
    if (cv.userId !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized CV access." });
    }

    // Create application with cvId
    const application = createApplicationModel({
      jobId,
      applicantId: req.user.userId,
      applicantName: user.name,
      cvId: cvId,
      status: "applied",
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


// =======================================================
// GET /api/applications/job/:jobId  (WITH ML RANKING)
// =======================================================

// export const getApplicationsForJob = async (req, res, next) => {
//   try {
//     const { jobId } = req.params;
//     const employer = req.user;

//     if (!jobId) {
//       return res.status(400).json({ error: "Job ID required." });
//     }

//     // Verify job exists
//     const job = await firestoreService.getDocument(jobCollection, jobId);
//     if (!job) {
//       return res.status(404).json({ error: "Job not found." });
//     }

//     // Ensure employer owns job
//     if (job.employerId !== employer.userId) {
//       return res.status(403).json({
//         error: "Not authorized to view applications for this job.",
//       });
//     }

//     // Get applications
//     const applications = await firestoreService.queryDocuments(
//       applicationCollection,
//       "jobId",
//       "==",
//       jobId
//     );

//     const enriched = [];

//     for (const app of applications) {

//       // Get user
//       const user = await firestoreService.getDocument(
//         userCollection,
//         app.applicantId
//       );

//       let safeProfile = null;
//       let rankScore = 0;

//       if (user) {
//         safeProfile = {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         };

//         // Prepare ML payload from userModel
//         const profilePayload = {
//           skills: user.skills?.join(", ") || "",
//           highest_degree: user.education || "",
//           current_designation: user.experience || "",
//           domain: "", // Not available in your model
//           location: user.location || "",
//           experience_years: 0, // Not structured in your model
//           experience_months: 0
//         };

//         const prediction = await getRolePrediction(profilePayload);

//        if (prediction && prediction.top_roles) {
//         const matchedRole = prediction.top_roles.find(
//           (r) =>
//             job.title.toLowerCase().includes(r.role.toLowerCase()) ||
//             r.role.toLowerCase().includes(job.title.toLowerCase())
//           );

//         if (matchedRole) {
//           rankScore = matchedRole.probability;
//           }
//     }

//         // ✅ Persist rankScore HERE (correct place)
//         await firestoreService.updateDocument(
//           applicationCollection,
//           app.id,
//           { rankScore }
//         );
//       }

//       enriched.push({
//         ...app,
//         profile: safeProfile,
//         rankScore,
//       });
//     }

//     // Sort by rankScore descending
//     enriched.sort((a, b) => b.rankScore - a.rankScore);

//     res.json({
//       success: true,
//       count: enriched.length,
//       data: enriched,
//     });

//   } catch (err) {
//     next(err);
//   }
// };

export const getApplicationsForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const employer = req.user;

    if (!jobId) {
      return res.status(400).json({ error: "Job ID required." });
    }

    const job = await firestoreService.getDocument(jobCollection, jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    if (job.employerId !== employer.userId) {
      return res.status(403).json({
        error: "Not authorized to view applications for this job.",
      });
    }

    const applications = await firestoreService.queryDocuments(
      applicationCollection,
      "jobId",
      "==",
      jobId
    );

    const enriched = [];

    for (const app of applications) {

      const user = await firestoreService.getDocument(
        userCollection,
        app.applicantId
      );

      let safeProfile = null;
      let rankScore = 0;

      if (user) {

        safeProfile = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };

        // Extract meaningful experience number from string like "2 years"
        let experienceYears = 0;
        if (user.experience) {
          const match = user.experience.match(/\d+/);
          if (match) {
            experienceYears = parseInt(match[0]);
          }
        }

      const profilePayload = {
        skills: user.skills?.join(", ") || "",
        highest_degree: user.highestDegree || "",
        current_designation: user.currentDesignation || "",
        domain: user.fieldOfStudy || "",
        location: user.location || "",
        experience_years: user.experienceYears || 0,
        experience_months: user.experienceMonths || 0,
     };

        console.log("📤 Sending to ML:", profilePayload);

        const prediction = await getRolePrediction(profilePayload);

        console.log("📥 ML Response:", prediction);
        console.log("🎯 Job Title:", job.title);

        if (prediction && prediction.top_roles?.length > 0) {

          // Smarter scoring: check ALL predicted roles
          for (const roleObj of prediction.top_roles) {

            const predicted = roleObj.role.toLowerCase();
            const jobTitle = job.title.toLowerCase();

            if (
              jobTitle.includes(predicted) ||
              predicted.includes(jobTitle)
            ) {
              rankScore = roleObj.probability;
              break;
            }
          }

          // If still 0, take highest probability as fallback
          if (rankScore === 0) {
            rankScore = prediction.top_roles[0].probability;
          }
        }

        await firestoreService.updateDocument(
          applicationCollection,
          app.id,
          { rankScore }
        );
      }

      enriched.push({
        ...app,
        profile: safeProfile,
        rankScore,
      });
    }

    enriched.sort((a, b) => b.rankScore - a.rankScore);

    res.json({
      success: true,
      count: enriched.length,
      data: enriched,
    });

  } catch (err) {
    next(err);
  }
};


// =======================================================
// PATCH /api/applications/:applicationId/status
// =======================================================
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const {
      status,
      interviewAt,
      interviewMode,
      interviewLocation,
      interviewNotes,
    } = req.body;
    const requester = req.user;

    if (!status) {
      return res.status(400).json({
        error: "Status is required.",
      });
    }

    const allowedStatuses = ["applied", "reviewed", "accepted", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status value.",
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

    const job = await firestoreService.getDocument(jobCollection, application.jobId);
    if (!job) {
      return res.status(404).json({
        error: "Job not found for this application.",
      });
    }

    const isAdmin = requester.role === "admin";
    const isOwnerEmployer = job.employerId === requester.userId;
    if (!isAdmin && !isOwnerEmployer) {
      return res.status(403).json({
        error: "Not authorized to update this application.",
      });
    }

    application.status = status;

    if (status === "accepted") {
      if (!interviewAt) {
        return res.status(400).json({
          error: "Interview date/time is required when accepting an application.",
        });
      }

      application.interviewAt = interviewAt;
      application.interviewMode = interviewMode || "online";
      application.interviewLocation = interviewLocation || "";
      application.interviewNotes = interviewNotes || "";
    }

    if (status === "rejected") {
      application.rejectedAt = new Date();
    }

    application.updatedAt = new Date();

    await firestoreService.updateDocument(
      applicationCollection,
      applicationId,
      application
    );

    res.json({
      message: "Application status updated",
      data: {
        id: applicationId,
        status,
        interviewAt: application.interviewAt || null,
        interviewMode: application.interviewMode || null,
        interviewLocation: application.interviewLocation || null,
        interviewNotes: application.interviewNotes || null,
      },
    });

  } catch (err) {
    next(err);
  }
};

// =======================================================
// GET /api/applications/:applicationId
// =======================================================
export const getApplicationById = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const requester = req.user;

    const application = await firestoreService.getDocument(
      applicationCollection,
      applicationId
    );

    if (!application) {
      return res.status(404).json({
        error: "Application not found.",
      });
    }

    const job = await firestoreService.getDocument(jobCollection, application.jobId);
    if (!job) {
      return res.status(404).json({
        error: "Job not found for this application.",
      });
    }

    const isAdmin = requester.role === "admin";
    const isOwnerEmployer = job.employerId === requester.userId;

    if (!isAdmin && !isOwnerEmployer) {
      return res.status(403).json({
        error: "Not authorized to view this application.",
      });
    }

    const applicant = await firestoreService.getDocument(
      userCollection,
      application.applicantId
    );

    const cv = application.cvId
      ? await firestoreService.getDocument("cvs", application.cvId)
      : null;

    const safeApplicant = applicant
      ? (() => {
          const { passwordHash, ...safeUser } = applicant;
          return safeUser;
        })()
      : null;

    res.json({
      success: true,
      data: {
        ...application,
        job: {
          id: job.id,
          title: job.title,
        },
        applicant: safeApplicant,
        cv: cv
          ? {
              id: cv.id,
              fileName: cv.fileName,
              fileUrl: cv.fileUrl,
              createdAt: cv.createdAt || null,
            }
          : null,
      },
    });
  } catch (err) {
    next(err);
  }
};


// =======================================================
// GET /api/applications/my
// =======================================================
export const getMyApplications = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const applications =
      await firestoreService.getAllDocuments(applicationCollection);

    const myApplications = applications.filter(
      (app) => app.applicantId === userId
    );

    const result = [];

    for (const app of myApplications) {
      const job = await firestoreService.getDocument(
        jobCollection,
        app.jobId
      );

      result.push({
        ...app,
        job: job || null,
      });
    }

    res.json({
      success: true,
      data: result,
    });

  } catch (err) {
    next(err);
  }
};

