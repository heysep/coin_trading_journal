# Repository 패키지

사용자 인증 관련 데이터 액세스 레이어입니다.

## 클래스 목록

### UserRepository
**기능**: 사용자 엔티티 데이터 액세스
- Spring Data JPA 기반 리포지토리
- 사용자 조회, 저장, 수정, 삭제 기능

## 주요 메서드

### 기본 조회
- `findById(Long id)` - ID로 사용자 조회
- `findByEmail(String email)` - 이메일로 사용자 조회
- `existsByEmail(String email)` - 이메일 존재 여부 확인

### OAuth2 관련
- `findByProviderTypeAndProviderId(ProviderType, String)` - OAuth2 사용자 조회
- `findByRefreshToken(String refreshToken)` - 리프레시 토큰으로 사용자 조회

### 활성 사용자 관리
- `findByIsActiveTrue()` - 활성 사용자 목록 조회
- `countByIsActiveTrue()` - 활성 사용자 수 조회

## 사용 예시

```java
@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
    }
}
```

## 인덱스 권장사항

성능 최적화를 위해 다음 컬럼에 인덱스 생성 권장:
- `email` (고유 인덱스)
- `provider_type, provider_id` (복합 인덱스)
- `refresh_token` (인덱스)
- `is_active` (인덱스)