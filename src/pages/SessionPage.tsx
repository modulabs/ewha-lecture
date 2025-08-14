import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MarkdownRenderer } from '../components/MarkdownRenderer/MarkdownRenderer';
import { useNavigationStore } from '../store/navigationStore';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { sidebarData } from '../data/sidebarData';

export const SessionPage: React.FC = () => {
  const { day, session } = useParams();
  const navigate = useNavigate();
  const { setCurrentPath, currentPath } = useNavigationStore();

  const filePath = `/${day}/${session}.md`;
  const routePath = `/${day}/${session}`;

  useEffect(() => {
    setCurrentPath(routePath);
  }, [routePath, setCurrentPath]);

  // Find current session and adjacent sessions for navigation
  const getAllSessions = () => {
    const sessions: { path: string; title: string }[] = [];
    
    sidebarData.forEach(item => {
      if (item.children) {
        item.children.forEach(child => {
          if (child.path) {
            sessions.push({ path: child.path, title: child.title });
          }
        });
      }
    });
    
    return sessions;
  };

  const sessions = getAllSessions();
  const currentIndex = sessions.findIndex(s => s.path === currentPath);
  const prevSession = currentIndex > 0 ? sessions[currentIndex - 1] : null;
  const nextSession = currentIndex < sessions.length - 1 ? sessions[currentIndex + 1] : null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <MarkdownRenderer filePath={filePath} />
        </div>
        
        {/* Navigation */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              {prevSession && (
                <button
                  onClick={() => navigate(prevSession.path)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span className="text-sm">{prevSession.title}</span>
                </button>
              )}
            </div>
            
            <div>
              {nextSession && (
                <button
                  onClick={() => navigate(nextSession.path)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <span className="text-sm">{nextSession.title}</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};