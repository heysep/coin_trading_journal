# Exchange Repository Package

거래소 관련 데이터 액세스 레이어를 담당하는 리포지토리 인터페이스들을 정의하는 패키지입니다.

## 주요 리포지토리 인터페이스

### ExchangeRepository
- **findByName()**: 거래소명으로 조회
- **findByIsActiveTrue()**: 활성화된 거래소 목록
- **findByNameAndIsActiveTrue()**: 활성화된 특정 거래소 조회

### SymbolRepository
- **findByExchangeIdAndIsActiveTrue()**: 거래소별 활성 심볼 목록
- **findBySymbol()**: 심볼명으로 조회
- **findByBaseAssetAndQuoteAsset()**: 기준/견적 자산으로 조회
- **findPopularSymbols()**: 인기 심볼 목록

### CandleDataRepository
- **findBySymbolIdAndTimeFrameAndOpenTimeBetween()**: 심볼/기간별 캔들 데이터 조회
- **findLatestCandleBySymbolAndTimeFrame()**: 최신 캔들 데이터 조회
- **findBySymbolIdAndTimeFrameOrderByOpenTimeDesc()**: 최근 캔들 데이터 정렬 조회
- **deleteOldCandleData()**: 오래된 캔들 데이터 삭제

### TradeRepository
- **findByUserIdOrderByTradeTimeDesc()**: 사용자별 거래 내역 (시간순)
- **findByUserIdAndSymbolIdAndTradeTimeBetween()**: 기간별 특정 심볼 거래 내역
- **findByUserIdAndSide()**: 매매 구분별 거래 내역
- **calculateTotalProfitLoss()**: 총 손익 계산
- **findTradesByDateRange()**: 날짜 범위별 거래 조회

### BalanceRepository
- **findByUserIdAndExchangeId()**: 사용자별 거래소 잔고 조회
- **findByUserIdAndAsset()**: 특정 자산 잔고 조회
- **findByUserIdAndTotalGreaterThan()**: 최소 잔고 이상 자산 조회
- **updateBalance()**: 잔고 업데이트
- **findLatestBalanceByUser()**: 사용자 최신 잔고 조회

## Custom Query Methods

### 통계 관련 쿼리
- **findMostTradedSymbols()**: 가장 많이 거래된 심볼
- **calculateDailyTradingVolume()**: 일별 거래량 계산
- **findTopPerformingAssets()**: 수익률 높은 자산
- **getTradingStatsByPeriod()**: 기간별 거래 통계

### 분석 관련 쿼리
- **findCandleDataForAnalysis()**: 분석용 캔들 데이터 조회
- **findTradePatterns()**: 거래 패턴 분석
- **calculateMovingAverages()**: 이동평균 계산
- **findVolumeSpikes()**: 거래량 급증 감지