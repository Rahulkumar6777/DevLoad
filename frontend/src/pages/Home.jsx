import React, { useState, useEffect } from 'react';
import { Upload, Folder, Code, Lock, Zap, Package, Check, ArrowRight, Play, FileCode, Image, Film, Music, ChevronRight, Star } from 'lucide-react';
import { privateAppDomain } from '../components/PrivateAppDomain';

export const Home = () => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeFeature, setActiveFeature] = useState(0);
  const [stats, setStats] = useState({ files: 0, projects: 0, users: 0 });

  
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        files: prev.files < 15420 ? prev.files + 147 : 15420,
        projects: prev.projects < 342 ? prev.projects + 3 : 342,
        users: prev.users < 128 ? prev.users + 1 : 128
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Project Organization",
      description: "Keep files organized by project with separate API keys",
      icon: <Folder className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Simple REST API",
      description: "Easy-to-use endpoints for all your file operations",
      icon: <Code className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Secure Storage",
      description: "API key authentication keeps your files protected",
      icon: <Lock className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Fast Performance",
      description: "Quick uploads with reliable VPS infrastructure",
      icon: <Zap className="w-6 h-6" />,
      color: "from-orange-500 to-red-500"
    },
    {
      title: "All File Types",
      description: "Support for images, videos, audio, and documents",
      icon: <Package className="w-6 h-6" />,
      color: "from-indigo-500 to-purple-500"
    },
    {
      title: "Developer Tools",
      description: "SDKs for Node.js, React, and vanilla JavaScript",
      icon: <FileCode className="w-6 h-6" />,
      color: "from-teal-500 to-cyan-500"
    }
  ];

  const fileTypes = [
    { icon: <Image className="w-6 h-6" />, name: "Images", formats: "JPG, PNG, GIF, WebP", color: "text-blue-400" },
    { icon: <Film className="w-6 h-6" />, name: "Videos", formats: "MP4, AVI, MOV, WebM", color: "text-purple-400" },
    { icon: <Music className="w-6 h-6" />, name: "Audio", formats: "MP3, WAV, OGG, FLAC", color: "text-green-400" },
    { icon: <FileCode className="w-6 h-6" />, name: "Documents", formats: "PDF, DOC, TXT, ZIP", color: "text-orange-400" }
  ];

  const useCases = [
    {
      title: "Portfolio Websites",
      description: "Host images and media for your personal portfolio",
      icon: "🎨",
      stats: "2-5 projects"
    },
    {
      title: "Mobile Apps",
      description: "Backend storage for your app's user-generated content",
      icon: "📱",
      stats: "1-3 projects"
    },
    {
      title: "Side Projects",
      description: "Quick file hosting for your weekend projects",
      icon: "🚀",
      stats: "1-5 projects"
    }
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles(files.slice(0, 3));
    setTimeout(() => setShowLoginPrompt(true), 500);
  };

  const handleClick = () => {
    setShowLoginPrompt(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated Background with Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium text-blue-300">Live & Ready</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                File Storage
              </span>
              <br />
              <span className="text-white">That Just Works</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
              Simple API-based file hosting for developers. Upload, organize, and serve files without the complexity of traditional cloud storage.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={`${privateAppDomain}/signup`}>
                <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-semibold overflow-hidden transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105">
                  <span className="relative z-10 flex items-center gap-2">
                    Start Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </a>
              
              <a href="/documentation">
                <button className="group px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold backdrop-blur-sm transition-all hover:border-cyan-500/50 flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Quick Start
                </button>
              </a>
            </div>

            
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {stats.files.toLocaleString()}+
                </div>
                <div className="text-xs text-gray-400 mt-1">Files Stored</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {stats.projects}+
                </div>
                <div className="text-xs text-gray-400 mt-1">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {stats.users}+
                </div>
                <div className="text-xs text-gray-400 mt-1">Developers</div>
              </div>
            </div>
          </div>

         
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl" />
            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
                className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive 
                    ? 'border-cyan-500 bg-cyan-500/10 scale-105' 
                    : 'border-white/20 hover:border-cyan-500/50 hover:bg-white/5'
                }`}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {isDragActive ? '📂 Drop files here' : 'Try it now'}
                </h3>
                <p className="text-gray-400 text-sm">
                  Drag & drop or click to test
                </p>
              </div>

              
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                      <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{file.name}</div>
                        <div className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              
              <div className="grid grid-cols-2 gap-3">
                {fileTypes.map((type, i) => (
                  <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-colors">
                    <div className={`${type.color} mb-2`}>{type.icon}</div>
                    <div className="text-sm font-medium">{type.name}</div>
                    <div className="text-xs text-gray-400">{type.formats}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-slate-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Everything You Need
                </span>
              </h2>
              <div className="space-y-3">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveFeature(i)}
                    className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                      activeFeature === i 
                        ? 'bg-white/10 border border-cyan-500/30' 
                        : 'bg-white/5 border border-transparent hover:bg-white/10'
                    }`}
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color} bg-opacity-10`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{feature.title}</div>
                      <div className="text-sm text-gray-400">{feature.description}</div>
                    </div>
                    {activeFeature === i && <ChevronRight className="w-5 h-5 text-cyan-400" />}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative h-80 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${features[activeFeature].color} opacity-10 transition-all duration-500`} />
              <div className="relative text-center p-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                  {React.cloneElement(features[activeFeature].icon, { className: 'w-10 h-10' })}
                </div>
                <h3 className="text-2xl font-bold mb-2">{features[activeFeature].title}</h3>
                <p className="text-gray-400">{features[activeFeature].description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Perfect For
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ideal for developers building side projects and small applications
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {useCases.map((useCase, i) => (
            <div key={i} className="group bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition-all hover:-translate-y-2">
              <div className="text-4xl mb-4">{useCase.icon}</div>
              <h3 className="text-xl font-bold mb-2">{useCase.title}</h3>
              <p className="text-gray-400 mb-4">{useCase.description}</p>
              <div className="flex items-center gap-2 text-sm text-cyan-400">
                <Star className="w-4 h-4" />
                <span>{useCase.stats}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
          <div className="relative text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Start Building Today
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              1GB free storage • No credit card • 2 minute setup
            </p>
            <a href={`${privateAppDomain}/signup`}>
              <button className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-gray-100 transition-all hover:scale-105 hover:shadow-xl inline-flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </button>
            </a>
          </div>
        </div>
      </section>

     
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="relative bg-slate-800 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <button 
              onClick={() => {
                setShowLoginPrompt(false);
                setUploadedFiles([]);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                <Upload className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Ready to Upload?
              </h2>
              <p className="text-gray-400">
                Create a free account to start uploading files
              </p>
            </div>
            
            <div className="space-y-4">
              <a href={`${privateAppDomain}/signup`}>
                <button className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                  Create Free Account
                </button>
              </a>
              
              <a href={`${privateAppDomain}/login`}>
                <button className="w-full py-3.5 bg-white/5 border border-white/10 rounded-lg font-semibold hover:bg-white/10 transition-all">
                  Sign In
                </button>
              </a>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>1GB free</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>No card needed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      
      <footer className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                DevLoad
              </h3>
              <p className="text-gray-500 text-sm">© 2025 DevLoad. Simple file storage for developers.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="/documentation" className="text-gray-400 hover:text-cyan-400 transition-colors">Docs</a>
              <a href="/pricing" className="text-gray-400 hover:text-cyan-400 transition-colors">Pricing</a>
              <a href="/about" className="text-gray-400 hover:text-cyan-400 transition-colors">About</a>
              <a href="/term" className="text-gray-400 hover:text-cyan-400 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};