# Auth Security Package

Spring Security 설정 및 보안 관련 필터, 핸들러를 관리하는 패키지입니다.

## 주요 보안 컴포넌트

### Security Configuration
- **SecurityConfig**: Spring Security 메인 설정
- **CorsConfig**: CORS 정책 설정
- **PasswordConfig**: 비밀번호 인코더 설정

### JWT Components
- **JwtAuthenticationFilter**: JWT 토큰 검증 필터
- **JwtTokenProvider**: JWT 토큰 생성/검증 프로바이더
- **JwtAuthenticationEntryPoint**: JWT 인증 실패 핸들러
- **JwtAccessDeniedHandler**: JWT 접근 거부 핸들러

### Authentication Providers
- **CustomAuthenticationProvider**: 커스텀 인증 프로바이더
- **ApiKeyAuthenticationProvider**: API 키 기반 인증 프로바이더
- **TwoFactorAuthenticationProvider**: 2FA 인증 프로바이더

### Security Services
- **CustomUserDetailsService**: 사용자 세부 정보 서비스
- **SecurityAuditService**: 보안 감사 서비스
- **SessionService**: 세션 관리 서비스

### Security Handlers
- **CustomAuthenticationSuccessHandler**: 로그인 성공 핸들러
- **CustomAuthenticationFailureHandler**: 로그인 실패 핸들러
- **CustomLogoutSuccessHandler**: 로그아웃 성공 핸들러

### Security Filters
- **RateLimitingFilter**: 요청 속도 제한 필터
- **IpWhitelistFilter**: IP 화이트리스트 필터
- **SecurityHeadersFilter**: 보안 헤더 추가 필터