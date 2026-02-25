// import firestoreService from "../services/firestoreService.js";
// import {
//   collection as jobCollection,
//   createJobModel,
// } from "../models/jobModel.js";

// // POST /api/jobs
// export const createJob = async (req, res, next) => {
//   try {
//     const {
//       title,
//       description,
//       skills,
//       experienceLevel,
//       location,
//       jobType,
//       salaryRange,
//     } = req.body;

//     if (!title || !description) {
//       return res.status(400).json({
//         error: "Title and description are required.",
//       });
//     }

//     // employer ID from token
//     const employerId = req.user.userId;

//     const job = createJobModel({
//       title,
//       description,
//       skills,
//       experienceLevel,
//       location,
//       jobType,
//       salaryRange,
//       employerId,
//     });

//     await firestoreService.createDocument(
//       jobCollection,
//       job.id,
//       job
//     );

//     res.status(201).json({
//       message: "Job created successfully",
//       jobId: job.id,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // GET /api/jobs
// export const getAllJobs = async (req, res, next) => {
//   try {
//     const jobs = await firestoreService.getAllDocuments(jobCollection);

//     res.json({
//       success: true,
//       count: jobs.length,
//       data: jobs,
//     });
//   } catch (err) {
//     next(err);
//   }
// };


import firestoreService from "../services/firestoreService.js";
import {
  collection as jobCollection,
  createJobModel,
} from "../models/jobModel.js";
import { collection as userCollection } from "../models/userModel.js";
import { getJobRecommendations } from "../services/mlJobRecommendService.js";


// =============================
// POST /api/jobs
// =============================
// export const createJob = async (req, res, next) => {
//   try {
//     const {
//       title,
//       description,
//       skills,
//       experienceLevel,
//       location,
//       jobType,
//       salaryRange,
//     } = req.body;

//     if (!title || !description) {
//       return res.status(400).json({
//         error: "Title and description are required.",
//       });
//     }

//     const employerId = req.user.userId;

//     const job = createJobModel({
//       title,
//       description,
//       skills,
//       experienceLevel,
//       location,
//       jobType,
//       salaryRange,
//       employerId,
//     });

//     await firestoreService.createDocument(
//       jobCollection,
//       job.id,
//       job
//     );

//     res.status(201).json({
//       message: "Job created successfully",
//       jobId: job.id,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      description,
      skills,
      experienceLevel,
      location,
      jobType,
      salaryRange,
    } = req.body;

    if (!title || !description || !company) {
      return res.status(400).json({
        error: "Title, company, and description are required.",
      });
    }

    const employerId = req.user.userId;

    // 🔍 Fetch employer from Firestore
    const employer = await firestoreService.getDocument(
      userCollection,
      employerId
    );

    if (!employer) {
      return res.status(404).json({
        error: "Employer not found.",
      });
    }

    // 🚫 Ensure only employers can create jobs
    if (employer.role !== "employer") {
      return res.status(403).json({
        error: "Only employers can create jobs.",
      });
    }

    // 🚫 Enforce admin approval
    if (!employer.approved) {
      return res.status(403).json({
        error: "Employer account not approved by admin.",
      });
    }

    const job = createJobModel({
      title,
      company,
      description,
      skills,
      experienceLevel,
      location,
      jobType,
      salaryRange,
      employerId,
    });

    await firestoreService.createDocument(
      jobCollection,
      job.id,
      job
    );

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      jobId: job.id,
    });
  } catch (err) {
    next(err);
  }
};


// =============================
// GET /api/jobs
// =============================
export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await firestoreService.getAllDocuments(jobCollection);

    const getTimestampSeconds = (value) => {
      if (!value) return 0;
      if (typeof value?.seconds === "number") return value.seconds;
      if (typeof value?._seconds === "number") return value._seconds;
      const parsed = new Date(value).getTime();
      return Number.isNaN(parsed) ? 0 : Math.floor(parsed / 1000);
    };

    const sortedJobs = [...jobs].sort(
      (a, b) => getTimestampSeconds(b.createdAt) - getTimestampSeconds(a.createdAt)
    );

    res.json({
      success: true,
      count: sortedJobs.length,
      data: sortedJobs,
    });
  } catch (err) {
    next(err);
  }
};

// =============================
// GET /api/jobs/my (Employer's jobs only)
// =============================
export const getEmployerJobs = async (req, res, next) => {
  try {
    const employerId = req.user.userId;

    // Query jobs where employerId matches current user
    const employerJobs = await firestoreService.queryDocuments(
      jobCollection,
      "employerId",
      "==",
      employerId
    );

    const getTimestampSeconds = (value) => {
      if (!value) return 0;
      if (typeof value?.seconds === "number") return value.seconds;
      if (typeof value?._seconds === "number") return value._seconds;
      const parsed = new Date(value).getTime();
      return Number.isNaN(parsed) ? 0 : Math.floor(parsed / 1000);
    };

    const sortedEmployerJobs = [...employerJobs].sort(
      (a, b) => getTimestampSeconds(b.createdAt) - getTimestampSeconds(a.createdAt)
    );

    res.json({
      success: true,
      count: sortedEmployerJobs.length,
      data: sortedEmployerJobs,
    });
  } catch (err) {
    next(err);
  }
};

// =============================
// GET /api/jobs/:jobId
// =============================
export const getJobById = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await firestoreService.getDocument(jobCollection, jobId);

    if (!job) {
      return res.status(404).json({
        error: "Job not found.",
      });
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};


// =============================
// PUT /api/jobs/:jobId
// =============================
export const updateJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { title, description, skills, experienceLevel, location, jobType, salaryRange } = req.body;
    const employerId = req.user.userId;

    if (!title || !description) {
      return res.status(400).json({
        error: "Title and description are required.",
      });
    }

    // Get the job
    const job = await firestoreService.getDocument(jobCollection, jobId);

    if (!job) {
      return res.status(404).json({
        error: "Job not found.",
      });
    }

    // Ensure the job belongs to the current employer
    if (job.employerId !== employerId) {
      return res.status(403).json({
        error: "You can only edit your own jobs.",
      });
    }

    // Update the job
    const updatedJob = {
      ...job,
      title,
      description,
      skills,
      experienceLevel,
      location,
      jobType,
      salaryRange,
      updatedAt: new Date().toISOString(),
    };

    await firestoreService.updateDocument(
      jobCollection,
      jobId,
      updatedJob
    );

    res.json({
      success: true,
      message: "Job updated successfully",
      jobId: jobId,
    });
  } catch (err) {
    next(err);
  }
};


// =============================
// GET /api/jobs/recommended
// =============================
export const getRecommendedJobs = async (req, res, next) => {
  try {
    const user = req.user;

    // Get full candidate profile
    const profile = await firestoreService.getDocument(
      userCollection,
      user.userId
    );

    if (!profile) {
      return res.status(404).json({
        error: "Profile not found",
      });
    }

    // Only recommend active jobs
    const jobs = await firestoreService.queryDocuments(
      jobCollection,
      "status",
      "==",
      "active"
    );

    if (!jobs.length) {
      return res.json({
        success: true,
        count: 0,
        data: [],
      });
    }

    // Call ML recommendation service
    const result = await getJobRecommendations(profile, jobs);

    if (!result.recommended_jobs) {
      return res.json({
        success: true,
        count: 0,
        data: [],
      });
    }

    // Map ML scores back to job objects
    const recommended = result.recommended_jobs.map((rec) => {
      const job = jobs.find((j) => j.id === rec.job_id);
      if (!job) return null;

      return {
        ...job,
        matchScore: rec.score,
      };
    }).filter(Boolean);

    // Sort highest score first
    recommended.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      count: recommended.length,
      data: recommended,
    });

  } catch (err) {
    next(err);
  }
};