import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">
      <div className="home-gradient-orb home-gradient-orb-one" />
      <div className="home-gradient-orb home-gradient-orb-two" />

      <header className="home-header">
        <div className="home-brand">
          <div className="home-brand-logo">C</div>
          <div>
            <h1>Cverra</h1>
            <p>Click | Connect | Conquer</p>
          </div>
        </div>

        <nav className="home-nav">
          <Link to="/login" className="home-nav-link">
            Sign In
          </Link>
          <Link to="/register" className="home-nav-button">
            Get Started
          </Link>
        </nav>
      </header>

      <main className="home-main">
        <section className="home-hero">
          <p className="home-kicker">Recruitment Platform</p>
          <h2>Find the right talent and opportunities, faster.</h2>
          <p className="home-subtitle">
            Cverra brings job seekers, employers, and admins into one clean workflow built for speed and quality hiring.
          </p>

          <div className="home-hero-actions">
            <Link to="/register" className="home-primary-cta">
              Create Account
            </Link>
            <Link to="/login" className="home-secondary-cta">
              Continue to Login
            </Link>
          </div>
        </section>

        <section className="home-feature-grid">
          <article className="home-feature-card">
            <span className="home-feature-icon">01</span>
            <h3>Role-Based Dashboards</h3>
            <p>Dedicated experiences for job seekers, employers, and administrators.</p>
          </article>

          <article className="home-feature-card">
            <span className="home-feature-icon">02</span>
            <h3>Faster Hiring Cycle</h3>
            <p>Post jobs, manage applications, and track status updates in one place.</p>
          </article>

          <article className="home-feature-card">
            <span className="home-feature-icon">03</span>
            <h3>Actionable Insights</h3>
            <p>Modern dashboards and metrics keep teams focused on what matters most.</p>
          </article>
        </section>
      </main>
    </div>
  );
};

export default Home;
