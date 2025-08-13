# Controller 패키지

인증 관련 REST API 엔드포인트를 제공하는 컨트롤러 클래스들입니다.

## 클래스 목록

### AuthController
**기능**: 일반 인증 API 엔드포인트
- `POST /auth/signup` - 회원가입
- `POST /auth/signin` - 로그인
- `POST /auth/refresh` - 토큰 갱신
- `POST /auth/logout` - 로그아웃
- `GET /auth/me` - 내 정보 조회

### OAuth2Controller  
**기능**: OAuth2 소셜 로그인 API 엔드포인트
- `POST /oauth2/login` - OAuth2 로그인 (구글, 애플)

## 공통 응답 형식

### 성공 응답
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "사용자"
    }
  }
}
```

### 오류 응답
```json
{
  "success": false,
  "error": {
    "code": "AUTH_FAILED",
    "message": "인증에 실패했습니다."
  }
}
```

## 인증 헤더

API 호출 시 Authorization 헤더에 Bearer 토큰을 포함해야 합니다:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```