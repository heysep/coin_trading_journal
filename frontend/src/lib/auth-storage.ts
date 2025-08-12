// 안전한 토큰 저장 및 접근 유틸리티
// - 가능한 경우 메모리 우선, 새로고침 대비하여 localStorage 백업

export type StoredTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

let inMemoryAccessToken: string | null = null;
let inMemoryRefreshToken: string | null = null;

const ACCESS_KEY = 'ctj_access_token';
const REFRESH_KEY = 'ctj_refresh_token';

export const authStorage = {
  // 토큰 저장 (메모리 + localStorage)
  save(tokens: StoredTokens) {
    inMemoryAccessToken = tokens.accessToken ?? null;
    inMemoryRefreshToken = tokens.refreshToken ?? null;
    try {
      if (typeof window !== 'undefined') {
        if (tokens.accessToken) localStorage.setItem(ACCESS_KEY, tokens.accessToken);
        else localStorage.removeItem(ACCESS_KEY);
        if (tokens.refreshToken) localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
        else localStorage.removeItem(REFRESH_KEY);
      }
    } catch {}
  },

  // 저장된 토큰 로드
  load(): StoredTokens {
    if (inMemoryAccessToken || inMemoryRefreshToken) {
      return { accessToken: inMemoryAccessToken, refreshToken: inMemoryRefreshToken };
    }
    try {
      if (typeof window !== 'undefined') {
        const access = localStorage.getItem(ACCESS_KEY);
        const refresh = localStorage.getItem(REFRESH_KEY);
        inMemoryAccessToken = access;
        inMemoryRefreshToken = refresh;
        return { accessToken: access, refreshToken: refresh };
      }
    } catch {}
    return { accessToken: null, refreshToken: null };
  },

  // 개별 토큰 접근자
  getAccessToken(): string | null {
    return this.load().accessToken;
  },

  getRefreshToken(): string | null {
    return this.load().refreshToken;
  },

  // 토큰 비우기
  clear() {
    inMemoryAccessToken = null;
    inMemoryRefreshToken = null;
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(ACCESS_KEY);
        localStorage.removeItem(REFRESH_KEY);
      }
    } catch {}
  },
};


