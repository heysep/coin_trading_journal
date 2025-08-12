# Exchange Entity Package

거래소 관련 데이터베이스 엔티티를 정의하는 패키지입니다.

## 주요 엔티티 클래스

### Exchange Entity
- **id**: 거래소 ID
- **name**: 거래소 이름 (BINANCE, UPBIT 등)
- **displayName**: 표시 이름
- **isActive**: 활성화 상태
- **apiEndpoint**: API 엔드포인트 URL
- **websocketEndpoint**: 웹소켓 엔드포인트
- **supportedFeatures**: 지원 기능 목록

### Symbol Entity
- **id**: 심볼 ID
- **exchangeId**: 거래소 ID
- **symbol**: 심볼명 (BTC/USDT)
- **baseAsset**: 기준 자산 (BTC)
- **quoteAsset**: 견적 자산 (USDT)
- **isActive**: 거래 활성화 상태
- **minOrderSize**: 최소 주문 수량
- **tickSize**: 가격 단위

### CandleData Entity
- **id**: 캔들 데이터 ID
- **symbolId**: 심볼 ID
- **timeFrame**: 시간 프레임 (1m, 5m, 1h 등)
- **openTime**: 시작 시간
- **closeTime**: 종료 시간
- **openPrice**: 시가
- **highPrice**: 고가
- **lowPrice**: 저가
- **closePrice**: 종가
- **volume**: 거래량
- **quoteVolume**: 견적 거래량

### Trade Entity
- **id**: 거래 ID
- **userId**: 사용자 ID
- **exchangeId**: 거래소 ID
- **symbolId**: 심볼 ID
- **orderId**: 주문 ID
- **side**: 매매 구분 (BUY/SELL)
- **quantity**: 거래 수량
- **price**: 거래 가격
- **fee**: 수수료
- **feeAsset**: 수수료 자산
- **tradeTime**: 거래 시간

### Balance Entity
- **id**: 잔고 ID
- **userId**: 사용자 ID
- **exchangeId**: 거래소 ID
- **asset**: 자산명
- **free**: 사용 가능한 잔고
- **locked**: 주문 중인 잔고
- **total**: 총 잔고
- **lastUpdated**: 마지막 업데이트 시간