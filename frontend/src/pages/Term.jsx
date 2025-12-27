import React, { useState } from 'react';
import { AlertTriangle, Shield, FileText, AlertCircle, Info, Home } from 'lucide-react';

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState('');

  const sections = [
    { id: 'important', title: 'Important Notice', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'service', title: 'Service Description', icon: <Info className="w-4 h-4" /> },
    { id: 'liability', title: 'No Liability', icon: <Shield className="w-4 h-4" /> },
    { id: 'data', title: 'Data & Privacy', icon: <FileText className="w-4 h-4" /> },
    { id: 'usage', title: 'Acceptable Use', icon: <AlertCircle className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>

      {/* Sidebar Navigation */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-72 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-2">Terms of Service</h2>
          <p className="text-sm text-gray-400">Last updated: December 2024</p>
        </div>

        <nav className="space-y-1">
          <a
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all mb-4"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </a>

          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeSection === section.id
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {section.icon}
              <span className="font-medium">{section.title}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Mobile Header */}
          <div className="lg:hidden mb-8">
            <a href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4">
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </a>
          </div>

          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-red-300">Please Read Carefully</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Terms of Service
              </span>
            </h1>
            <p className="text-lg text-gray-400">
              Important information about using DevLoad
            </p>
          </div>

          {/* Critical Warning */}
          <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 sm:p-8 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-300 mb-2">⚠️ THIS IS A DEVELOPER PROJECT</h2>
                <div className="space-y-2 text-gray-300">
                  <p className="font-semibold">DevLoad is a personal/educational project, NOT a commercial service.</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>This service is provided "AS IS" without any guarantees</li>
                    <li>The server may go down at any time without notice</li>
                    <li>Your files may be deleted without warning</li>
                    <li>There is NO data backup or recovery</li>
                    <li>Do NOT use this for production/commercial applications</li>
                    <li>Do NOT store important or irreplaceable files</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <section id="important" className="mb-12 scroll-mt-24">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Important Notice</h2>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <p className="text-lg font-semibold text-white">By using DevLoad, you acknowledge and agree that:</p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <p className="font-semibold text-yellow-300">For Developers & Learning Only</p>
                      <p className="text-sm text-gray-300">This is a side project built for learning and for developer friends to test their applications. It is NOT intended for real businesses or production use.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <span className="text-2xl">🚫</span>
                    <div>
                      <p className="font-semibold text-red-300">No Commercial Use</p>
                      <p className="text-sm text-gray-300">Do not use this service for any commercial application, client projects, or any scenario where file loss would cause financial or legal damage.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <span className="text-2xl">💾</span>
                    <div>
                      <p className="font-semibold text-orange-300">Keep Your Own Backups</p>
                      <p className="text-sm text-gray-300">Always maintain your own backup of any files you upload. DevLoad does not guarantee file persistence or availability.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Service Description */}
          <section id="service" className="mb-12 scroll-mt-24">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                  <Info className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Service Description</h2>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <p>DevLoad is a simple file storage service built by an individual developer as a learning project and to help friends test their applications.</p>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="font-semibold text-blue-300 mb-2">What DevLoad Provides:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Basic file upload and storage via API</li>
                    <li>Project-based file organization</li>
                    <li>Public URL access to uploaded files</li>
                    <li>Simple API for developers to test their apps</li>
                  </ul>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="font-semibold text-red-300 mb-2">What DevLoad Does NOT Provide:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Guaranteed uptime or availability</li>
                    <li>Data backup or recovery services</li>
                    <li>SLA (Service Level Agreement)</li>
                    <li>24/7 support or customer service</li>
                    <li>Legal compliance for business use</li>
                    <li>GDPR, HIPAA, or other regulatory compliance</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* No Liability */}
          <section id="liability" className="mb-12 scroll-mt-24">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Limitation of Liability</h2>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <p className="text-lg font-semibold text-white">The developer assumes NO LIABILITY for:</p>
                
                <ul className="space-y-2 list-none">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Loss, corruption, or deletion of your data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Service downtime or unavailability</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Security breaches or unauthorized access</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Any damages (financial or otherwise) resulting from service use</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Bugs, errors, or malfunctions in the service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Any consequences of using this service in production</span>
                  </li>
                </ul>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mt-6">
                  <p className="text-sm">
                    <strong>USE AT YOUR OWN RISK.</strong> The service is provided "AS IS" and "AS AVAILABLE" without warranty of any kind, express or implied. You are solely responsible for any consequences of using this service.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Data & Privacy */}
          <section id="data" className="mb-12 scroll-mt-24">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Data & Privacy</h2>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-white mb-2">Data Storage</h3>
                    <p className="text-sm">Your files are stored on a VPS (Virtual Private Server). There is no guarantee of data persistence, backup, or recovery.</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-2">Data Deletion</h3>
                    <p className="text-sm">The developer reserves the right to delete any or all data at any time without notice. Reasons may include (but are not limited to): server maintenance, storage limits, abuse, or project discontinuation.</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-2">Privacy</h3>
                    <p className="text-sm">We do not sell your data. However, we cannot guarantee the security of your files. Do not upload sensitive, private, or confidential information.</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-2">Your Responsibility</h3>
                    <p className="text-sm">You are responsible for the content you upload. Do not upload illegal, copyrighted, or malicious content.</p>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-300">
                    💡 Best Practice: Only upload test files, sample data, or files you have backed up elsewhere.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section id="usage" className="mb-12 scroll-mt-24">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Acceptable Use Policy</h2>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <p className="font-semibold text-white">You agree NOT to:</p>
                
                <ul className="space-y-2 list-none">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Upload illegal content (pirated software, copyrighted material, etc.)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Upload malicious files (viruses, malware, ransomware)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Use the service for any illegal activities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Abuse the service with excessive uploads or bandwidth usage</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Attempt to hack, exploit, or compromise the service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Use the service for commercial applications without explicit permission</span>
                  </li>
                </ul>

                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mt-6">
                  <p className="text-sm font-semibold text-red-300">
                    ⚠️ Violation of these terms may result in immediate account termination and deletion of all your data without notice.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Service Termination */}
          <section className="mb-12">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Service Termination</h2>
              <div className="space-y-4 text-gray-300">
                <p>The developer reserves the right to:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Suspend or terminate the service at any time without notice</li>
                  <li>Discontinue the project permanently</li>
                  <li>Delete all user data if the project is shut down</li>
                  <li>Change these terms at any time</li>
                </ul>
                <p className="text-sm bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                  <strong>If you cannot accept these terms, please do not use this service.</strong> Consider using enterprise solutions like AWS S3, Google Cloud Storage, or Cloudinary for production applications.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Questions?</h2>
              <p className="text-gray-300 mb-4">
                If you have questions about these terms, contact us at:
              </p>
              <a 
                href="mailto:support@devload.cloudcoderhub.in"
                className="text-cyan-400 hover:text-cyan-300 font-medium"
              >
                support@devload.cloudcoderhub.in
              </a>
            </div>
          </section>

          {/* Acknowledgment */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 sm:p-8 text-center">
            <p className="text-gray-300 mb-4">
              By using DevLoad, you acknowledge that you have read, understood, and agree to these terms.
            </p>
            <p className="text-sm text-gray-400">
              Last Updated: December 27, 2024
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;