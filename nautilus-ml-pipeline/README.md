# 노틸러스 트레이더 + ML 파이프라인

## 📊 시스템 구조

```
nautilus-ml-pipeline/
├── nautilus_integration/     # 노틸러스 트레이더 연동
│   ├── backtesting/         # 백테스팅 엔진
│   ├── strategy_filter.py   # 90점 이상 필터
│   └── data_collector.py    # 거래 데이터 수집
├── ml_pipeline/             # ML 파이프라인
│   ├── data_processor.py    # 데이터 전처리
│   ├── model_trainer.py     # 모델 훈련
│   ├── scheduler.py         # 재훈련 스케줄러
│   └── performance_monitor.py # 성능 모니터링
├── config/                  # 설정 파일
│   ├── strategy_config.yaml # 전략 설정
│   └── ml_config.yaml       # ML 설정
└── data/                    # 데이터 저장소
    ├── backtest_results/    # 백테스팅 결과
    ├── training_data/       # ML 훈련 데이터
    └── models/              # 저장된 모델들
```

## 🎯 주요 기능

### 1. 전략 점수 필터링

- 90점 이상 전략만 실행
- 실시간 점수 계산
- 동적 임계값 조정

### 2. 백테스팅 데이터 수집

- 고품질 거래 데이터 생성
- 다양한 시장 조건 시뮬레이션
- 레이블링된 학습 데이터

### 3. 적응형 ML 시스템

- 주기적 모델 재훈련
- 성능 드리프트 감지
- 자동 하이퍼파라미터 튜닝

## 📅 업데이트 스케줄

### 기본 스케줄

- **매일**: 새 데이터 수집 및 검증
- **주간**: 모델 재훈련 (일요일 02:00)
- **월간**: 전체 파이프라인 검토 (매월 1일)
- **긴급**: 성능 15% 하락 시 즉시 재훈련

### 데이터 양별 적응

- 100건 미만: 50건마다 재훈련
- 100-500건: 주 1회
- 500-2000건: 주 1회 + 성능 모니터링
- 2000건 이상: 2주 1회 + 드리프트 감지

## 🚀 실행 방법

```bash
# 1. 노틸러스 백테스팅 시작
python -m nautilus_integration.backtesting.run_backtest

# 2. ML 파이프라인 실행
python -m ml_pipeline.scheduler.start

# 3. 성능 모니터링 대시보드
python -m ml_pipeline.performance_monitor.dashboard
```

## 📈 성능 지표

### 모델 성능

- **RMSE**: 예측 오차
- **R²**: 설명력
- **Sharpe Ratio**: 위험 대비 수익
- **Information Ratio**: 정보 비율

### 백테스팅 지표

- **Total Return**: 총 수익률
- **Max Drawdown**: 최대 손실
- **Win Rate**: 승률
- **Profit Factor**: 수익 인수
