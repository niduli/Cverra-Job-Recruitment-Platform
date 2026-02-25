import firestoreService from "../services/firestoreService.js";
import bcrypt from "bcryptjs";

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

export const debugApplications = async (req, res) => {
  try {
    const applications = await firestoreService.getCollection("applications").get();
    const data = applications.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    
    console.log("📋 ALL APPLICATIONS IN DB:", data);
    
    res.json({ 
      success: true, 
      count: data.length,
      data 
    });
  } catch (error) {
    console.error("❌ Error fetching applications:", error);
    res.status(500).json({ error: error.message });
  }
};

export const debugJobs = async (req, res) => {
  try {
    const jobs = await firestoreService.getCollection("jobs").get();
    const data = jobs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    
    console.log("📋 ALL JOBS IN DB:", data);
    
    res.json({ 
      success: true, 
      count: data.length,
      data 
    });
  } catch (error) {
    console.error("❌ Error fetching jobs:", error);
    res.status(500).json({ error: error.message });
  }
};

export const debugJobAnalytics = async (req, res) => {
  try {
    const { jobId } = req.query;
    
    if (!jobId) {
      return res.status(400).json({ error: "jobId query param required" });
    }

    const applications = await firestoreService.queryDocuments("applications", "jobId", "==", jobId);
    
    console.log(`📊 Applications for jobId ${jobId}:`, applications.length, applications);
    
    res.json({ 
      success: true,
      jobId,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const debugEmployerDashboard = async (req, res) => {
  try {
    const employerId = req.user?.userId || "MISSING";
    
    // Get employer's jobs
    const jobs = await firestoreService.queryDocuments("jobs", "employerId", "==", employerId);
    
    // Get all applications
    const allApplications = await firestoreService.getCollection("applications").get();
    const allAppsData = allApplications.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    
    // Filter applications belonging to employer's jobs
    const employerJobIds = jobs.map((job) => job.id);
    const employerApplications = allAppsData.filter((app) =>
      employerJobIds.includes(app.jobId)
    );
    
    console.log("🔍 Employer Debug:", {
      employerId,
      jobsFound: jobs.length,
      jobIds: employerJobIds,
      allApplicationsInDB: allAppsData.length,
      filteredApplications: employerApplications.length,
    });
    
    res.json({
      success: true,
      debug: {
        employerId,
        jobsFound: jobs.length,
        jobIds: employerJobIds,
        allApplicationsInDB: allAppsData.length,
        filteredApplications: employerApplications.length,
        jobs,
        applications: employerApplications,
      }
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const testPasswordHash = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password required for test" });
    }

    console.log("\n🔐 TEST: Password Hashing & Comparison");
    console.log("Input password:", password);

    // Hash the password
    const hash1 = await bcrypt.hash(password, 10);
    console.log("Hash 1:", hash1);

    // Hash again (should be different due to salt)
    const hash2 = await bcrypt.hash(password, 10);
    console.log("Hash 2:", hash2);

    // Compare with first hash
    const compare1 = await bcrypt.compare(password, hash1);
    console.log("Compare with Hash 1:", compare1);

    // Compare with second hash
    const compare2 = await bcrypt.compare(password, hash2);
    console.log("Compare with Hash 2:", compare2);

    res.json({
      success: true,
      test: {
        inputPassword: password,
        hash1,
        hash2,
        compareWithHash1: compare1,
        compareWithHash2: compare2,
        bothHashable: compare1 && compare2,
      },
    });
  } catch (error) {
    console.error("❌ Password test error:", error);
    res.status(500).json({ error: error.message });
  }
};
