# Trading Executor Package

실제 주문 실행 및 거래 처리 엔진을 담당하는 패키지입니다.

## 주요 실행 엔진 클래스

### OrderExecutor
- **executeMarketOrder()**: 시장가 주문 실행
- **executeLimitOrder()**: 지정가 주문 실행
- **executeStopLossOrder()**: 손절 주문 실행
- **executeTakeProfitOrder()**: 익절 주문 실행
- **cancelOrder()**: 주문 취소 실행
- **modifyOrder()**: 주문 수정 실행

### BatchOrderExecutor
- **executeBatchOrders()**: 배치 주문 일괄 실행
- **executePortfolioRebalance()**: 포트폴리오 리밸런싱 실행
- **executeDCAStrategy()**: DCA 전략 실행
- **executeGridTrading()**: 그리드 트레이딩 실행

### SmartOrderExecutor
- **executeTWAP()**: 시간 가중 평균 가격 주문
- **executeVWAP()**: 거래량 가중 평균 가격 주문
- **executeIcebergOrder()**: 빙산 주문 실행
- **executeSlicedOrder()**: 분할 주문 실행

### RiskControlledExecutor
- **executeWithRiskCheck()**: 리스크 검증 후 주문 실행
- **executeWithPositionLimit()**: 포지션 한도 검증 후 실행
- **executeWithDrawdownCheck()**: 드로우다운 검증 후 실행
- **emergencyStopExecution()**: 비상 정지 실행

### ExecutionOptimizer
- **optimizeExecutionTiming()**: 실행 타이밍 최적화
- **minimizeSlippage()**: 슬리피지 최소화
- **optimizeOrderSize()**: 주문 크기 최적화
- **selectOptimalExchange()**: 최적 거래소 선택

### ExecutionMonitor
- **monitorOrderExecution()**: 주문 실행 모니터링
- **trackExecutionQuality()**: 실행 품질 추적
- **detectExecutionAnomalies()**: 실행 이상 징후 탐지
- **generateExecutionReport()**: 실행 보고서 생성

### LiquidityManager
- **assessLiquidity()**: 유동성 평가
- **fragmentLargeOrders()**: 대량 주문 분할
- **scheduleOrderExecution()**: 주문 실행 스케줄링
- **adaptToMarketConditions()**: 시장 상황 적응