# DTO 패키지

인증 관련 데이터 전송 객체(Data Transfer Object) 클래스들입니다.

## 클래스 목록

### AuthRequest
**기능**: 인증 요청 DTO 모음 (내부 클래스들)
- `SignIn` - 로그인 요청 (이메일, 비밀번호)
- `SignUp` - 회원가입 요청 (이메일, 비밀번호, 이름)
- `TokenRefresh` - 토큰 갱신 요청 (리프레시 토큰)
- `SignOut` - 로그아웃 요청 (리프레시 토큰)
- `ChangePassword` - 비밀번호 변경 요청

### LoginRequest
**기능**: 로그인 요청 전용 DTO
- 이메일과 비밀번호 검증 포함

### LoginResponse
**기능**: 로그인 성공 응답 DTO
- 액세스 토큰, 리프레시 토큰, 사용자 정보 포함

### OAuth2LoginRequest  
**기능**: OAuth2 로그인 요청 DTO
- OAuth2 토큰과 제공업체 정보 포함

### OAuth2UserInfo
**기능**: OAuth2 사용자 정보 DTO
- 외부 제공업체에서 받은 사용자 정보

### RegisterRequest
**기능**: 회원가입 요청 DTO
- 이메일, 비밀번호, 이름 등 가입 정보

### TokenResponse
**기능**: 토큰 관련 응답 DTO
- 액세스 토큰과 리프레시 토큰 정보

## 검증 규칙

### 이메일
- `@Email` - 유효한 이메일 형식
- `@NotBlank` - 필수 입력

### 비밀번호
- `@NotBlank` - 필수 입력
- `@Size(min = 8, max = 100)` - 8자 이상 100자 이하

### 이름
- `@NotBlank` - 필수 입력
- `@Size(min = 1, max = 100)` - 1자 이상 100자 이하