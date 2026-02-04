// import bcrypt from "bcryptjs";
// import firestoreService from "../services/firestoreService.js";
// import { collection as userCollection } from "../models/userModel.js";
// import { v4 as uuidv4 } from "uuid";

// // POST /api/auth/register
// export const register = async (req, res, next) => {
//   try {
//     const { name, email, password, role } = req.body;

//     if (!name || !email || !password || !role) {
//       return res.status(400).json({ error: "All fields are required." });
//     }

//     // Check if user already exists
//     const existingUsers = await firestoreService.getAllDocuments(
//       userCollection
//     );

//     const existing = existingUsers.find((u) => u.email === email);

//     if (existing)
//       return res.status(400).json({ error: "Email already registered." });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const userId = uuidv4();

//     const userData = {
//       id: userId,
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     await firestoreService.createDocument(
//       userCollection,
//       userId,
//       userData
//     );

//     res
//       .status(201)
//       .json({ message: "User registered successfully.", userId });
//   } catch (err) {
//     next(err);
//   }
// };

// // POST /api/auth/login
// export const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     const users = await firestoreService.getAllDocuments(userCollection);

//     const user = users.find((u) => u.email === email);

//     if (!user)
//       return res.status(404).json({ error: "User not found." });

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch)
//       return res.status(401).json({ error: "Invalid credentials." });

//     res.json({
//       message: "Login successful",
//       user: {
//         id: user.id,
//         name: user.name,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };



import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import firestoreService from "../services/firestoreService.js";
import {
  collection as userCollection,
  createUserModel,
} from "../models/userModel.js";

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required.",
      });
    }

    // Check if email already exists
    const users = await firestoreService.getAllDocuments(userCollection);
    const existing = users.find((u) => u.email === email);

    if (existing) {
      return res.status(400).json({
        error: "Email already registered.",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user using model helper
    const user = createUserModel({
      name,
      email,
      passwordHash,
      role,
    });

    // Save to Firestore
    await firestoreService.createDocument(
      userCollection,
      user.id,
      user
    );

    res.status(201).json({
      message: "User registered successfully.",
      userId: user.id,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    const users = await firestoreService.getAllDocuments(userCollection);

    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Compare password with stored hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid credentials.",
      });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

