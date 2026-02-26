import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import "../Dashboard.css";

const EmployerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobPostings, setJobPostings] = useState([]);
  const [jobsError, setJobsError] = useState("");
  const [recentApplications, setRecentApplications] = useState([]);
  const [applicationsError, setApplicationsError] = useState("");
  const [stats, setStats] = useState({
    activePostings: 0,
    totalApplications: 0,
    trends: {
      jobsCreatedToday: 0,
      newApplicationsToday: 0,
    },
    jobStats: {},
  });

  const formatCreatedDate = (createdAt) => {
    if (!createdAt) return "-";
    if (createdAt?.seconds) return new Date(createdAt.seconds * 1000).toLocaleDateString();
    if (createdAt?._seconds) return new Date(createdAt._seconds * 1000).toLocaleDateString();
    return new Date(createdAt).toLocaleDateString();
  };

  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        setJobsError("");
        setApplicationsError("");

        const [jobsResponse, dashboardResponse] = await Promise.all([
          api.get("/jobs/my"),
          api.get("/employer/dashboard"),
        ]);

        const employerJobs = jobsResponse.data?.data || [];
        setJobPostings(employerJobs);

        const dashboardData = dashboardResponse.data?.data || {};
        setStats({
          activePostings: dashboardData.activePostings || 0,
          totalApplications: dashboardData.totalApplications || 0,
          trends: dashboardData.trends || { jobsCreatedToday: 0, newApplicationsToday: 0 },
          jobStats: dashboardData.jobStats || {},
        });

        const recent = dashboardData.recentApplications || [];
        const jobTitleById = employerJobs.reduce((acc, job) => {
          acc[job.id] = job.title;
          return acc;
        }, {});

        const mappedRecentApplications = recent.map((app) => {
          const createdAt = app?.createdAt?.seconds
            ? new Date(app.createdAt.seconds * 1000)
            : app?.createdAt?._seconds
              ? new Date(app.createdAt._seconds * 1000)
              : app?.createdAt
                ? new Date(app.createdAt)
                : null;

          return {
            id: app.id,
            applicantId: app.applicantId,
            candidate: app.applicantName || "Candidate",
            position: jobTitleById[app.jobId] || "Job Position",
            applied:
              createdAt && !Number.isNaN(createdAt.getTime())
                ? createdAt.toLocaleDateString()
                : "Recently",
            status: app.status || "applied",
          };
        });

        setRecentApplications(mappedRecentApplications);
      } catch (error) {
        setJobsError(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            "Failed to load your job postings."
        );
        setApplicationsError("Failed to load recent applications.");
      }
    };

    if (user?.id) fetchEmployerData();
  }, [user?.id]);

  return (
    <div className="dashboard-layout">
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-hero">
          <div className="hero-content">
            <div>
              <p className="hero-greeting">Welcome back!</p>
              <h1>Recruitment Dashboard</h1>
              <p className="hero-subtitle">Manage job postings, track applications, and grow your team</p>
            </div>
            <button className="btn-post-job" onClick={() => navigate("/post-job")}>
              <span>+</span> Post New Job
            </button>
          </div>
          <div className="hero-decoration"></div>
        </div>

        <div className="stats-grid-modern stats-grid-employer">
          <div className="stat-card-modern stat-card-modern-clean">
            <div className="stat-card-header">
              {stats.trends.jobsCreatedToday > 0 && (
                <div className="stat-badge active">+{stats.trends.jobsCreatedToday} today</div>
              )}
            </div>
            <div className="stat-card-body">
              <p className="stat-label">Active Postings</p>
              <h3 className="stat-number">{stats.activePostings}</h3>
              <div className="stat-chart"></div>
            </div>
          </div>

          <div className="stat-card-modern stat-card-modern-clean">
            <div className="stat-card-header">
              {stats.trends.newApplicationsToday > 0 && (
                <div className="stat-badge">+{stats.trends.newApplicationsToday} new</div>
              )}
            </div>
            <div className="stat-card-body">
              <p className="stat-label">Applications</p>
              <h3 className="stat-number">{stats.totalApplications}</h3>
              <div className="stat-chart"></div>
            </div>
          </div>
        </div>

        <div className="dashboard-content-grid">
          <section className="content-section">
            <div className="section-header-modern">
              <div>
                <h2>Active Job Postings</h2>
                <p>Manage and track your open positions</p>
              </div>
              <button className="btn-view-all">View All ({jobPostings.length})</button>
            </div>

            <div className="job-postings-container">
              {jobsError && <p>{jobsError}</p>}
              {jobPostings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">No Jobs</div>
                  <h3>No job postings yet</h3>
                  <p>Create your first job posting to start attracting candidates</p>
                  <button className="btn-create" onClick={() => navigate("/post-job")}>
                    Create First Job
                  </button>
                </div>
              ) : (
                jobPostings.slice(0, 6).map((job) => (
                  <div key={job.id} className="job-card-modern">
                    <div className="job-card-top">
                      <div className="job-title-info">
                        <h3 className="job-title-modern">{job.title}</h3>
                        <span className={`job-status status-${job.status.toLowerCase()}`}>{job.status}</span>
                      </div>
                      <span className="job-date-posted">{formatCreatedDate(job.createdAt)}</span>
                    </div>

                    <div className="job-metrics">
                      <div className="metric-item">
                        <div className="metric-info">
                          <p className="metric-label">Views</p>
                          <p className="metric-value">{stats.jobStats[job.id]?.views || 0}</p>
                        </div>
                      </div>
                      <div className="metric-item">
                        <div className="metric-info">
                          <p className="metric-label">Applications</p>
                          <p className="metric-value">{stats.jobStats[job.id]?.applications || 0}</p>
                        </div>
                      </div>
                    </div>

                    <div className="job-card-actions">
                      <button className="btn-secondary" onClick={() => navigate(`/edit-job/${job.id}`)}>
                        Edit Job
                      </button>
                      <button className="btn-secondary" onClick={() => navigate(`/job/${job.id}/analytics`)}>
                        Analytics
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => navigate(`/employer/jobs/${job.id}/applications`)}
                      >
                        View Applications
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="content-section">
            <div className="section-header-modern">
              <div>
                <h2>Recent Applications</h2>
                <p>Latest candidates applying to your jobs</p>
              </div>
              <button className="btn-view-all">View All</button>
            </div>

            <div className="applications-container">
              {applicationsError && <p>{applicationsError}</p>}
              {!applicationsError && recentApplications.length === 0 && <p>No recent applications yet.</p>}
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="application-card-modern"
                  onClick={() => app.applicantId && navigate(`/profile/${app.applicantId}`)}
                  style={{ cursor: app.applicantId ? "pointer" : "default" }}
                >
                  <div className="app-details">
                    <h4 className="app-name">{app.candidate}</h4>
                    <p className="app-position">{app.position}</p>
                    <p className="app-date">Applied {app.applied}</p>
                  </div>
                  <div className={`app-status-badge status-${app.status.toLowerCase().replace(" ", "")}`}>
                    {app.status}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
