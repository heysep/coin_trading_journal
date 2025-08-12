# Database Migration Directory

데이터베이스 마이그레이션 스크립트를 관리하는 디렉토리입니다.

## 마이그레이션 도구
- **Flyway**: 데이터베이스 버전 관리 도구
- **Liquibase**: 대안 마이그레이션 도구 (선택사항)

## 네이밍 규칙
- **V{버전}_{날짜}_{설명}.sql**
- 예시: `V1_20240101_create_user_table.sql`

## 주요 마이그레이션 파일 (예정)

### Core Tables
- **V1_001_create_user_tables.sql**: 사용자 관련 테이블
- **V1_002_create_exchange_tables.sql**: 거래소 관련 테이블
- **V1_003_create_trading_tables.sql**: 거래 관련 테이블
- **V1_004_create_strategy_tables.sql**: 전략 관련 테이블
- **V1_005_create_bot_tables.sql**: 봇 관련 테이블

### Data Tables
- **V2_001_create_market_data_tables.sql**: 시장 데이터 테이블
- **V2_002_create_analysis_tables.sql**: 분석 데이터 테이블
- **V2_003_create_notification_tables.sql**: 알림 관련 테이블
- **V2_004_create_audit_tables.sql**: 감사 관련 테이블

### Index & Constraints
- **V3_001_add_indexes.sql**: 인덱스 추가
- **V3_002_add_constraints.sql**: 제약조건 추가
- **V3_003_add_triggers.sql**: 트리거 추가 (필요시)

## 실행 순서
1. Core Tables (사용자, 기본 설정)
2. Data Tables (거래, 시장 데이터)
3. Index & Constraints (성능 최적화)