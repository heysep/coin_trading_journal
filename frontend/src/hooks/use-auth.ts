'use client';

import { useEffect, useState, useCallback } from 'react';
import { getUser, clearAuthStorage } from '@/lib/token-storage';

// 현재 인증 상태를 반환하는 훅
export function useAuth<TUser = any>() {
  // 사용자 정보 상태
  const [currentUser, setCurrentUser] = useState<TUser | null>(null);

  // 인증 여부
  const isAuthenticated = !!currentUser;

  // 로컬스토리지에서 사용자 로드
  const loadUserFromStorage = useCallback(() => {
    const user = getUser<TUser>();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    loadUserFromStorage();
    // 스토리지 변경 감지 (다른 탭 포함)
    const handler = () => loadUserFromStorage();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [loadUserFromStorage]);

  // 로그아웃 (스토리지 초기화만 처리, 서버 로그아웃은 페이지에서 호출)
  const localSignOut = useCallback(() => {
    clearAuthStorage();
    setCurrentUser(null);
  }, []);

  return { currentUser, isAuthenticated, reloadUser: loadUserFromStorage, localSignOut };
}


