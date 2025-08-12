# Config Directory

애플리케이션별 상세 설정 파일들을 관리하는 디렉토리입니다.

## 설정 파일 구조

### Core Application Settings
- **application.yml**: 메인 애플리케이션 설정 (포트, 프로파일 등)
- **application-dev.yml**: 개발 환경 전용 설정
- **application-prod.yml**: 운영 환경 전용 설정  
- **application-test.yml**: 테스트 환경 전용 설정

### Database Configuration
- **database.yml**: 데이터베이스 연결 설정
  - Primary/Secondary DB 설정
  - 커넥션 풀 설정
  - 트랜잭션 설정
  - JPA/Hibernate 설정

### Cache Configuration  
- **redis.yml**: Redis 캐시 설정
  - 클러스터 설정
  - 세션 저장소 설정
  - 캐시 TTL 설정
  - 직렬화 설정

### Security Configuration
- **security.yml**: 보안 관련 설정
  - JWT 설정 (만료시간, 비밀키)
  - CORS 설정
  - 암호화 설정
  - 2FA 설정

### External API Configuration
- **exchange-api.yml**: 거래소 API 설정
  - Binance, Upbit API 엔드포인트
  - API 호출 제한 설정
  - 웹소켓 설정
  - 재시도 정책

### Monitoring & Logging
- **monitoring.yml**: 모니터링 설정
  - Actuator 설정
  - 메트릭 수집 설정
  - 헬스 체크 설정

### Notification Configuration
- **notification.yml**: 알림 설정
  - 이메일 서버 설정
  - SMS 서비스 설정
  - 푸시 알림 설정
  - 알림 템플릿 경로

### Scheduler Configuration
- **scheduler.yml**: 스케줄러 작업 설정
  - 데이터 수집 주기
  - 백업 스케줄
  - 리포트 생성 주기
  - 정리 작업 설정