# Exchange Scheduler Package

거래소 데이터 수집 및 동기화를 위한 스케줄링 작업을 담당하는 패키지입니다.

## 주요 스케줄러 클래스

### MarketDataScheduler
- **collectRealTimeData()**: 실시간 시세 데이터 수집 (1분마다)
- **collectCandleData()**: 캔들 차트 데이터 수집 (5분마다)
- **updateTickerData()**: 티커 정보 업데이트 (30초마다)
- **collectVolumeData()**: 거래량 데이터 수집 (1분마다)

### TradingDataScheduler
- **syncTradeHistory()**: 거래 내역 동기화 (10분마다)
- **updateBalances()**: 잔고 정보 업데이트 (5분마다)
- **syncOrderStatus()**: 주문 상태 동기화 (1분마다)
- **collectPositionData()**: 포지션 정보 수집 (5분마다)

### DataCleanupScheduler
- **cleanupOldCandleData()**: 오래된 캔들 데이터 정리 (매일 새벽 2시)
- **archiveTradeHistory()**: 거래 내역 아카이빙 (매주 일요일)
- **cleanupCache()**: 캐시 데이터 정리 (1시간마다)
- **compressHistoricalData()**: 과거 데이터 압축 (매월 1일)

### HealthCheckScheduler
- **checkExchangeConnectivity()**: 거래소 연결 상태 확인 (1분마다)
- **validateApiCredentials()**: API 자격증명 유효성 검사 (1시간마다)
- **monitorApiLimits()**: API 호출 제한 모니터링 (실시간)
- **generateHealthReport()**: 시스템 상태 보고서 생성 (매일)

### NotificationScheduler
- **sendDataSyncAlerts()**: 데이터 동기화 알림 (오류 발생 시)
- **sendSystemStatusUpdates()**: 시스템 상태 업데이트 (매시간)
- **sendMaintenanceNotices()**: 유지보수 알림 (예정된 작업 시)

## 스케줄링 설정

### 실행 주기 설정
- **실시간 데이터**: 30초 ~ 1분 간격
- **일반 데이터**: 5분 ~ 10분 간격
- **정리 작업**: 매일 ~ 매월 간격
- **상태 확인**: 1분 ~ 1시간 간격

### 에러 처리
- **재시도 로직**: 3회 재시도 후 알림
- **스케줄 복구**: 실패한 작업 자동 재스케줄링
- **우선순위**: 중요도에 따른 작업 우선순위 관리