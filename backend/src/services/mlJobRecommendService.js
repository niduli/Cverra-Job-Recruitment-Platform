// export const getJobRecommendations = async (profile, jobs) => {
//   try {
//     const response = await fetch("http://localhost:5002/recommend", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         skills: profile.skills?.join(" ") || "",
//         education: profile.education || "",
//         experience: profile.experience || "",
//         jobs: jobs.map((job) => ({
//           id: job.id,
//           title: job.title,
//           description: job.description,
//           skills: job.skills || [],
//         })),
//       }),
//     });

//     if (!response.ok) {
//       throw new Error("ML recommendation service failed");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Job recommendation error:", error);
//     return { recommended_jobs: [] };
//   }
// };

import axios from "axios";
import { config } from "../config/env.js";

export const getJobRecommendations = async (profile, jobs) => {
  try {
    const response = await axios.post(
      config.ML_JOB_RECOMMEND_URL,
      {
        skills: profile.skills?.join(" ") || "",
        education: profile.education || "",
        experience: profile.experience || "",
        jobs: jobs.map((job) => ({
          id: job.id,
          title: job.title,
          description: job.description,
          skills: job.skills || [],
        })),
      }
    );

    return response.data;

  } catch (error) {
    console.error("Job recommendation error:", error.message);
    return { recommended_jobs: [] };
  }
};