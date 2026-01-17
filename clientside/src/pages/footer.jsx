import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { useAuth } from "../../src/context/AuthContext";

function Footer() {
  const { user, isAuthenticated } = useAuth();

  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 text-base text-white bg-gradient-to-r from-gray-900 to-emerald-800 grid grid-rows-[auto_auto] p-8 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
        {/* Left Section: Logo & Description */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-500 p-2 rounded-2xl flex items-center justify-center">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col items-start">
              <h3 className="text-white text-xl font-bold m-0">AUCA CUPURI</h3>
              <p className="text-emerald-300 mt-1 text-sm">Past Exams Portal</p>
            </div>
          </div>

          <div className="mt-4 mb-4 text-left text-gray-300">
            Empowering AUCA students with comprehensive access to past
            examination papers across all faculties. Study smarter, achieve
            better results.
          </div>

          <div className="flex gap-4">
            {/* <div className="w-20 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-2xl text-white shadow-lg"><span>📚</span></div> */}
            {/* <div className="w-20 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-2xl text-white shadow-lg"><span>🎓</span></div> */}
          </div>
        </div>

        {/* Center Section: Quick Links */}
        <div className="flex flex-col items-start">
          <h2 className="text-white font-bold mb-5 text-lg">Quick Links</h2>
          <ul className="flex flex-col items-start gap-2 text-gray-300 text-sm list-none">
            {isAuthenticated && user?.role === "admin" ? (
              <>
                <li className="text-left hover:text-white transition-colors">
                  <Link to="/cupuriportal/dashboard/browse">Browse Exams</Link>
                </li>
                <li className="text-left hover:text-white transition-colors">
                  <Link to="/cupuriportal/dashboard">Dashboard</Link>
                </li>
              </>
            ) : isAuthenticated && user?.role === "student" ? (
              <>
                <li className="text-left hover:text-white transition-colors">
                  <Link to="/cupuriportal/dashboard/browse">Browse Exams</Link>
                </li>
                <li className="text-left hover:text-white transition-colors">
                  <Link to="/cupuriportal/dashboard">Home</Link>
                </li>
              </>
            ) : (
              <>
                <li className="text-left hover:text-white transition-colors">
                  <Link to="/">Home</Link>
                </li>
                <li className="text-left hover:text-white transition-colors">
                  <Link to="/cupuriportal/login">Login</Link>
                </li>
                <li className="text-left hover:text-white transition-colors">
                  <Link to="/cupuriportal/signup">SignUp</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Right Section: Faculties */}
        <div className="flex flex-col items-start">
          <h2 className="text-white font-bold mb-5 text-lg">Faculties</h2>
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
                Networking & Telecommunications
              </a>
            </li>
          </ul>
        </div>
      </div>

      <hr className="my-8 h-px bg-gray-500 border-none" />

      <div className="flex flex-col justify-center gap-3 text-gray-300 text-sm text-center sm:text-left">
        <div>© {year} AUCA CUPURI Portal. All rights reserved.</div>
        <div>
          Developed with <span className="text-emerald-400">❤️</span> by{" "}
          <span className="text-cyan-400">Prince Cuthbert</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
