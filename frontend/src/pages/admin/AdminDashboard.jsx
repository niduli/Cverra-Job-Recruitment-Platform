import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import "../Dashboard.css";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvingUserId, setApprovingUserId] = useState("");

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const [analyticsResponse, usersResponse, jobsResponse] = await Promise.all([
        api.get("/admin/analytics"),
        api.get("/admin/users"),
        api.get("/admin/jobs"),
      ]);

      setAnalytics(analyticsResponse.data?.analytics || null);
      setUsers(usersResponse.data?.data || []);
      setJobs(jobsResponse.data?.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to load admin data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const formatCreatedDate = (createdAt) => {
    if (!createdAt) return "-";
    if (createdAt?.seconds) {
      return new Date(createdAt.seconds * 1000).toLocaleDateString();
    }
    const date = new Date(createdAt);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
  };

  const recentUsers = useMemo(() => {
    return [...users]
      .sort((a, b) => {
        const aTime = a?.createdAt?.seconds
          ? a.createdAt.seconds
          : new Date(a.createdAt || 0).getTime() / 1000;
        const bTime = b?.createdAt?.seconds
          ? b.createdAt.seconds
          : new Date(b.createdAt || 0).getTime() / 1000;
        return bTime - aTime;
      })
      .slice(0, 10);
  }, [users]);

  const recentJobs = useMemo(() => {
    return [...jobs]
      .sort((a, b) => {
        const aTime = a?.createdAt?.seconds
          ? a.createdAt.seconds
          : new Date(a.createdAt || 0).getTime() / 1000;
        const bTime = b?.createdAt?.seconds
          ? b.createdAt.seconds
          : new Date(b.createdAt || 0).getTime() / 1000;
        return bTime - aTime;
      })
      .slice(0, 10);
  }, [jobs]);

  const handleApproveEmployer = async (userId) => {
    try {
      setApprovingUserId(userId);
      await api.patch(`/admin/approve/${userId}`);
      await fetchAdminData();
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to approve employer."
      );
    } finally {
      setApprovingUserId("");
    }
  };

  const systemStats = [
    { icon: "👥", label: "Total Users", value: analytics?.totalUsers ?? 0 },
    { icon: "🏢", label: "Employers", value: analytics?.totalEmployers ?? 0 },
    { icon: "💼", label: "Job Postings", value: analytics?.totalJobs ?? 0 },
    { icon: "📊", label: "Applications", value: analytics?.totalApplications ?? 0 },
  ];

  return (
    <div className="dashboard-layout">
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>System overview and management</p>
          </div>
        </div>

        <div className="dashboard-grid">
          {loading && <p>Loading admin data...</p>}
          {error && !loading && <p>{error}</p>}

          {/* System Stats */}
          <div className="stats-grid">
            {systemStats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-content">
                  <h3>{stat.label}</h3>
                  <p className="stat-value">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-content">
            {/* Recent Users */}
            <section className="section">
              <div className="section-header">
                <h2>Recent Users</h2>
                <span className="view-all">Total: {users.length}</span>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="user-name">{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className="role-badge">{user.role}</span>
                        </td>
                        <td>{formatCreatedDate(user.createdAt)}</td>
                        <td>
                          <span
                            className={`status-badge status-${
                              user.role === "employer" && !user.approved
                                ? "pending"
                                : "active"
                            }`}
                          >
                            {user.role === "employer" && !user.approved
                              ? "Pending"
                              : "Active"}
                          </span>
                        </td>
                        <td>
                          {user.role === "employer" && !user.approved ? (
                            <button
                              className="action-btn"
                              onClick={() => handleApproveEmployer(user.id)}
                              disabled={approvingUserId === user.id}
                            >
                              {approvingUserId === user.id ? "Approving..." : "Approve"}
                            </button>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Recent Jobs */}
            <section className="section">
              <div className="section-header">
                <h2>Recent Jobs</h2>
                <span className="view-all">Total: {jobs.length}</span>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Location</th>
                      <th>Job Type</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentJobs.map((job) => (
                      <tr key={job.id}>
                        <td className="user-name">{job.title}</td>
                        <td>{job.location || "-"}</td>
                        <td>{job.jobType || "-"}</td>
                        <td>
                          <span className={`status-badge status-${job.status || "active"}`}>
                            {job.status || "active"}
                          </span>
                        </td>
                        <td>{formatCreatedDate(job.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;