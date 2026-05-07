import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { useAuth } from "../../src/context/AuthContext";

function Footer() {
  const { user, isAuthenticated, userRole } = useAuth();

  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 sm:mt-16 text-base text-white bg-gradient-to-r from-gray-900 to-emerald-800 grid grid-rows-[auto_auto] p-6 sm:p-12 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10 sm:gap-y-8">
        {/* Left Section: Logo & Description */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-500 p-2 rounded-2xl flex items-center justify-center">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col items-start">
              <h3 className="text-white text-xl font-bold m-0 text-left">Cupuri Portal</h3>
              <p className="text-emerald-300 mt-0.5 text-xs sm:text-sm">Past Exams Portal</p>
            </div>
          </div>

          <div className="mt-2 mb-4 text-left text-gray-300 text-sm sm:text-base leading-relaxed">
            Empowering AUCA students with comprehensive access to past
            examination papers. Study smarter, achieve
            better results.
          </div>
        </div>

        {/* Center Section: Quick Links */}
        <div className="flex flex-col items-start">
          <h2 className="text-white font-bold mb-4 sm:mb-5 text-lg">Quick Links</h2>
          <ul className="flex flex-col items-start gap-2 text-gray-300 text-sm list-none">
            {isAuthenticated && userRole === "admin" ? (
              <>
                <li className="text-left hover:text-white transition-colors">
                  <Link to="/dashboard/browse">Browse Exams</Link>
                </li>
                <li className="text-left hover:text-white transition-colors">
                  <Link to="/dashboard">Dashboard</Link>
                </li>
              </>
            ) : isAuthenticated && userRole === "student" ? (
              <>
                <li className="text-left hover:text-white transition-colors">
                  <Link to="/dashboard/browse">Browse Exams</Link>
                </li>
                <li className="text-left hover:text-white transition-colors">
                  <Link to="/dashboard">Home</Link>
                </li>
              </>
            ) : (
              <>
                <li className="text-left hover:text-white transition-colors">
                  <Link to="/">Home</Link>
                </li>
                <li className="text-left hover:text-white transition-colors">
                  <Link to="/login">Login</Link>
                </li>
                <li className="text-left hover:text-white transition-colors">
                  <Link to="/signup">SignUp</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Right Section: Faculties */}
        <div className="flex flex-col items-start">
          <h2 className="text-white font-bold mb-4 sm:mb-5 text-lg">Faculties</h2>
          <ul className="flex flex-col items-start gap-2 text-gray-300 text-sm list-none">
            <li className="text-left">
              <a className="hover:text-white transition-colors cursor-pointer">
                Software Engineering
              </a>
            </li>
            <li className="text-left">
              <a className="hover:text-white transition-colors cursor-pointer">
                Information Management
              </a>
            </li>
            <li className="text-left">
              <a className="hover:text-white transition-colors cursor-pointer">
                Networking & Telecom
              </a>
            </li>
          </ul>
        </div>
      </div>

      <hr className="my-6 sm:my-8 h-px bg-gray-500/30 border-none" />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-400 text-[10px] sm:text-xs uppercase font-bold tracking-widest text-center sm:text-left">
        <div>© {year} Cupuri Portal.</div>
        <div>
          Developed with <span className="text-emerald-500">❤️</span> by{" "}
          <span className="text-white">Prince Cuthbert</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
