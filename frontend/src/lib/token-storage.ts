// 인증 토큰 로컬 스토리지 관리 유틸
// - 사용자의 취향에 따라 민감정보는 코드에서 분리 (env/스토리지 사용)

export type StoredAuth = {
  accessToken: string;
  refreshToken: string;
};

const ACCESS_TOKEN_KEY = 'ctj_access_token';
const REFRESH_TOKEN_KEY = 'ctj_refresh_token';
const USER_KEY = 'ctj_user';

// 액세스 토큰 조회
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

// 리프레시 토큰 조회
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

// 토큰 저장
export function setTokens(tokens: StoredAuth): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

// 사용자 정보 저장/조회 (백엔드 `user` 객체 그대로 저장)
export function setUser(user: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // JSON 직렬화 실패 시 무시
  }
}

export function getUser<T = unknown>(): T | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// 스토리지 초기화
export function clearAuthStorage(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}


