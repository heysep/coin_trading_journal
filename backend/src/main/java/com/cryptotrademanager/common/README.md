# Common Package

공통 유틸리티 및 공유 컴포넌트를 관리하는 패키지입니다.

## 주요 구성 요소

### config/
- Spring Boot 설정 클래스들
- SecurityConfig, DatabaseConfig, RedisConfig 등
- API 공통 설정 및 CORS 설정

### dto/
- 공통 응답 DTO (ApiResponse, ErrorResponse)
- 페이징 관련 DTO (PageRequest, PageResponse)
- 공통 요청/응답 모델

### entity/
- BaseEntity (생성일, 수정일, 생성자, 수정자)
- 공통 엔티티 속성 정의

### exception/
- 커스텀 예외 클래스들
- GlobalExceptionHandler
- 비즈니스 예외 정의

### util/
- 날짜/시간 유틸리티
- 암호화/복호화 유틸리티
- 문자열 처리 유틸리티
- 계산 관련 유틸리티 (금융 계산 등)

### validator/
- 커스텀 검증 어노테이션
- 비즈니스 규칙 검증기
- 입력값 유효성 검사기