# Auth 패키지

CryptoTradeManager의 사용자 인증 및 권한 관리 시스템입니다.

## 주요 기능

### 인증 방식
- **일반 로그인**: 이메일/비밀번호 기반 회원가입 및 로그인
- **OAuth2 소셜 로그인**: 구글, 애플 등 외부 제공업체 연동
- **JWT 토큰**: Access Token (단기) + Refresh Token (장기) 방식

### 보안 기능
- BCrypt 비밀번호 암호화
- JWT 토큰 검증 및 만료 관리
- Spring Security 기반 인증/인가
- CORS 설정 지원

## 패키지 구조

```
auth/
├── config/           # Spring Security 설정
│   ├── SecurityConfig.java      # 보안 설정 (CORS, CSRF, 인증 규칙)
│   └── OAuth2Properties.java    # OAuth2 설정 프로퍼티
├── controller/       # REST API 엔드포인트
│   ├── AuthController.java      # 일반 인증 API (/auth/*)
│   └── OAuth2Controller.java    # OAuth2 인증 API (/oauth2/*)
├── dto/             # 요청/응답 데이터 객체
│   ├── AuthRequest.java         # 인증 요청 DTO 모음
│   ├── LoginResponse.java       # 로그인 응답 (토큰 + 사용자 정보)
│   ├── TokenResponse.java       # 토큰 갱신 응답
│   └── OAuth2UserInfo.java      # OAuth2 사용자 정보
├── entity/          # 데이터베이스 엔티티
│   ├── User.java               # 사용자 정보 엔티티
│   ├── Role.java               # 권한 열거형 (USER, ADMIN)
│   ├── ProviderType.java       # 인증 제공업체 (LOCAL, GOOGLE, APPLE)
│   └── RefreshToken.java       # 리프레시 토큰 엔티티
├── jwt/             # JWT 토큰 관리
│   └── JwtTokenProvider.java   # JWT 생성, 검증, 파싱
├── repository/      # 데이터 액세스 레이어
│   └── UserRepository.java    # 사용자 데이터 조회
├── security/        # Spring Security 설정
│   └── UserPrincipal.java     # 인증된 사용자 정보
└── service/         # 비즈니스 로직
    ├── AuthService.java       # 인증 핵심 로직
    ├── OAuth2Service.java     # OAuth2 토큰 검증
    ├── UserService.java       # 사용자 관리
    └── CustomUserDetailsService.java  # Spring Security 연동
```

## 주요 클래스

### 🔐 AuthService
- 회원가입, 로그인, 로그아웃 처리
- JWT 토큰 생성 및 갱신
- OAuth2 사용자 처리

### 🎫 JwtTokenProvider  
- JWT Access/Refresh 토큰 생성
- 토큰 검증 및 사용자 정보 추출
- 토큰 만료 시간 관리

### 👤 User Entity
- 일반 사용자 + OAuth2 사용자 통합 관리
- 프로필 정보 및 리프레시 토큰 저장
- 계정 활성화 상태 관리

### 🛡️ SecurityConfig
- Spring Security 보안 설정
- CORS, CSRF 정책 설정
- API 접근 권한 정의

## API 엔드포인트

### 일반 인증 (/auth)
```
POST /auth/signup     # 회원가입
POST /auth/signin     # 로그인  
POST /auth/refresh    # 토큰 갱신
POST /auth/logout     # 로그아웃
GET  /auth/me         # 내 정보 조회
```

### OAuth2 인증 (/oauth2)
```
POST /oauth2/login    # OAuth2 로그인
```

## 설정 방법

### application.yaml 필수 설정
```yaml
jwt:
  secret: "your-secret-key-here"
  access-token-validity-in-seconds: 1800    # 30분
  refresh-token-validity-in-seconds: 1209600 # 14일

oauth2:
  google:
    client-id: "your-google-client-id"
    client-secret: "your-google-client-secret"
  apple:
    client-id: "your-apple-client-id"
    team-id: "your-apple-team-id"
    key-id: "your-apple-key-id"
    private-key: "your-apple-private-key"
```

## 보안 고려사항

- **JWT Secret**: 충분히 복잡한 비밀키 사용 (최소 32자)
- **HTTPS**: 프로덕션에서는 반드시 HTTPS 사용
- **토큰 만료**: Access Token은 짧게, Refresh Token은 적절히 설정
- **OAuth2 설정**: 각 제공업체의 보안 가이드라인 준수
- **API 키 보호**: 환경변수로 민감한 정보 관리