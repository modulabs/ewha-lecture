export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor';
  lastLogin: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  cohort: string;
  status: 'pending' | 'registered' | 'blocked';
  uploadedAt: string;
  registeredAt?: string;
  uploadedByName: string;
  notes?: string;
  totalLearningTime: number;
  completedItems: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  contentItemId: string;
  dueDate: string;
  maxFileSizeMb: number;
  allowedFileTypes: string[];
  totalStudents: number;
  submittedCount: number;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignment: {
    id: string;
    title: string;
    dueDate: string;
  };
  student: {
    id: string;
    name: string;
    email: string;
    studentId: string;
    cohort: string;
  };
  fileName: string;
  fileUrl: string;
  fileSizeBytes: number;
  comments?: string;
  submittedAt: string;
  reviewStatus: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  score?: number;
  feedback?: string;
  reviewedAt?: string;
  reviewerName?: string;
}

export interface AdminStats {
  studentsTotal: number;
  studentsRegistered: number;
  studentsActiveToday: number;
  assignmentsPending: number;
  assignmentsTotal: number;
  avgScore: number;
  completionRate: number;
}

export interface RecentActivity {
  id: string;
  type: 'assignment_submitted' | 'student_registered' | 'assignment_reviewed';
  title: string;
  studentName?: string;
  assignmentTitle?: string;
  timestamp: string;
}

export interface AdminTableColumn<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface AdminTableAction<T> {
  key: string;
  label: string;
  icon?: React.ComponentType<{ size?: number }>;
  onClick: (record: T) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: (record: T) => boolean;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

export interface UploadResult {
  totalRows: number;
  successfulImports: number;
  skippedDuplicates: number;
  errors: number;
  cohort: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  student_id?: string;
  cohort?: string;
  department?: string;
  phone?: string;
  role: 'student' | 'instructor' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface UserStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  role_distribution: {
    student: number;
    instructor: number;
    admin: number;
  };
  cohort_distribution: Record<string, number>;
}