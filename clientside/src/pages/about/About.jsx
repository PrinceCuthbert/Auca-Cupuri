import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Heart, ExternalLink, BookOpen, Target, Sparkles, Code } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../footer";

const About = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]">
              EMPOWERING <br />
              <span className="text-[#008767]">ACADEMIC EXCELLENCE.</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
              Cupuri Portal was born out of a simple need: to make high-quality academic resources accessible to every student at AUCA.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#008767] flex-shrink-0">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 tracking-tight">A Centralized Repository</h3>
                <p className="text-slate-600 leading-relaxed">
                  We believe that revision shouldn't be a scavenger hunt. Cupuri Portal provides a single, organized platform for students to access past examination papers across all faculties, ensuring that your focus stays on learning, not searching.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#008767] flex-shrink-0">
                <Target size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 tracking-tight">Revision with Purpose</h3>
                <p className="text-slate-600 leading-relaxed">
                  Past papers are one of the most effective tools for understanding exam patterns and testing your knowledge. Our mission is to democratize this access, fostering a culture of preparedness and academic integrity.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#008767] flex-shrink-0">
                <Heart size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 tracking-tight">A Wish for Your Success</h3>
                <p className="text-slate-600 leading-relaxed">
                  To every student using this system: we wish you nothing but the absolute best in your academic journey. May these resources be the stepping stones to your future success. Go forth and excel!
                </p>
              </div>
            </div>
          </motion.div>

          <div className="relative">
             <div className="bg-gradient-to-br from-[#008767] to-emerald-900 rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <Sparkles className="text-yellow-400 mb-6" size={48} />
                <h2 className="text-3xl font-black mb-6 leading-tight tracking-tighter">
                  "Education is the most powerful weapon which you can use to change the world."
                </h2>
                <div className="h-1 w-20 bg-yellow-400 rounded-full"></div>
             </div>
          </div>
        </div>
      </section>

      {/* Creator Credits Section */}
      <section className="px-6 py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-12">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] bg-gradient-to-br from-slate-900 to-emerald-900 flex items-center justify-center text-white overflow-hidden shrink-0 shadow-xl">
               <img 
                 src="https://avatars.githubusercontent.com/u/108422774?v=4" 
                 alt="Prince Cuthbert" 
                 className="w-full h-full object-cover"
                 onError={(e) => {
                   e.target.style.display = 'none';
                   e.target.parentElement.innerHTML = '<span class="text-4xl font-black">PC</span>';
                 }}
               />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#008767] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                <Code size={14} /> Built with Passion
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-slate-900 mb-4">
                Developed by Prince Cuthbert
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8 text-lg">
                I built Cupuri Portal to solve a real challenge I saw in our campus community. As a developer, I'm committed to creating tools that make a difference.
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <a 
                  href="https://princecuthbert.netlify.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-black/10"
                >
                  View Portfolio <ExternalLink size={18} />
                </a>
                <div className="flex -space-x-2">
                   <div className="w-10 h-10 rounded-full border-4 border-white bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">PC</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
