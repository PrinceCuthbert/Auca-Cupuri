import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import "../css/footer.css";
import { useAuth } from "../../src/context/AuthContext";

function Footer() {
  const { user, isAuthenticated } = useAuth();

  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-part-one">
        {/* Left Section: Logo & Description */}
        <div className="left-part">
          <div className="logo-group">
            <div className="logo-icon">
              <GraduationCap className="icon-white" />
            </div>
            <div className="logo-texts">
              <h3 className="logo-title">AUCA CUPURI</h3>
              <p className="logo-subtitle-footer">Past Exams Portal</p>
            </div>
          </div>

          <div className="footer-description">
            Empowering AUCA students with comprehensive access to past
            examination papers across all faculties. Study smarter, achieve
            better results.
          </div>

          <div className="footer-images">
            {/* <div className="footer-placeholder"><span>📚</span></div> */}
            {/* <div className="footer-placeholder"><span>🎓</span></div> */}
          </div>
        </div>

        {/* Center Section: Quick Links */}
        <div className="middle-part">
          <h2 className="title">Quick Links</h2>
          <ul className="lists">
            {isAuthenticated && user?.role === "admin" ? (
              <>
                <li>
                  <Link to="/cupuriportal/dashboard/browse">Browse Exams</Link>
                </li>
                <li>
                  <Link to="/cupuriportal/dashboard">Dashboard</Link>
                </li>
              </>
            ) : isAuthenticated && user?.role === "student" ? (
              <>
                <li>
                  <Link to="/cupuriportal/dashboard/browse">Browse Exams</Link>
                </li>
                <li>
                  <Link to="/cupuriportal/dashboard">Home</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/cupuriportal/home">Home</Link>
                </li>
                <li>
                  <Link to="/cupuriportal/login">Login</Link>
                </li>
                <li>
                  <Link to="/cupuriportal/signup">SignUp</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Right Section: Faculties */}
        <div className="right-part">
          <h2 className="title">Faculties</h2>
          <ul className="lists">
            <li>
              <a>Software Engineering</a>
            </li>
            <li>
              <a> Information Management</a>
            </li>
            <li>
              <a> Networking & Telecommunications</a>
            </li>
          </ul>
        </div>
      </div>

      <hr className="line-separator" />

      <div className="footer-part-two">
        <div className="footer-copy">
          © {year} AUCA CUPURI Portal. All rights reserved.
        </div>
        <div className="footer-credit">
          Developed with <span className="footer-love">❤️</span> by{" "}
          <span className="footer-author">Prince Cuthbert</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
