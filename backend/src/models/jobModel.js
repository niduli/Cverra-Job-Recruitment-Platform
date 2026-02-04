import { v4 as uuidv4 } from "uuid";

export const collection = "jobs";

export const createJobModel = ({
  title,
  description,
  skills,
  experienceLevel,
  location,
  jobType,
  salaryRange,
  employerId,
}) => {
  const now = new Date();

  return {
    id: uuidv4(),
    title,
    description,
    skills: skills || [],
    experienceLevel: experienceLevel || "",
    location: location || "",
    jobType: jobType || "",
    salaryRange: salaryRange || "",
    employerId,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
};
