# Trading Entity Package

거래 및 주문 관련 데이터베이스 엔티티를 정의하는 패키지입니다.

## 주요 엔티티 클래스

### Order Entity
- **id**: 주문 ID (Primary Key)
- **userId**: 사용자 ID
- **exchangeId**: 거래소 ID
- **symbolId**: 거래 심볼 ID
- **clientOrderId**: 클라이언트 주문 ID
- **side**: 매매 구분 (BUY/SELL)
- **type**: 주문 타입 (MARKET/LIMIT/STOP_LOSS/TAKE_PROFIT)
- **quantity**: 주문 수량
- **price**: 주문 가격
- **executedQuantity**: 체결 수량
- **status**: 주문 상태 (NEW/FILLED/CANCELED/REJECTED)
- **timeInForce**: 주문 유효 기간 (GTC/IOC/FOK)
- **createdAt**: 주문 생성 시간
- **updatedAt**: 주문 수정 시간

### Position Entity
- **id**: 포지션 ID
- **userId**: 사용자 ID
- **symbolId**: 심볼 ID
- **quantity**: 보유 수량
- **averagePrice**: 평균 단가
- **unrealizedPnL**: 미실현 손익
- **realizedPnL**: 실현 손익
- **side**: 포지션 방향 (LONG/SHORT)
- **openTime**: 포지션 오픈 시간
- **lastUpdateTime**: 마지막 업데이트 시간

### Trade Entity
- **id**: 거래 ID
- **userId**: 사용자 ID
- **orderId**: 주문 ID
- **symbolId**: 심볼 ID
- **side**: 매매 구분
- **quantity**: 거래 수량
- **price**: 거래 가격
- **fee**: 거래 수수료
- **feeAsset**: 수수료 자산
- **realizedPnL**: 실현 손익
- **tradeTime**: 거래 시간

### Portfolio Entity
- **id**: 포트폴리오 ID
- **userId**: 사용자 ID
- **name**: 포트폴리오 이름
- **totalValue**: 총 가치
- **totalCost**: 총 비용
- **unrealizedPnL**: 미실현 손익
- **realizedPnL**: 실현 손익
- **returnRate**: 수익률
- **createdAt**: 생성 시간
- **updatedAt**: 수정 시간

### RiskSettings Entity
- **userId**: 사용자 ID (Primary Key)
- **maxDailyLoss**: 일일 최대 손실 한도
- **maxPositionSize**: 최대 포지션 크기
- **maxDrawdown**: 최대 드로우다운 한도
- **stopLossPercent**: 기본 손절 비율
- **takeProfitPercent**: 기본 익절 비율
- **isEmergencyStopEnabled**: 비상 정지 활성화