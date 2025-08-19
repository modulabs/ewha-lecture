import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { contentLockApi, type ContentLock } from '../services/contentLockApi';

interface ContentLockState {
  // 상태
  lockedItems: Record<string, boolean>;
  isLoading: boolean;
  lastUpdated?: string;
  error?: string;

  // 로컬 액션 (즉시 반영)
  setItemLock: (itemId: string, locked: boolean) => void;
  
  // API 액션
  fetchLocks: () => Promise<void>;
  updateLock: (contentId: string, locked: boolean, reason?: string) => Promise<void>;
  batchUpdateLocks: (updates: Array<{contentId: string, locked: boolean}>, reason?: string) => Promise<void>;
  
  // 유틸리티
  isItemLocked: (itemId: string) => boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | undefined) => void;
}

export const useContentLockStore = create<ContentLockState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      lockedItems: {
        'day2': true,
        'day3': true
      },
      isLoading: false,
      lastUpdated: undefined,
      error: undefined,

      // 로컬 상태 즉시 업데이트 (UI 반응성을 위해)
      setItemLock: (itemId: string, locked: boolean) => {
        set((state) => ({
          lockedItems: {
            ...state.lockedItems,
            [itemId]: locked
          }
        }));
      },

      // 서버에서 잠금 상태 가져오기
      fetchLocks: async () => {
        try {
          set({ isLoading: true, error: undefined });
          
          const response = await contentLockApi.getLocks();
          
          if (response.success) {
            const locks: Record<string, boolean> = {};
            response.data.locks.forEach((lock: ContentLock) => {
              locks[lock.content_id] = lock.is_locked;
            });
            
            set({
              lockedItems: locks,
              lastUpdated: response.data.last_updated,
              isLoading: false,
              error: undefined
            });
          }
        } catch (error) {
          console.error('Failed to fetch content locks:', error);
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : '잠금 상태를 불러오는데 실패했습니다.'
          });
        }
      },

      // 개별 잠금 상태 변경
      updateLock: async (contentId: string, locked: boolean, reason?: string) => {
        try {
          set({ isLoading: true, error: undefined });
          
          // 낙관적 업데이트 (즉시 UI에 반영)
          get().setItemLock(contentId, locked);
          
          const response = await contentLockApi.updateLock(contentId, locked, reason);
          
          if (response.success) {
            // 서버 응답으로 최종 확인
            set({
              lockedItems: {
                ...get().lockedItems,
                [response.data.content_id]: response.data.is_locked
              },
              lastUpdated: response.data.updated_at,
              isLoading: false
            });
          }
        } catch (error) {
          console.error('Failed to update content lock:', error);
          
          // 실패 시 원래 상태로 되돌리기
          get().setItemLock(contentId, !locked);
          
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : '잠금 상태 변경에 실패했습니다.'
          });
          throw error;
        }
      },

      // 일괄 잠금 상태 변경
      batchUpdateLocks: async (updates: Array<{contentId: string, locked: boolean}>, reason?: string) => {
        try {
          set({ isLoading: true, error: undefined });
          
          // 낙관적 업데이트
          const currentLocks = get().lockedItems;
          const newLocks = { ...currentLocks };
          updates.forEach(update => {
            newLocks[update.contentId] = update.locked;
          });
          set({ lockedItems: newLocks });
          
          const apiUpdates = updates.map(update => ({
            content_id: update.contentId,
            is_locked: update.locked
          }));
          
          const response = await contentLockApi.batchUpdate(apiUpdates, reason);
          
          if (response.success) {
            // 성공 후 최신 상태를 다시 가져오기
            await get().fetchLocks();
          }
        } catch (error) {
          console.error('Failed to batch update content locks:', error);
          
          // 실패 시 원래 상태로 되돌리기
          await get().fetchLocks();
          
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : '일괄 변경에 실패했습니다.'
          });
          throw error;
        }
      },

      // 유틸리티 함수들
      isItemLocked: (itemId: string) => {
        const { lockedItems } = get();
        return lockedItems[itemId] || false;
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | undefined) => {
        set({ error });
      }
    }),
    {
      name: 'content-lock-storage',
      partialize: (state) => ({
        lockedItems: state.lockedItems,
        lastUpdated: state.lastUpdated
      })
    }
  )
);