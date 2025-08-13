# Service 패키지

인증 관련 비즈니스 로직을 처리하는 서비스 클래스들입니다.

## 클래스 목록

### AuthService
**기능**: 인증 핵심 비즈니스 로직
- 회원가입, 로그인, 로그아웃 처리
- JWT 토큰 생성 및 갱신 관리
- OAuth2 사용자 처리

### OAuth2Service
**기능**: OAuth2 토큰 검증 및 사용자 정보 조회
- 구글, 애플 등 외부 제공업체 토큰 검증
- OAuth2 사용자 정보 변환 및 처리

### UserService  
**기능**: 사용자 정보 관리
- 사용자 프로필 조회 및 수정
- 계정 상태 관리

### CustomUserDetailsService
**기능**: Spring Security 연동 서비스
- UserDetailsService 구현체
- 로그인 시 사용자 정보 로드

## 주요 기능별 서비스

### 인증 플로우 (AuthService)
1. **회원가입**: 이메일 중복 검사 → 비밀번호 암호화 → 사용자 생성
2. **로그인**: 사용자 조회 → 비밀번호 검증 → JWT 토큰 생성
3. **토큰 갱신**: 리프레시 토큰 검증 → 새 액세스 토큰 발급
4. **로그아웃**: 리프레시 토큰 삭제

### OAuth2 플로우 (OAuth2Service)
1. **토큰 검증**: 제공업체별 토큰 검증 API 호출
2. **사용자 정보 조회**: 토큰으로 사용자 정보 획득
3. **계정 연동**: 기존 계정 연동 또는 신규 계정 생성

## 트랜잭션 관리

### @Transactional 적용
- **readOnly = true**: 조회 전용 메서드에 적용
- **기본값**: 데이터 변경 메서드에 적용
- **롤백 정책**: RuntimeException 발생 시 자동 롤백

## 예외 처리

### 공통 예외
- `IllegalArgumentException` - 잘못된 요청 파라미터
- `EntityNotFoundException` - 엔티티 조회 실패
- `AuthenticationException` - 인증 실패

### 예외 처리 권장사항
```java
public User findUserByEmail(String email) {
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + email));
}
```