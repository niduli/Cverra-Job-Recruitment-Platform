// import admin from "firebase-admin";
// import { v4 as uuidv4 } from "uuid";

// const bucket = admin.storage().bucket(
//   process.env.FIREBASE_STORAGE_BUCKET
// );

// console.log("Using bucket:", bucket.name);

// import admin from "firebase-admin";
// import { v4 as uuidv4 } from "uuid";

// const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
// console.log("Using bucket:", bucketName);

// const bucket = admin.storage().bucket(bucketName);



// export const uploadFile = async (file, folder = "cvs") => {
//   try {
//     const fileId = uuidv4();
//     const fileName = `${folder}/${fileId}-${file.originalname}`;

//     const fileUpload = bucket.file(fileName);

//     await fileUpload.save(file.buffer, {
//       metadata: {
//         contentType: file.mimetype,
//       },
//     });

//     // Make file public
//     await fileUpload.makePublic();

//     const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

//     return publicUrl;
//   } catch (error) {
//     console.error("Storage upload error:", error);
//     throw new Error("File upload failed.");
//   }
// };


import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";

const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
console.log("Using bucket:", bucketName);

const bucket = admin.storage().bucket(bucketName);

export const uploadFile = async (file, folder = "cvs") => {
  try {
    const fileId = uuidv4();
    const fileName = `${folder}/${fileId}-${file.originalname}`;

    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Generate signed URL (valid for 7 days)
    const [signedUrl] = await fileUpload.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    return signedUrl;
  } catch (error) {
    console.error("Storage upload error:", error);
    throw new Error("File upload failed.");
  }
};