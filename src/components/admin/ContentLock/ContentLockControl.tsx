import React, { useState } from 'react';
import { Lock, Unlock, Users, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { sidebarData } from '../../../data/sidebarData';
import { useContentLockStore } from '../../../store/contentLockStore';
import type { SidebarItem } from '../../../types';

interface ContentLockControlProps {
  onLockChange?: (itemId: string, locked: boolean) => void;
}

export const ContentLockControl: React.FC<ContentLockControlProps> = ({ onLockChange }) => {
  const { 
    lockedItems, 
    isLoading, 
    error, 
    updateLock, 
    batchUpdateLocks,
    setError 
  } = useContentLockStore();

  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleLockToggle = async (itemId: string) => {
    const currentState = lockedItems[itemId] || false;
    const newLockState = !currentState;
    
    setIsUpdating(itemId);
    try {
      await updateLock(itemId, newLockState, `관리자에 의한 ${newLockState ? '잠금 설정' : '잠금 해제'}`);
      
      if (onLockChange) {
        onLockChange(itemId, newLockState);
      }
    } catch (error) {
      console.error('Lock toggle failed:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleBatchUpdate = async (locked: boolean) => {
    const contentItems = getContentItems();
    const updates = contentItems.map(item => ({
      contentId: item.id,
      locked
    }));
    
    setIsUpdating('batch');
    try {
      await batchUpdateLocks(updates, `관리자에 의한 전체 ${locked ? '잠금 설정' : '잠금 해제'}`);
      
      if (onLockChange) {
        contentItems.forEach(item => onLockChange(item.id, locked));
      }
    } catch (error) {
      console.error('Batch update failed:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const getContentItems = (): Array<SidebarItem & { locked?: boolean }> => {
    return sidebarData.filter(item => 
      item.children && !item.adminOnly && !item.isDivider
    );
  };

  const contentItems = getContentItems();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-amber-100 p-2 rounded-full">
          <Lock size={20} className="text-amber-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">콘텐츠 잠금 제어</h3>
          <p className="text-sm text-gray-600">학습 진도에 따라 콘텐츠 접근을 제어할 수 있습니다</p>
        </div>
        {isLoading && (
          <Loader2 size={16} className="text-blue-600 animate-spin ml-auto" />
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-600" />
          <span className="text-sm text-red-800">{error}</span>
          <button
            onClick={() => setError(undefined)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            ✕
          </button>
        </div>
      )}

      <div className="space-y-4">
        {contentItems.map(item => {
          const isLocked = lockedItems[item.id] || false;
          const isItemUpdating = isUpdating === item.id;
          
          return (
            <div 
              key={item.id} 
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    isLocked 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {isItemUpdating ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : isLocked ? (
                      <Lock size={16} />
                    ) : (
                      <Unlock size={16} />
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {item.children?.length || 0}개 세션
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        상태: {isLocked ? '잠금' : '해제'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isLocked
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {isLocked ? '잠금됨' : '접근가능'}
                  </span>
                  
                  <button
                    onClick={() => handleLockToggle(item.id)}
                    disabled={isItemUpdating || isLoading}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      isLocked
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    {isItemUpdating ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      isLocked ? '잠금 해제' : '잠금 설정'
                    )}
                  </button>
                </div>
              </div>

              {/* 세션 목록 */}
              {item.children && (
                <div className="mt-3 pl-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {item.children.map(child => (
                      <div key={child.id} className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1">
                        {child.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 전체 제어 버튼들 */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex gap-3">
          <button
            onClick={() => handleBatchUpdate(false)}
            disabled={isUpdating === 'batch' || isLoading}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating === 'batch' ? (
              <Loader2 size={16} className="inline mr-2 animate-spin" />
            ) : (
              <Unlock size={16} className="inline mr-2" />
            )}
            모든 콘텐츠 해제
          </button>
          
          <button
            onClick={() => handleBatchUpdate(true)}
            disabled={isUpdating === 'batch' || isLoading}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating === 'batch' ? (
              <Loader2 size={16} className="inline mr-2 animate-spin" />
            ) : (
              <Lock size={16} className="inline mr-2" />
            )}
            모든 콘텐츠 잠금
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          💡 관리자는 잠금된 콘텐츠에도 접근할 수 있습니다
        </p>
      </div>
    </div>
  );
};