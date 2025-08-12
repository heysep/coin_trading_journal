'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/components/providers/auth-provider';
import { authStorage } from '@/lib/auth-storage';

export default function GoogleCallbackPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { oauth2Login } = useAuth();

  useEffect(() => {
    const code = params.get('code');
    const error = params.get('error');

    if (error) {
      toast.error(`Google 로그인 오류: ${error}`);
      router.replace('/login');
      return;
    }
    if (!code) return;

    // 서버 라우트로 code 전달 → 토큰 교환 및 백엔드 로그인
    (async () => {
      try {
        const resp = await fetch('/api/google/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });
        const json = await resp.json();
        const payload = json?.data || json; // ApiResponse<T> 또는 직접 T
        if (!resp.ok || !payload?.accessToken) {
          toast.error(json?.message || 'Google 로그인에 실패했습니다');
          router.replace('/login');
          return;
        }
        // 액세스/리프레시 토큰 저장 후 리다이렉트 (AuthProvider가 부팅 시 me() 호출)
        authStorage.save({
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
        });
        // 라우팅만으로 충분하지만 캐시된 컨텍스트 초기화를 위해 하드 리로드가 더 안전
        window.location.replace('/');
      } catch (e: any) {
        toast.error(e?.message || 'Google 로그인 중 오류 발생');
        router.replace('/login');
      }
    })();
  }, [params, router, oauth2Login]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <div className="w-full max-w-sm bg-card border rounded-lg p-6 text-center">
        구글 로그인 처리 중...
      </div>
    </div>
  );
}


