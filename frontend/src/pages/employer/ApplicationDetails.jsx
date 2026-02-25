import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import "../Dashboard.css";

const formatDate = (value) => {
  if (!value) return "-";
  if (value?.seconds) return new Date(value.seconds * 1000).toLocaleDateString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "-" : parsed.toLocaleDateString();
};

const ApplicationDetails = () => {
  const { applicationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [application, setApplication] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [interviewAt, setInterviewAt] = useState("");
  const [interviewMode, setInterviewMode] = useState("online");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/applications/${applicationId}`);
        setApplication(response.data?.data || null);
      } catch (err) {
        const fallbackApp = location.state?.application || null;

        if (fallbackApp) {
          setApplication((previous) => ({
            ...(previous || {}),
            ...fallbackApp,
            job: fallbackApp.jobTitle
              ? { id: fallbackApp.jobId || "", title: fallbackApp.jobTitle }
              : previous?.job,
          }));

          if (fallbackApp.applicantId) {
            try {
              const profileResponse = await api.get(`/profile/${fallbackApp.applicantId}`);
              setApplication((previous) => ({
                ...(previous || {}),
                applicant: profileResponse.data?.data || null,
              }));
            } catch {
              // Keep fallback data only.
            }
          }
        }

        const rawResponseBody =
          typeof err?.response?.data === "string" ? err.response.data : "";
        const routeMissing = err?.response?.status === 404 && rawResponseBody.includes("Cannot GET");

        setError(
          routeMissing
            ? "Applicant details endpoint is not available on the running backend. Restart backend server and try again."
            : err?.response?.data?.error ||
                err?.response?.data?.message ||
                (!fallbackApp ? "Failed to load applicant details." : "")
        );
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) loadDetails();
  }, [applicationId]);

  const applicant = application?.applicant || {};
  const cv = application?.cv || null;

  const updateApplicationStatus = async (status, extra = {}) => {
    try {
      setActionLoading(true);
      setActionError("");
      await api.patch(`/applications/${applicationId}/status`, { status, ...extra });
      setApplication((prev) => (prev ? { ...prev, status, ...extra } : prev));
      return true;
    } catch (err) {
      setActionError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to update application status."
      );
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const handleReview = async () => {
    await updateApplicationStatus("reviewed");
  };

  const handleReject = async () => {
    await updateApplicationStatus("rejected");
    setShowInterviewForm(false);
  };

  const handleAcceptAndSchedule = async () => {
    if (!interviewAt) {
      setActionError("Please select interview date and time.");
      return;
    }

    const ok = await updateApplicationStatus("accepted", {
      interviewAt,
      interviewMode,
      interviewLocation: interviewLocation.trim(),
      interviewNotes: interviewNotes.trim(),
    });

    if (ok) {
      setShowInterviewForm(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <div className="dashboard-container">
          <div className="loading-message">Loading applicant details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <div className="dashboard-container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            Back
          </button>
          <div className="error-message">{error}</div>
          {application && (
            <button
              className="btn-secondary"
              style={{ width: "auto", marginTop: 12 }}
              onClick={() => setError("")}
            >
              Continue With Available Data
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Navbar />

      <div className="dashboard-container">
        <div className="profile-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            Back
          </button>
          {applicant?.id && (
            <button
              className="btn-secondary"
              style={{ width: "auto", marginLeft: "auto" }}
              onClick={() => navigate(`/profile/${applicant.id}`)}
            >
              Open Public Profile
            </button>
          )}
        </div>

        <div className="profile-container">
          <div className="profile-card profile-header-card">
            <div className="profile-avatar-large">AP</div>
            <div className="profile-header-info">
              <h1>{applicant.name || application?.applicantName || "Candidate"}</h1>
              <p className="profile-role">{applicant.role || "jobseeker"}</p>
              <p className="profile-bio">
                Application for {application?.job?.title || "job"} | Status: {application?.status || "applied"}
              </p>
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-left">
              <div className="profile-card">
                <h2>Candidate Details</h2>
                <div className="profile-info-list">
                  <div className="info-item">
                    <span className="info-label">Name</span>
                    <span className="info-value">{applicant.name || application?.applicantName || "-"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email</span>
                    <span className="info-value">{applicant.email || "-"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{applicant.phone || "-"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Location</span>
                    <span className="info-value">{applicant.location || "-"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Applied On</span>
                    <span className="info-value">{formatDate(application?.createdAt)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Rank Score</span>
                    <span className="info-value">{Number(application?.rankScore || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {Array.isArray(applicant.skills) && applicant.skills.length > 0 && (
                <div className="profile-card">
                  <h2>Skills</h2>
                  <div className="skills-container">
                    {applicant.skills.map((skill, index) => (
                      <div key={index} className="skill-tag">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="profile-right">
              <div className="profile-card">
                <h2>Application Actions</h2>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    className="btn-secondary"
                    style={{ width: "auto" }}
                    onClick={handleReview}
                    disabled={actionLoading}
                  >
                    Mark Reviewed
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ width: "auto", borderColor: "#dc2626", color: "#dc2626" }}
                    onClick={handleReject}
                    disabled={actionLoading}
                  >
                    Reject
                  </button>
                  <button
                    className="btn-primary"
                    style={{ width: "auto" }}
                    onClick={() => setShowInterviewForm((prev) => !prev)}
                    disabled={actionLoading}
                  >
                    Accept & Schedule Interview
                  </button>
                </div>

                {actionError && (
                  <p style={{ marginTop: 12, color: "var(--color-danger-text, #dc2626)" }}>
                    {actionError}
                  </p>
                )}

                {showInterviewForm && (
                  <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="interviewAt">Interview Date & Time</label>
                      <input
                        id="interviewAt"
                        type="datetime-local"
                        className="form-input"
                        value={interviewAt}
                        onChange={(e) => setInterviewAt(e.target.value)}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="interviewMode">Interview Mode</label>
                      <select
                        id="interviewMode"
                        className="form-input"
                        value={interviewMode}
                        onChange={(e) => setInterviewMode(e.target.value)}
                      >
                        <option value="online">Online</option>
                        <option value="onsite">Onsite</option>
                        <option value="phone">Phone</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="interviewLocation">
                        Meeting Link / Location
                      </label>
                      <input
                        id="interviewLocation"
                        type="text"
                        className="form-input"
                        placeholder="Zoom link or office location"
                        value={interviewLocation}
                        onChange={(e) => setInterviewLocation(e.target.value)}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="interviewNotes">Notes (Optional)</label>
                      <textarea
                        id="interviewNotes"
                        className="form-input"
                        rows={3}
                        placeholder="Any interview instructions"
                        value={interviewNotes}
                        onChange={(e) => setInterviewNotes(e.target.value)}
                      />
                    </div>

                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        className="btn-primary"
                        style={{ width: "auto" }}
                        onClick={handleAcceptAndSchedule}
                        disabled={actionLoading}
                      >
                        Confirm Acceptance
                      </button>
                      <button
                        className="btn-secondary"
                        style={{ width: "auto" }}
                        onClick={() => setShowInterviewForm(false)}
                        disabled={actionLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {application?.status === "accepted" && application?.interviewAt && (
                  <div style={{ marginTop: 16 }}>
                    <p className="profile-text" style={{ marginBottom: 4 }}>
                      Interview Scheduled: {formatDate(application.interviewAt)}
                    </p>
                    {application?.interviewMode && (
                      <p className="profile-text" style={{ marginBottom: 4 }}>
                        Mode: {application.interviewMode}
                      </p>
                    )}
                    {application?.interviewLocation && (
                      <p className="profile-text" style={{ marginBottom: 4 }}>
                        Location/Link: {application.interviewLocation}
                      </p>
                    )}
                    {application?.interviewNotes && (
                      <p className="profile-text">Notes: {application.interviewNotes}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="profile-card">
                <h2>CV Details</h2>
                {cv ? (
                  <div className="profile-info-list">
                    <div className="info-item">
                      <span className="info-label">File Name</span>
                      <span className="info-value">{cv.fileName || "CV.pdf"}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Uploaded</span>
                      <span className="info-value">{formatDate(cv.createdAt)}</span>
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <a
                        className="btn-primary"
                        href={cv.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "inline-block", width: "auto", textDecoration: "none" }}
                      >
                        Open CV
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="profile-text">No CV is linked to this application.</p>
                )}
              </div>

              {applicant.experience && (
                <div className="profile-card">
                  <h2>Experience</h2>
                  <p className="profile-text">{applicant.experience}</p>
                </div>
              )}

              {applicant.education && (
                <div className="profile-card">
                  <h2>Education</h2>
                  <p className="profile-text">{applicant.education}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
