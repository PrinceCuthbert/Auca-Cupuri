import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Menu, X as CloseIcon } from "lucide-react";

const PublicHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";

  // Navigation Links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ];

  return (
    <header className={`${isHome ? "absolute" : "sticky"} top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md md:bg-transparent`}>
      <nav className="px-6 py-4 md:py-6 flex items-center justify-between max-w-7xl mx-auto bg-white md:bg-transparent rounded-full mt-2 md:mt-0 shadow-sm md:shadow-none mx-4 md:mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-[#008767] p-2 rounded-lg">
            <GraduationCap className="text-white" size={24} />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900">Cupuri Portal</span>
        </Link>
        
        {/* Desktop Navigation Links (Center) */}
        <div className="hidden md:flex items-center gap-10 text-[13px] font-bold text-slate-600 tracking-widest uppercase">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path} 
              className={`hover:text-[#008767] transition-colors ${location.pathname === link.path ? "text-[#008767]" : ""}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop Auth Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/login" className="px-7 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all shadow-md shadow-black/10">
              Login
            </Link>
            <Link to="/signup" className="px-7 py-2.5 bg-white border border-slate-200 text-slate-900 text-sm font-bold rounded-full hover:bg-slate-50 transition-all shadow-sm">
              Register
            </Link>
          </div>

          {/* Hamburger Icon */}
          <button 
            className="md:hidden p-2 text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[60] bg-white flex flex-col p-8"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-2">
                  <div className="bg-[#008767] p-2 rounded-lg text-white">
                    <GraduationCap size={24} />
                  </div>
                  <span className="text-2xl font-black tracking-tighter">Cupuri Portal</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-900">
                  <CloseIcon size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-6 text-2xl font-black tracking-tighter uppercase mb-auto">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name}
                    to={link.path} 
                    onClick={() => setMobileMenuOpen(false)} 
                    className={`hover:text-[#008767] ${location.pathname === link.path ? "text-[#008767]" : ""}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="flex flex-col gap-4">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 bg-slate-900 text-white text-center font-bold rounded-2xl text-lg">
                    Login
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 border border-slate-200 text-slate-900 text-center font-bold rounded-2xl text-lg">
                    Create Account
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default PublicHeader;
