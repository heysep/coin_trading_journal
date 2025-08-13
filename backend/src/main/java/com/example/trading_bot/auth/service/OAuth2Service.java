package com.example.trading_bot.auth.service;

import com.example.trading_bot.auth.config.OAuth2Properties;
import com.example.trading_bot.auth.dto.GoogleTokenInfo;
import com.example.trading_bot.auth.dto.OAuth2UserInfo;
import com.example.trading_bot.auth.entity.ProviderType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.io.IOException;

@Slf4j
@Service
public class OAuth2Service {

    private final OAuth2Properties oauth2Properties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public OAuth2Service(OAuth2Properties oauth2Properties,
                        @Qualifier("oauth2ObjectMapper") ObjectMapper objectMapper,
                        @Qualifier("oauth2HttpClient") HttpClient httpClient) {
        this.oauth2Properties = oauth2Properties;
        this.objectMapper = objectMapper;
        this.httpClient = httpClient;
    }

    public OAuth2UserInfo verifyOAuth2Token(String token, ProviderType providerType) {
        return switch (providerType) {
            case GOOGLE -> verifyGoogleToken(token);
            case APPLE -> verifyAppleToken(token);
            default -> throw new IllegalArgumentException("지원하지 않는 OAuth2 Provider입니다: " + providerType);
        };
    }

    private OAuth2UserInfo verifyGoogleToken(String googleToken) {
        try {
            String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + googleToken;
            
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();
            
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() != 200) {
                throw new IllegalArgumentException("Google 토큰 검증에 실패했습니다. Status: " + response.statusCode());
            }
            
            GoogleTokenInfo tokenInfo = objectMapper.readValue(response.body(), GoogleTokenInfo.class);
            validateGoogleTokenInfo(tokenInfo);

            return OAuth2UserInfo.builder()
                    .id(tokenInfo.getSub())
                    .email(tokenInfo.getEmail())
                    .name(tokenInfo.getName())
                    .picture(tokenInfo.getPicture())
                    .emailVerified(tokenInfo.isEmail_verified())
                    .build();

        } catch (IOException | InterruptedException e) {
            log.error("Google 토큰 검증 실패: {}", e.getMessage());
            throw new IllegalArgumentException("Google 토큰이 유효하지 않습니다.");
        }
    }

    private void validateGoogleTokenInfo(GoogleTokenInfo tokenInfo) {
        if (tokenInfo == null) {
            throw new IllegalArgumentException("Google 토큰 검증에 실패했습니다.");
        }

        String googleClientId = oauth2Properties.getGoogle().getClientId();
        if (!googleClientId.equals(tokenInfo.getAud())) {
            log.warn("클라이언트 ID 불일치: 예상={}, 실제={}", googleClientId, tokenInfo.getAud());
        }
    }

    private OAuth2UserInfo verifyAppleToken(String appleToken) {
        throw new IllegalArgumentException("Apple 로그인은 현재 개발 중입니다.");
    }

}
