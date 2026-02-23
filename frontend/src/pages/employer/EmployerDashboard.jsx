import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../Dashboard.css";

const EmployerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobPostings, setJobPostings] = useState([]);

  // Load jobs from localStorage on component mount
  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem("jobPostings")) || [];
    
    const defaultJobs = [
      {
        id: 1,
        title: "Senior React Developer",
        views: 245,
        applications: 18,
        posted: "2 weeks ago",
        status: "Active",
      },
      {
        id: 2,
        title: "Full Stack Developer",
        views: 156,
        applications: 12,
        posted: "3 weeks ago",
        status: "Active",
      },
      {
        id: 3,
        title: "UI/UX Designer",
        views: 89,
        applications: 5,
        posted: "1 month ago",
        status: "Closed",
      },
    ];

    // Combine saved and default jobs
    setJobPostings([...savedJobs, ...defaultJobs]);
  }, []);

  const recentApplications = [
    {
      id: 1,
      candidate: "John Doe",
      position: "Senior React Developer",
      applied: "Today",
      status: "New",
    },
    {
      id: 2,
      candidate: "Jane Smith",
      position: "Full Stack Developer",
      applied: "Yesterday",
      status: "Reviewed",
    },
    {
      id: 3,
      candidate: "Mike Johnson",
      position: "Senior React Developer",
      applied: "2 days ago",
      status: "Shortlisted",
    },
  ];

  // Calculate stats from jobPostings
  const activePostings = jobPostings.filter(job => job.status === "Active").length || 8;
  const totalApplications = jobPostings.reduce((sum, job) => sum + job.applications, 0) || 47;
  const totalViews = jobPostings.reduce((sum, job) => sum + job.views, 0) || 1200;

  return (
    <div className="dashboard-layout">
      <Navbar />

      <div className="dashboard-container">
        {/* Hero Section */}
        <div className="dashboard-hero">
          <div className="hero-content">
            <div>
              <p className="hero-greeting">Welcome back! </p>
              <h1>Recruitment Dashboard</h1>
              <p className="hero-subtitle">Manage job postings, track applications, and grow your team</p>
            </div>
            <button className="btn-post-job" onClick={() => navigate("/post-job")}>
              <span>+</span> Post New Job
            </button>
          </div>
          <div className="hero-decoration"></div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid-modern">
          <div className="stat-card-modern">
            <div className="stat-card-header">
              <div className="stat-icon-modern">📋</div>
              <div className="stat-badge active">+2 today</div>
            </div>
            <div className="stat-card-body">
              <p className="stat-label">Active Postings</p>
              <h3 className="stat-number">{activePostings}</h3>
              <div className="stat-chart"></div>
            </div>
          </div>

          <div className="stat-card-modern">
            <div className="stat-card-header">
              <div className="stat-icon-modern">📨</div>
              <div className="stat-badge">+5 new</div>
            </div>
            <div className="stat-card-body">
              <p className="stat-label">Applications</p>
              <h3 className="stat-number">{totalApplications}</h3>
              <div className="stat-chart"></div>
            </div>
          </div>

          <div className="stat-card-modern">
            <div className="stat-card-header">
              <div className="stat-icon-modern">👁️</div>
              <div className="stat-badge">+12%</div>
            </div>
            <div className="stat-card-body">
              <p className="stat-label">Profile Views</p>
              <h3 className="stat-number">{Math.round(totalViews / 100) * 100}</h3>
              <div className="stat-chart"></div>
            </div>
          </div>

          <div className="stat-card-modern">
            <div className="stat-card-header">
              <div className="stat-icon-modern">⭐</div>
              <div className="stat-badge excellent">Excellent</div>
            </div>
            <div className="stat-card-body">
              <p className="stat-label">Employer Rating</p>
              <h3 className="stat-number">4.8/5</h3>
              <div className="stat-chart"></div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-content-grid">
          {/* Job Postings Section */}
          <section className="content-section">
            <div className="section-header-modern">
              <div>
                <h2>Active Job Postings</h2>
                <p>Manage and track your open positions</p>
              </div>
              <button className="btn-view-all">View All ({jobPostings.length})</button>
            </div>

            <div className="job-postings-container">
              {jobPostings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No job postings yet</h3>
                  <p>Create your first job posting to start attracting candidates</p>
                  <button className="btn-create" onClick={() => navigate("/post-job")}>Create First Job</button>
                </div>
              ) : (
                jobPostings.slice(0, 6).map((job) => (
                  <div key={job.id} className="job-card-modern">
                    <div className="job-card-top">
                      <div className="job-title-info">
                        <h3 className="job-title-modern">{job.title}</h3>
                        <span className={`job-status status-${job.status.toLowerCase()}`}>
                          {job.status}
                        </span>
                      </div>
                      <span className="job-date-posted">{job.posted}</span>
                    </div>

                    <div className="job-metrics">
                      <div className="metric-item">
                        <span className="metric-icon">👁️</span>
                        <div className="metric-info">
                          <p className="metric-label">Views</p>
                          <p className="metric-value">{job.views}</p>
                        </div>
                      </div>
                      <div className="metric-item">
                        <span className="metric-icon">📨</span>
                        <div className="metric-info">
                          <p className="metric-label">Applications</p>
                          <p className="metric-value">{job.applications}</p>
                        </div>
                      </div>
                    </div>

                    <div className="job-card-actions">
                      <button className="btn-secondary">Edit Job</button>
                      <button className="btn-secondary">View Applications</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Recent Applications Section */}
          <section className="content-section">
            <div className="section-header-modern">
              <div>
                <h2>Recent Applications</h2>
                <p>Latest candidates applying to your jobs</p>
              </div>
              <button className="btn-view-all">View All</button>
            </div>

            <div className="applications-container">
              {recentApplications.map((app) => (
                <div key={app.id} className="application-card-modern">
                  <div className="app-avatar">👤</div>
                  <div className="app-details">
                    <h4 className="app-name">{app.candidate}</h4>
                    <p className="app-position">{app.position}</p>
                    <p className="app-date">Applied {app.applied}</p>
                  </div>
                  <div className={`app-status-badge status-${app.status.toLowerCase()}`}>
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