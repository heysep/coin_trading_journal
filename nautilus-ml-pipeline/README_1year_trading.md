# 1년치 자동매매 백테스트 & ML 훈련 가이드

## 🎯 개요

이 시스템은 1년치 자동매매 데이터를 생성하고, 해당 데이터로 머신러닝 모델을 훈련하는 완전 자동화된 파이프라인입니다.

## 🚀 빠른 시작

### 1. 단일 심볼 실행 (추천)

```bash
# BTC 1년치 백테스트 + ML 훈련
python quick_start_1year.py --symbol BTCUSDT

# ETH 1년치 백테스트 + ML 훈련
python quick_start_1year.py --symbol ETHUSDT

# 청크 크기 조정 (기본값: 30일)
python quick_start_1year.py --symbol BTCUSDT --chunk-size 15
```

### 2. 다중 심볼 실행

```bash
# BTC + ETH 모두 실행 (시간이 많이 걸림)
python quick_start_1year.py --all-symbols
```

### 3. 고급 옵션

```bash
# 시간 프레임 변경
python quick_start_1year.py --symbol BTCUSDT --timeframe 5m

# 일반 훈련기 사용 (대용량 데이터 훈련기 대신)
python quick_start_1year.py --symbol BTCUSDT --small-trainer
```

## 📊 실행 과정

### 1단계: 1년치 백테스트 실행

- 365일 기간을 30일 청크로 분할
- 각 청크별로 백테스트 실행
- 거래 신호 생성 및 시뮬레이션
- 결과를 `data/backtest_results/`에 저장

### 2단계: 데이터 통합 및 처리

- 모든 백테스트 결과 통합
- ML 훈련용 피처 생성
- 타겟 변수 생성 및 정제
- 최종 데이터를 `data/training_data/`에 저장

### 3단계: ML 모델 훈련

- 대용량 데이터 처리 (배치 처리)
- XGBoost 모델 훈련
- 하이퍼파라미터 최적화
- 모델을 `data/models/`에 저장

### 4단계: 성능 분석

- 거래 성과 분석
- 모델 성능 평가
- 시각화 및 리포트 생성

## 📈 결과 분석

### 자동 분석 실행

```bash
# 종합 성과 분석
python analysis_tools.py
```

### 수동 분석

```python
from analysis_tools import BacktestAnalyzer

analyzer = BacktestAnalyzer()
analyzer.load_backtest_results()
report = analyzer.generate_comprehensive_report()

# 거래 성과 확인
performance = analyzer.analyze_trading_performance()
print(f"승률: {performance['basic_stats']['win_rate_pct']:.1f}%")
print(f"샤프비율: {performance['risk_metrics']['sharpe_ratio']:.3f}")
```

## 📁 생성되는 파일 구조

```
data/
├── backtest_results/           # 백테스트 결과
│   ├── backtest_BTCUSDT_*.csv
│   └── consolidated_1year_*.csv
├── training_data/              # ML 훈련 데이터
│   └── training_data_*.csv
├── models/                     # 훈련된 모델
│   ├── large_model_*.pkl
│   ├── large_scaler_*.pkl
│   └── large_metadata_*.json
└── reports/                    # 분석 리포트
    ├── charts/
    │   ├── performance_analysis_*.png
    │   └── drawdown_analysis_*.png
    └── comprehensive_report_*.json
```

## ⚙️ 설정 조정

### config/ml_config.yaml

주요 설정 포인트:

```yaml
# 1년치 대용량 데이터 설정
year_long_dataset:
  drift_detection: true
  retrain_every: monthly
  threshold: 500000
  performance_monitoring: true

# 대용량 모델 설정
large_dataset_config:
  max_depth: 8
  n_estimators: 500
  learning_rate: 0.05
  early_stopping_rounds: 50
```

## 🔧 성능 최적화

### 메모리 사용량 줄이기

1. **청크 크기 조정**: `--chunk-size 15` (기본값: 30)
2. **배치 처리**: 자동으로 500MB 이상에서 활성화
3. **피처 수 줄이기**: `config/ml_config.yaml`에서 features 조정

### 실행 시간 단축

1. **시간 프레임 변경**: `--timeframe 5m` 또는 `1h`
2. **하이퍼파라미터 튜닝 비활성화**: config에서 `auto_tuning.enabled: false`
3. **일반 훈련기 사용**: `--small-trainer` 옵션

## 📊 예상 결과

### 일반적인 성과 지표

- **거래 수**: 500 ~ 5,000건 (설정에 따라)
- **승률**: 45% ~ 65%
- **샤프비율**: 0.5 ~ 2.0
- **최대낙폭**: 5% ~ 20%
- **모델 R²**: 0.1 ~ 0.4

### 실행 시간

- **BTC 1년치**: 2 ~ 6시간
- **ETH 1년치**: 2 ~ 6시간
- **BTC + ETH**: 4 ~ 12시간

## 🚨 주의사항

### 시스템 요구사항

- **RAM**: 최소 8GB (16GB 권장)
- **디스크 공간**: 5GB 이상
- **CPU**: 멀티코어 권장

### 실행 전 확인사항

1. 필요한 디렉토리 자동 생성됨
2. 기존 데이터는 덮어쓰이지 않음
3. 중간에 중단되어도 재시작 가능

### 오류 대응

```bash
# 로그 확인
tail -f logs/1year_backtest.log

# 부분 실행 확인
ls -la data/backtest_results/
ls -la data/training_data/
```

## 🔄 지속적 운영

### 정기 재실행

```bash
# 매월 1일 실행 (crontab 설정)
0 2 1 * * cd /path/to/project && python quick_start_1year.py --symbol BTCUSDT
```

### 모델 업데이트

```bash
# 기존 모델과 비교하여 성능 개선시 자동 교체
python quick_start_1year.py --symbol BTCUSDT --compare-models
```

## 💡 활용 방안

### 1. 전략 개발

- 다양한 파라미터로 백테스트 실행
- A/B 테스트를 통한 전략 비교
- 시장 상황별 성능 분석

### 2. 리스크 관리

- 드로우다운 패턴 분석
- 포지션 사이징 최적화
- 손절매/익절매 레벨 조정

### 3. 모델 개선

- 피처 엔지니어링 실험
- 앙상블 모델 구축
- 온라인 학습 적용

## 📞 지원

문제가 발생하면:

1. 로그 파일 확인: `logs/1year_backtest.log`
2. 설정 파일 검토: `config/ml_config.yaml`
3. 중간 결과 확인: `data/` 디렉토리 내용

---

**🎉 축하합니다! 이제 1년치 자동매매 데이터로 나만의 AI 트레이딩 모델을 훈련할 수 있습니다!**
