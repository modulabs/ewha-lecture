export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'instructor' | 'admin';
  studentId?: string;
  cohort?: string;
  profileImageUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
  totalLearningTime?: number;
  totalCompletedItems?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface BackendTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  cohort: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface BackendAuthResponse {
  success: boolean;
  data: {
    user: User;
    tokens: BackendTokens;
  };
  message: string;
  timestamp: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthStore extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  checkAuth: () => void;
  checkAuthStatus: () => void;
}

export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}