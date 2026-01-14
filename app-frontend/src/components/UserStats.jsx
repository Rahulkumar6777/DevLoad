import React, { useEffect, useState } from 'react';
import { Search, TrendingUp, HardDrive, Zap, FolderOpen, Filter, CheckCircle, XCircle, Image, Music, Film, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BaseUrl } from '../api/ApiUrl';

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0 || !bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const formatNumber = (num) => {
  if (!num) return '0';
  return new Intl.NumberFormat().format(num);
};

const calculatePercentage = (used, total) => {
  if (!total || total === 0) return 0;
  return Math.min(100, Math.round((used / total) * 100));
};

// Skeleton Components
const StatCardSkeleton = () => (
  <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20"></div>
    <div className="space-y-4 animate-pulse">
      <div className="h-4 w-24 bg-slate-700/50 rounded"></div>
      <div className="h-8 w-32 bg-slate-700/50 rounded"></div>
      <div className="space-y-2">
        <div className="h-2 bg-slate-700/30 rounded-full overflow-hidden">
          <div className="h-full w-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-slate-700/50 rounded"></div>
          <div className="h-3 w-20 bg-slate-700/50 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

const ProjectCardSkeleton = () => (
  <div className="relative bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-700/30 p-6 overflow-hidden">
    <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500/30 to-transparent"></div>
    <div className="space-y-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div className="h-6 w-48 bg-slate-700/50 rounded"></div>
          <div className="h-4 w-64 bg-slate-700/30 rounded"></div>
        </div>
        <div className="h-7 w-20 bg-slate-700/50 rounded-full"></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-20 bg-slate-700/50 rounded"></div>
            <div className="h-5 w-24 bg-slate-700/50 rounded"></div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-slate-700/50 rounded-lg"></div>
        <div className="h-6 w-16 bg-slate-700/50 rounded-lg"></div>
      </div>
    </div>
  </div>
);

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { makeAuthenticatedRequest } = useAuth();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await makeAuthenticatedRequest(`${BaseUrl}/stats`, {
        method: 'GET',
      });

      if (!response.data) {
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }

      setDashboardData(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const filteredProjects = dashboardData?.projectStats?.filter(project => {
    const matchesSearch = project.projectname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && project.isActive === 'active') ||
      (statusFilter === 'inactive' && project.isActive !== 'active');
    return matchesSearch && matchesStatus;
  }) || [];

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-red-500/20 p-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-100">Error Loading Dashboard</h2>
              <p className="text-slate-400">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userStats = dashboardData?.userStats || {};
  const projects = dashboardData?.projectStats || [];

  const totalSavedStorage = projects.reduce((sum, project) => sum + (project.savedStorage || 0), 0);
  const storagePercentage = calculatePercentage(userStats.storageUsed, userStats.maxStorage);
  const requestsPercentage = calculatePercentage(userStats.requestsUsed, userStats.maxRequests);
  const projectsPercentage = calculatePercentage(userStats.currentProject, userStats.totalProject);

  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return 'from-red-500 to-orange-500';
    if (percentage >= 70) return 'from-orange-500 to-yellow-500';
    return 'from-indigo-500 to-purple-500';
  };

  const getTextColor = (percentage) => {
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 70) return 'text-orange-400';
    return 'text-indigo-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl border border-indigo-500/20 p-8 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                <TrendingUp className="w-6 h-6 text-indigo-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
            </div>
            <p className="text-slate-400 text-lg">Real-time statistics and project analytics</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              {/* Storage Card */}
              <div className="group relative bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <HardDrive className="w-5 h-5 text-indigo-400" />
                  </div>
                  <span className={`text-sm font-semibold ${getTextColor(storagePercentage)}`}>
                    {storagePercentage}%
                  </span>
                </div>
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Storage Usage</h3>
                <div className="text-2xl font-bold text-slate-100 mb-1">
                  {loading ? '...' : formatBytes(userStats.storageUsed)}
                </div>
                <p className="text-xs text-slate-500 mb-4">of {formatBytes(userStats.maxStorage)}</p>
                <div className="space-y-2">
                  <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getPercentageColor(storagePercentage)} transition-all duration-1000 ease-out relative`}
                      style={{ width: `${storagePercentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{formatBytes(userStats.maxStorage - userStats.storageUsed)} available</span>
                  </div>
                </div>
              </div>

              {/* Requests Card */}
              <div className="group relative bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Zap className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className={`text-sm font-semibold ${getTextColor(requestsPercentage)}`}>
                    {requestsPercentage}%
                  </span>
                </div>
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Requests Usage</h3>
                <div className="text-2xl font-bold text-slate-100 mb-1">
                  {formatNumber(userStats.requestsUsed)}
                </div>
                <p className="text-xs text-slate-500 mb-4">of {formatNumber(userStats.maxRequests)}</p>
                <div className="space-y-2">
                  <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getPercentageColor(requestsPercentage)} transition-all duration-1000 ease-out relative`}
                      style={{ width: `${requestsPercentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{formatNumber(userStats.maxRequests - userStats.requestsUsed)} remaining</span>
                  </div>
                </div>
              </div>

              {/* Projects Card */}
              <div className="group relative bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 hover:-translate-y-1 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-rose-500"></div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-pink-500/10 rounded-lg">
                    <FolderOpen className="w-5 h-5 text-pink-400" />
                  </div>
                  <span className={`text-sm font-semibold ${getTextColor(projectsPercentage)}`}>
                    {projectsPercentage}%
                  </span>
                </div>
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Projects</h3>
                <div className="text-2xl font-bold text-slate-100 mb-1">
                  {userStats.currentProject || 0}
                </div>
                <p className="text-xs text-slate-500 mb-4">of {userStats.totalProject || 0} slots</p>
                <div className="space-y-2">
                  <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getPercentageColor(projectsPercentage)} transition-all duration-1000 ease-out relative`}
                      style={{ width: `${projectsPercentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{userStats.totalProject - userStats.currentProject} available</span>
                  </div>
                </div>
              </div>

              {/* Saved Storage Card */}
              <div className="group relative bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl border border-emerald-500/20 p-6 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-semibold text-emerald-400">
                    Optimized
                  </span>
                </div>
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Total Saved</h3>
                <div className="text-2xl font-bold text-emerald-400 mb-1">
                  {formatBytes(totalSavedStorage)}
                </div>
                <p className="text-xs text-slate-500 mb-4">Across {projects.length} projects</p>
                <div className="flex items-center gap-2 text-xs text-emerald-400/80">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span>Space recovered</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Projects Section */}
        <div className="bg-slate-900/30 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-slate-100">
              Projects {!loading && `(${filteredProjects.length})`}
            </h2>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  statusFilter === 'all'
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                All Projects
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  statusFilter === 'active'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('inactive')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  statusFilter === 'inactive'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="space-y-4">
            {loading ? (
              <>
                <ProjectCardSkeleton />
                <ProjectCardSkeleton />
                <ProjectCardSkeleton />
              </>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-16 px-4 bg-slate-800/20 rounded-2xl border-2 border-dashed border-slate-700/50">
                <FolderOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-lg font-medium text-slate-400 mb-2">No projects found</p>
                <p className="text-sm text-slate-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredProjects.map((project, index) => {
                const projectStoragePercentage = calculatePercentage(project.storageUsed, project.projectstoragelimit);
                const isActive = project.isActive === 'active';

                return (
                  <div
                    key={project._id || index}
                    className="group relative bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-700/30 p-6 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:translate-x-1 overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-indigo-400 transition-colors">
                          {project.projectname || 'Unnamed Project'}
                        </h3>
                        {project.description && (
                          <p className="text-sm text-slate-400 line-clamp-2">{project.description}</p>
                        )}
                      </div>
                      <span className={`px-4 py-2 rounded-full text-xs font-semibold border whitespace-nowrap ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/10 text-red-400 border-red-500/30'
                      }`}>
                        {isActive ? (
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                            Inactive
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 font-medium">Storage Used</p>
                        <p className="text-lg font-bold text-slate-100">
                          {formatBytes(project.storageUsed)}
                        </p>
                        <p className={`text-xs font-semibold ${
                          projectStoragePercentage >= 90 ? 'text-red-400' :
                          projectStoragePercentage >= 70 ? 'text-orange-400' : 'text-slate-500'
                        }`}>
                          {projectStoragePercentage}% of limit
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 font-medium">Requests Used</p>
                        <p className="text-lg font-bold text-slate-100">
                          {formatNumber(project.requestsUsed)}
                        </p>
                        {project.maxRequests && (
                          <p className="text-xs text-slate-500">of {formatNumber(project.maxRequests)}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 font-medium">Files Optimized</p>
                        <p className="text-lg font-bold text-slate-100">
                          {formatNumber(project.totaloptimisedfile)}
                        </p>
                        <p className="text-xs text-slate-500">of {formatNumber(project.totalUploads)} total</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 font-medium">API Keys</p>
                        <p className="text-lg font-bold">
                          <span className={project.ownapikey >= project.maxapikey ? 'text-red-400' : 'text-indigo-400'}>
                            {project.ownapikey || 0}
                          </span>
                          <span className="text-slate-600 mx-1">/</span>
                          <span className="text-slate-400">{project.maxapikey || 0}</span>
                        </p>
                      </div>
                    </div>

                    {project.fileTypeAllowed && project.fileTypeAllowed.length > 0 && (
                      <div className="flex gap-2 flex-wrap pt-4 border-t border-slate-700/30">
                        {project.fileTypeAllowed.map((type, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs font-medium text-indigo-400 flex items-center gap-1.5"
                          >
                            {type === 'image' && <Image className="w-3.5 h-3.5" />}
                            {type === 'audio' && <Music className="w-3.5 h-3.5" />}
                            {type === 'video' && <Film className="w-3.5 h-3.5" />}
                            {type}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;