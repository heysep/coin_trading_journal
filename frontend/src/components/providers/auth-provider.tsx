'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, type AuthUser, type LoginRequest, type LoginResponse } from '@/lib/api/auth-api';
import { authStorage } from '@/lib/auth-storage';
import { apiClient } from '@/lib/axios';
import { toast } from 'sonner';

// 인증 컨텍스트 타입
type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  oauth2Login: (provider: 'GOOGLE' | 'APPLE', idToken: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Axios 요청/응답 인터셉터에 토큰 주입 및 자동 갱신 설정
function setupAxiosInterceptors() {
  // 요청 시 AccessToken 주입
  apiClient.interceptors.request.use((config) => {
    const token = authStorage.getAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // 401 발생 시 RefreshToken으로 재시도
  apiClient.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config;
      const status = error.response?.status;
      if (status === 401 && !original?._retry) {
        original._retry = true;
        try {
          const refreshToken = authStorage.getRefreshToken();
          if (!refreshToken) throw new Error('리프레시 토큰이 없습니다');
          const tokens = await authApi.refresh(refreshToken);
          authStorage.save(tokens);
          // 갱신 토큰으로 헤더 갱신 후 재요청
          original.headers = original.headers ?? {};
          original.headers.Authorization = `Bearer ${tokens.accessToken}`;
          return apiClient(original);
        } catch (e) {
          authStorage.clear();
        }
      }
      return Promise.reject(error);
    }
  );
}

let interceptorsInitialized = false;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 초기화: 인터셉터 1회 설정 + 토큰 있으면 me() 호출
  useEffect(() => {
    if (!interceptorsInitialized) {
      setupAxiosInterceptors();
      interceptorsInitialized = true;
    }
    const { accessToken } = authStorage.load();
    if (!accessToken) {
      setIsLoading(false);
      return;
    }
    authApi
      .me()
      .then((u) => setUser(u))
      .catch(() => authStorage.clear())
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    // 로그인 처리: 토큰 저장 + 사용자 상태 반영
    const res: LoginResponse = await authApi.login(payload);
    authStorage.save({ accessToken: res.accessToken, refreshToken: res.refreshToken });
    setUser(res.user);
    toast.success('로그인 되었습니다');
  }, []);

  const oauth2Login = useCallback(async (provider: 'GOOGLE' | 'APPLE', idToken: string) => {
    // 소셜 로그인 처리: 백엔드 검증 → 토큰 저장 → 사용자 상태 반영
    const res: LoginResponse = await authApi.oauth2Login({ token: idToken, providerType: provider });
    authStorage.save({ accessToken: res.accessToken, refreshToken: res.refreshToken });
    setUser(res.user);
    toast.success(`${provider === 'GOOGLE' ? 'Google' : 'Apple'}로 로그인되었습니다`);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      authStorage.clear();
      setUser(null);
      toast.success('로그아웃 되었습니다');
    }
  }, []);

  const refresh = useCallback(async () => {
    const refreshToken = authStorage.getRefreshToken();
    if (!refreshToken) throw new Error('리프레시 토큰이 없습니다');
    const tokens = await authApi.refresh(refreshToken);
    authStorage.save(tokens);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, login, logout, refresh, oauth2Login }),
    [user, isLoading, login, logout, refresh, oauth2Login]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 내부에서만 사용해야 합니다');
  return ctx;
}


