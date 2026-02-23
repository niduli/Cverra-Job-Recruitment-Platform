import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./PostJob.css";

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    jobType: "Full-time",
    experience: "0-2 years",
    skills: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Job description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.salary.trim()) {
      newErrors.salary = "Salary range is required";
    }

    if (!formData.skills.trim()) {
      newErrors.skills = "Required skills are required";
    }

    return newErrors;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create job object with timestamp
      const newJob = {
        id: Date.now(),
        ...formData,
        views: 0,
        applications: 0,
        posted: "Just now",
        status: "Active",
      };

      // Get existing jobs from localStorage
      const existingJobs = JSON.parse(localStorage.getItem("jobPostings")) || [];
      
      // Add new job
      const updatedJobs = [newJob, ...existingJobs];
      
      // Save to localStorage
      localStorage.setItem("jobPostings", JSON.stringify(updatedJobs));

      console.log("Job posted:", newJob);

      // Redirect back to employer dashboard
      navigate("/employer/dashboard");
    } catch (error) {
      setErrors({ submit: "Failed to post job. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Navbar />

      <div className="post-job-container">
        <div className="post-job-header">
          <button className="back-btn" onClick={() => navigate("/employer/dashboard")}>
            ← Back to Dashboard
          </button>
          <div className="header-content">
            <h1>Post a New Job</h1>
            <p>Create an engaging job listing to attract top talent. Fill in all required fields below.</p>
          </div>
        </div>

        <div className="post-job-card">
          {errors.submit && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="job-form">
            {/* Basic Information Section */}
            <div className="form-section">
              <div className="section-header">
                <h2>Basic Information</h2>
                <p>Job title and overview</p>
              </div>

              <div className="form-row">
                <div className="form-group full">
                  <label htmlFor="title">Job Title <span className="required">*</span></label>
                  <div className="form-input-wrapper">
                    <span className="input-icon">📌</span>
                    <input
                      id="title"
                      type="text"
                      name="title"
                      placeholder="e.g., Senior React Developer"
                      value={formData.title}
                      onChange={handleChange}
                      className={`form-input ${errors.title ? "error" : ""}`}
                    />
                  </div>
                  {errors.title && <span className="error-text">{errors.title}</span>}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="form-section">
              <div className="section-header">
                <h2>Job Details</h2>
                <p>Location, salary, and employment type</p>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Location <span className="required">*</span></label>
                  <div className="form-input-wrapper">
                    <span className="input-icon">📍</span>
                    <input
                      id="location"
                      type="text"
                      name="location"
                      placeholder="e.g., San Francisco, CA"
                      value={formData.location}
                      onChange={handleChange}
                      className={`form-input ${errors.location ? "error" : ""}`}
                    />
                  </div>
                  {errors.location && <span className="error-text">{errors.location}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="salary">Salary Range <span className="required">*</span></label>
                  <div className="form-input-wrapper">
                    <span className="input-icon">💰</span>
                    <input
                      id="salary"
                      type="text"
                      name="salary"
                      placeholder="e.g., $100k - $150k"
                      value={formData.salary}
                      onChange={handleChange}
                      className={`form-input ${errors.salary ? "error" : ""}`}
                    />
                  </div>
                  {errors.salary && <span className="error-text">{errors.salary}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="jobType">Job Type <span className="required">*</span></label>
                  <div className="form-input-wrapper">
                    <span className="input-icon">⏰</span>
                    <select
                      id="jobType"
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Temporary">Temporary</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="experience">Experience Level <span className="required">*</span></label>
                  <div className="form-input-wrapper">
                    <span className="input-icon">🎯</span>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="0-2 years">0-2 years</option>
                      <option value="2-5 years">2-5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Description Section */}
            <div className="form-section">
              <div className="section-header">
                <h2>Description & Requirements</h2>
                <p>Role details and required skills</p>
              </div>

              <div className="form-row">
                <div className="form-group full">
                  <label htmlFor="description">Job Description <span className="required">*</span></label>
                  <div className="form-input-wrapper textarea-wrapper">
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Describe the job role, responsibilities, and requirements..."
                      value={formData.description}
                      onChange={handleChange}
                      className={`form-input textarea ${errors.description ? "error" : ""}`}
                      rows="6"
                    />
                  </div>
                  <div className="field-hint">{formData.description.length} characters</div>
                  {errors.description && (
                    <span className="error-text">{errors.description}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full">
                  <label htmlFor="skills">Required Skills <span className="required">*</span></label>
                  <div className="form-input-wrapper textarea-wrapper">
                    <textarea
                      id="skills"
                      name="skills"
                      placeholder="List required skills separated by commas (e.g., React, Node.js, MongoDB)"
                      value={formData.skills}
                      onChange={handleChange}
                      className={`form-input textarea ${errors.skills ? "error" : ""}`}
                      rows="3"
                    />
                  </div>
                  {errors.skills && <span className="error-text">{errors.skills}</span>}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/employer/dashboard")}
              >
                <span>Cancel</span>
              </button>
              <button type="submit" className="submit-btn" disabled={loading}>
                <span>{loading ? "🔄 Posting..." : "✓ Post Job"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
