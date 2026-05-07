import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  GraduationCap,
  BookOpenText,
  School,
  ArrowRight,
  Sparkles,
  Users,
  Play,
  Smartphone,
  Monitor,
  Zap,
  Check,
  Menu,
  X as CloseIcon
} from "lucide-react";
import Footer from "../footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-100">
      <Hero />
      <BentoGrid />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-32 pb-12 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-br from-[#008767] via-[#006d53] to-emerald-900 rounded-[2.5rem] p-8 md:p-16 min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
          
          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-[-20deg] origin-top translate-x-20"></div>
          
          <div className="relative z-10 w-full lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#008767] bg-emerald-100 overflow-hidden shadow-md">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-[#008767] bg-yellow-400 flex items-center justify-center text-[10px] font-bold shadow-md">
                    +1k
                  </div>
                </div>
                <span className="text-white/80 text-xs font-bold uppercase tracking-widest">Trusted by students</span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8">
                STUDY.<br />
                DOWNLOAD.<br />
                EXCEL.
              </h1>

              <div className="flex flex-wrap items-center gap-6">
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 shadow-xl shadow-black/10 transition-all group"
                  >
                    Get Started 
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </motion.button>
                </Link>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                    <Monitor size={20} />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                    <Smartphone size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hero Image (Academic focused) */}
          <div className="hidden lg:block absolute bottom-0 right-0 w-[45%] h-[110%] overflow-hidden">
            <motion.img
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              src="https://images.pexels.com/photos/5212351/pexels-photo-5212351.jpeg?auto=compress&cs=tinysrgb&h=1000"
              alt="Student"
              className="w-full h-full object-cover object-top filter grayscale-[20%] brightness-110"
            />
            {/* Badge overlays */}
            <div className="absolute top-1/4 right-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Zap size={12} className="text-yellow-500 fill-yellow-500" />
              Instant Access
            </div>
            <div className="absolute bottom-1/3 right-1/3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={12} className="text-[#008767]" />
              Verified Resources
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BentoGrid = () => {
  return (
    <section className="px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Box 1: Stats & Focus */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="md:col-span-4 bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col justify-between"
        >
          <div>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Academic Success, Measured.</p>
            <h3 className="text-2xl font-bold leading-tight mb-8">
              Access the most comprehensive library of past papers across all faculties.
            </h3>
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <div className="text-4xl font-black mb-1 tracking-tighter">95%</div>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Student Approval</p>
            </div>
            <div className="h-10 w-[1px] bg-white/20"></div>
            <div>
              <div className="text-4xl font-black mb-1 tracking-tighter">1.2k+</div>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Active Papers</p>
            </div>
          </div>
        </motion.div>

        {/* Box 2: Visual Content */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="md:col-span-4 bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm flex flex-col overflow-hidden group"
        >
          <div className="relative flex-1 bg-slate-50 rounded-[1.5rem] overflow-hidden flex items-center justify-center p-8">
            <div className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white">
              <Play size={16} fill="white" />
            </div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <School size={120} className="text-emerald-100 group-hover:text-emerald-200 transition-colors" />
            </motion.div>
          </div>
          <div className="p-4">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Multi-Faculty Support</p>
            <p className="text-sm font-semibold text-slate-800 leading-snug">
              From Engineering to Management, we've got every subject covered.
            </p>
          </div>
        </motion.div>

        {/* Box 3: Nature/Organized */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="md:col-span-4 bg-emerald-400 rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden relative group"
        >
          {/* Animated leaf/organic background */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-300 rounded-full blur-3xl opacity-50 group-hover:scale-125 transition-transform duration-700"></div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-emerald-950 leading-none tracking-tighter mb-4">
              Organized for your growth.
            </h3>
            <p className="text-emerald-900/60 text-sm font-bold uppercase tracking-widest mb-8">
              Smarter learning logic.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-2">
             <div className="bg-emerald-950 text-white p-2.5 rounded-2xl">
               <Zap size={20} />
             </div>
             <div className="bg-emerald-950 text-white p-2.5 rounded-2xl">
               <Sparkles size={20} />
             </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

const Features = () => {
  return (
    <section className="px-6 py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">
            Everything you need to <span className="text-[#008767]">succeed.</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Stop searching across folders and emails. Get instant access to verified academic resources.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            { 
              icon: BookOpenText, 
              title: "Verified Exams", 
              desc: "Every paper is checked for accuracy and quality before being uploaded to our servers." 
            },
            { 
              icon: Users, 
              title: "Student Community", 
              desc: "Join over 1,000 students who use Cupuri daily to improve their grades and understanding." 
            },
            { 
              icon: Smartphone, 
              title: "Mobile Friendly", 
              desc: "Access your study materials on the go. Our platform works perfectly on any smartphone." 
            }
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#008767] border border-slate-100">
                <item.icon size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900">{item.title}</h4>
              <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="px-6 py-24">
      <div className="max-w-7xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[#008767] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
            Ready to transform your study habits?
          </h2>
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#008767] hover:bg-[#009e78] text-white px-10 py-5 rounded-full font-bold text-xl flex items-center gap-3 mx-auto shadow-2xl shadow-emerald-500/20"
            >
              Sign up for free <ArrowRight size={24} />
            </motion.button>
          </Link>
          <div className="mt-12 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
              <Check size={14} className="text-emerald-500" />
              No Credit Card Required
            </div>
            <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
              <Check size={14} className="text-emerald-500" />
              Unlimited Access
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
