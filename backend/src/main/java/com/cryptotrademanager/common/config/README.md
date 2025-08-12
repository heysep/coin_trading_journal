# Config Package

Spring Boot 애플리케이션의 전체 설정을 담당하는 패키지입니다.

## 주요 설정 클래스

- **SecurityConfig**: Spring Security 설정, JWT 인증, 권한 관리
- **DatabaseConfig**: JPA, Hibernate, 데이터베이스 연결 설정
- **RedisConfig**: Redis 캐시 설정 및 세션 관리
- **WebConfig**: CORS, 인터셉터, 메시지 컨버터 설정
- **SchedulerConfig**: 스케줄링 작업 설정 (자동매매, 데이터 수집)
- **ApiConfig**: 외부 API 연동 설정 (거래소 API, 뉴스 API)
- **CacheConfig**: 애플리케이션 레벨 캐시 설정