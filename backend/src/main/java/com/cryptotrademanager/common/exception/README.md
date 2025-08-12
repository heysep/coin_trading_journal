# Exception Package

애플리케이션 전체의 예외 처리 및 커스텀 예외를 관리하는 패키지입니다.

## 주요 예외 클래스

### Custom Exceptions
- **BusinessException**: 비즈니스 로직 예외
- **ValidationException**: 유효성 검사 실패 예외
- **AuthenticationException**: 인증 관련 예외
- **AuthorizationException**: 권한 관련 예외
- **ResourceNotFoundException**: 리소스 없음 예외
- **ExternalApiException**: 외부 API 호출 실패 예외

### Exception Handlers
- **GlobalExceptionHandler**: 전역 예외 처리기
- **ValidationExceptionHandler**: 유효성 검사 예외 처리
- **SecurityExceptionHandler**: 보안 관련 예외 처리

### Error Codes
- **ErrorCode**: 에러 코드 상수 정의
- **ErrorMessage**: 에러 메시지 상수 정의