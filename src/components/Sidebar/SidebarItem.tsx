import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Home, CheckCircle2, Lock } from 'lucide-react';
import type { SidebarItem as SidebarItemType } from '../../types';
import { useNavigationStore } from '../../store/navigationStore';
import { useAuthStore } from '../../store/authStore';
import { useContentLockStore } from '../../store/contentLockStore';
import { AssignmentSubmissionBox } from '../AssignmentSubmission/AssignmentSubmissionBox';

interface SidebarItemProps {
  item: SidebarItemType;
  level?: number;
  onNavigate?: (path: string) => void;
  renderChildren?: (children: SidebarItemType[], level: number, onNavigate?: (path: string) => void) => React.ReactNode;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ 
  item, 
  level = 0, 
  onNavigate,
  renderChildren 
}) => {
  const { 
    currentPath, 
    expandedItems, 
    completedItems, 
    toggleExpanded, 
    toggleCompleted 
  } = useNavigationStore();

  const { user, isAuthenticated } = useAuthStore();
  const { isItemLocked } = useContentLockStore();
  const isAdmin = isAuthenticated && user?.role === 'admin';

  // 백엔드 잠금 상태 우선 사용 (백엔드 데이터가 있으면 그것을 사용, 없으면 정적 데이터 사용)
  const backendLocked = isItemLocked(item.id);
  const { lockedItems } = useContentLockStore();
  const hasBackendData = Object.keys(lockedItems).length > 0;
  
  // 백엔드 데이터가 있으면 백엔드 우선, 없으면 정적 데이터 사용
  const isLocked = hasBackendData ? backendLocked : (item.locked || false);

  const isExpanded = expandedItems.includes(item.id);
  const isActive = currentPath === item.path;
  const isCompleted = completedItems.includes(item.id);
  const hasChildren = item.children && item.children.length > 0;

  // 관리자 전용 메뉴인데 관리자가 아닌 경우 숨김
  if (item.adminOnly && !isAdmin) {
    return null;
  }

  // 구분선 처리
  if (item.isDivider) {
    return (
      <div className="px-3 py-2 my-2">
        <div className="border-t border-gray-200 mb-2"></div>
        <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">
          {item.title}
        </span>
      </div>
    );
  }

  const handleToggle = () => {
    if (isLocked && !isAdmin) {
      return; // 잠겨있고 관리자가 아니면 클릭 비활성화
    }
    if (hasChildren) {
      toggleExpanded(item.id);
    }
    if (item.path && onNavigate) {
      onNavigate(item.path);
    }
  };

  const handleCompleteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCompleted(item.id);
  };

  const getIcon = () => {
    if (isLocked && !isAdmin) return <Lock size={16} className="text-gray-400" />;
    if (isLocked && isAdmin) return (
      <Lock 
        size={16} 
        className="text-amber-500" 
        style={{ cursor: 'help' }}
        aria-label="잠금 상태 (관리자 접근 가능)"
      />
    );
    if (item.id === 'home') return <Home size={16} />;
    if (hasChildren) return isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />;
    return null;
  };

  return (
    <div className="w-full">
      <div
        className={`
          flex items-center justify-between w-full px-3 py-2 transition-all duration-200
          ${isLocked && !isAdmin
            ? 'cursor-not-allowed text-gray-400 bg-gray-50' 
            : isLocked && isAdmin
            ? 'cursor-pointer hover:bg-amber-50 text-amber-700 border-l-2 border-amber-300'
            : 'cursor-pointer hover:bg-gray-100'
          }
          ${isActive && item.adminOnly 
            ? 'bg-amber-100 border-r-2 border-amber-500 text-amber-700' 
            : isActive 
            ? 'bg-blue-100 border-r-2 border-blue-500 text-blue-700' 
            : ''
          }
          ${!isLocked && !isActive 
            ? item.adminOnly 
              ? 'text-amber-700' 
              : 'text-gray-700' 
            : isLocked && isAdmin && !isActive
            ? 'text-amber-700'
            : ''
          }
          ${item.adminOnly && !isLocked && !isActive ? 'hover:bg-amber-50' : ''}
        `}
        onClick={handleToggle}
        style={{ paddingLeft: `${12 + level * 16}px` }}
      >
        <div className="flex items-center gap-2 flex-1">
          {getIcon()}
          <span className={`text-sm ${isActive ? 'font-medium' : ''}`}>
            {item.title}
          </span>
        </div>
        
        {item.path && (!isLocked || isAdmin) && (
          <button
            onClick={handleCompleteToggle}
            className={`
              p-1 rounded-full transition-colors
              ${isCompleted 
                ? 'text-green-600 hover:text-green-700' 
                : 'text-gray-400 hover:text-gray-600'
              }
            `}
            title={isCompleted ? '완료됨' : '완료로 표시'}
          >
            <CheckCircle2 size={16} className={isCompleted ? 'fill-current' : ''} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {hasChildren && isExpanded && (!isLocked || isAdmin) && renderChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {renderChildren(item.children!, level + 1, onNavigate)}
            
            {/* 과제 제출란 - Day 레벨에서만 표시 */}
            {item.hasAssignment && item.assignmentDate && level === 0 && isAuthenticated && user?.role === 'student' && (
              <div className="px-3 py-2">
                <AssignmentSubmissionBox
                  dayId={item.id}
                  dayTitle={item.title}
                  assignmentDate={item.assignmentDate}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};