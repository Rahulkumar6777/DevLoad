import React from "react";
import {
  Upload,
  Folder,
  Lock,
  Zap,
  Code,
  Check,
  Globe,
  Package,
} from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Simple File Storage",
      text: "Upload and organize your project files with an easy-to-use API",
      color: "from-blue-500/10 to-cyan-500/10",
      iconColor: "text-cyan-400",
    },
    {
      icon: <Folder className="w-8 h-8" />,
      title: "Project-Based Organization",
      text: "Keep files organized by project with separate API keys for each",
      color: "from-purple-500/10 to-pink-500/10",
      iconColor: "text-purple-400",
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Secure Access",
      text: "API key authentication to keep your files safe and private",
      color: "from-green-500/10 to-emerald-500/10",
      iconColor: "text-green-400",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast Performance",
      text: "Quick uploads and downloads with reliable VPS infrastructure",
      color: "from-yellow-500/10 to-orange-500/10",
      iconColor: "text-yellow-400",
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Developer Friendly",
      text: "Simple REST API that works with any programming language",
      color: "from-indigo-500/10 to-blue-500/10",
      iconColor: "text-indigo-400",
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "All File Types",
      text: "Store images, videos, documents, and any other file format",
      color: "from-pink-500/10 to-rose-500/10",
      iconColor: "text-pink-400",
    },
  ];

  const integrations = [
    {
      name: "Node.js SDK",
      link: "https://www.npmjs.com/package/devload",
      icon: <Code className="w-10 h-10" />,
      color: "from-green-500/10 to-emerald-500/20",
      description: "Official Node.js package for seamless integration",
    },
    {
      name: "React/Next.js SDK",
      link: "https://www.npmjs.com/package/devload-sdk",
      icon: <Globe className="w-10 h-10" />,
      color: "from-blue-500/10 to-cyan-500/20",
      description: "Frontend SDK for React and Next.js applications",
    },
    {
      name: "JavaScript Client",
      link: "https://api.devload.cloudcoderhub.in/devLoad.js",
      icon: <Package className="w-10 h-10" />,
      color: "from-yellow-500/10 to-orange-500/20",
      description: "Lightweight JS library for browser usage",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Header */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 py-2">
            <Package className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">
              About DevLoad
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Simple File Storage
            </span>
            <br />
            <span className="text-white">For Developers</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
            DevLoad is a straightforward file hosting solution built by
            developers, for developers. Store your project files with a simple
            API—no complexity, no fuss.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-2"
            >
              <div
                className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}
              >
                <div className={feature.iconColor}>{feature.icon}</div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What We Offer */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                What You Get
              </span>
            </h2>
            <p className="text-gray-400">
              Everything you need for project file storage
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Free tier with 1GB storage",
              "Project-based file organization",
              "Simple REST API",
              "Secure API key authentication",
              "Support for all file types",
              "Fast VPS infrastructure",
              "Public URL access",
              "Easy integration with any language",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Check className="w-5 h-5 text-green-400 shrink-0" />
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-4">
            <Code className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              Easy Integration
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Works With Your Stack
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Use our SDKs or call the API directly from any language
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {integrations.map((integration, index) => (
            <a
              key={index}
              href={integration.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`group bg-gradient-to-br ${integration.color} backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-2`}
            >
              <div className="flex justify-center mb-4">
                <div className="text-cyan-400 group-hover:scale-110 transition-transform">
                  {integration.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-center group-hover:text-cyan-400 transition-colors">
                {integration.name}
              </h3>
              <p className="text-gray-400 text-sm text-center group-hover:text-gray-300 transition-colors">
                {integration.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
          <div className="relative text-center space-y-6">
            <Zap className="w-12 h-12 mx-auto text-cyan-400" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to Get Started?
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Start with our free plan. No credit card required, no hidden fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-semibold hover:scale-105 transition-all hover:shadow-xl hover:shadow-cyan-500/25">
                Create Free Account
              </button>
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold transition-all">
                View Documentation
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 pt-6">
              {["No credit card", "1GB free storage", "Start in 2 minutes"].map(
                (item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
