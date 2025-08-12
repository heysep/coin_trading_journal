import axios from 'axios';

// Axios 인스턴스 생성 및 기본 설정
export const apiClient = axios.create({
  // 기본 API 베이스 URL 우선순위: NEXT_PUBLIC_API_BASE_URL > NEXT_PUBLIC_API_URL > ''(동일 오리진)
  baseURL:
    (process.env.NEXT_PUBLIC_API_BASE_URL as string | undefined) ||
    (process.env.NEXT_PUBLIC_API_URL as string | undefined) ||
    '',
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
  (error) => {
    // 에러 상태별 처리
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    switch (status) {
      case 401:
        console.error('인증 에러: 로그인이 필요합니다');
        // 필요시 로그인 페이지로 리다이렉트 로직 추가
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
