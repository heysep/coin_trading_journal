# Exchange Client Package

외부 거래소 API와의 직접적인 통신을 담당하는 클라이언트 클래스들을 정의하는 패키지입니다.

## 주요 클라이언트 클래스

### 거래소별 클라이언트

#### BinanceApiClient
- **getAccountInfo()**: 계정 정보 조회
- **getBalances()**: 잔고 조회
- **getOrderHistory()**: 주문 내역 조회
- **getTradeHistory()**: 거래 내역 조회
- **getCandlestickData()**: 캔들스틱 데이터 조회
- **get24hrTicker()**: 24시간 시세 정보
- **getOrderBook()**: 호가창 정보

#### UpbitApiClient
- **getAccounts()**: 계정 조회
- **getOrdersChance()**: 주문 가능 정보
- **getOrders()**: 주문 목록 조회
- **getTickers()**: 현재가 정보
- **getCandlesMinutes()**: 분봉 조회
- **getCandlesDays()**: 일봉 조회

### 공통 클라이언트 인터페이스

#### ExchangeApiClient (Interface)
- **authenticate()**: API 키 인증
- **getAccountBalance()**: 잔고 조회 공통 인터페이스
- **getMarketData()**: 시장 데이터 조회 공통 인터페이스
- **getOrderHistory()**: 주문 내역 조회 공통 인터페이스
- **subscribeToRealTimeData()**: 실시간 데이터 구독

### 유틸리티 클래스

#### ApiClientFactory
- **createClient()**: 거래소별 클라이언트 생성
- **getClientByExchange()**: 거래소명으로 클라이언트 조회
- **validateApiCredentials()**: API 자격증명 검증

#### RateLimiter
- **checkRateLimit()**: API 호출 제한 확인
- **waitForRateLimit()**: 제한 해제 대기
- **updateRateLimit()**: 제한 상태 업데이트

#### ResponseParser
- **parseMarketData()**: 시장 데이터 파싱
- **parseTradingData()**: 거래 데이터 파싱
- **parseErrorResponse()**: 에러 응답 파싱
- **normalizeData()**: 데이터 정규화