import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  updateUserFullName,
  updateUserEmail,
  updateUserPassword,
  clearUpdateStatus
} from '../store/slices/bootstrapSlice';
import {
  FiUser, FiMail, FiCalendar, FiShield, FiTrash2,
  FiArrowRight, FiX, FiEdit2, FiSave, FiEye, FiEyeOff,
  FiCheck, FiAlertCircle
} from 'react-icons/fi';

const Profile = () => {
  const { profile, subscription, loading, error, updateLoading, updateError, updateSuccess } = useSelector((state) => state.bootstrap);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accountdelete, makeAuthenticatedRequest } = useAuth();

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null); 
  const [deleteError, setDeleteError] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({ ...prev, fullname: profile.name }));
    }
    if (subscription) {
      setFormData(prev => ({ ...prev, email: subscription.email }));
    }
  }, [profile, subscription]);

  useEffect(() => {
    if (updateSuccess) {
      setShowEditModal(null);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setValidationError('');

      
      const timer = setTimeout(() => {
        dispatch(clearUpdateStatus());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, dispatch]);

  useEffect(() => {
    if (deleteError) {
      const timer = setTimeout(() => setDeleteError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [deleteError]);

  const handleDeleteAccount = async () => {
    try {
      await accountdelete();
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete account. Please try again.');
    }
  };

  const handleEditClick = (type) => {
    setShowEditModal(type);
    setValidationError('');
    dispatch(clearUpdateStatus());
  };

  const handleCloseModal = () => {
    setShowEditModal(null);
    setValidationError('');
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    dispatch(clearUpdateStatus());
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
  };

  const handleUpdateFullName = async () => {
    if (!formData.fullname.trim()) {
      setValidationError('Full name cannot be empty');
      return;
    }
    if (formData.fullname.trim().length < 2) {
      setValidationError('Full name must be at least 2 characters');
      return;
    }

    await dispatch(updateUserFullName({
      fullname: formData.fullname.trim(),
      makeAuthenticatedRequest
    }));
  };

  const handleUpdateEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    await dispatch(updateUserEmail({
      email: formData.email.trim(),
      makeAuthenticatedRequest
    }));
  };

  const handleUpdatePassword = async () => {
    if (!formData.currentPassword) {
      setValidationError('Current password is required');
      return;
    }
    if (formData.newPassword.length < 8) {
      setValidationError('New password must be at least 8 characters');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setValidationError('New passwords do not match');
      return;
    }
    if (formData.currentPassword === formData.newPassword) {
      setValidationError('New password must be different from current password');
      return;
    }

    await dispatch(updateUserPassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      makeAuthenticatedRequest
    }));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8 border-b border-gray-700">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">Profile</h1>
            <p className="text-gray-400 text-xs sm:text-sm">Your account information</p>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-800/50 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border border-gray-700">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3">
                    <div className="h-8 sm:h-10 w-8 sm:w-10 bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="h-3 sm:h-4 w-24 sm:w-32 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="h-5 sm:h-6 w-20 sm:w-24 bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-2 sm:px-4 py-8 sm:py-12">
        <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-red-700 text-center">
          <div className="bg-red-900/30 p-3 sm:p-4 rounded-lg sm:rounded-xl mb-4 sm:mb-6 flex flex-col items-center">
            <FiX className="text-red-400 text-xl sm:text-2xl md:text-3xl mb-2" />
            <h2 className="text-white text-lg sm:text-xl md:text-2xl font-semibold">Profile Error</h2>
            <p className="text-gray-300 mt-1 sm:mt-2 text-xs sm:text-sm">Failed to load profile information</p>
            <p className="text-red-300 mt-1 text-xs sm:text-sm">Error: {error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base font-medium rounded-lg transition-all shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile && !subscription) return null;

  const { email, plan } = subscription;
  const { name, createdAt } = profile;
  const joinDate = createdAt ? new Date(createdAt).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : 'N/A';

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      
      {updateSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3">
            <div className="bg-white/20 p-1 rounded-full">
              <FiCheck className="text-lg" />
            </div>
            <span className="font-medium">Profile updated successfully!</span>
          </div>
        </div>
      )}

      
      {deleteError && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-red-600 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3">
            <FiX className="text-lg" />
            <span>{deleteError}</span>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 md:p-8 border-b border-gray-700 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-xl">
              <FiUser className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">Profile Settings</h1>
              <p className="text-gray-400 text-xs sm:text-sm">Manage your account information and security</p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-900/30 p-2 rounded-lg">
                    <FiUser className="text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Full Name</p>
                    <p className="text-white font-semibold text-lg">{name}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEditClick('name')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 hover:bg-indigo-700 p-2 rounded-lg"
                >
                  <FiEdit2 className="text-white" />
                </button>
              </div>
            </div>

            
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-900/30 p-2 rounded-lg">
                    <FiMail className="text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-semibold text-lg break-all">{email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEditClick('email')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 hover:bg-indigo-700 p-2 rounded-lg"
                >
                  <FiEdit2 className="text-white" />
                </button>
              </div>
            </div>

            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-900/30 p-2 rounded-lg">
                  <FiCalendar className="text-indigo-400 text-xl" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Member Since</p>
                  <p className="text-white font-semibold text-lg">{joinDate}</p>
                </div>
              </div>
            </div>

            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-900/30 p-2 rounded-lg">
                    <FiShield className="text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Current Plan</p>
                    <p className={`font-semibold text-lg ${plan === 'free' ? 'text-gray-300' : 'text-indigo-400'
                      }`}>
                      {plan.charAt(0).toUpperCase() + plan.slice(1)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/subscription')}
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm"
                >
                  View <FiArrowRight />
                </button>
              </div>
            </div>
          </div>

          
          <div className="border-t border-gray-700 pt-6 sm:pt-8 mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FiShield className="text-indigo-400" />
              Security Settings
            </h2>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-900/30 p-2 rounded-lg">
                    <FiShield className="text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Password</p>
                    <p className="text-white font-medium">••••••••</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEditClick('password')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-all flex items-center gap-2"
                >
                  <FiEdit2 />
                  Change Password
                </button>
              </div>
            </div>
          </div>

          
          <div className="border-t border-red-700/50 pt-6 sm:pt-8">
            <h2 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
              <FiAlertCircle />
              Danger Zone
            </h2>
            <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 p-4 rounded-xl border border-red-700/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-red-900/30 p-2 rounded-lg">
                    <FiTrash2 className="text-red-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-red-300 text-sm">Delete Account</p>
                    <p className="text-red-100 font-medium">
                      Permanently remove your account and all data
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-medium rounded-lg transition-all shadow-lg"
                >
                  <FiTrash2 />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 max-w-md w-full overflow-hidden shadow-2xl animate-scale-in">
            
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FiEdit2 className="text-indigo-400" />
                  {showEditModal === 'name' && 'Edit Full Name'}
                  {showEditModal === 'email' && 'Edit Email Address'}
                  {showEditModal === 'password' && 'Change Password'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded-lg"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>

            
            <div className="p-6 space-y-4">
              
              {(updateError || validationError) && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-start gap-2">
                  <FiAlertCircle className="text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-red-400 text-sm">{updateError || validationError}</span>
                </div>
              )}

              
              {showEditModal === 'name' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      disabled={updateLoading}
                    />
                  </div>
                </div>
              )}

              
              {showEditModal === 'email' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      disabled={updateLoading}
                    />
                  </div>
                </div>
              )}

              
              {showEditModal === 'password' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all pr-12"
                        disabled={updateLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPasswords.current ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all pr-12"
                        disabled={updateLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all pr-12"
                        disabled={updateLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all"
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (showEditModal === 'name') handleUpdateFullName();
                    else if (showEditModal === 'email') handleUpdateEmail();
                    else if (showEditModal === 'password') handleUpdatePassword();
                  }}
                  disabled={updateLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updateLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-red-700 max-w-md w-full overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-red-700/50 bg-gradient-to-r from-red-900/20 to-red-800/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FiTrash2 className="text-red-500" />
                  Confirm Account Deletion
                </h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded-lg"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
              <div className="flex items-start gap-3 p-4 bg-red-900/20 rounded-lg border border-red-700/50">
                <FiAlertCircle className="text-red-400 text-xl mt-0.5 flex-shrink-0" />
                <p className="text-red-100 text-sm">
                  This will permanently delete your account and all associated data.
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="p-6">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <FiTrash2 />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { 
            opacity: 0; 
            transform: scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        @keyframes slide-in {
          from { 
            opacity: 0; 
            transform: translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Profile;