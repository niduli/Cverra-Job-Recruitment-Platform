import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import "../Dashboard.css";
import "./UploadCV.css";

const UploadCV = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [myCVs, setMyCVs] = useState([]);
  const [loadingCVs, setLoadingCVs] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [autoExtracted, setAutoExtracted] = useState({
    skills: [],
    predictedRole: "",
  });

  const fetchMyCVs = async () => {
    try {
      setLoadingCVs(true);
      const response = await api.get("/cv/my");
      setMyCVs(response.data?.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to load your CV list."
      );
    } finally {
      setLoadingCVs(false);
    }
  };

  useEffect(() => {
    fetchMyCVs();
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const response = await api.get("/profile/me");
        const profile = response.data?.data || null;
        setAutoExtracted({
          skills: profile?.skills || [],
          predictedRole: profile?.predictedRole || "",
        });
      } catch (err) {
        setAutoExtracted({
          skills: [],
          predictedRole: "",
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (createdAt) => {
    if (!createdAt) return "-";
    if (createdAt?.seconds) {
      return new Date(createdAt.seconds * 1000).toLocaleString();
    }
    const date = new Date(createdAt);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
  };

  const handleFileChange = (event) => {
    setError("");
    setMessage("");
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!selectedFile) {
      setError("Please select a CV file first.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("cv", selectedFile);

      const uploadResponse = await api.post("/cv/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const extracted = uploadResponse.data?.autoExtracted || {};
      setAutoExtracted({
        skills: extracted.skills || [],
        predictedRole: extracted.predictedRole || "",
      });

      setMessage("CV uploaded successfully.");
      setSelectedFile(null);
      await fetchMyCVs();
      const refreshedProfile = await api.get("/profile/me");
      const profile = refreshedProfile.data?.data || null;
      setAutoExtracted({
        skills: profile?.skills || [],
        predictedRole: profile?.predictedRole || "",
      });
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to upload CV."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-header upload-header">
          <div>
            <h1>Upload CV</h1>
            <p>Upload your latest CV before applying for jobs</p>
          </div>
          <button className="upload-back-btn" onClick={() => navigate("/jobseeker/dashboard")}>Back to Dashboard</button>
        </div>

        <section className="section upload-section">
          <form onSubmit={handleUpload} className="upload-form">
            <label htmlFor="cv-file" className="upload-label">Select CV (PDF)</label>
            <input
              id="cv-file"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="upload-input"
            />
            {selectedFile && <p className="upload-selected">Selected: {selectedFile.name}</p>}

            <button type="submit" className="apply-btn" disabled={loading}>
              {loading ? "Uploading..." : "Upload CV"}
            </button>
          </form>

          {message && <p className="upload-success">{message}</p>}
          {error && <p className="upload-error">{error}</p>}
        </section>

        <section className="section upload-section">
          <div className="section-header">
            <h2>Profile Insights</h2>
            <span className="view-all">
              {loadingProfile ? "Checking..." : "Updated from CV"}
            </span>
          </div>
          {loadingProfile && <p>Loading profile insights...</p>}
          {!loadingProfile && (
            <div className="insights-card">
              <div className="insights-item">
                <h3>Predicted Role</h3>
                <p className="insight-value">
                  {autoExtracted.predictedRole || "Not detected yet"}
                </p>
              </div>
              <div className="insights-item">
                <h3>Detected Skills</h3>
                <div className="skill-chips">
                  {(autoExtracted.skills || []).length === 0 && (
                    <span className="chip muted">No skills detected yet</span>
                  )}
                  {(autoExtracted.skills || []).map((skill) => (
                    <span key={skill} className="chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="section upload-section">
          <div className="section-header">
            <h2>My Uploaded CVs</h2>
            <span className="view-all">Total: {myCVs.length}</span>
          </div>

          {loadingCVs && <p>Loading CVs...</p>}
          {!loadingCVs && myCVs.length === 0 && <p>No CV uploaded yet.</p>}

          {!loadingCVs && myCVs.length > 0 && (
            <div className="applications-list">
              {myCVs.map((cv) => (
                <div key={cv.id} className="application-card">
                  <div className="app-info">
                    <h3>{cv.fileName || "CV File"}</h3>
                    <p className="date">Uploaded: {formatDate(cv.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UploadCV;