import { apiClient } from '@/lib/axios';
import { getAccessToken, getRefreshToken, setTokens, setUser, clearAuthStorage } from '@/lib/token-storage';

// 백엔드 응답 래퍼 타입과 DTO 타입 정의
type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type LoginRequestDto = {
  // 이메일/비밀번호 로그인 요청 DTO
  // - email: 사용자 이메일
  // - password: 사용자 비밀번호
  email: string;
  password: string;
};

export type ProviderType = 'GOOGLE' | 'APPLE';

export type OAuth2LoginRequestDto = {
  // 소셜 로그인 요청 DTO
  // - providerType: 'GOOGLE' | 'APPLE'
  // - token: 공급자 발급 id_token
  providerType: ProviderType;
  token: string;
};

export type LoginResponseDto = {
  accessToken: string;
  refreshToken: string;
  user: unknown;
};

export type TokenResponseDto = {
  accessToken: string;
  refreshToken: string;
};

const AUTH_BASE = '/api'; // NEXT_PUBLIC_API_BASE_URL 앞에 붙음

// 공통: Authorization 헤더 설정
function authHeader() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 이메일/비밀번호 로그인
export async function signInLocal(payload: LoginRequestDto): Promise<LoginResponseDto> {
  const { data } = await apiClient.post<ApiResponse<LoginResponseDto>>(`${AUTH_BASE}/auth/login`, payload);
  if (!data?.data) throw new Error('로그인 응답이 올바르지 않습니다');
  setTokens({ accessToken: data.data.accessToken, refreshToken: data.data.refreshToken });
  setUser(data.data.user);
  return data.data;
}

// 소셜 로그인 (구글/애플)
export async function signInOAuth2(payload: OAuth2LoginRequestDto): Promise<LoginResponseDto> {
  const { data } = await apiClient.post<ApiResponse<LoginResponseDto>>(`${AUTH_BASE}/oauth2/login`, payload);
  if (!data?.data) throw new Error('소셜 로그인 응답이 올바르지 않습니다');
  setTokens({ accessToken: data.data.accessToken, refreshToken: data.data.refreshToken });
  setUser(data.data.user);
  return data.data;
}

// 현재 사용자 조회
export async function getMe(): Promise<unknown> {
  const { data } = await apiClient.get<ApiResponse<unknown>>(`${AUTH_BASE}/auth/me`, { headers: authHeader() });
  return data.data;
}

// 토큰 갱신
export async function refreshAccessToken(): Promise<TokenResponseDto> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('리프레시 토큰이 없습니다');
  const { data } = await apiClient.post<ApiResponse<TokenResponseDto>>(
    `${AUTH_BASE}/auth/refresh`,
    {},
    { headers: { Authorization: `Bearer ${refreshToken}` } }
  );
  if (!data?.data) throw new Error('토큰 갱신 응답이 올바르지 않습니다');
  setTokens({ accessToken: data.data.accessToken, refreshToken: data.data.refreshToken });
  return data.data;
}

// 로그아웃
export async function signOut(): Promise<void> {
  try {
    await apiClient.post<ApiResponse<void>>(`${AUTH_BASE}/auth/logout`, {}, { headers: authHeader() });
  } finally {
    clearAuthStorage();
  }
}


