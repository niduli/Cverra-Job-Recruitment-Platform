import firestoreService from "../services/firestoreService.js";
import {
  collection as jobCollection,
  createJobModel,
} from "../models/jobModel.js";

// POST /api/jobs
export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      skills,
      experienceLevel,
      location,
      jobType,
      salaryRange,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        error: "Title and description are required.",
      });
    }

    // employer ID from token
    const employerId = req.user.userId;

    const job = createJobModel({
      title,
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
      message: "Job created successfully",
      jobId: job.id,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/jobs
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
