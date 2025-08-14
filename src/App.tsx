import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { HomePage } from './pages/HomePage';
import { SessionPage } from './pages/SessionPage';
import { useNavigationStore } from './store/navigationStore';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentPath } = useNavigationStore();

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    navigate(path);
  };

  return (
    <Layout onNavigate={handleNavigate}>
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