// import { v4 as uuidv4 } from "uuid";

// // Firestore collection name
// export const collection = "users";

// // Schema reference (documentation purpose)
// export const userFields = {
//   id: "string",
//   name: "string",
//   email: "string",
//   passwordHash: "string",
//   role: "string", // candidate | employer | admin
//   createdAt: "timestamp",
//   updatedAt: "timestamp",
// };

// // Helper to create user object
// export const createUserModel = ({
//   name,
//   email,
//   passwordHash,
//   role = "candidate",
// }) => {
//   const now = new Date();

//   return {
//     id: uuidv4(),
//     name,
//     email,
//     passwordHash,
//     role,
//     createdAt: now,
//     updatedAt: now,
//   };
// };


import { v4 as uuidv4 } from "uuid";

export const collection = "users";

export const userFields = {
  id: "string",
  name: "string",
  email: "string",
  passwordHash: "string",
  role: "string",
  bio: "string",
  skills: "array",
  location: "string",
  phone: "string",
  experience: "string",
  education: "string",
  linkedin: "string",
  profileVisibility: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp",
};

export const createUserModel = ({
  name,
  email,
  passwordHash,
  role = "jobseeker",
}) => {
  const now = new Date();

  return {
    id: uuidv4(),
    name,
    email,
    passwordHash,
    role,

    // Profile fields
    bio: "",
    skills: [],
    location: "",
    phone: "",

    currentDesignation: "",
    experienceYears: 0,
    experienceMonths: 0,

    highestDegree: "",
    fieldOfStudy: "",

    linkedin: "",
    profileVisibility: "public",

    createdAt: now,
    updatedAt: now,
  };
};
