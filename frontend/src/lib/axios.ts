import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearAuthStorage } from '@/lib/token-storage';

// Axios 인스턴스 생성 및 기본 설정
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '', // 로컬 API 사용을 위해 빈 문자열로 설정
  timeout: 10000, // 10초 타임아웃 설정
  headers: {
    'Content-Type': 'application/json',
    // API 키는 환경변수에서 가져오기 (사용자의 보안 선호도 반영)
    ...(process.env.NEXT_PUBLIC_API_KEY && {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    }),
  },
});

// 요청 인터셉터 - 요청 전 공통 처리
apiClient.interceptors.request.use(
  (config) => {
    // 로컬 인증 토큰을 우선적으로 Authorization 헤더에 부착
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    // 요청 로깅 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log('API 요청:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    console.error('요청 에러:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 응답 후 공통 처리
apiClient.interceptors.response.use(
  (response) => {
    // 응답 로깅 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log('API 응답:', response.status, response.config.url);
    }
    return response;
  },
  async (error) => {
    // 에러 상태별 처리
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    switch (status) {
      case 401:
        console.error('인증 에러: 로그인이 필요합니다');
        // 액세스 토큰 만료 시 자동 갱신 시도
        try {
          const refreshToken = getRefreshToken();
          if (refreshToken && !error.config._retry) {
            error.config._retry = true;
            const refreshResponse = await axios.post(
              `${apiClient.defaults.baseURL || ''}/api/auth/refresh`,
              {},
              { headers: { Authorization: `Bearer ${refreshToken}` } }
            );
            const newAccess = refreshResponse.data?.data?.accessToken;
            const newRefresh = refreshResponse.data?.data?.refreshToken || refreshToken;
            if (newAccess) {
              setTokens({ accessToken: newAccess, refreshToken: newRefresh });
              error.config.headers = error.config.headers || {};
              error.config.headers.Authorization = `Bearer ${newAccess}`;
              return apiClient.request(error.config);
            }
          }
        } catch (refreshErr) {
          clearAuthStorage();
        }
        break;
      case 403:
        console.error('권한 에러: 접근 권한이 없습니다');
        break;
      case 404:
        console.error('요청한 리소스를 찾을 수 없습니다');
        break;
      case 500:
        console.error('서버 에러: 나중에 다시 시도해주세요');
        break;
      default:
        console.error('API 에러:', message);
    }

    return Promise.reject(error);
  }
);
