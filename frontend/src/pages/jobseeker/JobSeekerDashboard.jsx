import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import "../Dashboard.css";

const JobSeekerDashboard = () => {
  const { user } = useAuth();

  const recentJobs = [
    {
      id: 1,
      title: "Senior React Developer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      salary: "$120k - $160k",
      type: "Full-time",
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company: "StartUp Inc",
      location: "Remote",
      salary: "$100k - $140k",
      type: "Full-time",
    },
    {
      id: 3,
      title: "Frontend Developer",
      company: "Design Studio",
      location: "New York, NY",
      salary: "$90k - $120k",
      type: "Full-time",
    },
  ];

  const applications = [
    {
      id: 1,
      job: "Senior React Developer",
      company: "Tech Corp",
      status: "Under Review",
      appliedDate: "2 days ago",
    },
    {
      id: 2,
      job: "Full Stack Developer",
      company: "StartUp Inc",
      status: "Rejected",
      appliedDate: "5 days ago",
    },
  ];

  return (
    <div className="dashboard-layout">
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user?.email || "Job Seeker"}</h1>
            <p>Find your next opportunity</p>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <h3>Applications</h3>
                <p className="stat-value">5</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <div className="stat-content">
                <h3>Saved Jobs</h3>
                <p className="stat-value">12</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👁️</div>
              <div className="stat-content">
                <h3>Profile Views</h3>
                <p className="stat-value">28</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💬</div>
              <div className="stat-content">
                <h3>Messages</h3>
                <p className="stat-value">3</p>
              </div>
            </div>
          </div>

          <div className="dashboard-content">
            {/* Recent Jobs */}
            <section className="section">
              <div className="section-header">
                <h2>Latest Job Postings</h2>
                <a href="#" className="view-all">
                  View All →
                </a>
              </div>
              <div className="jobs-list">
                {recentJobs.map((job) => (
                  <div key={job.id} className="job-card">
                    <div className="job-header">
                      <div>
                        <h3>{job.title}</h3>
                        <p className="company">{job.company}</p>
                      </div>
                      <button className="save-btn">❤️</button>
                    </div>
                    <div className="job-details">
                      <span className="detail">📍 {job.location}</span>
                      <span className="detail">💰 {job.salary}</span>
                      <span className="badge">{job.type}</span>
                    </div>
                    <button className="apply-btn">Apply Now</button>
                  </div>
                ))}
              </div>
            </section>

            {/* Applications */}
            <section className="section">
              <div className="section-header">
                <h2>My Applications</h2>
                <a href="#" className="view-all">
                  View All →
                </a>
              </div>
              <div className="applications-list">
                {applications.map((app) => (
                  <div key={app.id} className="application-card">
                    <div className="app-info">
                      <h3>{app.job}</h3>
                      <p className="company">{app.company}</p>
                      <p className="date">{app.appliedDate}</p>
                    </div>
                    <div className={`app-status status-${app.status.replace(" ", "").toLowerCase()}`}>
                      {app.status}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
