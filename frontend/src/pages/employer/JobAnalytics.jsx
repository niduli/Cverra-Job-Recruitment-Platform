import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import "../Dashboard.css";

const JobAnalytics = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch job details and analytics in parallel
        const [jobResponse, analyticsResponse] = await Promise.all([
          api.get(`/jobs/${jobId}`),
          api.get(`/employer/job/${jobId}/analytics`),
        ]);

        setJob(jobResponse.data.data);
        setAnalytics(analyticsResponse.data.data);
      } catch (err) {
        setError(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Failed to load job analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      loadAnalytics();
    }
  }, [jobId]);

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <div className="dashboard-container">
          <div className="loading-message">Loading analytics...</div>
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
            ← Back
          </button>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Navbar />

      <div className="dashboard-container">
        <div className="analytics-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back to Dashboard
          </button>
          <div className="analytics-title">
            <h1>Job Analytics</h1>
            {job && <p className="job-title-subtitle">{job.title}</p>}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="stats-grid-modern">
          <div className="stat-card-modern">
            <div className="stat-card-header">
              <div className="stat-icon-modern">📨</div>
              <div className="stat-badge">Total</div>
            </div>
            <div className="stat-card-body">
              <p className="stat-label">Total Applications</p>
              <h3 className="stat-number">{analytics?.totalApplications || 0}</h3>
            </div>
          </div>

          <div className="stat-card-modern">
            <div className="stat-card-header">
              <div className="stat-icon-modern">⭐</div>
              <div className="stat-badge">Score</div>
            </div>
            <div className="stat-card-body">
              <p className="stat-label">Highest Rank</p>
              <h3 className="stat-number">
                {analytics?.highestRank?.toFixed(2) || "0.00"}
              </h3>
            </div>
          </div>

          <div className="stat-card-modern">
            <div className="stat-card-header">
              <div className="stat-icon-modern">📊</div>
              <div className="stat-badge">Average</div>
            </div>
            <div className="stat-card-body">
              <p className="stat-label">Average Rank</p>
              <h3 className="stat-number">
                {analytics?.averageRank?.toFixed(2) || "0.00"}
              </h3>
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        {analytics?.statusBreakdown && (
          <div className="analytics-section">
            <h2>Application Status Breakdown</h2>
            <div className="status-breakdown-grid">
              <div className="breakdown-card">
                <div className="breakdown-icon applied">📋</div>
                <div className="breakdown-content">
                  <p className="breakdown-label">Applied</p>
                  <p className="breakdown-value">
                    {analytics.statusBreakdown.applied || 0}
                  </p>
                </div>
              </div>

              <div className="breakdown-card">
                <div className="breakdown-icon reviewed">👁️</div>
                <div className="breakdown-content">
                  <p className="breakdown-label">Reviewed</p>
                  <p className="breakdown-value">
                    {analytics.statusBreakdown.reviewed || 0}
                  </p>
                </div>
              </div>

              <div className="breakdown-card">
                <div className="breakdown-icon accepted">✓</div>
                <div className="breakdown-content">
                  <p className="breakdown-label">Accepted</p>
                  <p className="breakdown-value">
                    {analytics.statusBreakdown.accepted || 0}
                  </p>
                </div>
              </div>

              <div className="breakdown-card">
                <div className="breakdown-icon rejected">✕</div>
                <div className="breakdown-content">
                  <p className="breakdown-label">Rejected</p>
                  <p className="breakdown-value">
                    {analytics.statusBreakdown.rejected || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Job Information */}
        {job && (
          <div className="analytics-section">
            <h2>Job Information</h2>
            <div className="job-info-grid">
              <div className="info-card">
                <span className="info-label">Position</span>
                <span className="info-value">{job.title}</span>
              </div>
              <div className="info-card">
                <span className="info-label">Location</span>
                <span className="info-value">{job.location || "Not specified"}</span>
              </div>
              <div className="info-card">
                <span className="info-label">Experience Level</span>
                <span className="info-value">{job.experienceLevel || "Not specified"}</span>
              </div>
              <div className="info-card">
                <span className="info-label">Employment Type</span>
                <span className="info-value">{job.jobType || "Not specified"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="analytics-actions">
          <button
            className="btn-secondary"
            onClick={() => navigate(`/employer/jobs/${jobId}/applications`)}
          >
            View All Applications
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate(-1)}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <style>{`
        .analytics-header {
          margin-bottom: 32px;
        }

        .analytics-title h1 {
          font-size: 32px;
          color: var(--color-text);
          margin: 16px 0 8px 0;
        }

        .job-title-subtitle {
          color: var(--color-text-secondary);
          font-size: 14px;
        }

        .analytics-section {
          margin-top: 32px;
        }

        .analytics-section h2 {
          font-size: 20px;
          color: var(--color-text);
          margin-bottom: 20px;
        }

        .status-breakdown-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 16px;
        }

        .breakdown-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .breakdown-icon {
          font-size: 32px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: rgba(59, 130, 246, 0.1);
        }

        .breakdown-icon.applied {
          background: rgba(59, 130, 246, 0.1);
        }

        .breakdown-icon.reviewed {
          background: rgba(168, 85, 247, 0.1);
        }

        .breakdown-icon.accepted {
          background: rgba(16, 185, 129, 0.1);
        }

        .breakdown-icon.rejected {
          background: rgba(239, 68, 68, 0.1);
        }

        .breakdown-content {
          flex: 1;
        }

        .breakdown-label {
          font-size: 12px;
          color: var(--color-text-secondary);
          margin: 0;
        }

        .breakdown-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--color-text);
          margin: 4px 0 0 0;
        }

        .job-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .info-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .info-label {
          font-size: 12px;
          color: var(--color-text-secondary);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 14px;
          color: var(--color-text);
          font-weight: 600;
        }

        .analytics-actions {
          display: flex;
          gap: 12px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--color-border);
        }

        @media (max-width: 768px) {
          .analytics-title h1 {
            font-size: 24px;
          }

          .status-breakdown-grid,
          .job-info-grid {
            grid-template-columns: 1fr;
          }

          .analytics-actions {
            flex-direction: column;
          }

          .btn-secondary {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default JobAnalytics;
