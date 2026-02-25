import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import "../Dashboard.css";

const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentJobs, setRecentJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState("");
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [recommendedError, setRecommendedError] = useState("");
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [applicationsError, setApplicationsError] = useState("");
  const [applyingJobId, setApplyingJobId] = useState("");
  const [applyMessage, setApplyMessage] = useState("");
  const [stats, setStats] = useState({
    totalApplications: 0,
    totalSavedJobs: 0,
    profileViews: 0,
    unreadMessages: 0,
  });
  const [savedJobIds, setSavedJobIds] = useState(new Set());

  const normalizeStatus = (status) => {
    const map = {
      applied: "Applied",
      reviewed: "Under Review",
      accepted: "Accepted",
      rejected: "Rejected",
    };
    return map[status] || status || "Applied";
  };

  const getTimestampSeconds = (value) => {
    if (!value) return 0;
    if (typeof value?.seconds === "number") return value.seconds;
    if (typeof value?._seconds === "number") return value._seconds;
    const parsed = new Date(value).getTime();
    return Number.isNaN(parsed) ? 0 : Math.floor(parsed / 1000);
  };

  const formatAppliedDate = (createdAt) => {
    if (!createdAt) return "Recently";
    let appliedDate = null;

    if (createdAt?.seconds) {
      appliedDate = new Date(createdAt.seconds * 1000);
    } else {
      appliedDate = new Date(createdAt);
    }

    if (Number.isNaN(appliedDate.getTime())) return "Recently";

    const diffMs = Date.now() - appliedDate.getTime();
    const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/jobseeker/dashboard");
      const data = response.data?.data || {};
      setStats({
        totalApplications: data.totalApplications || 0,
        totalSavedJobs: data.totalSavedJobs || 0,
        profileViews: data.profileViews || 0,
        unreadMessages: data.unreadMessages || 0,
      });
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await api.get("/jobseeker/saved-jobs");
      const saved = response.data?.data || [];
      const jobIds = new Set(saved.map((item) => item.jobId));
      setSavedJobIds(jobIds);
    } catch (error) {
      console.error("Failed to load saved jobs:", error);
    }
  };

  const fetchMyApplications = async () => {
    try {
      setLoadingApplications(true);
      setApplicationsError("");
      const response = await api.get("/applications/my");
      const mappedApplications = (response.data?.data || []).map((item) => ({
        id: item.id,
        job: item.job?.title || "Unknown Job",
        company: item.job?.company || "Cverra Employer",
        status: normalizeStatus(item.status),
        appliedDate: formatAppliedDate(item.createdAt),
      }));
      setApplications(mappedApplications);
    } catch (error) {
      setApplicationsError(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to load your applications."
      );
    } finally {
      setLoadingApplications(false);
    }
  };

  const fetchRecommendedJobs = async () => {
    try {
      setLoadingRecommended(true);
      setRecommendedError("");
      const response = await api.get("/jobs/recommended");
      setRecommendedJobs(response.data?.data || []);
    } catch (error) {
      setRecommendedError(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to load recommended jobs."
      );
    } finally {
      setLoadingRecommended(false);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoadingJobs(true);
        const response = await api.get("/jobs");
        const jobs = response.data?.data || [];
        const sortedJobs = [...jobs].sort(
          (a, b) => getTimestampSeconds(b.createdAt) - getTimestampSeconds(a.createdAt)
        );
        setRecentJobs(sortedJobs);
      } catch (error) {
        setJobsError(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            "Failed to load jobs."
        );
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
    fetchRecommendedJobs();
    fetchMyApplications();
    fetchDashboardStats();
    fetchSavedJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyJob = async (jobId) => {
    try {
      setApplyingJobId(jobId);
      setApplyMessage("");

      const cvResponse = await api.get("/cv/my");
      const myCVs = cvResponse.data?.data || [];

      if (!myCVs.length) {
        setApplyMessage("Please upload your CV first before applying.");
        return;
      }

      const latestCV = [...myCVs].sort((a, b) => {
        const aTime = a?.createdAt?.seconds ? a.createdAt.seconds : new Date(a.createdAt || 0).getTime() / 1000;
        const bTime = b?.createdAt?.seconds ? b.createdAt.seconds : new Date(b.createdAt || 0).getTime() / 1000;
        return bTime - aTime;
      })[0];

      await api.post(`/applications/apply/${jobId}`, {
        cvId: latestCV.id,
      });

      setApplyMessage("Application submitted successfully.");
      await fetchMyApplications();
      await fetchDashboardStats();
    } catch (error) {
      setApplyMessage(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to apply for this job."
      );
    } finally {
      setApplyingJobId("");
    }
  };

  const handleToggleSaveJob = async (jobId) => {
    try {
      const isSaved = savedJobIds.has(jobId);
      
      if (isSaved) {
        await api.delete(`/jobseeker/unsave-job/${jobId}`);
        setSavedJobIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
      } else {
        await api.post(`/jobseeker/save-job/${jobId}`);
        setSavedJobIds((prev) => new Set(prev).add(jobId));
      }
      
      await fetchDashboardStats();
    } catch (error) {
      console.error("Failed to toggle save job:", error);
    }
  };

  return (
    <div className="dashboard-layout">
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user?.email || "Job Seeker"}</h1>
            <p>Find your next opportunity</p>
          </div>
          <div className="header-actions">
            <button
              className="btn-secondary"
              onClick={() => document.getElementById("recommended-jobs")?.scrollIntoView({ behavior: "smooth" })}
            >
              Recommended Jobs
            </button>
            <button className="btn-view-all" onClick={() => navigate("/jobseeker/upload-cv")}>Upload CV</button>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <h3>Applications</h3>
                <p className="stat-value">{stats.totalApplications}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <div className="stat-content">
                <h3>Saved Jobs</h3>
                <p className="stat-value">{stats.totalSavedJobs}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👁️</div>
              <div className="stat-content">
                <h3>Profile Views</h3>
                <p className="stat-value">{stats.profileViews}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💬</div>
              <div className="stat-content">
                <h3>Messages</h3>
                <p className="stat-value">{stats.unreadMessages}</p>
              </div>
            </div>
          </div>

          <div className="dashboard-content">
            {/* Recommended Jobs */}
            <section className="section" id="recommended-jobs">
              <div className="section-header">
                <h2>Recommended Jobs</h2>
                <div className="section-actions">
                  <span className="view-all">Total: {recommendedJobs.length}</span>
                  <button className="btn-refresh" onClick={fetchRecommendedJobs}>
                    Refresh
                  </button>
                </div>
              </div>
              <div className="jobs-list">
                {loadingRecommended && <p>Loading recommendations...</p>}
                {recommendedError && !loadingRecommended && <p>{recommendedError}</p>}
                {!loadingRecommended && !recommendedError && recommendedJobs.length === 0 && (
                  <p>No recommendations yet. Upload a CV to improve matching.</p>
                )}
                {!loadingRecommended &&
                  !recommendedError &&
                  recommendedJobs.slice(0, 6).map((job) => (
                    <div 
                      key={job.id} 
                      className="job-card"
                      onClick={() => navigate(`/job/${job.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="job-header">
                        <div>
                          <h3>{job.title}</h3>
                          <p className="company">{job.company || "Cverra Employer"}</p>
                        </div>
                        {typeof job.matchScore === "number" && (
                          <span className="score-badge">{Math.round(job.matchScore * 100)}% match</span>
                        )}
                      </div>
                      <div className="job-details">
                        <span className="detail">📍 {job.location || "N/A"}</span>
                        <span className="detail">💰 {job.salaryRange || "Not specified"}</span>
                        <span className="badge">{job.jobType || "N/A"}</span>
                      </div>
                      <button
                        className="apply-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyJob(job.id);
                        }}
                        disabled={applyingJobId === job.id}
                      >
                        {applyingJobId === job.id ? "Applying..." : "Apply Now"}
                      </button>
                    </div>
                  ))}
              </div>
            </section>

            {/* Recent Jobs */}
            <section className="section">
              <div className="section-header">
                <h2>Latest Job Postings</h2>
                <span className="view-all">Total: {recentJobs.length}</span>
              </div>
              {applyMessage && <p>{applyMessage}</p>}
              <div className="jobs-list">
                {loadingJobs && <p>Loading jobs...</p>}
                {jobsError && !loadingJobs && <p>{jobsError}</p>}
                {!loadingJobs && !jobsError && recentJobs.length === 0 && (
                  <p>No jobs available right now.</p>
                )}
                {!loadingJobs &&
                  !jobsError &&
                  recentJobs.slice(0, 6).map((job) => (
                    <div 
                      key={job.id} 
                      className="job-card"
                      onClick={() => navigate(`/job/${job.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="job-header">
                        <div>
                          <h3>{job.title}</h3>
                          <p className="company">{job.company || "Cverra Employer"}</p>
                        </div>
                        <button 
                          className={`save-btn ${savedJobIds.has(job.id) ? 'saved' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSaveJob(job.id);
                          }}
                          title={savedJobIds.has(job.id) ? "Unsave job" : "Save job"}
                        >
                          {savedJobIds.has(job.id) ? '❤️' : '🤍'}
                        </button>
                      </div>
                      <div className="job-details">
                        <span className="detail">📍 {job.location || "N/A"}</span>
                        <span className="detail">💰 {job.salaryRange || "Not specified"}</span>
                        <span className="badge">{job.jobType || "N/A"}</span>
                      </div>
                      <button
                        className="apply-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyJob(job.id);
                        }}
                        disabled={applyingJobId === job.id}
                      >
                        {applyingJobId === job.id ? "Applying..." : "Apply Now"}
                      </button>
                    </div>
                  ))}
              </div>
            </section>

            {/* Applications */}
            <section className="section">
              <div className="section-header">
                <h2>My Applications</h2>
                <span className="view-all">Total: {applications.length}</span>
              </div>
              <div className="applications-list">
                {loadingApplications && <p>Loading applications...</p>}
                {applicationsError && !loadingApplications && <p>{applicationsError}</p>}
                {!loadingApplications && !applicationsError && applications.length === 0 && (
                  <p>No applications yet.</p>
                )}
                {!loadingApplications &&
                  !applicationsError &&
                  applications.map((app) => (
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
