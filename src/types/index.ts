export interface SidebarItem {
  id: string;
  title: string;
  path?: string;
  children?: SidebarItem[];
  isExpanded?: boolean;
}

export interface CourseDay {
  day: number;
  date: string;
  title: string;
  sessions: CourseSession[];
}

export interface CourseSession {
  id: string;
  title: string;
  filename: string;
  path: string;
}

export interface NavigationState {
  currentPath: string;
  expandedItems: string[];
  completedItems: string[];
}