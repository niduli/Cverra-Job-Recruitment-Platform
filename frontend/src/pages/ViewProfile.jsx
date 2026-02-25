import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const ViewProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        let response;
        if (isOwnProfile) {
          // Load own profile
          response = await api.get("/profile/me");
        } else {
          // Load public profile
          response = await api.get(`/profile/${userId}`);
        }

        setProfile(response.data.data);
      } catch (err) {
        setError(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId, isOwnProfile]);

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <div className="dashboard-container">
          <div className="loading-message">Loading profile...</div>
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
        <div className="profile-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          {isOwnProfile && (
            <button
              className="btn-primary"
              onClick={() => navigate("/profile/edit")}
              style={{ width: "auto", marginLeft: "auto" }}
            >
              Edit Profile
            </button>
          )}
        </div>

        {profile && (
          <div className="profile-container">
            {/* Header Section */}
            <div className="profile-card profile-header-card">
              <div className="profile-avatar-large">👤</div>
              <div className="profile-header-info">
                <h1>{profile.name || "No name"}</h1>
                <p className="profile-role">
                  {profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "User"}
                </p>
                {profile.bio && <p className="profile-bio">{profile.bio}</p>}
              </div>
            </div>

            <div className="profile-grid">
              {/* Left Column */}
              <div className="profile-left">
                {/* Contact Information */}
                <div className="profile-card">
                  <h2>Contact Information</h2>
                  <div className="profile-info-list">
                    <div className="info-item">
                      <span className="info-label">Email</span>
                      <span className="info-value">{profile.email || "-"}</span>
                    </div>
                    {profile.phone && (
                      <div className="info-item">
                        <span className="info-label">Phone</span>
                        <span className="info-value">{profile.phone}</span>
                      </div>
                    )}
                    {profile.location && (
                      <div className="info-item">
                        <span className="info-label">Location</span>
                        <span className="info-value">{profile.location}</span>
                      </div>
                    )}
                    {profile.linkedin && (
                      <div className="info-item">
                        <span className="info-label">LinkedIn</span>
                        <a
                          href={profile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="info-value link"
                        >
                          View Profile
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills */}
                {profile.skills && profile.skills.length > 0 && (
                  <div className="profile-card">
                    <h2>Skills</h2>
                    <div className="skills-container">
                      {Array.isArray(profile.skills) ? (
                        profile.skills.map((skill, index) => (
                          <div key={index} className="skill-tag">
                            {skill}
                          </div>
                        ))
                      ) : (
                        <p>{profile.skills}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="profile-right">
                {/* Education */}
                {profile.education && (
                  <div className="profile-card">
                    <h2>Education</h2>
                    <p className="profile-text">{profile.education}</p>
                  </div>
                )}

                {/* Experience */}
                {profile.experience && (
                  <div className="profile-card">
                    <h2>Experience</h2>
                    <p className="profile-text">{profile.experience}</p>
                  </div>
                )}

                {/* Profile Status */}
                <div className="profile-card">
                  <h2>Profile Details</h2>
                  <div className="profile-info-list">
                    <div className="info-item">
                      <span className="info-label">Profile Visibility</span>
                      <span className="info-value">
                        {profile.profileVisibility === "private" ? "🔒 Private" : "🌐 Public"}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Member Since</span>
                      <span className="info-value">
                        {profile.createdAt?.seconds
                          ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString()
                          : profile.createdAt
                          ? new Date(profile.createdAt).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>
                    {profile.updatedAt && (
                      <div className="info-item">
                        <span className="info-label">Last Updated</span>
                        <span className="info-value">
                          {profile.updatedAt?.seconds
                            ? new Date(profile.updatedAt.seconds * 1000).toLocaleDateString()
                            : profile.updatedAt
                            ? new Date(profile.updatedAt).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Status */}
                {profile.role === "employer" && (
                  <div className="profile-card">
                    <h2>Account Status</h2>
                    <div className="profile-info-list">
                      <div className="info-item">
                        <span className="info-label">Approval Status</span>
                        <span className={`info-value status-${profile.approved ? "active" : "pending"}`}>
                          {profile.approved ? "✓ Approved" : "⏳ Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProfile;
