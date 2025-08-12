'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Shield,
} from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import { useRecentTrades } from '@/hooks/use-trades';
import { Trade } from '@/types/trade';
import { ForbiddenRuleViolation } from '@/types/forbidden-rules';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// 손익 포맷팅 함수
function formatPnL(pnl: number | undefined): string {
  if (pnl === undefined || pnl === 0) return '-';

  const isPositive = pnl > 0;
  const formattedValue = Math.abs(pnl).toLocaleString('ko-KR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return `${isPositive ? '+' : '-'}$${formattedValue}`;
}

// 가격 포맷팅 함수
function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
}

// 매매유형 한글 라벨 헬퍼
function getTradingTypeLabel(tradingType: string): string {
  // 매매 유형 id -> 한글 라벨 매핑
  switch (tradingType) {
    case 'breakout':
      return '돌파매매';
    case 'trend':
      return '추세매매';
    case 'counter_trend':
      return '역추세매매';
    default:
      return '알 수 없음';
  }
}

// 금기룰 위반 표시 컴포넌트
function ForbiddenViolationsBadges({
  violations,
  orientation = 'horizontal',
}: {
  violations?: ForbiddenRuleViolation[];
  orientation?: 'horizontal' | 'vertical';
}) {
  if (!violations || violations.length === 0) {
    if (orientation === 'vertical') {
      return (
        <div className="flex flex-col items-center justify-center gap-1">
          <Shield className="h-4 w-4 text-green-600" />
          <span className="text-[11px] leading-none text-green-600">안전</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-1">
        <Shield className="h-3 w-3 text-green-600" />
        <span className="text-xs text-green-600">안전</span>
      </div>
    );
  }

  const highSeverityCount = violations.filter((v) => v.severity === 'high').length;
  const mediumSeverityCount = violations.filter((v) => v.severity === 'medium').length;
  const totalPenalty = violations.reduce((sum, v) => sum + v.score_penalty, 0);

  return (
    <div className="inline-flex items-center gap-1">
      <AlertTriangle className="h-3 w-3 text-red-600" />
      <div className="inline-flex gap-1">
        {highSeverityCount > 0 && (
          <Badge variant="destructive" className="text-xs px-1 py-0 h-4">
            위험 {highSeverityCount}
          </Badge>
        )}
        {mediumSeverityCount > 0 && (
          <Badge
            variant="outline"
            className="text-xs px-1 py-0 h-4 border-orange-300 text-orange-700"
          >
            경고 {mediumSeverityCount}
          </Badge>
        )}
        <span className="text-xs text-red-600 font-medium">-{totalPenalty}점</span>
      </div>
    </div>
  );
}

// 개별 거래 행 컴포넌트
function TradeRow({ trade, onClick }: { trade: Trade; onClick: (t: Trade) => void }) {
  const isBuy = trade.type === 'buy';
  const isOpen = trade.status === 'open';
  const hasPnL = trade.pnl !== undefined && trade.pnl !== 0;
  const isProfit = trade.pnl && trade.pnl > 0;

  // 매매 유형에 따른 배지 색상 결정
  const getTradingTypeBadge = (tradingType: string) => {
    switch (tradingType) {
      case 'breakout':
        return (
          <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
            돌파매매
          </Badge>
        );
      case 'trend':
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            추세매매
          </Badge>
        );
      case 'counter_trend':
        return (
          <Badge variant="default" className="bg-orange-500 hover:bg-orange-600">
            역추세매매
          </Badge>
        );
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  return (
    <TableRow className="hover:bg-muted/50 cursor-pointer" onClick={() => onClick(trade)}>
      {/* 종목명 */}
      <TableCell className="font-medium">{trade.symbol}</TableCell>

      {/* 거래 유형 */}
      <TableCell>
        <Badge variant={isBuy ? 'default' : 'destructive'} className="gap-1">
          {isBuy ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {isBuy ? '매수' : '매도'}
        </Badge>
      </TableCell>

      {/* 매매 유형 */}
      <TableCell>{getTradingTypeBadge(trade.tradingType)}</TableCell>

      {/* 수량 */}
      <TableCell className="text-right">
        {trade.quantity.toLocaleString('ko-KR', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 8,
        })}
      </TableCell>

      {/* 진입가 */}
      <TableCell className="text-right font-mono text-sm">
        ${formatPrice(trade.entryPrice)}
      </TableCell>

      {/* 청산가 */}
      <TableCell className="text-right font-mono text-sm">
        {trade.exitPrice ? `$${formatPrice(trade.exitPrice)}` : '-'}
      </TableCell>

      {/* 손익 */}
      <TableCell className="text-right">
        {hasPnL ? (
          <span
            className={cn(
              'font-medium',
              isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            )}
          >
            {formatPnL(trade.pnl)}
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>

      {/* 상태 */}
      <TableCell>
        <Badge variant={isOpen ? 'secondary' : 'outline'} className="gap-1">
          {isOpen ? (
            <>
              <Clock className="h-3 w-3" />
              진행중
            </>
          ) : (
            <>
              <CheckCircle className="h-3 w-3" />
              완료
            </>
          )}
        </Badge>
      </TableCell>

      {/* 진입 시간 */}
      <TableCell className="text-sm text-muted-foreground">
        {format(trade.entryTime, 'MM/dd HH:mm', { locale: ko })}
      </TableCell>

      {/* 메모 */}
      <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
        {trade.memo || '-'}
      </TableCell>

      {/* 금기룰 위반 */}
      <TableCell className="text-center">
        <ForbiddenViolationsBadges orientation="vertical" violations={trade.forbiddenViolations} />
      </TableCell>
    </TableRow>
  );
}

// 빈 상태, 로딩, 에러 컴포넌트는 동일

interface TradesTableProps {
  selectedMonth?: Date;
}

export function TradesTable({ selectedMonth }: TradesTableProps) {
  const { data, isLoading, error } = useRecentTrades();
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  // 선택된 월의 거래만 필터링
  const filteredTrades =
    data?.trades.filter((trade) => {
      if (!selectedMonth) return true;

      const tradeDate = new Date(trade.entryTime);
      const monthStart = startOfMonth(selectedMonth);
      const monthEnd = endOfMonth(selectedMonth);

      return isWithinInterval(tradeDate, { start: monthStart, end: monthEnd });
    }) || [];

  const totalPnL = filteredTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {selectedMonth
              ? `${format(selectedMonth, 'yyyy년 M월', { locale: ko })} 거래 기록`
              : '최근 거래 기록'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {selectedMonth
              ? `${format(selectedMonth, 'yyyy년 M월', { locale: ko })} 거래 내역을 확인하세요`
              : '최근 10건의 거래 내역을 확인하세요'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedMonth && <Badge variant="outline">{filteredTrades.length}건</Badge>}
          {data && <Badge variant="secondary">총 {data.total}건</Badge>}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>종목</TableHead>
              <TableHead>유형</TableHead>
              <TableHead>매매유형</TableHead>
              <TableHead className="text-right">수량</TableHead>
              <TableHead className="text-right">진입가</TableHead>
              <TableHead className="text-right">청산가</TableHead>
              <TableHead className="text-right">손익</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>진입시간</TableHead>
              <TableHead>메모</TableHead>
              <TableHead className="text-center whitespace-nowrap w-16">금기룰</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={11} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      거래 기록을 불러오는 중...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={11} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-destructive">
                      <p className="text-sm font-medium">데이터를 불러올 수 없습니다</p>
                      <p className="text-xs">{(error as Error).message}</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {data && filteredTrades.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">매매 기록이 없습니다</p>
                      <p className="text-xs text-muted-foreground">첫 번째 거래를 기록해보세요</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {filteredTrades.map((trade) => (
              <TradeRow key={trade.id} trade={trade} onClick={setSelectedTrade} />
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredTrades.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            {selectedMonth
              ? `${format(selectedMonth, 'yyyy년 M월', { locale: ko })} ${filteredTrades.length}건 표시 중`
              : `최근 ${filteredTrades.length}건 표시 중`}
          </div>
          <div>
            총 손익:{' '}
            <span
              className={cn(
                'font-medium',
                totalPnL > 0
                  ? 'text-green-600 dark:text-green-400'
                  : totalPnL < 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-muted-foreground'
              )}
            >
              {formatPnL(totalPnL)}
            </span>
          </div>
        </div>
      )}

      {/* 상세 모달 */}
      <Dialog open={!!selectedTrade} onOpenChange={(open) => !open && setSelectedTrade(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>거래 상세 정보</DialogTitle>
          </DialogHeader>
          {selectedTrade && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">종목</span>
                  <div className="font-medium">{selectedTrade.symbol}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">유형</span>
                  <div>
                    <Badge
                      variant={selectedTrade.type === 'buy' ? 'default' : 'destructive'}
                      className="gap-1"
                    >
                      {selectedTrade.type === 'buy' ? '매수' : '매도'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">매매유형</span>
                  <div className="font-medium">
                    {getTradingTypeLabel(selectedTrade.tradingType)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">수량</span>
                  <div className="font-mono">{selectedTrade.quantity}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">진입가</span>
                  <div className="font-mono">${formatPrice(selectedTrade.entryPrice)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">청산가</span>
                  <div className="font-mono">
                    {selectedTrade.exitPrice ? `$${formatPrice(selectedTrade.exitPrice)}` : '-'}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">진입시간</span>
                  <div>{format(selectedTrade.entryTime, 'yyyy-MM-dd HH:mm', { locale: ko })}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">청산시간</span>
                  <div>
                    {selectedTrade.exitTime
                      ? format(selectedTrade.exitTime, 'yyyy-MM-dd HH:mm', { locale: ko })
                      : '-'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground">메모</span>
                  <div className="whitespace-pre-wrap">{selectedTrade.memo || '-'}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">금기룰</span>
                  <div className="mt-1">
                    <ForbiddenViolationsBadges
                      orientation="horizontal"
                      violations={selectedTrade.forbiddenViolations}
                    />
                  </div>
                </div>
              </div>

              {selectedTrade.strategyScore && (
                <div>
                  <span className="text-muted-foreground">전략 점수</span>
                  <div className="mt-1">
                    <div className="font-medium">
                      총점: {selectedTrade.strategyScore.totalScore}점
                    </div>
                    <div className="mt-2 space-y-1">
                      {selectedTrade.strategyScore.criteria.map((c) => (
                        <div key={c.code} className="flex items-center justify-between text-xs">
                          <span>
                            {c.description} ({Math.round(c.weight * 100)}%)
                          </span>
                          <span className={cn('font-medium', c.ratio > 0 ? 'text-green-600' : 'text-red-600')}>
                            {c.ratio > 0 ? `+${Math.round(c.weight * 100)}` : '+0'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedTrade.finalScore !== undefined && (
                <div className="border-t pt-3">
                  <div className="text-sm">
                    최종 점수: <span className="font-semibold">{selectedTrade.finalScore}점</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
