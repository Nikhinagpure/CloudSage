import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

// Lazy load pages for performance
const Landing = React.lazy(() => import('../pages/Landing'));
const Login = React.lazy(() => import('../pages/auth/Login'));
const Register = React.lazy(() => import('../pages/auth/Register'));
const ForgotPassword = React.lazy(() => import('../pages/auth/ForgotPassword'));

const DashboardLayout = React.lazy(() => import('../components/layout/DashboardLayout'));
const Dashboard = React.lazy(() => import('../pages/dashboard/Dashboard'));
const Resources = React.lazy(() => import('../pages/resources/ResourcesPage'));
const Recommendations = React.lazy(() => import('../pages/recommendations/RecommendationsPage'));
const Forecast = React.lazy(() => import('../pages/forecast/ForecastPage'));
const Analysis = React.lazy(() => import('../pages/analysis/AnalysisPage'));
const Alerts = React.lazy(() => import('../pages/alerts/AlertsPage'));
const Settings = React.lazy(() => import('../pages/settings/Settings'));

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <React.Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ec2" element={<Resources />} />
            <Route path="/rds" element={<Resources />} />
            <Route path="/s3" element={<Resources />} />
            <Route path="/vpc" element={<Resources />} />
            <Route path="/services" element={<Resources />} />
            <Route path="/analytics" element={<Analysis />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings/*" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </React.Suspense>
  );
};
