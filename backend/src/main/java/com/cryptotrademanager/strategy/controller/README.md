# Strategy Controller Package

거래 전략 관리 관련 REST API 엔드포인트를 제공하는 컨트롤러들을 담당하는 패키지입니다.

## 주요 컨트롤러 클래스

### StrategyController
- **GET** `/api/strategies`: 사용자 전략 목록 조회
- **POST** `/api/strategies`: 새 전략 생성
- **GET** `/api/strategies/{id}`: 특정 전략 상세 조회
- **PUT** `/api/strategies/{id}`: 전략 수정
- **DELETE** `/api/strategies/{id}`: 전략 삭제
- **POST** `/api/strategies/{id}/activate`: 전략 활성화
- **POST** `/api/strategies/{id}/deactivate`: 전략 비활성화

### BacktestController
- **POST** `/api/backtest/run`: 백테스트 실행
- **GET** `/api/backtest/{id}`: 백테스트 결과 조회
- **GET** `/api/backtest/{id}/report`: 백테스트 상세 보고서
- **GET** `/api/backtest/history`: 백테스트 이력
- **POST** `/api/backtest/compare`: 전략 성과 비교
- **DELETE** `/api/backtest/{id}`: 백테스트 결과 삭제

### OptimizationController
- **POST** `/api/optimization/start`: 매개변수 최적화 시작
- **GET** `/api/optimization/{id}/progress`: 최적화 진행 상황
- **GET** `/api/optimization/{id}/results`: 최적화 결과
- **POST** `/api/optimization/{id}/stop`: 최적화 중단
- **GET** `/api/optimization/history`: 최적화 이력

### SignalController
- **GET** `/api/signals/current`: 현재 매매 신호 조회
- **GET** `/api/signals/history`: 신호 이력 조회
- **POST** `/api/signals/test`: 신호 생성 테스트
- **GET** `/api/signals/{strategy-id}`: 특정 전략 신호 조회
- **PUT** `/api/signals/settings`: 신호 설정 수정

### IndicatorController
- **GET** `/api/indicators/available`: 사용 가능한 지표 목록
- **POST** `/api/indicators/calculate`: 지표 계산
- **GET** `/api/indicators/{symbol}/values`: 심볼별 지표 값
- **POST** `/api/indicators/custom`: 커스텀 지표 생성
- **GET** `/api/indicators/performance`: 지표 성능 분석

### TemplateController
- **GET** `/api/templates`: 전략 템플릿 목록
- **GET** `/api/templates/{id}`: 템플릿 상세 정보
- **POST** `/api/templates/{id}/create-strategy`: 템플릿으로 전략 생성
- **GET** `/api/templates/categories`: 템플릿 카테고리