import { apiClient } from '@/lib/axios';

// 공통 API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// 사용자 타입 (백엔드 User 엔티티 필드 기반)
export interface AuthUser {
  id: number;
  email: string;
  name: string;
  profileImageUrl?: string | null;
  providerType: 'LOCAL' | 'GOOGLE' | 'APPLE';
  providerId?: string | null;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
}

// 로그인/토큰 응답 타입
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

// 요청 DTO 타입
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// OAuth2 로그인 요청 DTO
export interface OAuth2LoginRequest {
  token: string; // Google/Apple에서 받은 ID 토큰
  providerType: 'GOOGLE' | 'APPLE';
}

export const authApi = {
  // 로그인 API 호출
  async login(payload: LoginRequest): Promise<LoginResponse> {
    try {
      const res = await apiClient.post<ApiResponse<LoginResponse>>('/api/auth/login', payload);
      if (!res.data.success || !res.data.data) {
        throw new Error(res.data.message || '로그인에 실패했습니다');
      }
      return res.data.data;
    } catch (error) {
      // 한글 메시지 우선 처리
      const message = (error as any)?.response?.data?.message || (error as Error).message;
      throw new Error(message || '로그인에 실패했습니다');
    }
  },

  // OAuth2 로그인 (Google/Apple)
  async oauth2Login(payload: OAuth2LoginRequest): Promise<LoginResponse> {
    try {
      const res = await apiClient.post<ApiResponse<LoginResponse>>('/api/oauth2/login', payload);
      if (!res.data.success || !res.data.data) {
        throw new Error(res.data.message || '소셜 로그인에 실패했습니다');
      }
      return res.data.data;
    } catch (error) {
      const message = (error as any)?.response?.data?.message || (error as Error).message;
      throw new Error(message || '소셜 로그인에 실패했습니다');
    }
  },

  // 회원가입 API 호출
  async register(payload: RegisterRequest): Promise<AuthUser> {
    try {
      const res = await apiClient.post<ApiResponse<AuthUser>>('/api/auth/register', payload);
      if (!res.data.success || !res.data.data) {
        throw new Error(res.data.message || '회원가입에 실패했습니다');
      }
      return res.data.data;
    } catch (error) {
      const message = (error as any)?.response?.data?.message || (error as Error).message;
      throw new Error(message || '회원가입에 실패했습니다');
    }
  },

  // 현재 사용자 정보 조회
  async me(): Promise<AuthUser> {
    try {
      const res = await apiClient.get<ApiResponse<AuthUser>>('/api/auth/me');
      if (!res.data.success || !res.data.data) {
        throw new Error(res.data.message || '사용자 정보를 불러오지 못했습니다');
      }
      return res.data.data;
    } catch (error) {
      const message = (error as any)?.response?.data?.message || (error as Error).message;
      throw new Error(message || '사용자 정보를 불러오지 못했습니다');
    }
  },

  // 토큰 갱신 (요청 헤더 Authorization: Bearer <refreshToken>)
  async refresh(refreshToken: string): Promise<TokenResponse> {
    const res = await apiClient.post<ApiResponse<TokenResponse>>(
      '/api/auth/refresh',
      {},
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
      }
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || '토큰 갱신에 실패했습니다');
    }
    return res.data.data;
  },

  // 로그아웃 (요청 헤더 Authorization: Bearer <accessToken>)
  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout');
  },
};


