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
    <div className="h-screen bg-gray-50">
      <Sidebar onNavigate={onNavigate} />
      
      <main 
        className={`
          h-full flex flex-col transition-all duration-300 ease-out
          ${sidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-0'}
        `}
      >
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4 md:p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};