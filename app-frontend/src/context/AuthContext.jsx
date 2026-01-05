import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { BaseUrl } from '../api/ApiUrl';
import { useDispatch } from 'react-redux';
import { resetBootstrap } from '../store/slices/bootstrapSlice';
import { privateAppDomain } from '../api/PrivateAppDomain';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [recentLogin, setRecentLogin] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  
  const hasCheckedAuth = useRef(false);

  const isTokenNearExpiry = (token) => {
    if (!token) return true;
    try {
      const { exp } = jwtDecode(token);
      return exp * 1000 < Date.now() + 5 * 60 * 1000; 
    } catch {
      return true;
    }
  };

  const checkAuth = useCallback(async () => {
    if (recentLogin) {
      setIsLoading(false);
      setRecentLogin(false);
      setIsAuthReady(true);
      return;
    }

    setIsLoading(true);
    
    
    try {
      const response = await axios.get(`${BaseUrl}/auth/refresh-token`, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data.accessToken) {
        setIsAuthenticated(true);
        setAccessToken(response.data.accessToken);
        setIsAuthReady(true);
      } else {
        setIsAuthenticated(false);
        setAccessToken(null);
        dispatch(resetBootstrap());
        if (location.pathname !== '/login' && location.pathname !== '/signup') {
          navigate('/login', { replace: true, state: { from: location } });
        }
      }
    } catch (error) {
      console.error('Refresh token check failed:', error.message);
      setIsAuthenticated(false);
      setAccessToken(null);
      dispatch(resetBootstrap());
      if (location.pathname !== '/login' && location.pathname !== '/signup') {
        navigate('/login', { replace: true, state: { from: location } });
      }
    } finally {
      setIsLoading(false);
      setIsAuthReady(true);
    }
  }, [recentLogin, dispatch, location, navigate]);

  
  useEffect(() => {
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      checkAuth();
    }
  }, []); 

  useEffect(() => {
    if (accessToken && !isTokenNearExpiry(accessToken)) {
      const { exp } = jwtDecode(accessToken);
      const timeout = exp * 1000 - Date.now() - 5 * 60 * 1000;
      const timer = setTimeout(async () => {
        await refreshAccessToken();
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [accessToken]);

  const login = async (email, password) => {
    const response = await axios.post(
      `${BaseUrl}/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    if (response.status === 200 && response.data.accessToken) {
      setIsAuthenticated(true);
      setAccessToken(response.data.accessToken); 
      setRecentLogin(true);
      hasCheckedAuth.current = true; 
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } else {
      throw new Error(response.data?.message || response.data?.error || 'Login failed: No access token');
    }
  };

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await axios.get(`${BaseUrl}/auth/refresh-token`, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data.accessToken) {
        setIsAuthenticated(true);
        setAccessToken(response.data.accessToken);
        return response.data.accessToken;
      }
      throw new Error('Refresh failed');
    } catch (error) {
      console.error('Silent refresh failed:', error.message);
      setIsAuthenticated(false);
      setAccessToken(null);
      dispatch(resetBootstrap());
      if (location.pathname !== '/login' && location.pathname !== '/signup') {
        navigate('/login', { replace: true, state: { from: location } });
      }
      return null;
    }
  }, [navigate, location, dispatch]);

  const logout = async () => {
    let token = accessToken;
    try {
      await axios.post(
        `${BaseUrl}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setIsAuthenticated(false);
      dispatch(resetBootstrap());
      setAccessToken(null);
      hasCheckedAuth.current = false; 
      
      window.location.replace(privateAppDomain);
    } catch (error) {
      console.error('Logout failed:', error.message);
      
      setIsAuthenticated(false);
      dispatch(resetBootstrap());
      setAccessToken(null);
      hasCheckedAuth.current = false;
      window.location.replace(privateAppDomain);
    }
  };

  const accountdelete = async () => {
    let token = accessToken;
    try {
      await axios.delete(`${BaseUrl}delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setIsAuthenticated(false);
      dispatch(resetBootstrap());
      setAccessToken(null);
      hasCheckedAuth.current = false; 
      
      window.location.replace(privateAppDomain);
    } catch (error) {
      console.error('Delete failed:', error.message);
      
      setIsAuthenticated(false);
      dispatch(resetBootstrap());
      setAccessToken(null);
      hasCheckedAuth.current = false;
    }
  };

  const makeAuthenticatedRequest = useCallback(
    async (url, options = {}) => {
      let token = accessToken;
      if (!token || isTokenNearExpiry(token)) {
        token = await refreshAccessToken();
        if (!token) throw new Error('Authentication failed: No valid token');
      }

      try {
        const response = await axios({
          url,
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        return response;
      } catch (error) {
        if (error.response?.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            return axios({
              url,
              ...options,
              headers: {
                ...options.headers,
                Authorization: `Bearer ${newToken}`,
              },
              withCredentials: true,
            });
          }
        }
        if (error.response?.status === 403) {
          setIsAuthenticated(false);
          setAccessToken(null);
          dispatch(resetBootstrap());
          navigate('/login', { replace: true });
          throw new Error('Unauthorized: You do not have access to this resource.');
        }
        throw error;
      }
    },
    [accessToken, refreshAccessToken, navigate, dispatch]
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        accessToken,
        isAuthReady,
        login,
        logout,
        accountdelete,
        refreshAccessToken,
        makeAuthenticatedRequest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);