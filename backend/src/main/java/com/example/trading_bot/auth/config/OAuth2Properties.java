package com.example.trading_bot.auth.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * OAuth2 설정 프로퍼티 클래스
 * 
 * application.yml 파일의 oauth2 설정을 바인딩하여 관리합니다.
 * 각 OAuth2 제공자별 클라이언트 ID와 시크릿 정보를 포함합니다.
 * 
 * 설정 예시 (application.yml):
 * oauth2:
 *   google:
 *     client-id: your-google-client-id
 *   apple:
 *     client-id: your-apple-client-id
 */
@Component
@ConfigurationProperties(prefix = "oauth2")
@Getter
@Setter
public class OAuth2Properties {

    /**
     * Google OAuth2 설정
     */
    private Google google = new Google();
    
    /**
     * Apple OAuth2 설정
     */
    private Apple apple = new Apple();

    /**
     * Google OAuth2 설정 내부 클래스
     * 
     * Google OAuth2 인증에 필요한 설정 정보를 담습니다.
     * Google Developer Console에서 발급받은 클라이언트 정보를 설정해야 합니다.
     */
    @Getter
    @Setter
    public static class Google {
        /**
         * Google OAuth2 클라이언트 ID
         * 
         * Google Cloud Console (https://console.cloud.google.com/)에서
         * OAuth 2.0 클라이언트 ID를 생성하여 설정합니다.
         * 
         * 주의: 실제 운영환경에서는 반드시 실제 클라이언트 ID로 교체해야 합니다.
         */
        private String clientId = "default-google-client-id";
    }

    /**
     * Apple OAuth2 설정 내부 클래스
     * 
     * Apple Sign In에 필요한 설정 정보를 담습니다.
     * Apple Developer 계정에서 발급받은 클라이언트 정보를 설정해야 합니다.
     */
    @Getter
    @Setter
    public static class Apple {
        /**
         * Apple OAuth2 클라이언트 ID (서비스 ID)
         * 
         * Apple Developer Portal에서 Sign In with Apple을 위한
         * Services ID를 생성하여 설정합니다.
         * 
         * 주의: 실제 운영환경에서는 반드시 실제 클라이언트 ID로 교체해야 합니다.
         */
        private String clientId = "default-apple-client-id";
    }
}