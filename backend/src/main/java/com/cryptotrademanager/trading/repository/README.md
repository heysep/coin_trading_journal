# Trading Repository Package

거래 관련 데이터 액세스 레이어를 담당하는 리포지토리 인터페이스들을 정의하는 패키지입니다.

## 주요 리포지토리 인터페이스

### OrderRepository
- **findByUserIdOrderByCreatedAtDesc()**: 사용자별 주문 내역 (최신순)
- **findByUserIdAndStatus()**: 사용자별 특정 상태 주문 조회
- **findByUserIdAndSymbolId()**: 사용자별 특정 심볼 주문 조회
- **findActiveOrdersByUserId()**: 활성 주문 목록 (NEW, PARTIALLY_FILLED)
- **findByClientOrderId()**: 클라이언트 주문 ID로 조회
- **countByUserIdAndStatusAndCreatedAtBetween()**: 기간별 주문 수 통계

### PositionRepository
- **findByUserIdAndSymbolId()**: 사용자별 특정 심볼 포지션 조회
- **findByUserIdOrderByQuantityDesc()**: 사용자 포지션 목록 (수량순)
- **findActivePositionsByUserId()**: 활성 포지션 목록 (수량 > 0)
- **calculateTotalPositionValue()**: 총 포지션 가치 계산
- **findByUserIdAndUnrealizedPnLLessThan()**: 손실 포지션 조회
- **findLargestPositionsByUser()**: 최대 포지션 조회

### TradeRepository
- **findByUserIdOrderByTradeTimeDesc()**: 사용자별 거래 내역 (시간순)
- **findByUserIdAndSymbolIdAndTradeTimeBetween()**: 기간별 특정 심볼 거래
- **calculateRealizedPnLByUser()**: 사용자별 실현 손익 계산
- **findTradesByDateRange()**: 날짜 범위별 거래 조회
- **findByOrderId()**: 주문 ID별 거래 조회
- **getTradingVolumeByPeriod()**: 기간별 거래량 통계

### PortfolioRepository
- **findByUserId()**: 사용자별 포트폴리오 조회
- **findByUserIdAndName()**: 이름별 포트폴리오 조회
- **calculatePortfolioPerformance()**: 포트폴리오 성과 계산
- **findTopPerformingPortfolios()**: 상위 성과 포트폴리오
- **updatePortfolioValue()**: 포트폴리오 가치 업데이트

### RiskSettingsRepository
- **findByUserId()**: 사용자별 리스크 설정 조회
- **findUsersWithEmergencyStop()**: 비상 정지 활성화 사용자
- **findByMaxDailyLossGreaterThan()**: 최소 손실 한도 이상 설정자
- **updateRiskSettings()**: 리스크 설정 업데이트

## Custom Query Methods

### 분석 및 통계 쿼리
- **findMostTradedSymbolsByUser()**: 사용자별 가장 많이 거래된 심볼
- **calculateWinRate()**: 승률 계산
- **findBestPerformingTrades()**: 최고 수익 거래
- **calculateAverageHoldingPeriod()**: 평균 보유 기간
- **findTradingPatternsByUser()**: 사용자별 거래 패턴
- **calculateMaxDrawdown()**: 최대 드로우다운 계산
- **findRiskExposureByAsset()**: 자산별 위험 노출도