import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "../Dashboard.css";

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);
  const [cvs, setCvs] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState("");
  const [cvLoading, setCvLoading] = useState(false);

  useEffect(() => {
    const loadJobDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch job details
        const jobResponse = await api.get(`/jobs/${jobId}`);
        setJob(jobResponse.data.data);

        // If jobseeker, fetch their CVs
        if (user?.role === "jobseeker") {
          try {
            setCvLoading(true);
            const cvResponse = await api.get("/cv/my");
            const userCvs = cvResponse.data.data || [];
            setCvs(userCvs);
            if (userCvs.length > 0) {
              setSelectedCvId(userCvs[0].id);
            }
          } catch (err) {
            console.error("Failed to load CVs:", err);
          } finally {
            setCvLoading(false);
          }
        }
      } catch (err) {
        setError(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Failed to load job details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      loadJobDetails();
    }
  }, [jobId, user?.role]);

  const handleApply = async () => {
    if (!selectedCvId) {
      setError("Please select or upload a CV first");
      return;
    }

    try {
      setApplying(true);
      setError("");

      await api.post(`/applications/apply/${jobId}`, {
        cvId: selectedCvId,
      });

      alert("Application submitted successfully!");
      navigate("/jobseeker/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to submit application"
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <div className="dashboard-container">
          <div className="loading-message">Loading job details...</div>
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <div className="dashboard-container">
          <div className="error-message">{error}</div>
          <button onClick={() => navigate(-1)} className="btn-secondary">
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Navbar />

      <div className="dashboard-container">
        <div className="job-detail-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        {job && (
          <div className="job-detail-container">
            <div className="job-detail-main">
              {/* Job Header */}
              <div className="job-detail-card">
                <div className="job-detail-title">
                  <h1>{job.title}</h1>
                  <span className={`job-status status-${job.status?.toLowerCase() || "active"}`}>
                    {job.status || "Active"}
                  </span>
                </div>

                <div className="job-detail-meta">
                  <div className="meta-item">
                    <span className="meta-icon">📍</span>
                    <span>{job.location || "Location not specified"}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">💰</span>
                    <span>{job.salaryRange || "Salary not specified"}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">⏰</span>
                    <span>{job.jobType || "Employment type not specified"}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">🎯</span>
                    <span>{job.experienceLevel || "Experience level not specified"}</span>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="job-detail-card">
                <h2>Job Description</h2>
                <p className="job-description">{job.description || "No description provided"}</p>
              </div>

              {/* Required Skills */}
              <div className="job-detail-card">
                <h2>Required Skills</h2>
                <div className="skills-container">
                  {Array.isArray(job.skills) && job.skills.length > 0 ? (
                    job.skills.map((skill, index) => (
                      <div key={index} className="skill-tag">
                        {skill}
                      </div>
                    ))
                  ) : (
                    <p>No specific skills listed</p>
                  )}
                </div>
              </div>

              {/* Apply Section (for jobseekers only) */}
              {user?.role === "jobseeker" && (
                <div className="job-detail-card apply-section">
                  <h2>Apply for this Position</h2>
                  {error && <div className="error-message">{error}</div>}

                  {cvLoading ? (
                    <p>Loading your CVs...</p>
                  ) : cvs.length === 0 ? (
                    <div className="no-cv-message">
                      <p>You haven't uploaded any CV yet</p>
                      <button
                        className="btn-primary"
                        onClick={() => navigate("/jobseeker/upload-cv")}
                      >
                        Upload CV
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="form-group">
                        <label htmlFor="cvSelect">Select CV to apply with</label>
                        <select
                          id="cvSelect"
                          value={selectedCvId}
                          onChange={(e) => setSelectedCvId(e.target.value)}
                          className="form-input"
                        >
                          {cvs.map((cv) => (
                            <option key={cv.id} value={cv.id}>
                              {cv.fileName || cv.id} -{" "}
                              {new Date(cv.createdAt?.seconds * 1000).toLocaleDateString()}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        className="btn-primary"
                        onClick={handleApply}
                        disabled={applying}
                      >
                        {applying ? "🔄 Submitting..." : "✓ Apply Now"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar Info */}
            <div className="job-detail-sidebar">
              <div className="sidebar-card">
                <h3>About This Job</h3>
                <div className="sidebar-info">
                  <div className="info-row">
                    <span className="info-label">Posted</span>
                    <span className="info-value">
                      {job.createdAt?.seconds
                        ? new Date(job.createdAt.seconds * 1000).toLocaleDateString()
                        : job.createdAt
                        ? new Date(job.createdAt).toLocaleDateString()
                        : "Recently"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Status</span>
                    <span className="info-value">{job.status || "Active"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;
