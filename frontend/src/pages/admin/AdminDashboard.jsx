import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import "../Dashboard.css";

const AdminDashboard = () => {
  const { user } = useAuth();

  const systemStats = [
    { icon: "👥", label: "Total Users", value: "1,245", change: "+12%" },
    { icon: "🏢", label: "Employers", value: "324", change: "+5%" },
    { icon: "💼", label: "Job Postings", value: "856", change: "+23%" },
    { icon: "📊", label: "Applications", value: "5,234", change: "+18%" },
  ];

  const recentUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Job Seeker",
      joined: "2 hours ago",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Employer",
      joined: "5 hours ago",
      status: "Active",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "Job Seeker",
      joined: "1 day ago",
      status: "Pending",
    },
  ];

  const reports = [
    {
      id: 1,
      title: "Suspicious Activity Reported",
      description: "User account with multiple flagged applications",
      priority: "High",
      reported: "Today",
    },
    {
      id: 2,
      title: "Job Posting Violation",
      description: "Inappropriate content in job description",
      priority: "Medium",
      reported: "Yesterday",
    },
    {
      id: 3,
      title: "User Complaint",
      description: "Harassment report from a job seeker",
      priority: "High",
      reported: "2 days ago",
    },
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
          {/* System Stats */}
          <div className="stats-grid">
            {systemStats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-content">
                  <h3>{stat.label}</h3>
                  <p className="stat-value">{stat.value}</p>
                  <span className="stat-change">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-content">
            {/* Recent Users */}
            <section className="section">
              <div className="section-header">
                <h2>Recent Users</h2>
                <a href="#" className="view-all">
                  View All →
                </a>
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
                        <td>{user.joined}</td>
                        <td>
                          <span
                            className={`status-badge status-${user.status.toLowerCase()}`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Reports */}
            <section className="section">
              <div className="section-header">
                <h2>Flagged Reports</h2>
                <a href="#" className="view-all">
                  View All →
                </a>
              </div>
              <div className="reports-list">
                {reports.map((report) => (
                  <div key={report.id} className="report-card">
                    <div className="report-header">
                      <div>
                        <h3>{report.title}</h3>
                        <p>{report.description}</p>
                      </div>
                      <span
                        className={`priority-badge priority-${report.priority.toLowerCase()}`}
                      >
                        {report.priority}
                      </span>
                    </div>
                    <div className="report-footer">
                      <p className="report-date">{report.reported}</p>
                      <button className="secondary-btn">Investigate</button>
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

export default AdminDashboard;