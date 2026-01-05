import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FaUpload, FaDatabase, FaCogs, FaExchangeAlt, FaChartLine, 
  FaServer, FaRocket, FaCompressArrowsAlt, FaSave, FaNetworkWired 
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { BaseUrl } from '../api/ApiUrl';


const SkeletonLoader = ({ className = "" }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-700/40 to-gray-600/40 rounded-lg ${className}`}></div>
);


const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="relative w-6 h-6">
      <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full"></div>
      <div className="absolute inset-0 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);


const StatCard = ({ icon, label, value, subtext, color = 'blue', animationDelay = 0, loading, trend }) => {
  const colorSchemes = {
    blue: {
      bg: 'from-blue-500/10 to-blue-600/5',
      border: 'border-blue-500/20 hover:border-blue-500/40',
      iconBg: 'bg-blue-500/10',
      textGradient: 'from-blue-400 to-cyan-400',
      icon: 'text-blue-400'
    },
    purple: {
      bg: 'from-purple-500/10 to-purple-600/5',
      border: 'border-purple-500/20 hover:border-purple-500/40',
      iconBg: 'bg-purple-500/10',
      textGradient: 'from-purple-400 to-pink-400',
      icon: 'text-purple-400'
    },
    pink: {
      bg: 'from-pink-500/10 to-rose-600/5',
      border: 'border-pink-500/20 hover:border-pink-500/40',
      iconBg: 'bg-pink-500/10',
      textGradient: 'from-pink-400 to-rose-400',
      icon: 'text-pink-400'
    },
    green: {
      bg: 'from-emerald-500/10 to-green-600/5',
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10',
      textGradient: 'from-emerald-400 to-green-400',
      icon: 'text-emerald-400'
    },
    orange: {
      bg: 'from-orange-500/10 to-amber-600/5',
      border: 'border-orange-500/20 hover:border-orange-500/40',
      iconBg: 'bg-orange-500/10',
      textGradient: 'from-orange-400 to-amber-400',
      icon: 'text-orange-400'
    },
    cyan: {
      bg: 'from-cyan-500/10 to-teal-600/5',
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10',
      textGradient: 'from-cyan-400 to-teal-400',
      icon: 'text-cyan-400'
    }
  };

  const scheme = colorSchemes[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay, duration: 0.5 }}
      className={`bg-gradient-to-br ${scheme.bg} backdrop-blur-sm border ${scheme.border} rounded-2xl p-5 group hover:shadow-lg hover:shadow-${color}-500/10 transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-xl ${scheme.iconBg} group-hover:scale-110 transition-transform duration-300`}>
          {React.cloneElement(icon, { className: `${scheme.icon} text-2xl` })}
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            trend > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      
      <h3 className="text-gray-400 text-sm font-medium mb-2">{label}</h3>
      <div className={`text-3xl font-bold bg-gradient-to-r ${scheme.textGradient} bg-clip-text text-transparent mb-1`}>
        {loading ? <LoadingSpinner /> : value}
      </div>
      {subtext && (
        <p className="text-gray-500 text-xs mt-1">
          {loading ? <SkeletonLoader className="w-24 h-3" /> : subtext}
        </p>
      )}
    </motion.div>
  );
};


const StorageCard = ({ storageUsed, maxStorage, storageProcessing, animationDelay, loading }) => {
  const usedMB = (storageUsed / (1024 * 1024)).toFixed(2);
  const maxMB = (maxStorage / (1024 * 1024)).toFixed(0);
  const processingMB = (storageProcessing / (1024 * 1024)).toFixed(2);
  const storagePercent = Math.min(100, ((storageUsed / maxStorage) * 100).toFixed(2));
  
  const getStorageColor = () => {
    if (storagePercent >= 90) return 'from-red-500 to-orange-500';
    if (storagePercent >= 70) return 'from-yellow-500 to-orange-500';
    return 'from-emerald-500 to-green-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay, duration: 0.5 }}
      className="bg-gradient-to-br from-emerald-500/10 to-green-600/5 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl p-5 group hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 group-hover:scale-110 transition-transform duration-300">
            <FaDatabase className="text-emerald-400 text-2xl" />
          </div>
          <div>
            <h3 className="text-gray-400 text-sm font-medium">Storage Used</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              {loading ? <LoadingSpinner /> : `${usedMB} MB`}
            </p>
          </div>
        </div>
      </div>
      
      
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>0 MB</span>
          <span>{loading ? <SkeletonLoader className="w-16 h-3 inline-block" /> : `${maxMB} MB`}</span>
        </div>
        <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden relative">
          {loading ? (
            <SkeletonLoader className="w-full h-full" />
          ) : (
            <>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${storagePercent}%` }}
                transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
                className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getStorageColor()} rounded-full shadow-lg`}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            </>
          )}
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-gray-400 text-xs">
            {loading ? <SkeletonLoader className="w-20 h-3 inline-block" /> : `${storagePercent}% used`}
          </p>
          {processingMB > 0 && (
            <p className="text-yellow-400 text-xs">
              {loading ? <SkeletonLoader className="w-24 h-3 inline-block" /> : `${processingMB} MB processing`}
            </p>
          )}
        </div>
      </div>

      
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-emerald-500/10">
        <div className="bg-gray-800/30 rounded-lg p-2">
          <p className="text-gray-500 text-xs">Available</p>
          <p className="text-emerald-400 text-sm font-semibold">
            {loading ? <SkeletonLoader className="w-16 h-3" /> : `${(maxMB - usedMB).toFixed(2)} MB`}
          </p>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-2">
          <p className="text-gray-500 text-xs">Max Limit</p>
          <p className="text-gray-300 text-sm font-semibold">
            {loading ? <SkeletonLoader className="w-16 h-3" /> : `${maxMB} MB`}
          </p>
        </div>
      </div>
    </motion.div>
  );
};


const OptimizationCard = ({ data, animationDelay, loading }) => {
  const savedPercentage = data.optimisedRawBytes > 0 
    ? ((data.savedStorage / data.optimisedRawBytes) * 100).toFixed(1)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay, duration: 0.5 }}
      className="bg-gradient-to-br from-violet-500/10 to-purple-600/5 backdrop-blur-sm border border-violet-500/20 hover:border-violet-500/40 rounded-2xl p-5 group hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-violet-500/10 group-hover:scale-110 transition-transform duration-300">
          <FaCompressArrowsAlt className="text-violet-400 text-2xl" />
        </div>
        <div>
          <h3 className="text-gray-400 text-sm font-medium">Optimization Stats</h3>
          <p className="text-xs text-gray-500">File compression efficiency</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800/30 rounded-xl p-3">
          <p className="text-gray-500 text-xs mb-1">Optimized Files</p>
          <p className="text-2xl font-bold text-violet-400">
            {loading ? <LoadingSpinner /> : data.totaloptimisedfile}
          </p>
        </div>
        <div className="bg-gray-800/30 rounded-xl p-3">
          <p className="text-gray-500 text-xs mb-1">Storage Saved</p>
          <p className="text-2xl font-bold text-green-400">
            {loading ? <LoadingSpinner /> : `${(data.savedStorage / (1024 * 1024)).toFixed(2)} MB`}
          </p>
        </div>
      </div>

      
      <div className="mt-4 pt-4 border-t border-violet-500/10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-xs">Compression Rate</span>
          <span className="text-green-400 text-sm font-semibold">
            {loading ? <SkeletonLoader className="w-12 h-3 inline-block" /> : `${savedPercentage}%`}
          </span>
        </div>
        <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
          {loading ? (
            <SkeletonLoader className="w-full h-full" />
          ) : (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${savedPercentage}%` }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ProjectAnalytics = () => {
  const { makeAuthenticatedRequest } = useAuth();
  const { id: projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState({
    totalUploads: 0,
    storageUsed: 0,
    projectstoragelimit: 0,
    storageProcessing: 0,
    requestsUsed: 0,
    trafficused: 0,
    totaloptimisedfile: 0,
    optimisedRawBytes: 0,
    optimisedFinalBytes: 0,
    savedStorage: 0,
    maxfilesize: 0,
    projectname: 'Loading...'
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await makeAuthenticatedRequest(
          `${BaseUrl}/project/${projectId}/analytics`,
          { method: 'GET' }
        );
        setProjectData(res.data.analytics);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [projectId, makeAuthenticatedRequest]);

  const formatBytes = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 py-6 px-4">
      
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl animate-pulse animation-delay-4000" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 mb-4 backdrop-blur-sm border border-blue-500/20">
            <FaChartLine className="text-blue-400 text-3xl" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Project Analytics
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Monitor your project's performance, resource usage, and optimization metrics in real-time
          </p>
        </motion.div>

        
        <motion.div
          className="bg-gradient-to-r from-gray-800/40 to-gray-800/20 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FaServer className="text-blue-400 text-xl" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Project Name</p>
                <p className="text-white font-semibold">{loading ? 'Loading...' : projectData.projectname}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-700/30 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300 text-xs font-mono">ID: {projectId.slice(0, 8)}...</span>
            </div>
          </div>
        </motion.div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<FaUpload />}
            label="Total Uploads"
            value={projectData.totalUploads.toLocaleString()}
            subtext="Files uploaded"
            color="blue"
            animationDelay={0.3}
            loading={loading}
            trend={12}
          />

          <StatCard
            icon={<FaCogs />}
            label="Operations Used"
            value={projectData.requestsUsed.toLocaleString()}
            subtext="API requests made"
            color="purple"
            animationDelay={0.4}
            loading={loading}
          />

          <StatCard
            icon={<FaNetworkWired />}
            label="Traffic Used"
            value={`${formatBytes(projectData.trafficused)} MB`}
            subtext="Bandwidth consumed"
            color="pink"
            animationDelay={0.5}
            loading={loading}
          />
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StorageCard 
            storageUsed={projectData.storageUsed}
            maxStorage={projectData.projectstoragelimit}
            storageProcessing={projectData.storageProcessing}
            animationDelay={0.6}
            loading={loading}
          />

          <OptimizationCard
            data={projectData}
            animationDelay={0.7}
            loading={loading}
          />
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<FaRocket />}
            label="Max File Size"
            value={`${formatBytes(projectData.maxfilesize)} MB`}
            subtext="Upload limit per file"
            color="orange"
            animationDelay={0.8}
            loading={loading}
          />

          <StatCard
            icon={<FaSave />}
            label="Total Saved"
            value={`${formatBytes(projectData.savedStorage)} MB`}
            subtext="Through optimization"
            color="green"
            animationDelay={0.9}
            loading={loading}
          />

          <StatCard
            icon={<FaCompressArrowsAlt />}
            label="Compression Ratio"
            value={projectData.optimisedRawBytes > 0 
              ? `${((projectData.savedStorage / projectData.optimisedRawBytes) * 100).toFixed(1)}%`
              : '0%'}
            subtext="Average savings"
            color="cyan"
            animationDelay={1.0}
            loading={loading}
          />
        </div>

        
        <motion.div
          className="bg-gradient-to-br from-indigo-500/10 to-purple-600/5 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-indigo-500/10">
              <FaChartLine className="text-indigo-400 text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Performance Insights</h2>
              <p className="text-gray-400 text-sm">Key metrics and recommendations</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Storage Efficiency</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  ((projectData.storageUsed / projectData.projectstoragelimit) * 100) < 70 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {loading ? <SkeletonLoader className="w-12 h-3" /> : 
                    ((projectData.storageUsed / projectData.projectstoragelimit) * 100) < 70 ? 'Good' : 'Monitor'
                  }
                </span>
              </div>
              <p className="text-gray-500 text-xs">
                {loading ? <SkeletonLoader className="w-full h-3" /> :
                  `You're using ${((projectData.storageUsed / projectData.projectstoragelimit) * 100).toFixed(1)}% of your storage quota`
                }
              </p>
            </div>

            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Optimization Rate</span>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                  {loading ? <SkeletonLoader className="w-12 h-3" /> : 
                    projectData.totalUploads > 0 
                      ? `${((projectData.totaloptimisedfile / projectData.totalUploads) * 100).toFixed(0)}%`
                      : '0%'
                  }
                </span>
              </div>
              <p className="text-gray-500 text-xs">
                {loading ? <SkeletonLoader className="w-full h-3" /> :
                  `${projectData.totaloptimisedfile} out of ${projectData.totalUploads} files optimized`
                }
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ProjectAnalytics;