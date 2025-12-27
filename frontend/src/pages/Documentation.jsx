import React, { useState } from "react";
import {
  Book,
  Code,
  Upload,
  Trash2,
  Key,
  Home,
  Menu,
  X,
  Copy,
  Check,
} from "lucide-react";

const Documentation = () => {
  const [activeTab, setActiveTab] = useState("javascript");
  const [activeSection, setActiveSection] = useState("signup");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");

  const sections = [
    { id: "signup", title: "Get Started", icon: <Key className="w-4 h-4" /> },
    {
      id: "install",
      title: "Installation",
      icon: <Code className="w-4 h-4" />,
    },
    {
      id: "upload",
      title: "Upload Files",
      icon: <Upload className="w-4 h-4" />,
    },
    {
      id: "delete",
      title: "Delete Files",
      icon: <Trash2 className="w-4 h-4" />,
    },
    {
      id: "nextsteps",
      title: "Next Steps",
      icon: <Book className="w-4 h-4" />,
    },
  ];

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const CodeBlock = ({ code, language, id }) => (
    <div className="relative group">
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={() => copyToClipboard(code, id)}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          title="Copy code"
        >
          {copiedCode === id ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
      <pre className="bg-slate-900 text-gray-100 rounded-xl p-4 overflow-x-auto text-sm border border-slate-700">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Book className="w-6 h-6 text-cyan-400" />
            <h1 className="text-lg font-bold text-white">DevLoad Docs</h1>
          </div>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-screen w-72 bg-slate-900/50 backdrop-blur-xl border-r border-white/10
        transform transition-transform duration-300 z-40
        ${showMobileMenu ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        <div className="p-6 border-b border-white/10 hidden lg:block">
          <div className="flex items-center gap-2 mb-2">
            <Book className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Documentation</h2>
          </div>
          <p className="text-sm text-gray-400">
            Quick start guide & API reference
          </p>
        </div>

        <nav className="p-4 space-y-1 mt-16 lg:mt-0">
          <a
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all mb-4"
          >
            <Home className="w-4 h-4" />
            <span className="font-medium">Back to Home</span>
          </a>

          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={() => {
                setActiveSection(section.id);
                setShowMobileMenu(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeSection === section.id
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {section.icon}
              <span className="font-medium">{section.title}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen pt-20 lg:pt-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-4">
              <Code className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">
                API Documentation
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Quick Start Guide
            </h1>
            <p className="text-lg text-gray-400">
              Get started with DevLoad in minutes. Upload and manage your
              project files with our simple API.
            </p>
          </div>

          {/* Sign Up Section */}
          <section id="signup" className="mb-16 scroll-mt-24">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                  <Key className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  1. Get Your API Key
                </h2>
              </div>
              <p className="text-gray-400 mb-4">
                Sign up at{" "}
                <a
                  href="https://app-devload.cloudcoderhub.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-medium underline"
                >
                  app-devload.cloudcoderhub.in
                </a>{" "}
                and grab your Project ID and API Key from project settings.
              </p>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-300">
                  💡 <strong>Tip:</strong> Keep your API key secure and never
                  commit it to public repositories.
                </p>
              </div>
            </div>
          </section>

          {/* Installation Section */}
          <section id="install" className="mb-16 scroll-mt-24">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <Code className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  2. Install DevLoad
                </h2>
              </div>

              {/* Tab Switcher */}
              <div className="flex gap-2 mb-4 border-b border-white/10">
                {[
                  { id: "javascript", label: "Vanilla JS" },
                  { id: "nodejs", label: "Node.js" },
                  { id: "reactjs", label: "React" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 font-medium transition-all ${
                      activeTab === tab.id
                        ? "text-cyan-400 border-b-2 border-cyan-400"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <CodeBlock
                id="install"
                language={activeTab === "javascript" ? "html" : "bash"}
                code={
                  activeTab === "javascript"
                    ? '<script src="https://api-devload.cloudcoderhub.in/devload.js"></script>'
                    : activeTab === "nodejs"
                    ? "npm install devload"
                    : "npm install devload-sdk"
                }
              />
            </div>
          </section>

          {/* Upload Section */}
          <section id="upload" className="mb-16 scroll-mt-24">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  3. Upload Your First File
                </h2>
              </div>

              <div className="flex gap-2 mb-4 border-b border-white/10">
                {[
                  { id: "javascript", label: "Vanilla JS" },
                  { id: "nodejs", label: "Node.js" },
                  { id: "reactjs", label: "React" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 font-medium transition-all ${
                      activeTab === tab.id
                        ? "text-cyan-400 border-b-2 border-cyan-400"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <CodeBlock
                id="upload"
                language={
                  activeTab === "javascript"
                    ? "html"
                    : activeTab === "nodejs"
                    ? "javascript"
                    : "jsx"
                }
                code={
                  activeTab === "javascript"
                    ? javascriptUploadCode
                    : activeTab === "nodejs"
                    ? nodejsUploadCode
                    : reactUploadCode
                }
              />
            </div>
          </section>

          {/* Delete Section */}
          <section id="delete" className="mb-16 scroll-mt-24">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  4. Delete a File
                </h2>
              </div>

              <div className="flex gap-2 mb-4 border-b border-white/10">
                {[
                  { id: "javascript", label: "Vanilla JS" },
                  { id: "nodejs", label: "Node.js" },
                  { id: "reactjs", label: "React" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 font-medium transition-all ${
                      activeTab === tab.id
                        ? "text-cyan-400 border-b-2 border-cyan-400"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <CodeBlock
                id="delete"
                language={activeTab === "javascript" ? "html" : "javascript"}
                code={
                  activeTab === "javascript"
                    ? javascriptDeleteCode
                    : activeTab === "nodejs"
                    ? nodejsDeleteCode
                    : reactDeleteCode
                }
              />
            </div>
          </section>

          {/* Next Steps Section */}
          <section id="nextsteps" className="mb-16 scroll-mt-24">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <Book className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Next Steps</h2>
              </div>
              <p className="text-gray-300 mb-6">
                You're all set! Explore more features and advanced
                configurations in our full documentation.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <a
                  href="mailto:support@devload.cloudcoderhub.in"
                  className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                    <span className="text-xl">💬</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Get Support</h3>
                    <p className="text-sm text-gray-400">Contact our team</p>
                  </div>
                </a>
                <a
                  href="/"
                  className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <span className="text-xl">🚀</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">View Examples</h3>
                    <p className="text-sm text-gray-400">
                      Browse sample projects
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

// Code snippets
const javascriptUploadCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Devload File Upload</title>
    <script src="https://api-devload.cloudcoderhub.in/devload.js"></script>
</head>
<body>
    <div class="container">
        <h2>Upload File</h2>
        <input type="file" id="fileInput">
        <button onclick="uploadFile()">Upload</button>
        <p id="status"></p>
    </div>

    <script>
        const apiKey = "YOUR_API_KEY";
        const projectid = "YOUR_PROJECT_ID";
        const devload = new DevLoad(apiKey);

        async function uploadFile() {
            const fileInput = document.getElementById("fileInput");
            const status = document.getElementById("status");

            if (!fileInput.files.length) {
                status.textContent = "Please select a file to upload.";
                return;
            }

            try {
                status.textContent = "Uploading...";
                const file = fileInput.files[0];
                const response = await devload.uploadFile(projectid, file);

                if (response.status === 200) {
                    status.textContent = "File upload success!";
                } else {
                    status.textContent = "Upload failed!";
                }
            } catch (error) {
                status.textContent = "Error while uploading";
                console.error(error);
            }
        }
    </script>
</body>
</html>`;

const nodejsUploadCode = `const DevLoad = require('devload');

(async () => {
  const devload = new DevLoad('YOUR_API_KEY');
  const projectid = 'YOUR_PROJECT_ID';
  const filePath = './sample.mp4';
  
  try {
    const result = await devload.uploadFile(projectid, filePath);
    console.log('Uploaded:', result);
  } catch (error) {
    console.error('Error:', error);
  }
})();`;

const reactUploadCode = `import { useState } from 'react';
import DevLoad from 'devload-sdk';

export default function FileUploader() {
  const [file, setFile] = useState(null);
  const devload = new DevLoad('YOUR_API_KEY');
  const projectid = "YOUR_PROJECT_ID";

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      const response = await devload.uploadFile(projectid, file);
      console.log('Uploaded:', response);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}`;

const javascriptDeleteCode = `<script>
  async function deleteExampleFile() {
    const devload = new DevLoad("YOUR_API_KEY");
    
    try {
      const result = await devload.deleteFile('example.jpg');
      console.log('Delete successful:', result);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }
</script>`;

const nodejsDeleteCode = `const DevLoad = require('devload');

(async () => {
  const devload = new DevLoad('YOUR_API_KEY');
  const filename = "example.jpg";
  
  try {
    const result = await devload.deleteFile(filename);
    console.log('Deleted:', result);
  } catch (error) {
    console.error('Error:', error);
  }
})();`;

const reactDeleteCode = `const devload = new DevLoad('YOUR_API_KEY');

async function handleDeleteFile(filename) {
  try {
    const response = await devload.deleteFile(filename);
    console.log('File deleted:', response);
  } catch (error) {
    console.error('Delete failed:', error);
  }
}`;

export default Documentation;
