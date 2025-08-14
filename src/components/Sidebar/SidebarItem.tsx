import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Home, CheckCircle2 } from 'lucide-react';
import type { SidebarItem as SidebarItemType } from '../../types';
import { useNavigationStore } from '../../store/navigationStore';

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

  const isExpanded = expandedItems.includes(item.id);
  const isActive = currentPath === item.path;
  const isCompleted = completedItems.includes(item.id);
  const hasChildren = item.children && item.children.length > 0;

  const handleToggle = () => {
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
    if (item.id === 'home') return <Home size={16} />;
    if (hasChildren) return isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />;
    return null;
  };

  return (
    <div className="w-full">
      <div
        className={`
          flex items-center justify-between w-full px-3 py-2 cursor-pointer
          transition-all duration-200 hover:bg-gray-100
          ${isActive ? 'bg-blue-100 border-r-2 border-blue-500 text-blue-700' : 'text-gray-700'}
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
        
        {item.path && (
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
        {hasChildren && isExpanded && renderChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {renderChildren(item.children!, level + 1, onNavigate)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};