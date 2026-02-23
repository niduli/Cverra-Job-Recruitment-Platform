// import axios from "axios";

// export const getCVRankingScore = async (jobDescription, cvText) => {
//   try {
//     const response = await axios.post(
//       "http://localhost:8002/rank",
//       {
//         job_description: jobDescription,
//         cv_text: cvText,
//       }
//     );

//     console.log("ML RESPONSE:", response.data);

//     return response.data.score;
//   } catch (error) {
//     console.error("ML Ranking FULL Error:", error);
//     return 0;
//   }
// };


// import axios from "axios";

// const ML_SERVICE_URL = "http://localhost:6000/predict";

// export const getRolePrediction = async (profileData) => {
//   try {
//     const response = await axios.post(ML_SERVICE_URL, profileData);
//     return response.data;
//   } catch (error) {
//     console.error("ML Role Prediction Error:", error.message);
//     return null;
//   }
// };


import axios from "axios";
import { config } from "../config/env.js";

export const getRolePrediction = async (profileData) => {
  try {
    const response = await axios.post(
      config.ML_ROLE_PREDICT_URL,
      profileData
    );

    return response.data;
  } catch (error) {
    console.error("ML Role Prediction Error:", error.message);
    return null;
  }
};