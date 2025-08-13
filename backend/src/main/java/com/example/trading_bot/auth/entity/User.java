package com.example.trading_bot.auth.entity;

import com.example.trading_bot.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 사용자 엔티티 클래스
 * - 일반 로그인 및 OAuth2 소셜 로그인 사용자 모두 지원
 * - JWT 인증용 리프레시 토큰 관리
 */
@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 320)
    private String email;

    @Column(length = 255)
    private String password; // 일반 회원가입용, OAuth2 사용자는 null

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider_type", nullable = false)
    private ProviderType providerType; // LOCAL, GOOGLE, GITHUB 등

    @Column(name = "provider_id")
    private String providerId; // OAuth2 provider에서 제공하는 사용자 ID

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "refresh_token", length = 500)
    private String refreshToken; // JWT 토큰 갱신용

    @Builder
    public User(String email, String password, String name, String profileImageUrl,
                ProviderType providerType, String providerId, Role role, Boolean isActive) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.profileImageUrl = profileImageUrl;
        this.providerType = providerType;
        this.providerId = providerId;
        this.role = role;
        this.isActive = isActive;
    }

    // 리프레시 토큰 설정 (로그인/로그아웃 시 사용)
    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    // 프로필 정보 업데이트 (OAuth2 재로그인 시 사용)
    public void updateProfile(String name, String profileImageUrl) {
        if (name != null && !name.equals(this.name)) {
            this.name = name;
        }
        if (profileImageUrl != null && !profileImageUrl.equals(this.profileImageUrl)) {
            this.profileImageUrl = profileImageUrl;
        }
    }

    // OAuth2 제공자 정보 연결 (이메일 중복 사용자 처리용)
    public void linkProvider(ProviderType providerType, String providerId) {
        this.providerType = providerType;
        this.providerId = providerId;
    }
}