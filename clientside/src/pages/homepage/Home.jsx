import React from "react";

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
    <div className="bg-gradient-to-r from-emerald-800 to-slate-900 text-white shadow-md rounded-lg text-center py-12 px-6 mb-12">
      <div className="bg-emerald-600 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
        <GraduationCap className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-4xl md:text-4xl font-extrabold mb-4 leading-tight">
        Welcome to <span className="text-yellow-400">AUCA CUPURI</span>
      </h1>
      <p className="text-gray-200 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
        Your comprehensive portal for accessing past examination papers across
        all faculties. Study smarter with our organized collection of academic
        resources.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
        <Link 
          to="/cupuriportal/signup" 
          className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300 shadow-lg"
        >
          Get Started <ArrowRight size={16} />
        </Link>
        <Link 
          to="/cupuriportal/login" 
          className="border-2 border-white hover:bg-white/10 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <section className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden mb-12">
      <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4">
          <BookOpenText className="w-8 h-8 text-emerald-600" />
          <h2 className="text-2xl font-bold">
            About <span className="text-yellow-500">AUCA CUPURI</span>
          </h2>
        </div>
        <p className="mb-4">
          <strong>AUCA CUPURI</strong>
          (AUCA Comprehensive University Past Resources Initiative) is a
          dedicated digital platform designed to enhance academic excellence at
          Adventist University of Central Africa.
        </p>
        <p className="mb-6">
          Our portal serves as a centralized repository for past examination
          papers across all faculties, providing students with easy access to
          valuable study materials that can significantly improve their academic
          performance and exam preparation strategies.
        </p>

        <div className="bg-emerald-100 border-l-4 border-emerald-600 p-4 rounded-lg text-emerald-800 my-6">
          <strong>Our Mission</strong>
          <br />
          To democratize access to academic resources, foster collaborative
          learning, and empower students with the tools they need to excel in
          their studies through organized, easily accessible past examination
          materials.
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <School size={40} className="text-emerald-600 flex-shrink-0" />
            <span>
              <strong className="block mb-1">Organized by Faculty</strong>
              Browse exams by Software Engineering, Information Management, and
              Networking & Telecommunications
            </span>
          </div>
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <ListChecks size={40} className="text-emerald-600 flex-shrink-0" />
            <span>
              <strong className="block mb-1">Comprehensive Coverage</strong>
              Access both Mid Term and Final exams from various academic years
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-emerald-50 flex flex-col items-center justify-center p-8">
        <img
          src="https://images.pexels.com/photos/5212351/pexels-photo-5212351.jpeg?auto=compress&cs=tinysrgb&h=300"
          alt="Student Success"
          className="max-w-full h-auto rounded-md shadow-sm mb-4"
        />
        <p className="font-medium text-lg text-center mb-1">Empowering Student Success</p>
        <small className="text-gray-600 text-center">
          Join thousands of students who have improved their academic
          performance using our platform
        </small>
      </div>
    </section>
  );
}

export default Home;
