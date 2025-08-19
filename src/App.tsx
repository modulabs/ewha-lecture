import React, { Suspense, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useNavigationStore } from './store/navigationStore';
import { useAuthStore } from './store/authStore';
import { useContentLockSync } from './hooks/useContentLockSync';

// Lazy load pages
const HomePage = React.lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const SessionPage = React.lazy(() => import('./pages/SessionPage').then(module => ({ default: module.SessionPage })));

// Auth pages
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage').then(module => ({ default: module.RegisterPage })));

// Admin pages
const AdminDashboardPage = React.lazy(() => import('./pages/admin/AdminDashboardPage').then(module => ({ default: module.AdminDashboardPage })));
const StudentManagementPage = React.lazy(() => import('./pages/admin/StudentManagementPage').then(module => ({ default: module.StudentManagementPage })));
const AssignmentManagementPage = React.lazy(() => import('./pages/admin/AssignmentManagementPage').then(module => ({ default: module.AssignmentManagementPage })));

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentPath } = useNavigationStore();
  const { checkAuth } = useAuthStore();

  // 콘텐츠 잠금 상태 실시간 동기화
  useContentLockSync();

  // 앱 시작시 인증 상태 복원
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    navigate(path);
  };

  return (
    <Layout onNavigate={handleNavigate}>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading...</div>
        </div>
      }>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route path="/:day/:session" element={
            <ProtectedRoute>
              <SessionPage />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes (Protected) */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/students" element={
            <ProtectedRoute>
              <StudentManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/students/upload" element={
            <ProtectedRoute>
              <StudentManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/assignments" element={
            <ProtectedRoute>
              <AssignmentManagementPage />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                페이지를 찾을 수 없습니다
              </h1>
              <p className="text-gray-600 mb-6">
                요청하신 페이지가 존재하지 않습니다.
              </p>
              <button
                onClick={() => handleNavigate('/')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                홈으로 돌아가기
              </button>
            </div>
          } />
        </Routes>
      </Suspense>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;