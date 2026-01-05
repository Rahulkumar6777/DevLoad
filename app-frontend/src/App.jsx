import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch , useSelector} from 'react-redux';

import PrivateLayout from './layouts/PrivateLayout';
import ProjectLayout from './layouts/ProjectLayout';
import MinimalLayout from './layouts/MinimalLayout';

import Login from './pages/Login';
import Signup from './pages/Signup';
import MyProjects from './pages/MyProject';
import ProjectDetails from './pages/ProjectDetails';
import ProjectFiles from './pages/ProjectFiles';
import ProjectSettings from './pages/ProjectSettings';
import Subscription from './pages/Subscription';
import Profile from './pages/Profile';
import CreateProject from './pages/CreateProject';
import UpgradePage from './pages/UpgradePage';

import { useAuth } from './context/AuthContext';
//import { fetchSubscription } from './store/slices/subscriptionSlice';
import {fetchBootstrapData} from './store/slices/bootstrapSlice'
import ProjectAnalytics from './pages/ProjectAnalytics';
import ProjectApiKey from './pages/ProjectApiKey';
import UserDashboard from './components/UserStats';
import Renew from './pages/RenewPage';

function AuthenticatedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  return isAuthenticated
    ? children
    : <Navigate to="/login" replace state={{ from: location }} />;
}

function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <>
      </>
    );
  }

  return isAuthenticated
    ? <Navigate to="/" replace state={{ from: location }} />
    : children;
}

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, makeAuthenticatedRequest } = useAuth();
  const fetchedOnce = useSelector((state) => state.bootstrap.fetchedOnce); // ✅ from Redux

  useEffect(() => {
    if (isAuthenticated && !fetchedOnce) {
      dispatch(fetchBootstrapData(makeAuthenticatedRequest));
    }
  }, [isAuthenticated, dispatch, makeAuthenticatedRequest , fetchedOnce]);

  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute><Login /></PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute><Signup /></PublicRoute>
      } />
      <Route path="/" element={
        <AuthenticatedRoute><PrivateLayout /></AuthenticatedRoute>
      }>
        <Route index element={<MyProjects />} />
        <Route path="project/:id" element={<ProjectLayout />}>
          <Route index element={<ProjectDetails />} />
          <Route path="files" element={<ProjectFiles />} />
          <Route path="analytics" element={<ProjectAnalytics />} />
          <Route path="settings" element={<ProjectSettings />} />
          <Route path="apikeys" element={<ProjectApiKey />} />
        </Route>
        <Route path="subscription" element={<Subscription />} />
        <Route path="profile" element={<Profile />} />
        <Route path="stats" element={<UserDashboard />} />
      </Route>
      <Route path="/create-project" element={
        <AuthenticatedRoute>
          <MinimalLayout><CreateProject /></MinimalLayout>
        </AuthenticatedRoute>
      } />
      <Route path="/upgrade" element={
        <AuthenticatedRoute>
          <MinimalLayout><UpgradePage /></MinimalLayout>
        </AuthenticatedRoute>
      } />
      <Route path="/renew" element={
        <AuthenticatedRoute>
          <MinimalLayout><Renew/></MinimalLayout>
        </AuthenticatedRoute>
      } />
      <Route path="*" element={
        <div className="text-white text-center mt-20">404 - Page Not Found</div>
      } />
    </Routes>
  );
}

export default App;
