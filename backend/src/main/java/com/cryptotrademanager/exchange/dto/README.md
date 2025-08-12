# Exchange DTO Package

거래소 연동 관련 데이터 전송 객체들을 정의하는 패키지입니다.

## Request DTOs

### Market Data Requests
- **CandleDataRequest**: 캔들 데이터 조회 요청 (심볼, 기간, 시작/종료일)
- **TickerRequest**: 실시간 시세 조회 요청
- **OrderbookRequest**: 호가창 데이터 조회 요청
- **SymbolListRequest**: 심볼 목록 조회 요청

### Trading Data Requests
- **BalanceRequest**: 잔고 조회 요청
- **OrderHistoryRequest**: 주문 내역 조회 요청 (기간, 상태, 페이징)
- **TradeHistoryRequest**: 거래 내역 조회 요청
- **PositionRequest**: 포지션 정보 조회 요청

### Sync Requests
- **DataSyncRequest**: 데이터 동기화 요청
- **HistoricalSyncRequest**: 과거 데이터 동기화 요청
- **RealTimeSyncRequest**: 실시간 동기화 설정 요청

## Response DTOs

### Market Data Responses
- **CandleDataResponse**: 캔들 차트 데이터 응답
- **TickerResponse**: 실시간 시세 데이터
- **OrderbookResponse**: 호가창 데이터
- **SymbolInfoResponse**: 심볼 상세 정보
- **MarketStatsResponse**: 시장 통계 데이터

### Trading Data Responses
- **BalanceResponse**: 계좌 잔고 정보
- **OrderResponse**: 주문 정보
- **TradeResponse**: 거래 정보
- **PositionResponse**: 포지션 정보

### Exchange Info Responses
- **ExchangeInfoResponse**: 거래소 기본 정보
- **ExchangeStatusResponse**: 거래소 상태 정보
- **ApiLimitResponse**: API 제한 정보
- **SyncStatusResponse**: 동기화 상태 정보