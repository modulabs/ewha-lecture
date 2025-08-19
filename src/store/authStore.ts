import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthStore, LoginRequest, RegisterRequest, BackendAuthResponse } from '../types/auth';

// API Base URL
const API_BASE_URL = 'https://modulabs.ddns.net/ewha/api/v1';

// API helper function
const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Real API
const authApi = {
  login: async (credentials: LoginRequest): Promise<BackendAuthResponse> => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (data: RegisterRequest): Promise<BackendAuthResponse> => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  refreshToken: async (refreshToken: string): Promise<{ data: { access_token: string; expires_in: number } }> => {
    return apiCall('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (credentials: LoginRequest) => {
        try {
          set({ isLoading: true });
          const response = await authApi.login(credentials);
          
          // 백엔드 응답 구조에 맞게 수정
          set({
            user: response.data.user,
            tokens: {
              accessToken: response.data.tokens.access_token,
              refreshToken: response.data.tokens.refresh_token,
              expiresIn: response.data.tokens.expires_in
            },
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        try {
          set({ isLoading: true });
          const response = await authApi.register(data);
          
          // 백엔드 응답 구조에 맞게 수정
          set({
            user: response.data.user,
            tokens: {
              accessToken: response.data.tokens.access_token,
              refreshToken: response.data.tokens.refresh_token,
              expiresIn: response.data.tokens.expires_in
            },
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false
        });
        
        // 로그아웃 시 콘텐츠 잠금 상태도 초기화
        // 다른 사용자가 로그인할 때 이전 상태가 남지 않도록 보안 처리
        try {
          localStorage.removeItem('content-lock-storage');
        } catch (error) {
          console.warn('Failed to clear content lock storage:', error);
        }
      },

      refreshToken: async () => {
        const { tokens } = get();
        if (!tokens?.refreshToken) return;

        try {
          const response = await authApi.refreshToken(tokens.refreshToken);
          
          set({
            tokens: {
              ...tokens,
              accessToken: response.data.access_token,
              expiresIn: response.data.expires_in
            }
          });
        } catch (error) {
          // Refresh 실패 시 로그아웃
          get().logout();
          throw error;
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      checkAuth: () => {
        const { tokens } = get();
        if (tokens) {
          set({ isAuthenticated: true });
        } else {
          set({ isAuthenticated: false });
        }
      },

      checkAuthStatus: () => {
        const { tokens } = get();
        if (tokens) {
          set({ isAuthenticated: true });
        } else {
          set({ isAuthenticated: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);