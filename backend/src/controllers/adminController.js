// import firestoreService from "../services/firestoreService.js";
// import { collection as userCollection } from "../models/userModel.js";
// import { collection as jobCollection } from "../models/jobModel.js";


// // GET /api/admin/users
// export const getAllUsers = async (req, res, next) => {
//   try {
//     const users = await firestoreService.getAllDocuments(userCollection);

//     res.json({
//       success: true,
//       count: users.length,
//       data: users,
//     });
//   } catch (err) {
//     next(err);
//   }
// };


// // GET /api/admin/jobs
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


// // PATCH /api/admin/approve/:userId
// export const approveEmployer = async (req, res, next) => {
//   try {
//     const { userId } = req.params;

//     await firestoreService.updateDocument(userCollection, userId, {
//       approved: true,
//       updatedAt: new Date(),
//     });

//     res.json({
//       message: "Employer approved successfully",
//     });
//   } catch (err) {
//     next(err);
//   }
// };


// // GET /api/admin/analytics
// export const getSystemAnalytics = async (req, res, next) => {
//   try {
//     const users = await firestoreService.getAllDocuments(userCollection);
//     const jobs = await firestoreService.getAllDocuments(jobCollection);

//     const employers = users.filter(u => u.role === "employer");
//     const jobseekers = users.filter(u => u.role === "jobseeker");

//     res.json({
//       success: true,
//       analytics: {
//         totalUsers: users.length,
//         totalEmployers: employers.length,
//         totalJobSeekers: jobseekers.length,
//         totalJobs: jobs.length,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

import firestoreService from "../services/firestoreService.js";
import { collection as userCollection } from "../models/userModel.js";
import { collection as jobCollection } from "../models/jobModel.js";


// GET /api/admin/users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await firestoreService.getAllDocuments(userCollection);

    // 🔐 Remove sensitive fields like passwordHash
    const safeUsers = users.map((user) => {
      const { passwordHash, ...safeData } = user;
      return safeData;
    });

    res.json({
      success: true,
      count: safeUsers.length,
      data: safeUsers,
    });
  } catch (err) {
    next(err);
  }
};


// GET /api/admin/jobs
export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await firestoreService.getAllDocuments(jobCollection);

    res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (err) {
    next(err);
  }
};


// PATCH /api/admin/approve/:userId
export const approveEmployer = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await firestoreService.getDocument(userCollection, userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    if (user.role !== "employer") {
      return res.status(400).json({
        error: "Only employer accounts can be approved.",
      });
    }

    await firestoreService.updateDocument(userCollection, userId, {
      approved: true,
      updatedAt: new Date(),
    });

    res.json({
      success: true,
      message: "Employer approved successfully.",
    });
  } catch (err) {
    next(err);
  }
};


// GET /api/admin/analytics
export const getSystemAnalytics = async (req, res, next) => {
  try {
    const users = await firestoreService.getAllDocuments(userCollection);
    const jobs = await firestoreService.getAllDocuments(jobCollection);

    const employers = users.filter((u) => u.role === "employer");
    const approvedEmployers = employers.filter((u) => u.approved === true);
    const jobseekers = users.filter((u) => u.role === "jobseeker");
    const admins = users.filter((u) => u.role === "admin");

    res.json({
      success: true,
      analytics: {
        totalUsers: users.length,
        totalAdmins: admins.length,
        totalEmployers: employers.length,
        approvedEmployers: approvedEmployers.length,
        totalJobSeekers: jobseekers.length,
        totalJobs: jobs.length,
      },
    });
  } catch (err) {
    next(err);
  }
};