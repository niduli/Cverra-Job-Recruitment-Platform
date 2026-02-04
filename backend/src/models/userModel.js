// backend/src/models/userModel.js

// // Firestore collection name for users
// export const collection = "users";

// // Optional schema reference
// export const userFields = {
//   id: "string",
//   name: "string",
//   email: "string",
//   password: "string",
//   role: "string", // jobseeker | employer | admin
//   createdAt: "timestamp",
//   updatedAt: "timestamp",
// };

import { v4 as uuidv4 } from "uuid";

// Firestore collection name
export const collection = "users";

// Schema reference (documentation purpose)
export const userFields = {
  id: "string",
  name: "string",
  email: "string",
  passwordHash: "string",
  role: "string", // candidate | employer | admin
  createdAt: "timestamp",
  updatedAt: "timestamp",
};

// Helper to create user object
export const createUserModel = ({
  name,
  email,
  passwordHash,
  role = "candidate",
}) => {
  const now = new Date();

  return {
    id: uuidv4(),
    name,
    email,
    passwordHash,
    role,
    createdAt: now,
    updatedAt: now,
  };
};

