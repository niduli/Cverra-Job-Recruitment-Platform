// import dotenv from "dotenv";
// import app from "./src/app.js";

// dotenv.config();

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Backend server running on port ${PORT}`);
// });


import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables BEFORE any other imports
const envPath = path.join(__dirname, ".env");

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.error(".env file not found at:", envPath);
}

// Use dynamic import to ensure env vars are loaded first
const { default: app } = await import("./src/app.js");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
