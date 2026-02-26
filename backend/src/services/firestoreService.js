import admin from "../config/firebaseAdmin.js";

if (!admin.apps.length) {
  console.error("Firebase Admin not initialized!");
}

const db = admin.firestore();

const firestoreService = {
  /**
   * Get collection reference
   */
  getCollection: (collectionName) => db.collection(collectionName),

  /**
   * Get single document
   */
  getDocument: async (collectionName, docId) => {
    const doc = await db.collection(collectionName).doc(docId).get();

    if (!doc.exists) return null;

    return {
      id: doc.id,
      ...doc.data(),
    };
  },

  /**
   * Create document with custom ID
   */
  createDocument: async (collectionName, docId, data) => {
    const payload = {
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection(collectionName).doc(docId).set(payload);

    return { id: docId, ...payload };
  },

  /**
   * Add document with auto ID
   */
  addDocument: async (collectionName, data) => {
    const payload = {
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const ref = await db.collection(collectionName).add(payload);

    return ref.id;
  },

  /**
   * Update document
   */
  updateDocument: async (collectionName, docId, data) => {
    const payload = {
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection(collectionName).doc(docId).update(payload);

    return payload;
  },

  /**
   * Delete document
   */
  deleteDocument: async (collectionName, docId) => {
    await db.collection(collectionName).doc(docId).delete();
    return true;
  },

  /**
   * Get all documents
   */
  getAllDocuments: async (collectionName) => {
    const snapshot = await db.collection(collectionName).get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  /**
   * 🔥 Query documents with condition (NEW)
   */
  queryDocuments: async (collectionName, field, operator, value) => {
    const snapshot = await db
      .collection(collectionName)
      .where(field, operator, value)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },
};

export default firestoreService;