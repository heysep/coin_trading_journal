# Auth Controller Package

사용자 인증 및 권한 관리 관련 REST API 컨트롤러를 담당하는 패키지입니다.

## 주요 컨트롤러 클래스

### AuthController
- **POST** `/api/auth/login`: 사용자 로그인
- **POST** `/api/auth/logout`: 사용자 로그아웃
- **POST** `/api/auth/refresh`: 토큰 갱신
- **POST** `/api/auth/forgot-password`: 비밀번호 재설정 요청

### UserController
- **POST** `/api/users/register`: 사용자 회원가입
- **GET** `/api/users/profile`: 사용자 프로필 조회
- **PUT** `/api/users/profile`: 사용자 프로필 수정
- **POST** `/api/users/change-password`: 비밀번호 변경

### ApiKeyController
- **GET** `/api/users/api-keys`: 거래소 API 키 목록 조회
- **POST** `/api/users/api-keys`: 거래소 API 키 등록
- **PUT** `/api/users/api-keys/{id}`: API 키 수정
- **DELETE** `/api/users/api-keys/{id}`: API 키 삭제

### SecurityController
- **POST** `/api/security/2fa/enable`: 2단계 인증 활성화
- **POST** `/api/security/2fa/verify`: 2FA 코드 검증
- **GET** `/api/security/sessions`: 활성 세션 조회
- **DELETE** `/api/security/sessions/{id}`: 세션 종료