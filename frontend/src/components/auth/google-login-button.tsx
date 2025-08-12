'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { signInOAuth2 } from '@/lib/api/auth-api';
import { toast } from 'sonner';

declare global {
  interface Window {
    google?: any;
  }
}

type GoogleLoginButtonProps = {
  // 로그인 성공 시 호출 콜백
  onSuccess?: () => void;
};

export function GoogleLoginButton({ onSuccess }: GoogleLoginButtonProps) {
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // 구글 버튼 초기화 함수
  const initializeGoogle = () => {
    if (!window.google || !clientId || !buttonContainerRef.current) return;
    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: any) => {
          const idToken = response?.credential as string | undefined;
          if (!idToken) return;
          setIsLoading(true);
          try {
            await signInOAuth2({ providerType: 'GOOGLE', token: idToken });
            toast.success('구글 로그인 성공');
            onSuccess?.();
          } catch (e: any) {
            toast.error(e?.response?.data?.message || e?.message || '구글 로그인 실패');
          } finally {
            setIsLoading(false);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // 렌더 버튼
      window.google.accounts.id.renderButton(buttonContainerRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        width: 340,
      });
    } catch (err) {
      // 초기화 실패시 조용히 무시
    }
  };

  useEffect(() => {
    // 스크립트가 이미 로드된 경우 대비
    const t = setTimeout(initializeGoogle, 100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  return (
    <>
      {/* 구글 Identity Services 스크립트 */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initializeGoogle}
      />

      {/* 버튼 컨테이너 (구글에서 렌더링) */}
      <div ref={buttonContainerRef} className="flex justify-center" />

      {/* 폴백 버튼 (스크립트 실패 시) */}
      {!clientId && (
        <Button type="button" variant="outline" className="w-full" disabled={isLoading}>
          Google로 계속하기 (Client ID 필요)
        </Button>
      )}
    </>
  );
}


