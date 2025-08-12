# Trading Validator Package

거래 실행 전 유효성 검증 및 리스크 검사를 담당하는 패키지입니다.

## 주요 검증 클래스

### OrderValidator
- **validateOrderRequest()**: 주문 요청 기본 유효성 검증
- **validateOrderQuantity()**: 주문 수량 유효성 검증
- **validateOrderPrice()**: 주문 가격 유효성 검증
- **validateSymbolTradability()**: 심볼 거래 가능성 검증
- **validateOrderType()**: 주문 타입 적합성 검증

### BalanceValidator
- **validateSufficientBalance()**: 잔고 충분성 검증
- **validateMinimumOrderSize()**: 최소 주문 크기 검증
- **validateMaximumOrderSize()**: 최대 주문 크기 검증
- **validateTradingFeeDeduction()**: 거래 수수료 차감 검증

### RiskValidator
- **validateDailyLossLimit()**: 일일 손실 한도 검증
- **validatePositionSizeLimit()**: 포지션 크기 한도 검증
- **validateMaxDrawdownLimit()**: 최대 드로우다운 한도 검증
- **validateConcentrationRisk()**: 집중 위험 검증
- **validateLeverageLimit()**: 레버리지 한도 검증

### MarketValidator
- **validateMarketHours()**: 거래 시간 검증
- **validateMarketVolatility()**: 시장 변동성 검증
- **validateLiquidity()**: 유동성 충분성 검증
- **validateCircuitBreaker()**: 서킷 브레이커 상태 검증
- **validateMarketDepth()**: 시장 깊이 검증

### StrategyValidator
- **validateStrategyParameters()**: 전략 매개변수 유효성 검증
- **validateSignalQuality()**: 매매 신호 품질 검증
- **validateStrategyRisk()**: 전략 위험도 검증
- **validateBacktestResults()**: 백테스트 결과 유효성 검증

### ComplianceValidator
- **validateRegulatoryCompliance()**: 규제 준수 검증
- **validateAntiMoneyLaundering()**: 자금세탁방지 검증
- **validateKYCRequirements()**: 고객확인제도 검증
- **validateTaxCompliance()**: 세법 준수 검증

### TechnicalValidator
- **validateApiConnectivity()**: API 연결 상태 검증
- **validateSystemCapacity()**: 시스템 처리 용량 검증
- **validateDataIntegrity()**: 데이터 무결성 검증
- **validateExecutionCapability()**: 실행 능력 검증

### ValidationResult
- **isValid**: 검증 결과 (true/false)
- **errorCode**: 오류 코드
- **errorMessage**: 오류 메시지
- **warnings**: 경고 사항
- **recommendedAction**: 권장 조치