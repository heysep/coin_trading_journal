# Validator Package

커스텀 검증 어노테이션과 검증 로직을 담당하는 패키지입니다.

## 주요 검증 클래스

### Custom Validation Annotations
- **@ValidEmail**: 이메일 형식 검증
- **@ValidPassword**: 비밀번호 강도 검증
- **@ValidCurrency**: 암호화폐 심볼 검증
- **@ValidAmount**: 거래 금액 범위 검증
- **@ValidPercent**: 퍼센트 범위 검증
- **@ValidApiKey**: API 키 형식 검증

### Validators
- **EmailValidator**: 이메일 유효성 검증기
- **PasswordValidator**: 비밀번호 규칙 검증기
- **CurrencyValidator**: 암호화폐 유효성 검증기
- **TradingAmountValidator**: 거래 금액 검증기
- **PercentageValidator**: 퍼센트 값 검증기

### Business Rules Validators
- **TradingRuleValidator**: 거래 규칙 검증
- **RiskManagementValidator**: 리스크 관리 규칙 검증
- **StrategyParameterValidator**: 전략 매개변수 검증