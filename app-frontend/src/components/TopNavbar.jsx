import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from './SidebarContext';
import { useAuth } from '../context/AuthContext';

const TopNavbar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getSectionName = () => {
    
    if (location.pathname.startsWith('/project')) {
      const projectId = location.pathname.split('/')[2];
      if (location.pathname === `/project/${projectId}`) return 'Getting Started';
      if (location.pathname === `/project/${projectId}/files`) return 'Files';
      if (location.pathname === `/project/${projectId}/analytics`) return 'Analytics';
      if (location.pathname === `/project/${projectId}/settings`) return 'Settings';
      if (location.pathname === `/project/${projectId}/apikeys`) return 'ApiKeys';
    }
    
    if (location.pathname === '/') return 'Workspace';
    if (location.pathname === '/subscription') return 'Subscription';
    if (location.pathname === '/profile') return 'Profile';
    if (location.pathname === '/stats') return 'Stats';
    return '';
  };

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-700 md:left-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              />
            </svg>
          </button>

          
          <div className="flex-1 flex justify-center md:justify-start truncate px-2">
            <h1 className="text-lg md:text-2xl font-semibold text-white tracking-wide truncate">
              {getSectionName()}
            </h1>
          </div>

         
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-all"
            >
              P
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-50 text-sm">
                <Link
                  to="/"
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-indigo-400"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Workspace
                </Link>
                <Link
                  to="/subscription"
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-indigo-400"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Subscription
                </Link>
                <Link
                  to="/profile"
                  className={`block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-indigo-400 ${
                    location.pathname === '/profile' ? 'bg-indigo-600 text-white' : ''
                  }`}
                  onClick={() => setIsProfileOpen(false)}
                >
                  Profile
                </Link>
                <hr className="border-t border-gray-600 my-1" />
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-red-700 hover:text-white"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;