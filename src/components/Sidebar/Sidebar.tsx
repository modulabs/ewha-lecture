import React from 'react';
import { X, Menu, LogIn, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SidebarItem } from './SidebarItem';
import { sidebarData } from '../../data/sidebarData';
import { useNavigationStore } from '../../store/navigationStore';
import { useAuthStore } from '../../store/authStore';
import type { SidebarItem as SidebarItemType } from '../../types';

interface SidebarProps {
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const { sidebarOpen, toggleSidebar } = useNavigationStore();
  const { user, isAuthenticated, logout } = useAuthStore();

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
      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 w-[280px]
          transform transition-transform duration-300 ease-out
          lg:fixed lg:z-40
          ${sidebarOpen ? 'translate-x-0 shadow-lg lg:shadow-md' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-lg font-bold text-gray-900">
              이화여대 캠퍼스타운
            </h1>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded hover:bg-gray-100"
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

          {/* Footer - User Info */}
          <div className="p-4 border-t border-gray-200">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User size={16} className="text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.role === 'admin' ? '관리자' : 
                       user.role === 'instructor' ? '강사' : '학생'}
                      {user.studentId && ` · ${user.studentId}`}
                    </p>
                  </div>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  <span>로그아웃</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <LogIn size={16} />
                  <span>로그인</span>
                </Link>
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-sm text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <User size={16} />
                  <span>회원가입</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Toggle button */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          <Menu size={20} />
        </button>
      )}
    </>
  );
};