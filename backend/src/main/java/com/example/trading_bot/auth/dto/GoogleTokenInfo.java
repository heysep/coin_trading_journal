package com.example.trading_bot.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Google OAuth2 토큰 검증 응답 DTO
 * - Google tokeninfo API의 응답 데이터를 매핑
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GoogleTokenInfo {
    
    /**
     * Google 사용자 고유 ID
     */
    private String sub;
    
    /**
     * 사용자 이메일
     */
    private String email;
    
    /**
     * 사용자 이름
     */
    private String name;
    
    /**
     * 프로필 이미지 URL
     */
    private String picture;
    
    /**
     * 클라이언트 ID (audience)
     */
    private String aud;
    
    /**
     * 이메일 인증 여부
     */
    private boolean email_verified;
}