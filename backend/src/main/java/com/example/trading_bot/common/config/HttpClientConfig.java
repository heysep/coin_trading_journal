package com.example.trading_bot.common.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.http.HttpClient;
import java.time.Duration;

/**
 * HTTP 클라이언트 및 JSON 매핑 설정
 * 
 * OAuth2 토큰 검증 등 외부 API 호출을 위한 HttpClient와
 * JSON 직렬화/역직렬화를 위한 ObjectMapper를 Bean으로 제공합니다.
 */
@Configuration
@EnableCaching
public class HttpClientConfig {

    /**
     * OAuth2 토큰 검증용 HttpClient Bean
     * 
     * @return 설정된 HttpClient 인스턴스
     */
    @Bean("oauth2HttpClient")
    public HttpClient oauth2HttpClient() {
        return HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    /**
     * OAuth2 응답 파싱용 ObjectMapper Bean
     * 
     * snake_case 응답을 camelCase로 매핑하도록 설정
     * 
     * @return 설정된 ObjectMapper 인스턀스
     */
    @Bean("oauth2ObjectMapper")
    public ObjectMapper oauth2ObjectMapper() {
        return new ObjectMapper()
                .setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
    }
}