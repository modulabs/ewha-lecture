import React from 'react';
import { motion } from 'framer-motion';
import { X, Menu } from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { sidebarData } from '../../data/sidebarData';
import { useNavigationStore } from '../../store/navigationStore';
import type { SidebarItem as SidebarItemType } from '../../types';

interface SidebarProps {
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const { sidebarOpen, toggleSidebar } = useNavigationStore();

  // 재귀적으로 자식 아이템들을 렌더링하는 함수
  const renderChildren = (children: SidebarItemType[], level: number, onNav?: (path: string) => void) => {
    return children.map((child) => (
      <SidebarItem
        key={child.id}
        item={child}
        level={level}
        onNavigate={onNav}
        renderChildren={renderChildren}
      />
    ));
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: sidebarOpen ? 0 : '-100%',
          width: sidebarOpen ? '280px' : '0px'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50
          lg:relative lg:translate-x-0 lg:z-0
          ${sidebarOpen ? 'shadow-lg lg:shadow-none' : ''}
        `}
        style={{ width: sidebarOpen ? '280px' : '0px' }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-lg font-bold text-gray-900">
              이화여대 AI 과정
            </h1>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded hover:bg-gray-100 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1">
              {sidebarData.map((item) => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  onNavigate={onNavigate}
                  renderChildren={renderChildren}
                />
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              React + TypeScript
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile toggle button */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 lg:hidden"
        >
          <Menu size={20} />
        </button>
      )}
    </>
  );
};