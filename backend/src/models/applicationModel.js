import { v4 as uuidv4 } from "uuid";

export const collection = "applications";

export const createApplicationModel = ({
  jobId,
  applicantId,
  applicantName,
  resumeUrl = "",
}) => {
  return {
    id: uuidv4(),
    jobId,
    applicantId,
    applicantName,
    resumeUrl,
    status: "applied", // applied | reviewed | accepted | rejected
    createdAt: new Date(),
  };
};
