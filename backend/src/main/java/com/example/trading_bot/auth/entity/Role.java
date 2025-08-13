package com.example.trading_bot.auth.entity;

/**
 * 사용자 역할 열거형
 * - 사용자 권한 관리를 위한 역할 정의
 */
public enum Role {
    /**
     * 일반 사용자 권한
     * - 기본 거래 기능 사용 가능
     */
    USER,
    
    /**
     * 관리자 권한  
     * - 시스템 관리 및 모든 기능 접근 가능
     */
    ADMIN
}