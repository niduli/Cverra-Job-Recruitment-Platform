import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "../../");

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
  console.warn(
    "FIREBASE_SERVICE_ACCOUNT_PATH not set. Firebase Admin not initialized."
  );
} else {
  const resolvedPath = path.isAbsolute(serviceAccountPath)
    ? serviceAccountPath
    : path.join(backendRoot, serviceAccountPath);

  if (!fs.existsSync(resolvedPath)) {
    console.error("Firebase service account file not found:", resolvedPath);
  } else {
    const serviceAccount = JSON.parse(
      fs.readFileSync(resolvedPath, "utf8")
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
      databaseURL: process.env.FIREBASE_DATABASE_URL || undefined,
    });

    console.log("Firebase Admin initialized.");
  }
}

export default admin;
