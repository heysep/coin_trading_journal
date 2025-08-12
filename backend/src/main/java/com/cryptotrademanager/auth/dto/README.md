# Auth DTO Package

인증 관련 데이터 전송 객체들을 정의하는 패키지입니다.

## Request DTOs

### 인증 관련
- **LoginRequest**: 로그인 요청 (이메일, 비밀번호)
- **RegisterRequest**: 회원가입 요청 (이메일, 비밀번호, 이름 등)
- **ChangePasswordRequest**: 비밀번호 변경 요청
- **ForgotPasswordRequest**: 비밀번호 재설정 요청
- **ResetPasswordRequest**: 비밀번호 재설정 확인 요청

### API 키 관련
- **ApiKeyRequest**: API 키 등록/수정 요청
- **ApiKeyTestRequest**: API 키 연동 테스트 요청

### 보안 관련
- **Enable2FARequest**: 2FA 활성화 요청
- **Verify2FARequest**: 2FA 코드 검증 요청

## Response DTOs

### 인증 응답
- **LoginResponse**: 로그인 응답 (토큰, 사용자 정보)
- **TokenResponse**: 토큰 갱신 응답
- **UserProfileResponse**: 사용자 프로필 응답

### API 키 응답
- **ApiKeyResponse**: API 키 정보 응답
- **ApiKeyTestResponse**: API 키 테스트 결과

### 보안 응답
- **SessionResponse**: 세션 정보 응답
- **SecuritySettingsResponse**: 보안 설정 응답