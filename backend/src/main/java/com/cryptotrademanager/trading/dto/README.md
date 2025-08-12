# Trading DTO Package

거래 실행 및 주문 관리 관련 데이터 전송 객체들을 정의하는 패키지입니다.

## Request DTOs

### Order Requests
- **CreateOrderRequest**: 주문 생성 요청 (심볼, 수량, 가격, 주문타입)
- **ModifyOrderRequest**: 주문 수정 요청 (수량, 가격 변경)
- **CancelOrderRequest**: 주문 취소 요청
- **BatchOrderRequest**: 배치 주문 요청 (여러 주문 일괄 처리)

### Position Requests
- **ClosePositionRequest**: 포지션 정리 요청
- **ModifyPositionRequest**: 포지션 수정 요청
- **PositionQueryRequest**: 포지션 조회 요청

### Trading Requests
- **MarketOrderRequest**: 시장가 주문 요청
- **LimitOrderRequest**: 지정가 주문 요청
- **StopLossRequest**: 손절 주문 요청
- **TakeProfitRequest**: 익절 주문 요청
- **DCAOrderRequest**: DCA 매매 요청

### Risk Management Requests
- **RiskSettingsRequest**: 리스크 설정 요청
- **EmergencyStopRequest**: 비상 정지 요청
- **LimitUpdateRequest**: 한도 설정 변경 요청

## Response DTOs

### Order Responses
- **OrderResponse**: 주문 정보 응답
- **OrderStatusResponse**: 주문 상태 응답
- **OrderExecutionResponse**: 주문 체결 결과
- **OrderHistoryResponse**: 주문 내역 응답

### Position Responses
- **PositionResponse**: 포지션 정보 응답
- **PositionSummaryResponse**: 포지션 요약 응답
- **PositionPerformanceResponse**: 포지션 성과 응답
- **UnrealizedPnLResponse**: 미실현 손익 응답

### Trading Responses
- **ExecutionResponse**: 거래 실행 결과
- **TradingStatsResponse**: 거래 통계 응답
- **SlippageResponse**: 슬리피지 분석 결과
- **LiquidityResponse**: 유동성 분석 결과

### Portfolio Responses
- **PortfolioResponse**: 포트폴리오 조회 응답
- **PortfolioPerformanceResponse**: 포트폴리오 성과
- **AllocationResponse**: 자산 배분 현황
- **RebalanceResponse**: 리밸런싱 결과