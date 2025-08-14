import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { useNavigationStore } from './store/navigationStore';

// Lazy load pages
const HomePage = React.lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const SessionPage = React.lazy(() => import('./pages/SessionPage').then(module => ({ default: module.SessionPage })));

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentPath } = useNavigationStore();

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
          <Route path="/" element={<HomePage />} />
          <Route path="/:day/:session" element={<SessionPage />} />
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
    <Router basename="/ewha-lecture">
      <AppContent />
    </Router>
  );
};

export default App;