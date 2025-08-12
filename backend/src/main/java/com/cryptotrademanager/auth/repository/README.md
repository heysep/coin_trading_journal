# Auth Repository Package

인증 관련 데이터 액세스 레이어를 담당하는 리포지토리 인터페이스들을 정의하는 패키지입니다.

## 주요 리포지토리 인터페이스

### UserRepository
- **findByEmail()**: 이메일로 사용자 조회
- **findByEmailAndIsActiveTrue()**: 활성화된 사용자 조회
- **existsByEmail()**: 이메일 존재 여부 확인
- **findUsersWithExpiredSessions()**: 만료된 세션을 가진 사용자 조회
- **countActiveUsers()**: 활성 사용자 수 조회

### RoleRepository
- **findByName()**: 권한 이름으로 조회
- **findAllByOrderByNameAsc()**: 권한 목록 정렬 조회

### UserApiKeyRepository
- **findByUserIdAndExchangeName()**: 사용자별 거래소 API 키 조회
- **findByUserIdAndIsActiveTrue()**: 활성화된 API 키 목록
- **countByUserIdAndIsActiveTrue()**: 사용자별 활성 API 키 수
- **findByApiKeyHash()**: API 키 해시로 조회

### UserSessionRepository
- **findBySessionToken()**: 세션 토큰으로 조회
- **findByUserIdAndIsActiveTrue()**: 사용자 활성 세션 목록
- **deleteExpiredSessions()**: 만료된 세션 삭제
- **countActiveSessionsByUserId()**: 사용자별 활성 세션 수

### SecuritySettingsRepository
- **findByUserId()**: 사용자별 보안 설정 조회
- **findUsersWithEnable2FA()**: 2FA 활성화 사용자 조회

## Custom Query Methods

### 복합 조건 조회
- **findUsersByRoleAndStatus()**: 권한 및 상태별 사용자 조회
- **findApiKeysByExchangeAndPermission()**: 거래소 및 권한별 API 키 조회
- **findSessionsByIpAndTimeRange()**: IP 및 시간 범위별 세션 조회