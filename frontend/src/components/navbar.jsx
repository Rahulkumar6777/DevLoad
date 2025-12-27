import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, FileCode, Zap } from "lucide-react";
import { privateAppDomain } from "./PrivateAppDomain";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const navLinks = [
    { name: "Pricing", path: "/pricing" },
    { name: "About", path: "/about" },
    { name: "Developers", path: "/developers" },
    { name: "Docs", path: "/documentation" },
  ];

  return (
    <>
      
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
          onClick={closeMobileMenu}
        /> 
      )}

      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-slate-950/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-cyan-500/10"
            : "bg-slate-950/80 backdrop-blur-md border-b border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center gap-2 group"
              onClick={closeMobileMenu}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg">
                  <FileCode className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Dev
                </span>
                <span className="text-white">Load</span>
              </span>
            </a>

            
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="px-4 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                >
                  {link.name}
                </a>
              ))}
            </div>

            
            <div className="hidden lg:flex items-center gap-3">
              <a href={`${privateAppDomain}/login`}>
                <button className="px-5 py-2 text-gray-300 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-all font-medium">
                  Login
                </button>
              </a>
              <a href={`${privateAppDomain}/signup`}>
                <button className="group relative px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-medium overflow-hidden transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105">
                  <span className="relative z-10 text-white flex items-center gap-2">
                    Get Started
                    <Zap className="w-4 h-4" />
                  </span>
                </button>
              </a>
            </div>

            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        
        {mobileMenuOpen && (
          <div className="lg:hidden fixed top-16 left-0 right-0 bg-slate-950/98 backdrop-blur-xl border-b border-white/10 z-50 animate-in slide-in-from-top duration-300">
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                >
                  {link.name}
                </a>
              ))}

              <div className="pt-4 space-y-3 border-t border-white/10 mt-4">
                <a
                  href={`${privateAppDomain}/login`}
                  onClick={closeMobileMenu}
                  className="block"
                >
                  <button className="w-full px-4 py-3 text-gray-300 border border-white/10 rounded-lg hover:bg-white/5 transition-all font-medium">
                    Login
                  </button>
                </a>
                <a
                  href={`${privateAppDomain}/signup`}
                  onClick={closeMobileMenu}
                  className="block"
                >
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-medium text-white hover:shadow-lg transition-all">
                    Get Started Free
                  </button>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
      <div className="h-16" />
    </>
  );
};

export default Navbar;
