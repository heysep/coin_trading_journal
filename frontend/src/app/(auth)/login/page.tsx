'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInLocal, signInOAuth2, OAuth2LoginRequestDto } from '@/lib/api/auth-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { GoogleLoginButton } from '@/components/auth/google-login-button';

// 폼 스키마 정의 (기본 유효성 검사)
const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // RHF 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  // 일반 로그인 제출 처리
  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signInLocal(values);
      toast.success('로그인 성공');
      router.replace('/');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || '로그인 실패');
    } finally {
      setIsLoading(false);
    }
  };

  // 구글 로그인 처리 (구글 원탭/팝업 대신 id_token 입력 분기 제공)
  const handleGoogleLogin = async () => {
    // 실제 운영에선 Google Identity Services 사용하여 id_token 획득 필요
    // 여기서는 환경변수/프롬프트 등에서 토큰을 받아 테스트할 수 있게 처리
    const googleIdToken = window.prompt('Google ID Token을 입력하세요');
    if (!googleIdToken) return;
    const payload: OAuth2LoginRequestDto = { providerType: 'GOOGLE', token: googleIdToken };
    setIsLoading(true);
    try {
      await signInOAuth2(payload);
      toast.success('구글 로그인 성공');
      router.replace('/');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || '구글 로그인 실패');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>로그인</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              이메일로 로그인
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">또는</span>
            </div>
          </div>

          {/* 실제 배포 시 Google Identity Services 버튼 사용 */}
          <div className="w-full">
            <GoogleLoginButton onSuccess={() => router.replace('/')} />
          </div>
          {/* 개발/테스트용 수동 토큰 입력 버튼 */}
          <Button variant="outline" className="w-full mt-3" onClick={handleGoogleLogin} disabled={isLoading}>
            (개발용) Google ID Token 직접 입력
          </Button>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          로그인 시 약관 및 개인정보 처리방침에 동의하게 됩니다.
        </CardFooter>
      </Card>
    </div>
  );
}


