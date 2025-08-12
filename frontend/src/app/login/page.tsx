'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/components/providers/auth-provider';
import Script from 'next/script';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// 로그인 폼 검증 스키마
const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, oauth2Login } = useAuth();
  const router = useRouter();
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
      router.replace('/');
    } catch (error) {
      form.setError('root', {
        type: 'server',
        message: (error as any)?.message || '로그인에 실패했습니다',
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <div className="w-full max-w-sm bg-card border rounded-lg p-6">
        <h1 className="text-xl font-semibold mb-1">로그인</h1>
        <p className="text-sm text-muted-foreground mb-6">이메일과 비밀번호를 입력하세요</p>

        {/* Google / Apple SDK 로딩 */}
        <Script
          id="google-identity"
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
        <Script
          id="apple-js"
          src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
          strategy="afterInteractive"
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* 이메일 입력 */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 비밀번호 입력 */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="비밀번호" autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
            )}

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        </Form>

        {/* 구분선 */}
        <div className="my-4 text-center text-sm text-muted-foreground">또는</div>

        {/* Google 로그인 버튼 */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full mb-2 h-11"
          disabled={googleLoading}
          onClick={async () => {
            try {
              const g = (window as any).google;
              if (!g?.accounts?.id) throw new Error('Google SDK 로드 실패');
              const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
              if (!clientId) throw new Error('환경변수 NEXT_PUBLIC_GOOGLE_CLIENT_ID 가 설정되지 않았습니다');

              setGoogleLoading(true);
              g.accounts.id.initialize({
                client_id: clientId,
                // FedCM 임시 비활성화 (환경 이슈 최소화)
                use_fedcm_for_prompt: false,
                auto_select: false,
                context: 'signin',
                itp_support: true,
                callback: async (resp: any) => {
                  try {
                    if (resp?.credential) {
                      await oauth2Login('GOOGLE', resp.credential);
                      router.replace('/');
                    } else {
                      form.setError('root', { type: 'server', message: 'Google 로그인에 실패했습니다' });
                    }
                  } finally {
                    setGoogleLoading(false);
                  }
                },
              });
              // 프롬프트 상태 콜백: 표시 안됨/건너뜀/닫힘 등 모든 케이스에서 로딩 해제
              g.accounts.id.prompt((notification: any) => {
                if (notification?.isNotDisplayed?.() || notification?.isSkippedMoment?.() || notification?.isDismissedMoment?.()) {
                  const reason =
                    notification?.getNotDisplayedReason?.() ||
                    notification?.getSkippedReason?.() ||
                    notification?.getDismissedReason?.() ||
                    '알 수 없는 이유로 로그인 창을 표시하지 못했습니다';
                  form.setError('root', { type: 'server', message: `Google 로그인 실패: ${reason}` });
                  setGoogleLoading(false);
                }
              });
            } catch (e: any) {
              form.setError('root', { type: 'server', message: e?.message || 'Google 로그인 실패' });
            } finally {
              // initialize 또는 prompt 호출 이전 예외에도 로딩 해제 보장
              setGoogleLoading(false);
            }
          }}
        >
          <span className="flex items-center justify-center gap-2">
            {/* 공식 로고 파일 사용 */}
            <Image src="/logos/google.svg" alt="Google" width={20} height={20} className="shrink-0" />
            <span>{googleLoading ? 'Google로 로그인 중...' : 'Google로 로그인'}</span>
          </span>
        </Button>

        {/* Apple 로그인 버튼 */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full h-11"
          onClick={async () => {
            try {
              const AppleID = (window as any).AppleID;
              if (!AppleID?.auth) throw new Error('Apple JS SDK 로드 실패');
              const appleClientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
              if (!appleClientId) throw new Error('환경변수 NEXT_PUBLIC_APPLE_CLIENT_ID 가 설정되지 않았습니다');

              AppleID.auth.init({
                clientId: appleClientId,
                scope: 'name email',
                redirectURI: typeof window !== 'undefined' ? window.location.origin + '/login' : undefined,
                usePopup: true,
              });

              const res = await AppleID.auth.signIn();
              const idToken = res?.authorization?.id_token;
              if (!idToken) throw new Error('Apple ID Token을 받지 못했습니다');
              await oauth2Login('APPLE', idToken);
              router.replace('/');
            } catch (e: any) {
              form.setError('root', { type: 'server', message: e?.message || 'Apple 로그인 실패' });
            }
          }}
        >
          <span className="flex items-center justify-center gap-2">
            <Image src="/logos/apple.svg" alt="Apple" width={18} height={18} className="shrink-0" />
            <span>Apple로 로그인</span>
          </span>
        </Button>
      </div>
    </div>
  );
}


