import firestoreService from "../services/firestoreService.js";

export const insertTestData = async (req, res) => {
  try {
    const id = await firestoreService.addDocument("users", {
      name: "Test User",
      email: "test@example.com",
      role: "candidate",
    });

    res.json({ success: true, id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Insert failed" });
  }
};

export const getTestData = async (req, res) => {
  try {
    const users = await firestoreService.getCollection("users").get();
    const data = users.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fetch failed" });
  }
};
