import React from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import { useNavigationStore } from '../../store/navigationStore';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (path: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNavigate }) => {
  const { sidebarOpen } = useNavigationStore();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onNavigate={onNavigate} />
      
      <main 
        className={`
          flex-1 flex flex-col transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'lg:ml-0' : 'ml-0'}
        `}
      >
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};