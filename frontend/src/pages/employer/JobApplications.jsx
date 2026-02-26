import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import "../Dashboard.css";

const JobApplications = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageTitle = useMemo(() => {
    const first = applications[0];
    return first?.jobTitle || "Job Applications";
  }, [applications]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/applications/job/${jobId}`);
      const data = response.data?.data || [];

      const mapped = data.map((app) => ({
        id: app.id,
        applicantId: app.applicantId || app.profile?.id || "",
        cvId: app.cvId || "",
        applicantName: app.profile?.name || app.applicantName || "Candidate",
        applicantEmail: app.profile?.email || "N/A",
        status: app.status || "applied",
        rankScore: Number(app.rankScore || 0),
        createdAt: app.createdAt,
      }));

      setApplications(mapped);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to load applications for this job."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchApplications();
    }
  }, [jobId]);

  const formatDate = (createdAt) => {
    if (!createdAt) return "Recently";
    if (createdAt?.seconds) {
      return new Date(createdAt.seconds * 1000).toLocaleDateString();
    }
    const date = new Date(createdAt);
    return Number.isNaN(date.getTime()) ? "Recently" : date.toLocaleDateString();
  };

  return (
    <div className="dashboard-layout">
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>{pageTitle}</h1>
            <p>Review and manage candidate applications</p>
          </div>
          <button className="btn-view-all" onClick={() => navigate("/employer/dashboard")}>Back to Dashboard</button>
        </div>

        <section className="section">
          <div className="section-header">
            <h2>Applications</h2>
            <span className="view-all">Total: {applications.length}</span>
          </div>

          {loading && <p>Loading applications...</p>}
          {error && !loading && <p>{error}</p>}
          {!loading && !error && applications.length === 0 && (
            <p>No applications available for this job yet.</p>
          )}

          {!loading && !error && applications.length > 0 && (
            <div className="applications-list">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="application-card"
                  onClick={() =>
                    navigate(`/employer/applications/${app.id}`, {
                      state: {
                        application: {
                          ...app,
                          jobId,
                          jobTitle: pageTitle,
                        },
                      },
                    })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <div className="app-info">
                    <h3>{app.applicantName}</h3>
                    <p className="company">{app.applicantEmail}</p>
                    <p className="date">Applied: {formatDate(app.createdAt)}</p>
                    <p className="date">Rank Score: {app.rankScore.toFixed(2)}</p>
                  </div>

                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span className={`app-status status-${app.status}`}>{app.status}</span>
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

export default JobApplications;
