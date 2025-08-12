# Test Directory

CryptoTradeManager 애플리케이션의 테스트 코드를 관리하는 디렉토리입니다.

## 테스트 전략

### Unit Tests (단위 테스트)
- 각 메소드별 독립적인 테스트
- Mock 객체를 활용한 의존성 격리
- 테스트 커버리지 80% 이상 목표
- 빠른 실행 속도 (전체 5분 이내)

### Integration Tests (통합 테스트)
- 실제 데이터베이스 연동 테스트
- 외부 API 통합 테스트 (Mock 서버 활용)
- Spring Context 로딩 테스트
- 트랜잭션 테스트

### End-to-End Tests (E2E 테스트)
- 실제 거래소 API 연동 테스트 (테스트넷)
- 전체 워크플로우 테스트
- 성능 테스트 (부하, 스트레스)
- 보안 테스트

## 테스트 도구 및 프레임워크

### Core Testing
- **JUnit 5**: 기본 테스트 프레임워크
- **AssertJ**: 풍부한 단언문
- **Mockito**: Mock 객체 생성
- **TestContainers**: 컨테이너 기반 테스트

### Spring Boot Testing
- **@SpringBootTest**: 통합 테스트
- **@WebMvcTest**: 웹 레이어 테스트
- **@DataJpaTest**: JPA 레이어 테스트
- **@JsonTest**: JSON 직렬화 테스트

### Security Testing
- **Spring Security Test**: 보안 테스트
- **JWT 테스트**: 토큰 검증 테스트
- **인증/인가 테스트**: 권한별 접근 테스트

## 패키지 구조

각 메인 패키지와 동일한 구조로 구성:
- **common/**: 공통 테스트 유틸리티
- **auth/**: 인증/인가 테스트
- **exchange/**: 거래소 연동 테스트
- **trading/**: 거래 실행 테스트
- **strategy/**: 전략 및 백테스트 테스트
- **bot/**: 자동매매 봇 테스트
- **analysis/**: 분석 기능 테스트
- **notification/**: 알림 기능 테스트
- **dashboard/**: 대시보드 테스트
- **audit/**: 감사 기능 테스트