# Exchange Controller Package

거래소 연동 관련 REST API 엔드포인트를 제공하는 컨트롤러들을 담당하는 패키지입니다.

## 주요 컨트롤러 클래스

### ExchangeController
- **GET** `/api/exchanges`: 지원하는 거래소 목록 조회
- **GET** `/api/exchanges/{exchange}/status`: 거래소 연결 상태 확인
- **POST** `/api/exchanges/{exchange}/sync`: 거래소 데이터 수동 동기화

### MarketDataController
- **GET** `/api/market/symbols`: 거래 가능한 심볼 목록
- **GET** `/api/market/{symbol}/ticker`: 실시간 시세 조회
- **GET** `/api/market/{symbol}/candles`: 캔들 차트 데이터 조회
- **GET** `/api/market/{symbol}/orderbook`: 호가창 데이터 조회

### TradingDataController
- **GET** `/api/trading/balance`: 계좌 잔고 조회
- **GET** `/api/trading/orders`: 주문 내역 조회
- **GET** `/api/trading/trades`: 거래 내역 조회
- **GET** `/api/trading/positions`: 포지션 정보 조회

### DataSyncController
- **POST** `/api/sync/historical`: 과거 데이터 동기화
- **POST** `/api/sync/trades`: 거래 내역 동기화
- **GET** `/api/sync/status`: 동기화 상태 조회
- **DELETE** `/api/sync/cache`: 캐시 데이터 초기화