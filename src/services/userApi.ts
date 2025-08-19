// API Base URL
const API_BASE_URL = 'https://modulabs.ddns.net/ewha/api/v1';

// API helper function (contentLockApi.ts와 동일)
const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // localStorage에서 토큰 가져오기
  const getAccessToken = (): string | null => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return parsed.state?.tokens?.accessToken || null;
    }
    return null;
  };

  const token = getAccessToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    headers,
    ...options,
  };

  const response = await fetch(url, config);
  
  // 401 에러 시 토큰 갱신 시도
  if (response.status === 401 && token) {
    try {
      const { useAuthStore } = await import('../store/authStore');
      const { refreshToken: refresh } = useAuthStore.getState();
      
      await refresh();
      
      // 새로운 토큰으로 재시도
      const newToken = useAuthStore.getState().tokens?.accessToken;
      if (newToken) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
        const retryResponse = await fetch(url, { ...config, headers });
        
        if (!retryResponse.ok) {
          const errorData = await retryResponse.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${retryResponse.status}`);
        }
        
        return retryResponse.json();
      }
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
    }
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// 사용자 관련 타입 정의
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

export interface BulkCreateResult {
  created_count: number;
  skipped_count: number;
  error_count: number;
  created_users: Array<{
    row: number;
    name: string;
    email: string;
    role: string;
  }>;
  skipped_users: Array<{
    row: number;
    email: string;
    reason: string;
  }>;
  errors: Array<{
    row: number;
    error: string;
  }>;
}

// 사용자 API 서비스
export const userApi = {
  // 사용자 목록 조회
  getAllUsers: async (filters: {
    role?: string;
    cohort?: string;
    search?: string;
    skip?: number;
    limit?: number;
  } = {}): Promise<{ success: boolean; data: User[]; total: number }> => {
    const params = new URLSearchParams();
    if (filters.role) params.append('role', filters.role);
    if (filters.cohort) params.append('cohort', filters.cohort);
    if (filters.search) params.append('search', filters.search);
    params.append('skip', (filters.skip || 0).toString());
    params.append('limit', (filters.limit || 50).toString());
    
    const queryString = params.toString();
    return apiCall(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  // 사용자 통계 조회
  getUserStats: async (): Promise<{ success: boolean; data: UserStats }> => {
    return apiCall('/admin/users/stats');
  },

  // CSV 파일로 사용자 일괄 등록
  bulkCreateUsers: async (csvFile: File): Promise<{ success: boolean; data: BulkCreateResult }> => {
    const formData = new FormData();
    formData.append('file', csvFile);
    
    return fetch(`${API_BASE_URL}/admin/users/bulk-create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
      },
      body: formData,
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  },

  // 개별 사용자 생성
  createUser: async (userData: {
    name: string;
    email: string;
    student_id?: string;
    cohort?: string;
    department?: string;
    phone?: string;
    role: string;
    password: string;
  }): Promise<{ success: boolean; data: User }> => {
    return apiCall('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // 사용자 정보 수정
  updateUser: async (userId: string, userData: Partial<User>): Promise<{ success: boolean; data: User }> => {
    return apiCall(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // 사용자 삭제
  deleteUser: async (userId: string): Promise<{ success: boolean }> => {
    return apiCall(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // 사용자 활성화/비활성화
  toggleUserStatus: async (userId: string, isActive: boolean): Promise<{ success: boolean; data: User }> => {
    return apiCall(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ is_active: isActive }),
    });
  }
};

// localStorage에서 토큰 가져오는 헬퍼 함수
const getAccessToken = (): string | null => {
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    const parsed = JSON.parse(authStorage);
    return parsed.state?.tokens?.accessToken || null;
  }
  return null;
};