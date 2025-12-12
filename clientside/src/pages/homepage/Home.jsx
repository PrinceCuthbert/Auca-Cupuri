import React from "react";
import "../../css/homepage/header.css";
import "../../css/footer.css";
import "../../css/homepage/welcomeBanner.css";
import "../../css/homepage/aboutSection.css";

import { Link } from "react-router-dom";
import {
  GraduationCap,
  Search,
  BookOpenText,
  School,
  ListChecks,
  ArrowRight,
  Home as HomeIcon,
  User,
  Upload,
  LogOut,
} from "lucide-react";

import Footer from "../footer";
import Header from "../../pages/header/header.jsx";
// import { useAuth } from "../../context/AuthContext";

// Home component now expects props
function Home() {
  // const { isAuthenticated, user, logout } = useAuth();
  return (
    <>
      {/* <Header /> */}
      <WelcomeBanner />
      <AboutSection />
      <Footer />
    </>
  );
}

function WelcomeBanner() {
  return (
    <div className="welcome-banner">
      <div className="banner-icon">
        <GraduationCap className="icon" />
      </div>
      <h1 className="banner-title">
        Welcome to <span className="highlight">AUCA CUPURI</span>
      </h1>
      <p className="banner-subtext">
        Your comprehensive portal for accessing past examination papers across
        all faculties. Study smarter with our organized collection of academic
        resources.
      </p>
      <div className="banner-buttons">
        <Link to="/cupuriportal/signup" className="btn-yellow">
          Get Started <ArrowRight size={16} />
        </Link>
        <Link to="/cupuriportal/login" className="btn-outline">
          Login
        </Link>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <section className="about-section">
      <div className="about-left">
        <div className="about-header">
          <BookOpenText className="icon" />
          <h2>
            About <span className="highlight">AUCA CUPURI</span>
          </h2>
        </div>
        <p>
          <strong>AUCA CUPURI</strong>
          (AUCA Comprehensive University Past Resources Initiative) is a
          dedicated digital platform designed to enhance academic excellence at
          Adventist University of Central Africa.
        </p>
        <p>
          Our portal serves as a centralized repository for past examination
          papers across all faculties, providing students with easy access to
          valuable study materials that can significantly improve their academic
          performance and exam preparation strategies.
        </p>

        <div className="mission-box">
          <strong>Our Mission</strong>
          <br />
          To democratize access to academic resources, foster collaborative
          learning, and empower students with the tools they need to excel in
          their studies through organized, easily accessible past examination
          materials.
        </div>

        <div className="about-highlights">
          <div className="highlight-box">
            <School size={40} className="school-icon" />
            <span>
              <strong>Organized by Faculty</strong>
              <br />
              Browse exams by Software Engineering, Information Management, and
              Networking & Telecommunications
            </span>
          </div>
          <div className="highlight-box">
            <ListChecks size={40} className="check-list-icon" />
            <span>
              <strong>Comprehensive Coverage</strong>
              <br />
              Access both Mid Term and Final exams from various academic years
            </span>
          </div>
        </div>
      </div>

      <div className="about-right">
        <img
          src="https://images.pexels.com/photos/5212351/pexels-photo-5212351.jpeg?auto=compress&cs=tinysrgb&h=300"
          alt="Student Success"
        />
        <p className="caption">Empowering Student Success</p>
        <small>
          Join thousands of students who have improved their academic
          performance using our platform
        </small>
      </div>
    </section>
  );
}

export default Home;
