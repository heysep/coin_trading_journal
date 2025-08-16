"""
백테스팅 데이터를 ML 훈련 데이터로 변환하는 파이프라인
- 노틸러스 거래 결과 처리
- 피처 엔지니어링
- 레이블 생성 및 정제
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
import logging
from pathlib import Path
import yaml

logger = logging.getLogger(__name__)

class BacktestDataProcessor:
    """백테스팅 데이터 전처리기"""
    
    def __init__(self, config_path: str = "config/ml_config.yaml"):
        """
        데이터 프로세서 초기화
        
        Args:
            config_path: ML 설정 파일 경로
        """
        with open(config_path, 'r', encoding='utf-8') as f:
            self.config = yaml.safe_load(f)
        
        self.feature_columns = self.config['data']['features']
        self.target_column = self.config['data']['target']
        self.default_values = self.config['data'].get('default_values', {})
        self.missing_value_strategy = self.config['data'].get('missing_value_strategy', 'drop')
        self.halt_on_missing = self.config['data'].get('halt_on_missing_features', False)
        
    def process_backtest_results(self, backtest_file: str) -> pd.DataFrame:
        """
        백테스팅 결과를 ML 학습 데이터로 변환
        
        Args:
            backtest_file: 백테스팅 결과 파일 경로
            
        Returns:
            ML 학습용 데이터프레임
        """
        # 한글 주석: 백테스팅 결과 로드
        df = self._load_backtest_data(backtest_file)
        
        # 한글 주석: 기본 피처 추출
        df = self._extract_basic_features(df)
        
        # 한글 주석: 고급 피처 생성
        df = self._create_advanced_features(df)
        
        # 한글 주석: 타겟 변수 생성
        df = self._create_target_variable(df)
        
        # 한글 주석: 데이터 품질 검증
        df = self._validate_and_clean(df)
        
        logger.info(f"ML 데이터 변환 완료: {len(df)}건, {len(df.columns)}개 피처")
        return df
    
    def _load_backtest_data(self, file_path: str) -> pd.DataFrame:
        """백테스팅 데이터 로드"""
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        elif file_path.endswith('.json'):
            df = pd.read_json(file_path)
        else:
            raise ValueError("지원하지 않는 파일 형식입니다")
        
        # 한글 주석: 시간 컬럼 파싱
        if 'timestamp' in df.columns:
            df['timestamp'] = pd.to_datetime(df['timestamp'])
        if 'exit_timestamp' in df.columns:
            df['exit_timestamp'] = pd.to_datetime(df['exit_timestamp'])
            
        return df
    
    def _extract_basic_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """기본 피처 추출"""
        # 한글 주석: 전략 점수 기반 피처
        if 'strategy_score' in df.columns:
            df['entry_timing_score'] = df['strategy_score']
            df['exit_timing_score'] = df['strategy_score'] * 0.95  # 약간 할인
        
        # 한글 주석: 신뢰도 기반 피처
        if 'confidence' in df.columns:
            df['risk_mgmt_score'] = df['confidence'] * 100
        
        # 한글 주석: 손익 비율
        if 'pnl' in df.columns and 'entry_price' in df.columns:
            df['pnl_ratio'] = df['pnl'] / df['entry_price']
        
        # 한글 주석: 거래 지속 시간 (분)
        if 'timestamp' in df.columns and 'exit_timestamp' in df.columns:
            df['duration_minutes'] = (df['exit_timestamp'] - df['timestamp']).dt.total_seconds() / 60
        
        return df
    
    def _create_advanced_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """고급 피처 생성"""
        # 한글 주석: 시장 조건 피처
        if 'timestamp' in df.columns:
            df['hour_of_day'] = df['timestamp'].dt.hour
            df['day_of_week'] = df['timestamp'].dt.dayofweek
            df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
        else:
            df['hour_of_day'] = self._get_default_value('hour_of_day')
            df['day_of_week'] = self._get_default_value('day_of_week')
            df['is_weekend'] = self._get_default_value('is_weekend')
        
        # 한글 주석: 변동성 피처 (가격 변동 기반)
        if 'entry_price' in df.columns and 'exit_price' in df.columns:
            df['price_change_pct'] = ((df['exit_price'] - df['entry_price']) / df['entry_price']) * 100
            df['volatility'] = df['price_change_pct'].abs()
        else:
            df['volatility'] = self._get_default_value('volatility')
        
        # 한글 주석: 시장 조건 (단순화)
        df['market_condition'] = self._classify_market_condition(df)
        
        # 한글 주석: 볼륨 프로파일 (랜덤 제거, 결정적 기본값 사용)
        if 'volume_profile' not in df.columns:
            df['volume_profile'] = self._get_default_value('volume_profile')
        
        return df
    
    def _classify_market_condition(self, df: pd.DataFrame) -> pd.Series:
        """시장 조건 분류 (벡터화)"""
        if 'volatility' not in df.columns:
            return pd.Series(np.ones(len(df), dtype=int))
        vol = df['volatility'].values
        # 기본값 1, 고/저 변동성 조건 덮어쓰기
        cond = np.ones_like(vol, dtype=int)
        cond[vol > 3.0] = 2
        cond[vol < 1.0] = 0
        return pd.Series(cond)
    
    def _create_target_variable(self, df: pd.DataFrame) -> pd.DataFrame:
        """타겟 변수 생성"""
        if 'return_pct' in df.columns:
            df[self.target_column] = df['return_pct']
        elif 'pnl' in df.columns and 'entry_price' in df.columns:
            # 한글 주석: 수익률 계산
            df[self.target_column] = (df['pnl'] / df['entry_price']) * 100
        else:
            # 한글 주석: 타겟 계산 불가 시 결측 처리 (랜덤 제거)
            df[self.target_column] = np.nan
            logger.warning("타겟 변수를 계산할 수 없어 해당 행을 학습에서 제외합니다")
        
        return df
    
    def _validate_and_clean(self, df: pd.DataFrame) -> pd.DataFrame:
        """데이터 품질 검증 및 정제"""
        # 한글 주석: 필수 피처 존재 확인
        missing_features = []
        for feature in self.feature_columns:
            if feature not in df.columns:
                missing_features.append(feature)
        
        if missing_features:
            message = f"누락된 피처: {missing_features}"
            if self.halt_on_missing:
                logger.error(message)
                raise ValueError(message)
            logger.warning(message)
            for feature in missing_features:
                df[feature] = self._get_default_value(feature)
        
        # 한글 주석: 이상치 제거 (수익률 기준) - 표본 충분할 때만 수행
        if self.target_column in df.columns:
            try:
                if len(df) >= 50:
                    q1 = df[self.target_column].quantile(0.05)
                    q3 = df[self.target_column].quantile(0.95)
                    initial_count = len(df)
                    df = df[(df[self.target_column] >= q1) & (df[self.target_column] <= q3)]
                    removed_count = initial_count - len(df)
                    if removed_count > 0:
                        logger.info(f"이상치 제거: {removed_count}건 ({removed_count/initial_count*100:.1f}%)")
            except Exception:
                pass
        
        # 한글 주석: 결측값 처리
        for feature in self.feature_columns:
            if feature in df.columns and df[feature].isna().any():
                missing_count = df[feature].isna().sum()
                logger.warning(f"결측값 발견 - {feature}: {missing_count}건")
                if self.missing_value_strategy == 'drop':
                    df = df.dropna(subset=[feature])
                elif self.missing_value_strategy == 'default':
                    df[feature] = df[feature].fillna(self._get_default_value(feature))

        df = df.dropna(subset=[self.target_column])
        
        # 한글 주석: 무한값 제거
        df = df.replace([np.inf, -np.inf], np.nan).dropna()
        
        return df
    
    def _get_default_value(self, feature: str) -> float:
        """피처별 기본값 반환"""
        return self.default_values.get(feature, 0.0)
    
    def save_training_data(self, df: pd.DataFrame, output_path: str):
        """훈련 데이터 저장"""
        # 한글 주석: 필요한 컬럼만 선택
        feature_cols = [col for col in self.feature_columns if col in df.columns]
        target_cols = [self.target_column] if self.target_column in df.columns else []
        
        if 'trade_id' in df.columns:
            save_cols = ['trade_id'] + feature_cols + target_cols
        else:
            # 한글 주석: trade_id가 없으면 인덱스를 trade_id로 사용
            df['trade_id'] = [f"trade_{i}" for i in range(len(df))]
            save_cols = ['trade_id'] + feature_cols + target_cols
        
        # 한글 주석: 타임스탬프 포함 저장 (시계열 분할용)
        if 'timestamp' in df.columns and 'timestamp' not in save_cols:
            save_cols = ['timestamp'] + save_cols
        final_df = df[save_cols].copy()
        # 한글 주석: 저장 디렉토리 보장
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        final_df.to_csv(output_path, index=False)
        
        logger.info(f"훈련 데이터 저장: {output_path} ({len(final_df)}건, {len(feature_cols)}개 피처)")
        return final_df

class MLDataPipeline:
    """ML 데이터 파이프라인 오케스트레이터"""
    
    def __init__(self):
        self.processor = BacktestDataProcessor()
        
    def run_pipeline(self, backtest_dir: str = "data/backtest_results") -> str:
        """
        전체 데이터 파이프라인 실행
        
        Args:
            backtest_dir: 백테스팅 결과 디렉토리
            
        Returns:
            생성된 훈련 데이터 파일 경로
        """
        backtest_files = self._find_backtest_files(backtest_dir)
        
        if not backtest_files:
            logger.warning(f"백테스팅 파일을 찾을 수 없습니다: {backtest_dir}")
            return self._create_sample_data()
        
        # 한글 주석: 모든 백테스팅 결과 통합
        all_data = []
        for file_path in backtest_files:
            try:
                df = self.processor.process_backtest_results(file_path)
                all_data.append(df)
                logger.info(f"처리 완료: {file_path} ({len(df)}건)")
            except Exception as e:
                logger.error(f"파일 처리 실패 {file_path}: {e}")
        
        if not all_data:
            logger.warning("처리할 수 있는 백테스팅 데이터가 없습니다")
            return self._create_sample_data()
        
        # 한글 주석: 데이터 통합
        combined_df = pd.concat(all_data, ignore_index=True)
        
        # 한글 주석: 훈련 데이터 저장
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = f"data/training_data/training_data_{timestamp}.csv"
        
        final_df = self.processor.save_training_data(combined_df, output_path)
        
        logger.info(f"파이프라인 완료: {len(final_df)}건의 훈련 데이터 생성")
        return output_path
    
    def _find_backtest_files(self, directory: str) -> List[str]:
        """백테스팅 파일 찾기"""
        path = Path(directory)
        if not path.exists():
            return []
        
        files = []
        for ext in ['*.csv', '*.json']:
            files.extend(path.glob(ext))
        
        return [str(f) for f in files]
    
    def _create_sample_data(self) -> str:
        """샘플 데이터 생성 (백테스팅 데이터가 없을 때)"""
        logger.info("샘플 훈련 데이터 생성")
        
        np.random.seed(42)
        n_samples = 200
        
        # 한글 주석: 현실적인 샘플 데이터 생성
        data = {
            'trade_id': [f"sample_{i}" for i in range(n_samples)],
            'entry_timing_score': np.random.normal(75, 15, n_samples).clip(0, 100),
            'exit_timing_score': np.random.normal(70, 15, n_samples).clip(0, 100),
            'risk_mgmt_score': np.random.normal(80, 12, n_samples).clip(0, 100),
            'pnl_ratio': np.random.normal(0.01, 0.05, n_samples),
            'volatility': np.random.exponential(2.0, n_samples).clip(0, 10),
            'market_condition': np.random.choice([0, 1, 2], n_samples, p=[0.3, 0.5, 0.2]),
            'volume_profile': np.random.normal(1.0, 0.3, n_samples).clip(0.1, 3.0)
        }
        
        # 한글 주석: 타겟 변수 (피처들과 상관관계 있게 생성)
        target = (
            data['entry_timing_score'] * 0.03 +
            data['exit_timing_score'] * 0.02 +
            data['risk_mgmt_score'] * 0.01 +
            data['pnl_ratio'] * 100 +
            np.random.normal(0, 1, n_samples)
        )
        data['return_pct'] = target
        
        df = pd.DataFrame(data)
        
        # 한글 주석: 샘플 데이터 저장
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = f"data/training_data/sample_data_{timestamp}.csv"
        df.to_csv(output_path, index=False)
        
        logger.info(f"샘플 데이터 생성 완료: {output_path} ({len(df)}건)")
        return output_path

def run_data_pipeline() -> str:
    """데이터 파이프라인 실행"""
    pipeline = MLDataPipeline()
    return pipeline.run_pipeline()

if __name__ == "__main__":
    # 한글 주석: 파이프라인 단독 실행
    logging.basicConfig(level=logging.INFO)
    output_file = run_data_pipeline()
    print(f"훈련 데이터 생성 완료: {output_file}")
