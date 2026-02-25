import { v4 as uuidv4 } from "uuid";

export const collection = "savedJobs";

export const createSavedJobModel = ({ userId, jobId }) => {
  const now = new Date();

  return {
    id: uuidv4(),
    userId,
    jobId,
    createdAt: now,
  };
};
