import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { 
  FaKey, FaEye, FaEyeSlash, FaCopy, FaShieldAlt, FaLock, 
  FaInfoCircle, FaPlus, FaTrash, FaHistory, FaSyncAlt 
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { BaseUrl } from '../api/ApiUrl';

const ProjectApiKey = () => {
  const { id: projectid } = useParams();
  const { makeAuthenticatedRequest } = useAuth();
  const { subscription } = useSelector((state) => state.bootstrap);
  const isMember = subscription?.plan === 'member';
  const maxKeys = isMember ? 5 : 1;

  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSecrets, setShowSecrets] = useState({});
  const [copyStatus, setCopyStatus] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('keys');
  const [cooldowns, setCooldowns] = useState({});

  
  useEffect(() => {
    const storedCooldowns = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('lastRotation_')) {
        const keyId = key.split('_')[1];
        const lastRotationTime = parseInt(localStorage.getItem(key));
        const currentTime = Date.now();
        const cooldownPeriod = 10 * 1000; 
        const timeLeft = cooldownPeriod - (currentTime - lastRotationTime);
        
        if (timeLeft > 0) {
          storedCooldowns[keyId] = Math.ceil(timeLeft / 1000);
        } else {
          localStorage.removeItem(key); 
        }
      }
    }
    setCooldowns(storedCooldowns);
  }, []);

  
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        setLoading(true);
        const response = await makeAuthenticatedRequest(
          `${BaseUrl}/project/${projectid}/api-keys`,
          { method: 'GET' }
        );
        setApiKeys(response.data.apiKeys || []);
      } catch (error) {
        toast.error('Failed to load API keys');
      } finally {
        setLoading(false);
      }
    };
    fetchApiKeys();
  }, [projectid]);

  
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldowns(prev => {
        const newCooldowns = { ...prev };
        let hasActiveCooldown = false;
        
        Object.keys(newCooldowns).forEach(keyId => {
          newCooldowns[keyId] -= 1;
          if (newCooldowns[keyId] > 0) {
            hasActiveCooldown = true;
          } else {
            
            localStorage.removeItem(`lastRotation_${keyId}`);
            delete newCooldowns[keyId];
          }
        });
        
        return hasActiveCooldown ? newCooldowns : {};
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleSecret = (keyId) => {
    setShowSecrets(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const copyToClipboard = async (text, keyId, keyType) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(prev => ({ ...prev, [`${keyId}-${keyType}`]: true }));
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [`${keyId}-${keyType}`]: false }));
      }, 2000);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy key');
    }
  };

  const generateApiKey = async () => {
    if (apiKeys.length >= maxKeys) {
      toast.error(`Maximum of ${maxKeys} API key${maxKeys > 1 ? 's' : ''} reached`);
      return;
    }
    
    try {
      setIsGenerating(true);
      const response = await makeAuthenticatedRequest(
        `${BaseUrl}/project/${projectid}/api-keys`,
        { method: 'POST' }
      );
      setApiKeys(prev => [...prev, response.data]);
      toast.success('API key generated!');
    } catch (error) {
      toast.error('Failed to generate API key');
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteApiKey = async (secretKey, keyId) => {
    try {
      await makeAuthenticatedRequest(
        `${BaseUrl}/project/${projectid}/api-keys`,
        {
          method: 'DELETE',
          data: { secretKey }
        }
      );
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
      setDeleteConfirm(null);
      // Clear cooldown timer for deleted key
      localStorage.removeItem(`lastRotation_${keyId}`);
      setCooldowns(prev => {
        const newCooldowns = { ...prev };
        delete newCooldowns[keyId];
        return newCooldowns;
      });
      toast.success('API key deleted');
    } catch (error) {
      toast.error('Failed to delete API key');
    }
  };

  const maskSecretKey = (key, isShown) => {
    if (!key) return '';
    return isShown ? key : `${key.slice(0, 6)}••••••••••••${key.slice(-6)}`;
  };

  const rotateKey = async (keyId) => {
    try {
      const lastRotationKey = `lastRotation_${keyId}`;
      const lastRotationTime = localStorage.getItem(lastRotationKey);
      const currentTime = Date.now();
      const cooldownPeriod = 10 * 1000;

      if (lastRotationTime && currentTime - parseInt(lastRotationTime) < cooldownPeriod) {
        return; 
      }

      const keyToRotate = apiKeys.find(key => key.id === keyId);
      if (!keyToRotate) {
        toast.error('Key not found');
        return;
      }

      const response = await makeAuthenticatedRequest(
        `${BaseUrl}/project/${projectid}/api-keys/rotate`,
        {
          method: 'POST',
          data: { secretKey: keyToRotate.secretKey }
        }
      );

      setApiKeys(prev =>
        prev.map(key =>
          key.id === keyId ? response.data : key
        )
      );

      
      localStorage.setItem(lastRotationKey, currentTime.toString());
      setCooldowns(prev => ({ ...prev, [keyId]: 10 }));
      toast.success('API key Renew successfully!');
    } catch (error) {
      toast.error('Failed to Renew key');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-900/20 mb-4">
              <div className="w-8 h-8 border-2 border-gray-400 border-t-gray-200 rounded-full animate-spin"></div>
            </div>
            <div className="h-8 w-64 bg-gray-700 rounded-xl mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 w-56 bg-gray-700 rounded mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[1, 2].map(i => (
              <div key={i} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                <div className="h-7 w-40 bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
                <div className="h-4 w-64 bg-gray-700 rounded mb-6 animate-pulse"></div>
                <div className="bg-gray-700/50 px-4 py-5 rounded-xl animate-pulse"></div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
            <div className="flex justify-between mb-6">
              <div className="h-8 w-32 bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="h-10 w-40 bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
            
            {[1, 2].map(i => (
              <div key={i} className="mb-6 p-5 bg-gray-800 rounded-xl border border-gray-700">
                <div className="flex justify-between mb-4">
                  <div className="h-6 w-24 bg-gray-700 rounded animate-pulse"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="h-5 w-full bg-gray-700 rounded mb-3 animate-pulse"></div>
                <div className="h-5 w-3/4 bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-4 sm:py-8 px-2 sm:px-4">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        
        <div className="text-center mb-6 sm:mb-12">
          <motion.div 
            className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg mb-3 sm:mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <FaKey className="text-white text-xl sm:text-2xl" />
          </motion.div>
          <h1 className="text-xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">API Key Management</h1>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-md sm:max-w-lg mx-auto">
            Securely manage your project's API credentials. 
            <span className="ml-1 px-2 py-0.5 sm:py-1 bg-gray-800 text-xs rounded-full">
              {isMember ? 'Member' : 'Free'} Plan: {maxKeys} Key{maxKeys > 1 ? 's' : ''} Max
            </span>
          </p>
        </div>

       
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700 p-4 sm:p-6 transition-all hover:border-blue-500/30">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-900/30 flex items-center justify-center">
                <FaKey className="text-blue-400 text-sm sm:text-base" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white">Project ID</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">Use this ID for package integrations</p>
            <div className="bg-gray-700/50 px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl flex items-center justify-between gap-3">
              <span className="text-white font-mono text-xs sm:text-sm break-all">{projectid}</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(projectid, 'projectid', 'projectid')}
                className="bg-blue-600 hover:bg-blue-700 px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm text-white rounded flex items-center gap-1 min-w-[60px] sm:min-w-[80px]"
              >
                <FaCopy className="text-xs" />
                {copyStatus['projectid-projectid'] ? 'Copied!' : 'Copy'}
              </motion.button>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-900/30 flex items-center justify-center">
                <FaLock className="text-purple-400 text-sm sm:text-base" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white">Key Summary</h3>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-white">{apiKeys.length}</p>
                <p className="text-xs sm:text-sm text-gray-400">Active Keys</p>
              </div>
              <div className="text-right">
                <p className="text-xl sm:text-2xl font-bold text-white">{maxKeys}</p>
                <p className="text-xs sm:text-sm text-gray-400">Max Allowed</p>
              </div>
            </div>
          </div>
        </div>

        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-700 flex">
            <button
              className={`flex-1 py-3 sm:py-4 text-center text-xs sm:text-sm font-medium ${
                activeTab === 'keys' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('keys')}
            >
              API Keys
            </button>
            <button
              className={`flex-1 py-3 sm:py-4 text-center text-xs sm:text-sm font-medium ${
                activeTab === 'usage' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('usage')}
            >
              Usage Analytics
            </button>
          </div>

         
          <div className="p-3 sm:p-4 md:p-6">
            {activeTab === 'keys' ? (
              <>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
                  <h2 className="text-base sm:text-xl font-bold text-white">Manage API Keys</h2>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={generateApiKey}
                    disabled={apiKeys.length >= maxKeys || isGenerating}
                    className={`flex items-center justify-center gap-1 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm rounded-lg text-white font-medium ${
                      apiKeys.length >= maxKeys 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600'
                    } ${isGenerating ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {isGenerating ? (
                      <>
                        <FaSyncAlt className="animate-spin text-xs sm:text-sm" /> Generating...
                      </>
                    ) : (
                      <>
                        <FaPlus className="text-xs sm:text-sm" /> New API Key
                      </>
                    )}
                  </motion.button>
                </div>

                <AnimatePresence>
                  {apiKeys.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-6 sm:py-12"
                    >
                      <div className="bg-gray-800/50 border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-8 max-w-md mx-auto">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-gray-800 flex items-center justify-center mb-3 sm:mb-4">
                          <FaKey className="text-gray-500 text-lg sm:text-2xl" />
                        </div>
                        <h3 className="text-base sm:text-xl font-semibold text-gray-300 mb-1 sm:mb-2">No API Keys Found</h3>
                        <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">Generate your first API key to get started</p>
                        <button
                          onClick={generateApiKey}
                          className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 text-xs sm:text-sm rounded-lg"
                        >
                          Generate API Key
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {apiKeys.map((key) => (
                        <motion.div
                          key={key.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 p-3 sm:p-5"
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2">
                            <div>
                              <h3 className="font-medium sm:font-semibold text-white flex items-center gap-1 text-sm sm:text-base">
                                <FaLock className="text-purple-400 text-xs sm:text-sm" /> 
                                API Key
                                <span className="text-[10px] sm:text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded ml-1">
                                  Active
                                </span>
                              </h3>
                              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                                Created: {new Date(key.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-1 sm:gap-2">
                              <motion.button
                                whileHover={{ scale: cooldowns[key.id] ? 1 : 1.05 }}
                                whileTap={{ scale: cooldowns[key.id] ? 1 : 0.95 }}
                                onClick={() => rotateKey(key.id)}
                                disabled={!!cooldowns[key.id]}
                                className={`text-xs sm:text-sm flex items-center gap-1 ${
                                  cooldowns[key.id] 
                                    ? 'text-gray-600 cursor-not-allowed' 
                                    : 'text-gray-400 hover:text-blue-400'
                                }`}
                              >
                                <FaSyncAlt className="text-xs sm:text-sm" /> {cooldowns[key.id] ? `(${cooldowns[key.id]}s)` : 'Renew'}
                              </motion.button>
                            </div>
                          </div>

                          <div className="mb-3 sm:mb-4">
                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                              <label className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide">Secret Key</label>
                              <div className="flex gap-1">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => toggleSecret(key.id)}
                                  className="text-gray-400 hover:text-gray-300 text-xs sm:text-sm"
                                  title={showSecrets[key.id] ? "Hide Key" : "Show Key"}
                                >
                                  {showSecrets[key.id] ? <FaEyeSlash /> : <FaEye />}
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => copyToClipboard(key.secretKey, key.id, 'secret')}
                                  className="text-gray-400 hover:text-green-400 text-xs sm:text-sm"
                                  title="Copy Key"
                                >
                                  <FaCopy />
                                </motion.button>
                              </div>
                            </div>
                            <div className="bg-gray-900 px-3 py-2 sm:px-4 sm:py-3 rounded font-mono text-xs sm:text-sm break-all flex items-center overflow-x-auto">
                              <span className={showSecrets[key.id] ? "text-green-400" : "text-gray-400"}>
                                {maskSecretKey(key.secretKey, showSecrets[key.id])}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setDeleteConfirm(key.id)}
                              className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded border border-red-800/50"
                            >
                              <FaTrash className="text-xs sm:text-sm" /> Delete Key
                            </motion.button>
                          </div>

                          
                          {deleteConfirm === key.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-900/50 rounded border border-gray-700"
                            >
                              <div className="flex items-start gap-2 mb-2 sm:mb-3">
                                <FaShieldAlt className="text-yellow-400 mt-0.5 flex-shrink-0 text-sm" />
                                <p className="text-xs sm:text-sm text-yellow-100">
                                  Deleting this key will immediately revoke access. Any systems using this key will stop working. Are you sure?
                                </p>
                              </div>
                              <div className="flex justify-end gap-2 sm:gap-3">
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded border border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => deleteApiKey(key.secretKey, key.id)}
                                  className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-red-600 hover:bg-red-700 rounded text-white"
                                >
                                  Confirm Delete
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <div className="py-4 sm:py-8 text-center">
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-8 max-w-md mx-auto">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-gray-800 flex items-center justify-center mb-3 sm:mb-4">
                    <FaHistory className="text-gray-500 text-lg sm:text-2xl" />
                  </div>
                  <h3 className="text-base sm:text-xl font-semibold text-gray-300 mb-1 sm:mb-2">Usage Analytics</h3>
                  <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">Track your API key usage and monitor activity</p>
                  <button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 text-xs sm:text-sm rounded-lg">
                    Coming Soon
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 sm:mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700 p-4 sm:p-6"
        >
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-br from-blue-700 to-indigo-800 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaShieldAlt className="text-blue-200 text-sm sm:text-lg" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">API Security Best Practices</h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  'Never commit API keys to version control systems',
                  'Store keys in secure environment variables',
                  'Renew keys at least every 90 days',
                  'Monitor usage patterns for suspicious activity',
                  'Use key vault services for production environments'
                ].map((tip, i) => (
                  <li key={i} className="flex items-start">
                    <div className="bg-blue-900/30 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full"></div>
                    </div>
                    <span className="text-gray-300 text-xs sm:text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProjectApiKey;