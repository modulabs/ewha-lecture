import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NavigationState {
  currentPath: string;
  expandedItems: string[];
  completedItems: string[];
  sidebarOpen: boolean;
  
  setCurrentPath: (path: string) => void;
  toggleExpanded: (itemId: string) => void;
  toggleCompleted: (itemId: string) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set, get) => ({
      currentPath: '/',
      expandedItems: [],
      completedItems: [],
      sidebarOpen: true,
      
      setCurrentPath: (path: string) => set({ currentPath: path }),
      
      toggleExpanded: (itemId: string) => {
        const { expandedItems } = get();
        const isExpanded = expandedItems.includes(itemId);
        
        if (isExpanded) {
          set({ expandedItems: expandedItems.filter(id => id !== itemId) });
        } else {
          set({ expandedItems: [...expandedItems, itemId] });
        }
      },
      
      toggleCompleted: (itemId: string) => {
        const { completedItems } = get();
        const isCompleted = completedItems.includes(itemId);
        
        if (isCompleted) {
          set({ completedItems: completedItems.filter(id => id !== itemId) });
        } else {
          set({ completedItems: [...completedItems, itemId] });
        }
      },
      
      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
      
      toggleSidebar: () => {
        const { sidebarOpen } = get();
        set({ sidebarOpen: !sidebarOpen });
      }
    }),
    {
      name: 'ewha-navigation-storage',
      partialize: (state) => ({ 
        expandedItems: state.expandedItems,
        completedItems: state.completedItems,
        sidebarOpen: state.sidebarOpen 
      }),
    }
  )
);