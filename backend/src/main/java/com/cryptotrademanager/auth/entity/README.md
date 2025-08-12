# Auth Entity Package

사용자 및 인증 관련 데이터베이스 엔티티를 정의하는 패키지입니다.

## 주요 엔티티 클래스

### User Entity
- **id**: 사용자 고유 ID (Primary Key)
- **email**: 이메일 주소 (Unique)
- **password**: 암호화된 비밀번호
- **firstName**: 이름
- **lastName**: 성
- **isActive**: 계정 활성화 상태
- **lastLoginAt**: 마지막 로그인 시간
- **createdAt**, **updatedAt**: 생성/수정 시간

### Role Entity
- **id**: 권한 ID
- **name**: 권한 이름 (ADMIN, USER, TRADER 등)
- **description**: 권한 설명
- **permissions**: 권한별 허용 작업

### UserApiKey Entity
- **id**: API 키 ID
- **userId**: 사용자 ID (Foreign Key)
- **exchangeName**: 거래소 이름 (BINANCE, UPBIT 등)
- **apiKey**: 암호화된 API 키
- **secretKey**: 암호화된 Secret 키
- **isActive**: 활성화 상태
- **permissions**: API 키 권한 설정

### UserSession Entity
- **id**: 세션 ID
- **userId**: 사용자 ID
- **sessionToken**: 세션 토큰
- **ipAddress**: 접속 IP 주소
- **userAgent**: 브라우저 정보
- **expiresAt**: 만료 시간
- **isActive**: 활성화 상태

### SecuritySettings Entity
- **userId**: 사용자 ID (Primary Key)
- **is2FAEnabled**: 2FA 활성화 여부
- **secretKey2FA**: 2FA 비밀키
- **backupCodes**: 백업 코드
- **loginNotification**: 로그인 알림 설정