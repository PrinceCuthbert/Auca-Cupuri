import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpenText,
  School,
  ListChecks,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";

import Footer from "../footer";

function Home() {
  return (
    <>
      <WelcomeBanner />
      <StatsSection />
      <AboutSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </>
  );
}

function WelcomeBanner() {
  return (
    <div className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="text-center">
          {/* Icon with Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-block bg-gradient-to-br from-yellow-400 to-yellow-500 w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/50 rotate-6 hover:rotate-0 transition-transform duration-300"
          >
            <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-slate-900" />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-8 leading-tight tracking-tight"
          >
            Welcome to{" "}
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              AUCA CUPURI
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-200 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-10 sm:mb-12 leading-relaxed font-light px-4"
          >
            Your comprehensive portal for accessing{" "}
            <span className="font-semibold text-yellow-300">
              past examination papers
            </span>{" "}
            across all faculties. Study smarter with our organized collection of
            academic resources.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 max-w-lg mx-auto px-4"
          >
            <Link to="/cupuriportal/signup">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold text-base sm:text-lg py-4 px-8 sm:px-10 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-500/70"
              >
                Get Started <ArrowRight size={20} />
              </motion.button>
            </Link>
            <Link to="/cupuriportal/login">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto border-2 border-white/30 backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white font-bold text-base sm:text-lg py-4 px-8 sm:px-10 rounded-xl transition-all duration-300 hover:border-white/50"
              >
                Login
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#F8FAFC"
          />
        </svg>
      </div>
    </div>
  );
}

function StatsSection() {
  const stats = [
    { icon: Users, value: "1000+", label: "Active Students" },
    { icon: BookOpenText, value: "500+", label: "Exam Papers" },
    { icon: School, value: "3", label: "Faculties" },
    { icon: Award, value: "95%", label: "Success Rate" },
  ];

  return (
    <div className="bg-slate-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
            >
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <stat.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
                {stat.value}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <BookOpenText className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900">
                About{" "}
                <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  AUCA CUPURI
                </span>
              </h2>
            </div>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
              <span className="font-bold text-slate-900">AUCA CUPURI</span>{" "}
              (AUCA Comprehensive University Past Resources Initiative) is a
              dedicated digital platform designed to enhance academic excellence
              at Adventist University of Central Africa.
            </p>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8">
              Our portal serves as a centralized repository for past examination
              papers across all faculties, providing students with easy access to
              valuable study materials that can significantly improve their
              academic performance.
            </p>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 border-l-4 border-emerald-600 p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-start gap-3 mb-3">
                <Sparkles className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                <h3 className="font-bold text-lg sm:text-xl text-slate-900">
                  Our Mission
                </h3>
              </div>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                To democratize access to academic resources, foster collaborative
                learning, and empower students with the tools they need to excel
                in their studies through organized, easily accessible past
                examination materials.
              </p>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/5212351/pexels-photo-5212351.jpeg?auto=compress&cs=tinysrgb&h=600"
                alt="Student Success"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">
                  Empowering Student Success
                </h3>
                <p className="text-sm sm:text-base text-gray-200">
                  Join thousands of students who have improved their academic
                  performance using our platform
                </p>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute -top-6 -right-6 bg-yellow-400 text-slate-900 font-black text-sm sm:text-base px-6 py-3 rounded-full shadow-xl rotate-12 hover:rotate-0 transition-transform duration-300"
            >
              🎓 Trusted Platform
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: School,
      title: "Organized by Faculty",
      description:
        "Browse exams by Software Engineering, Information Management, and Networking & Telecommunications",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: ListChecks,
      title: "Comprehensive Coverage",
      description:
        "Access both Mid Term and Final exams from various academic years",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: TrendingUp,
      title: "Improve Performance",
      description:
        "Study smarter with organized materials and boost your grades significantly",
      color: "from-emerald-500 to-emerald-600",
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              CUPURI
            </span>
            ?
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
            Discover the features that make us the #1 choice for AUCA students
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100"
            >
              <div
                className={`bg-gradient-to-br ${feature.color} w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg`}
              >
                <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 py-16 sm:py-20 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6">
            Ready to Ace Your Exams?
          </h2>
          <p className="text-gray-200 text-base sm:text-lg lg:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of successful students who trust CUPURI for their exam
            preparation. Start your journey to academic excellence today!
          </p>
          <Link to="/cupuriportal/signup">
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-black text-base sm:text-lg py-5 px-10 sm:px-12 rounded-xl flex items-center justify-center gap-3 mx-auto transition-all duration-300 shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-500/70"
            >
              Get Started Free <ArrowRight size={24} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default Home;
