# Resources Directory

Spring Boot 애플리케이션의 설정 파일 및 리소스를 관리하는 디렉토리입니다.

## 디렉토리 구조

### /config
- **application.yml**: 메인 애플리케이션 설정
- **application-dev.yml**: 개발 환경 설정
- **application-prod.yml**: 운영 환경 설정
- **application-test.yml**: 테스트 환경 설정
- **database.yml**: 데이터베이스 설정
- **redis.yml**: Redis 캐시 설정
- **security.yml**: 보안 관련 설정

### /static
- **css/**: CSS 스타일시트 파일
- **js/**: JavaScript 파일
- **images/**: 이미지 리소스
- **icons/**: 아이콘 파일
- **docs/**: API 문서 및 가이드

### /templates
- **email/**: 이메일 템플릿
- **notification/**: 알림 템플릿
- **report/**: 보고서 템플릿

### /db
- **migration/**: 데이터베이스 마이그레이션 스크립트
- **seed/**: 초기 데이터 스크립트
- **schema/**: 데이터베이스 스키마 정의

### /i18n
- **messages.properties**: 기본 메시지
- **messages_ko.properties**: 한국어 메시지
- **messages_en.properties**: 영어 메시지

### /crypto
- **certificates/**: SSL 인증서
- **keys/**: API 키 및 암호화 키 (환경별)

## 주요 설정 파일

- **application.properties**: 기본 애플리케이션 설정
- **logback-spring.xml**: 로깅 설정
- **banner.txt**: 애플리케이션 시작 배너