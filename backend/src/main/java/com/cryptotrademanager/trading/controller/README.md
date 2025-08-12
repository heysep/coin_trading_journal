# Trading Controller Package

거래 실행 및 주문 관리 관련 REST API 엔드포인트를 제공하는 컨트롤러들을 담당하는 패키지입니다.

## 주요 컨트롤러 클래스

### OrderController
- **POST** `/api/orders`: 새 주문 생성
- **GET** `/api/orders`: 주문 목록 조회
- **GET** `/api/orders/{id}`: 특정 주문 상세 조회
- **PUT** `/api/orders/{id}`: 주문 수정
- **DELETE** `/api/orders/{id}`: 주문 취소
- **POST** `/api/orders/batch`: 배치 주문 실행

### PositionController
- **GET** `/api/positions`: 현재 포지션 목록
- **GET** `/api/positions/{symbol}`: 특정 심볼 포지션 조회
- **POST** `/api/positions/{symbol}/close`: 포지션 정리
- **PUT** `/api/positions/{symbol}`: 포지션 수정
- **GET** `/api/positions/summary`: 포지션 요약 정보

### TradingController
- **POST** `/api/trading/buy`: 매수 주문
- **POST** `/api/trading/sell`: 매도 주문
- **POST** `/api/trading/market-order`: 시장가 주문
- **POST** `/api/trading/limit-order`: 지정가 주문
- **POST** `/api/trading/stop-loss`: 손절 주문
- **POST** `/api/trading/take-profit`: 익절 주문

### PortfolioController
- **GET** `/api/portfolio`: 포트폴리오 조회
- **GET** `/api/portfolio/performance`: 포트폴리오 성과
- **GET** `/api/portfolio/allocation`: 자산 배분 현황
- **POST** `/api/portfolio/rebalance`: 리밸런싱 실행
- **GET** `/api/portfolio/history`: 포트폴리오 이력

### RiskManagementController
- **GET** `/api/risk/settings`: 리스크 관리 설정 조회
- **PUT** `/api/risk/settings`: 리스크 관리 설정 수정
- **GET** `/api/risk/limits`: 거래 한도 조회
- **POST** `/api/risk/emergency-stop`: 비상 정지
- **GET** `/api/risk/exposure`: 노출 위험도 조회