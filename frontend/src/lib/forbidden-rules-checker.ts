/**
 * 금기룰 위반 체크 로직
 */

import { Trade } from '@/types/trade';
import {
  ForbiddenRuleViolation,
  FORBIDDEN_RULES,
  FORBIDDEN_RULE_PARAMS,
} from '@/types/forbidden-rules';

export class ForbiddenRulesChecker {
  /**
   * 새로운 거래에 대해 모든 금기룰을 체크
   */
  static checkTrade(
    newTrade: Trade,
    allTrades: Trade[],
    accountEquity?: number
  ): ForbiddenRuleViolation[] {
    const violations: ForbiddenRuleViolation[] = [];

    // 1. 손절 설정 없음 체크
    if (this.checkNoStopLoss(newTrade)) {
      violations.push(
        this.createViolation('no_stoploss', {
          trade_id: newTrade.id,
          stopLoss: newTrade.stopLoss,
        })
      );
    }

    // 2. 과도한 포지션 사이즈 체크
    if (accountEquity && this.checkOversizedPosition(newTrade, accountEquity)) {
      violations.push(
        this.createViolation('oversized_position', {
          trade_id: newTrade.id,
          position_size: newTrade.quantity * newTrade.entryPrice,
          account_equity: accountEquity,
          ratio: (newTrade.quantity * newTrade.entryPrice) / accountEquity,
        })
      );
    }

    // 3. 복수 거래 체크
    if (this.checkRevengeTrade(newTrade, allTrades)) {
      violations.push(
        this.createViolation('revenge_trade', {
          trade_id: newTrade.id,
          last_loss_trade: allTrades
            .filter((t) => t.exitPrice && this.calculatePnL(t) < 0)
            .sort(
              (a, b) => new Date(b.exitTime || 0).getTime() - new Date(a.exitTime || 0).getTime()
            )[0]?.id,
        })
      );
    }

    // 4. 급등 추격 매수 체크 (기본적인 로직)
    if (this.checkChasing(newTrade, allTrades)) {
      violations.push(
        this.createViolation('chasing', {
          trade_id: newTrade.id,
          entry_price: newTrade.entryPrice,
        })
      );
    }

    // 5. 과도한 거래 빈도 체크
    if (this.checkOvertrading(newTrade, allTrades)) {
      violations.push(
        this.createViolation('overtrading', {
          trade_id: newTrade.id,
          daily_trade_count: this.getDailyTradeCount(newTrade.entryTime, allTrades),
        })
      );
    }

    // 6. 계획 없는 물타기 체크
    if (this.checkAverageDownNoplan(newTrade, allTrades)) {
      violations.push(
        this.createViolation('avg_down_no_plan', {
          trade_id: newTrade.id,
          symbol: newTrade.symbol,
        })
      );
    }

    return violations;
  }

  /**
   * 손절 설정 없음 체크
   */
  private static checkNoStopLoss(trade: Trade): boolean {
    return trade.type === 'buy' && !trade.stopLoss;
  }

  /**
   * 과도한 포지션 사이즈 체크
   */
  private static checkOversizedPosition(trade: Trade, accountEquity: number): boolean {
    const positionSize = trade.quantity * trade.entryPrice;
    return positionSize > accountEquity * FORBIDDEN_RULE_PARAMS.max_position_ratio;
  }

  /**
   * 복수 거래 체크
   */
  private static checkRevengeTrade(newTrade: Trade, allTrades: Trade[]): boolean {
    // 가장 최근 손실 거래 찾기
    const lastLossTrade = allTrades
      .filter(
        (t) =>
          t.exitPrice &&
          this.calculatePnL(t) < 0 &&
          new Date(t.exitTime || 0) < new Date(newTrade.entryTime)
      )
      .sort((a, b) => new Date(b.exitTime || 0).getTime() - new Date(a.exitTime || 0).getTime())[0];

    if (!lastLossTrade || !lastLossTrade.exitTime) return false;

    const timeDiff =
      new Date(newTrade.entryTime).getTime() - new Date(lastLossTrade.exitTime).getTime();
    const timeDiffMinutes = timeDiff / (1000 * 60);

    return timeDiffMinutes < FORBIDDEN_RULE_PARAMS.revenge_trade_window;
  }

  /**
   * 급등 추격 매수 체크 (단순화된 로직)
   */
  private static checkChasing(newTrade: Trade, allTrades: Trade[]): boolean {
    if (newTrade.type !== 'buy') return false;

    // 같은 종목의 최근 거래들에서 가격 급등 패턴 확인
    const recentTrades = allTrades
      .filter(
        (t) => t.symbol === newTrade.symbol && new Date(t.entryTime) < new Date(newTrade.entryTime)
      )
      .sort((a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime())
      .slice(0, 5);

    if (recentTrades.length === 0) return false;

    const avgRecentPrice =
      recentTrades.reduce((sum, t) => sum + t.entryPrice, 0) / recentTrades.length;
    const priceIncrease = (newTrade.entryPrice - avgRecentPrice) / avgRecentPrice;

    // 최근 평균 대비 5% 이상 높은 가격에 매수하는 경우
    return priceIncrease > 0.05;
  }

  /**
   * 과도한 거래 빈도 체크
   */
  private static checkOvertrading(newTrade: Trade, allTrades: Trade[]): boolean {
    const dailyCount = this.getDailyTradeCount(newTrade.entryTime, allTrades);
    return dailyCount > FORBIDDEN_RULE_PARAMS.max_daily_trades;
  }

  /**
   * 계획 없는 물타기 체크
   */
  private static checkAverageDownNoplan(newTrade: Trade, allTrades: Trade[]): boolean {
    if (newTrade.type !== 'buy') return false;

    // 같은 종목의 미청산 포지션이 있는지 확인
    const openPositions = allTrades.filter(
      (t) =>
        t.symbol === newTrade.symbol &&
        t.type === 'buy' &&
        !t.exitPrice &&
        new Date(t.entryTime) < new Date(newTrade.entryTime)
    );

    if (openPositions.length === 0) return false;

    // 기존 포지션들의 평균 진입가보다 낮은 가격에 추가 매수하는 경우
    const avgEntryPrice =
      openPositions.reduce((sum, t) => sum + t.entryPrice, 0) / openPositions.length;

    // 물타기로 판단되고, 계획적인 물타기인지 확인 (메모에 물타기 계획 언급이 있는지)
    const isAverageDown = newTrade.entryPrice < avgEntryPrice;
    const hasPlan =
      newTrade.memo?.toLowerCase().includes('물타기') ||
      newTrade.memo?.toLowerCase().includes('평균단가') ||
      newTrade.memo?.toLowerCase().includes('추가매수');

    return isAverageDown && !hasPlan;
  }

  /**
   * 하루 거래 횟수 계산
   */
  private static getDailyTradeCount(entryTime: Date, allTrades: Trade[]): number {
    const today = new Date(entryTime);
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return (
      allTrades.filter((t) => {
        const tradeDate = new Date(t.entryTime);
        return tradeDate >= today && tradeDate < tomorrow;
      }).length + 1
    ); // +1은 현재 거래 포함
  }

  /**
   * PnL 계산
   */
  private static calculatePnL(trade: Trade): number {
    if (!trade.exitPrice) return 0;

    if (trade.type === 'buy') {
      return (trade.exitPrice - trade.entryPrice) * trade.quantity;
    } else {
      return (trade.entryPrice - trade.exitPrice) * trade.quantity;
    }
  }

  /**
   * 위반 객체 생성
   */
  private static createViolation(
    ruleCode: keyof typeof FORBIDDEN_RULES,
    details:
      | { trade_id: string | number; stopLoss?: number | undefined }
      | { trade_id: string | number; position_size: number; account_equity: number; ratio: number }
      | { trade_id: string | number; last_loss_trade?: string | number | undefined }
      | { trade_id: string | number; entry_price: number }
      | { trade_id: string | number; daily_trade_count: number }
      | { trade_id: string | number; symbol: string }
  ): ForbiddenRuleViolation {
    const rule = FORBIDDEN_RULES[ruleCode];
    return {
      rule_code: ruleCode,
      description: rule.description,
      severity: rule.severity,
      score_penalty: rule.score_penalty,
      detected_at: new Date(),
      details,
    };
  }

  /**
   * 위반 점수 총합 계산
   */
  static calculateTotalPenalty(violations: ForbiddenRuleViolation[]): number {
    return violations.reduce((total, violation) => total + violation.score_penalty, 0);
  }

  /**
   * 심각도별 위반 개수 계산
   */
  static getViolationStats(violations: ForbiddenRuleViolation[]) {
    return {
      high: violations.filter((v) => v.severity === 'high').length,
      medium: violations.filter((v) => v.severity === 'medium').length,
      low: violations.filter((v) => v.severity === 'low').length,
      total: violations.length,
      total_penalty: this.calculateTotalPenalty(violations),
    };
  }
}
