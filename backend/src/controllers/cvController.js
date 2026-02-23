// import firestoreService from "../services/firestoreService.js";
// import { uploadFile } from "../services/storageService.js";
// import { v4 as uuidv4 } from "uuid";

// const CV_COLLECTION = "cvs";

// // POST /api/cv/upload
// export const uploadCV = async (req, res, next) => {
//   try {
//     const user = req.user;
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({
//         error: "No file uploaded.",
//       });
//     }

//     // Upload to Firebase Storage
//     const fileUrl = await uploadFile(file);

//     const cvId = uuidv4();

//     const cvData = {
//       id: cvId,
//       userId: user.userId,
//       fileName: file.originalname,
//       fileUrl,
//       createdAt: new Date(),
//     };

//     // Save in Firestore
//     await firestoreService.createDocument(
//       CV_COLLECTION,
//       cvId,
//       cvData
//     );

//     res.status(201).json({
//       message: "CV uploaded successfully",
//       cv: cvData,
//     });
//   } catch (err) {
//     next(err);
//   }
// };


// import { uploadFile } from "../services/storageService.js";
// import { db } from "../config/firebaseAdmin.js";
// import { v4 as uuidv4 } from "uuid";

// export const uploadCV = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file provided" });
//     }

//     const userId = req.user.uid;
//     const fileUrl = await uploadFile(req.file);

//     // Save CV metadata to Firestore
//     const cvId = uuidv4();
//     await db.collection("cvs").doc(cvId).set({
//       id: cvId,
//       userId,
//       fileName: req.file.originalname,
//       fileUrl,
//       createdAt: new Date(),
//     });

//     res.status(200).json({
//       message: "CV uploaded successfully",
//       cv: {
//         id: cvId,
//         userId,
//         fileName: req.file.originalname,
//         fileUrl,
//         createdAt: new Date(),
//       },
//     });
//   } catch (error) {
//     console.error("Error uploading CV:", error);
//     res.status(500).json({ message: error.message || "Failed to upload CV" });
//   }
// };


import firestoreService from "../services/firestoreService.js";
import { uploadFile } from "../services/storageService.js";
import { v4 as uuidv4 } from "uuid";
import { extractTextFromPDF } from "../utils/pdfTextExtractor.js";
import { getRolePrediction } from "../services/mlCVRankingService.js";
import { collection as userCollection } from "../models/userModel.js";

const CV_COLLECTION = "cvs";

// POST /api/cv/upload
export const uploadCV = async (req, res, next) => {
  try {
    const user = req.user;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: "No file uploaded.",
      });
    }

    // 1️⃣ Upload to Firebase Storage
    const fileUrl = await uploadFile(file);

    const cvId = uuidv4();

    const cvData = {
      id: cvId,
      userId: user.userId,
      fileName: file.originalname,
      fileUrl,
      createdAt: new Date(),
    };

    // 2️⃣ Save CV record in Firestore
    await firestoreService.createDocument(
      CV_COLLECTION,
      cvId,
      cvData
    );

    // 3️⃣ Extract text from uploaded PDF (local file buffer)
    let extractedText = "";
    try {
      // extractedText = await extractTextFromPDF(file.buffer);
      extractedText = await extractTextFromPDF(fileUrl);
    } catch (err) {
      console.error("PDF extraction failed:", err.message);
    }

    // 4️⃣ Simple skill detection (keyword matching)
    const commonSkills = [
      "python",
      "java",
      "javascript",
      "react",
      "node",
      "machine learning",
      "sql",
      "aws",
      "docker",
      "html",
      "css",
      "c++",
      "c#",
    ];

    const lowerText = extractedText.toLowerCase();

    const detectedSkills = commonSkills.filter((skill) =>
      lowerText.includes(skill)
    );

    // 5️⃣ Call Role Prediction ML
    let predictedRole = null;

    try {
      const prediction = await getRolePrediction({
        skills: detectedSkills.join(", "),
        highest_degree: "",
        current_designation: "",
        experience_years: 0,
        experience_months: 0,
      });

      predictedRole = prediction?.top_roles?.[0]?.role || null;
    } catch (err) {
      console.error("Role prediction failed:", err.message);
    }

    // 6️⃣ Auto-update user profile
    await firestoreService.updateDocument(
      userCollection,
      user.userId,
      {
        skills: detectedSkills,
        predictedRole,
        updatedAt: new Date(),
      }
    );

    res.status(201).json({
      message: "CV uploaded and profile auto-updated successfully",
      cv: cvData,
      autoExtracted: {
        skills: detectedSkills,
        predictedRole,
      },
    });

  } catch (err) {
    next(err);
  }
};