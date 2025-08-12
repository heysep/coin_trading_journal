import { NextRequest, NextResponse } from 'next/server';

// 서버 전용 라우트: 구글 Authorization Code를 ID 토큰으로 교환한 후
// 백엔드 `/api/oauth2/login`에 전달하여 우리 서비스 토큰을 발급받는다.

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    if (!code) {
      return NextResponse.json({ error: 'code is required' }, { status: 400 });
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET; // 서버 전용
    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Google OAuth client configuration missing' }, { status: 500 });
    }

    const origin = new URL(request.url).origin;
    const redirectUri = `${origin}/auth/google/callback`;

    // 1) authorization_code → token 교환
    const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenJson = await tokenResp.json();
    if (!tokenResp.ok) {
      return NextResponse.json({ error: 'google_token_error', details: tokenJson }, { status: 502 });
    }

    const idToken = tokenJson.id_token as string | undefined;
    if (!idToken) {
      return NextResponse.json({ error: 'id_token_not_found', details: tokenJson }, { status: 502 });
    }

    // 2) 우리 백엔드 OAuth2 로그인
    const backendBase = process.env.BACKEND_BASE_URL || 'http://localhost:8080';
    const loginResp = await fetch(`${backendBase.replace(/\/$/, '')}/api/oauth2/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: idToken, providerType: 'GOOGLE' }),
    });

    const loginJson = await loginResp.json();
    return NextResponse.json(loginJson, { status: loginResp.status });
  } catch (error: any) {
    return NextResponse.json({ error: 'unexpected_error', message: error?.message }, { status: 500 });
  }
}


