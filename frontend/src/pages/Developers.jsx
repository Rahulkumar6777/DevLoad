import React from "react";
import { Linkedin, Globe, Code, Database, Server } from "lucide-react";

const developers = [
  {
    name: "Rahul Kumar",
    role: "Full Stack Developer & DevOps",
    description:
      "Architected the complete backend infrastructure with Node.js, MongoDB, and BullMQ for queue management. Implemented secure authentication, API design, and handled deployment with Nginx. Integrated Redux for state management and FFmpeg for media processing.",
    image:
      "https://api-devload.cloudcoderhub.in/public/64b2d2fe454e0f128767e54bca28b02c/1766838252547ff6da4d91af5c5d9093018f2e6d36b5f.jpeg",
    skills: [
      "Node.js",
      "MongoDB",
      "Redis",
      "BullMQ",
      "Redux",
      "FFmpeg",
      "Nginx",
      "REST APIs",
    ],
    social: {
      linkedin: "https://www.linkedin.com/in/rahul-kumar-003aa2316",
      portfolio: "https://rahul.cloudcoderhub.in",
    },
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Junaid Quamar",
    role: "Frontend Specialist",
    description:
      "Designed and developed the modern, responsive landing page using React.js and Vite. Created smooth animations with Framer Motion and crafted the entire UI/UX with Tailwind CSS. Focused on mobile-first design and optimal user experience.",
    image:
      "https://api-devload.cloudcoderhub.in/public/1751661454306d296db2a288443f93fe23342b20e5662.jpg",
    skills: [
      "React.js",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "UI/UX Design",
    ],
    social: {
      linkedin: "https://www.linkedin.com/in/junaidqamar12",
      portfolio: "https://junaidportfolio1.netlify.app/",
    },
    gradient: "from-purple-500 to-pink-500",
  },
];

const techStack = [
  { name: "Vite", color: "text-purple-400" },
  { name: "React", color: "text-cyan-400" },
  { name: "Redux", color: "text-violet-400" },
  { name: "Node.js", color: "text-green-400" },
  { name: "MongoDB", color: "text-emerald-400" },
  { name: "Redis", color: "text-red-400" },
  { name: "BullMQ", color: "text-orange-400" },
  { name: "FFmpeg", color: "text-yellow-400" },
  { name: "Nginx", color: "text-blue-400" },
  { name: "s3", color: "text-blue-400" },
];

export default function DevelopersSection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-1/2 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Header */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 py-2">
            <Code className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">
              Meet the Team
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              The Minds Behind
            </span>
            <br />
            <span className="text-white">DevLoad</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
            Two passionate developers building simple, reliable file storage
            solutions
          </p>
        </div>
      </section>

      {/* Developer Cards */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {developers.map((dev, index) => (
            <div
              key={index}
              className="group relative bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10"
            >
              {/* Gradient overlay */}
              <div
                className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-br ${dev.gradient} opacity-20 group-hover:opacity-30 transition-opacity`}
              />

              <div className="relative p-6 sm:p-8">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  {/* Profile Image */}
                  <div className="relative shrink-0">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${dev.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity`}
                    />
                    <img
                      src={dev.image}
                      alt={dev.name}
                      className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-2 border-white/10 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        {dev.name}
                      </h3>
                      <div
                        className={`inline-block bg-gradient-to-r ${dev.gradient} text-white text-xs sm:text-sm px-4 py-1.5 rounded-full font-medium`}
                      >
                        {dev.role}
                      </div>
                    </div>

                    <p className="text-gray-300 leading-relaxed">
                      {dev.description}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {dev.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-white/5 border border-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-full hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-3 justify-center md:justify-start pt-2">
                      <a
                        href={dev.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span className="text-sm font-medium">LinkedIn</span>
                      </a>

                      <a
                        href={dev.social.portfolio}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg transition-all hover:scale-105"
                      >
                        <Globe className="w-4 h-4" />
                        <span className="text-sm font-medium">Portfolio</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-4">
            <Server className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              Technology Stack
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Powered By
            </span>
          </h2>
          <p className="text-gray-400">
            Modern tools and technologies we use daily
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {techStack.map((tech, i) => (
            <div
              key={i}
              className="group relative bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-3 hover:border-cyan-500/50 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 group-hover:animate-pulse" />
                <span
                  className={`font-mono font-medium ${tech.color} group-hover:text-white transition-colors`}
                >
                  {tech.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
          <div className="relative text-center space-y-6">
            <Database className="w-12 h-12 mx-auto text-cyan-400" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Want to work with us?
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              We're always open to collaboration and new opportunities. Reach
              out via LinkedIn!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {developers.map((dev, i) => (
                <a
                  key={i}
                  href={dev.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-medium transition-all hover:scale-105"
                >
                  Connect with {dev.name.split(" ")[0]}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
