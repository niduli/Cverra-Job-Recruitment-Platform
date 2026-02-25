import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    phone: "",
    location: "",
    experience: "",
    education: "",
    linkedin: "",
    skills: "",
    profileVisibility: "public",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get("/profile/me");
        const profile = response.data.data;

        setFormData({
          name: profile.name || "",
          bio: profile.bio || "",
          phone: profile.phone || "",
          location: profile.location || "",
          experience: profile.experience || "",
          education: profile.education || "",
          linkedin: profile.linkedin || "",
          skills: Array.isArray(profile.skills)
            ? profile.skills.join(", ")
            : profile.skills || "",
          profileVisibility: profile.profileVisibility || "public",
        });
      } catch (error) {
        setErrors({
          submit: error?.response?.data?.error || "Failed to load profile",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    return newErrors;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validatePasswordForm();
    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      return;
    }

    try {
      setChangingPassword(true);
      setPasswordErrors({});
      setPasswordSuccess("");

      await api.post("/profile/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordErrors({
        submit:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to change password",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSaving(true);
      setErrors({});
      setSuccessMessage("");

      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      await api.patch("/profile/update", {
        name: formData.name,
        bio: formData.bio,
        phone: formData.phone,
        location: formData.location,
        experience: formData.experience,
        education: formData.education,
        linkedin: formData.linkedin,
        skills: skillsArray,
        profileVisibility: formData.profileVisibility,
      });

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      setErrors({
        submit:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div className="dashboard-layout">
      <Navbar />

      <div className="dashboard-container">
        <div className="profile-header">
          <button className="back-btn" onClick={() => navigate("/profile")}>
            ← Back to Profile
          </button>
        </div>

        <div className="profile-container">
          <div className="profile-card edit-profile-card">
            <h1>Edit Profile</h1>
            <p className="profile-subtitle">Update your profile information</p>

            {errors.submit && (
              <div className="error-message">{errors.submit}</div>
            )}

            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}

            <form onSubmit={handleSubmit} className="edit-profile-form">
              {/* Name */}
              <div className="form-group">
                <label htmlFor="name">Full Name <span className="required">*</span></label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? "error" : ""}`}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              {/* Bio */}
              <div className="form-group">
                <label htmlFor="bio">Bio / About You</label>
                <textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself"
                  value={formData.bio}
                  onChange={handleChange}
                  className="form-input textarea"
                  rows="3"
                />
              </div>

              {/* Location & Phone */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    type="text"
                    name="location"
                    placeholder="e.g., San Francisco, CA"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="e.g., +1(555)123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Education & Experience */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="education">Education</label>
                  <textarea
                    id="education"
                    name="education"
                    placeholder="Your educational background"
                    value={formData.education}
                    onChange={handleChange}
                    className="form-input textarea"
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="experience">Experience</label>
                  <textarea
                    id="experience"
                    name="experience"
                    placeholder="Your professional experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="form-input textarea"
                    rows="2"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="form-group">
                <label htmlFor="skills">Skills</label>
                <textarea
                  id="skills"
                  name="skills"
                  placeholder="List your skills separated by commas (e.g., React, Node.js, MongoDB)"
                  value={formData.skills}
                  onChange={handleChange}
                  className="form-input textarea"
                  rows="2"
                />
              </div>

              {/* LinkedIn */}
              <div className="form-group">
                <label htmlFor="linkedin">LinkedIn Profile URL</label>
                <input
                  id="linkedin"
                  type="url"
                  name="linkedin"
                  placeholder="https://linkedin.com/in/your-profile"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              {/* Profile Visibility */}
              <div className="form-group">
                <label htmlFor="profileVisibility">Profile Visibility</label>
                <select
                  id="profileVisibility"
                  name="profileVisibility"
                  value={formData.profileVisibility}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="public">🌐 Public</option>
                  <option value="private">🔒 Private</option>
                </select>
                <small className="field-hint">
                  Public profiles can be viewed by others. Private profiles are only visible to you.
                </small>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate("/profile")}
                >
                  <span>Cancel</span>
                </button>
                <button type="submit" className="submit-btn" disabled={saving}>
                  <span>{saving ? "🔄 Saving..." : "✓ Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Password Change Section */}
          <div className="profile-card edit-profile-card" style={{ marginTop: "24px" }}>
            <h2>Change Password</h2>
            <p className="profile-subtitle">Update your account password</p>

            {passwordErrors.submit && (
              <div className="error-message">{passwordErrors.submit}</div>
            )}

            {passwordSuccess && (
              <div className="success-message">{passwordSuccess}</div>
            )}

            <form onSubmit={handlePasswordSubmit} className="edit-profile-form">
              {/* Current Password */}
              <div className="form-group">
                <label htmlFor="currentPassword">
                  Current Password <span className="required">*</span>
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  name="currentPassword"
                  placeholder="Enter your current password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={`form-input ${passwordErrors.currentPassword ? "error" : ""}`}
                />
                {passwordErrors.currentPassword && (
                  <span className="error-text">{passwordErrors.currentPassword}</span>
                )}
              </div>

              {/* New Password */}
              <div className="form-group">
                <label htmlFor="newPassword">
                  New Password <span className="required">*</span>
                </label>
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  placeholder="Enter your new password (min 6 characters)"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={`form-input ${passwordErrors.newPassword ? "error" : ""}`}
                />
                {passwordErrors.newPassword && (
                  <span className="error-text">{passwordErrors.newPassword}</span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Confirm New Password <span className="required">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter your new password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`form-input ${passwordErrors.confirmPassword ? "error" : ""}`}
                />
                {passwordErrors.confirmPassword && (
                  <span className="error-text">{passwordErrors.confirmPassword}</span>
                )}
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={changingPassword}
                  style={{ maxWidth: "300px" }}
                >
                  <span>{changingPassword ? "🔄 Changing..." : "🔒 Change Password"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .success-message {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid #10b981;
          border-radius: 8px;
          padding: 16px;
          color: #10b981;
          margin-bottom: 16px;
        }

        .profile-subtitle {
          color: var(--color-text-secondary);
          margin-bottom: 24px;
        }

        .edit-profile-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-actions {
          display: flex;
          gap: 16px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid var(--color-border);
        }

        .cancel-btn,
        .submit-btn {
          flex: 1;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .cancel-btn {
          background: var(--color-surface);
          color: var(--color-primary);
          border: 2px solid var(--color-primary);
        }

        .cancel-btn:hover {
          background: var(--color-primary);
          color: white;
        }

        .submit-btn {
          background: linear-gradient(135deg, var(--color-primary), #2563eb);
          color: white;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.2);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .field-hint {
          font-size: 12px;
          color: var(--color-text-secondary);
          margin-top: 6px;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .cancel-btn,
          .submit-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default EditProfile;
