export interface SidebarItem {
  id: string;
  title: string;
  path?: string;
  children?: SidebarItem[];
  isExpanded?: boolean;
  locked?: boolean;
  adminOnly?: boolean;
  isDivider?: boolean;
  hasAssignment?: boolean; // 과제가 있는 날짜인지 표시
  assignmentDate?: string; // 과제 날짜 (YYYY-MM-DD 형식)
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