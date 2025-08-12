import { NextRequest, NextResponse } from 'next/server';
import { createTradeSchema } from '@/schemas/trade';
import { Trade } from '@/types/trade';
import { z } from 'zod';
import {
  computeStrategyScore,
  computeForbiddenPoints,
  TOTAL_FORBIDDEN_POINTS,
} from '@/lib/strategy-scoring';

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL; // e.g. http://localhost:8000

// 임시 메모리 저장소 (실제 프로젝트에서는 데이터베이스 사용)
// eslint-disable-next-line prefer-const
let trades: Trade[] = [
  {
    id: '1',
    symbol: 'BTC/USDT',
    type: 'buy',
    tradingType: 'trend',
    quantity: 0.5,
    entryPrice: 45000,
    exitPrice: 47000,
    entryTime: new Date('2024-01-15T10:30:00'),
    exitTime: new Date('2024-01-16T14:20:00'),
    memo: '상승 추세 진입',
    pnl: 1000,
    status: 'closed',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-16T14:20:00'),
  },
  {
    id: '2',
    symbol: 'ETH/USDT',
    type: 'buy',
    tradingType: 'breakout',
    quantity: 2.0,
    entryPrice: 2800,
    entryTime: new Date('2024-01-20T09:15:00'),
    memo: '지지선 반등 기대',
    status: 'open',
    createdAt: new Date('2024-01-20T09:15:00'),
    updatedAt: new Date('2024-01-20T09:15:00'),
  },
  {
    id: '3',
    symbol: 'SOL/USDT',
    type: 'sell',
    tradingType: 'counter_trend',
    quantity: 10,
    entryPrice: 120,
    exitPrice: 115,
    entryTime: new Date('2024-01-18T16:45:00'),
    exitTime: new Date('2024-01-19T11:30:00'),
    memo: '과매수 구간 진입으로 숏 포지션',
    pnl: -50,
    status: 'closed',
    createdAt: new Date('2024-01-18T16:45:00'),
    updatedAt: new Date('2024-01-19T11:30:00'),
  },
];

// 손익 계산 함수
function calculatePnL(trade: Omit<Trade, 'pnl'>): number {
  if (!trade.exitPrice) return 0;
  return trade.type === 'buy'
    ? (trade.exitPrice - trade.entryPrice) * trade.quantity
    : (trade.entryPrice - trade.exitPrice) * trade.quantity;
}

// GET /api/trades - 거래 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

  // Backend proxy (preferred). 실패(404/오류) 시 로컬 fallback으로 전환
  if (BACKEND_BASE_URL) {
    try {
      const qs = searchParams.toString();
      const url = `${BACKEND_BASE_URL.replace(/\/$/, '')}/trades${qs ? `?${qs}` : ''}`;
      const resp = await fetch(url, { headers: { 'Content-Type': 'application/json' } });

      if (resp.ok) {
        const data = await resp.json();
        return NextResponse.json(data, { status: resp.status });
      }

      console.warn(`BACKEND proxy GET /trades failed with status ${resp.status}. Falling back to local.`);
    } catch (err) {
      console.warn('BACKEND proxy GET /trades error. Falling back to local.', err);
    }
  }

    // Fallback: local in-memory list
    const symbol = searchParams.get('symbol');
    const type = searchParams.get('type') as 'buy' | 'sell' | null;
    const status = searchParams.get('status') as 'open' | 'closed' | null;

    let filteredTrades = trades;
    if (symbol)
      filteredTrades = filteredTrades.filter((t) =>
        t.symbol.toLowerCase().includes(symbol.toLowerCase())
      );
    if (type) filteredTrades = filteredTrades.filter((t) => t.type === type);
    if (status) filteredTrades = filteredTrades.filter((t) => t.status === status);

    filteredTrades.sort(
      (a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime()
    );
    const paginatedTrades = filteredTrades.slice(offset, offset + limit);

    return NextResponse.json({
      trades: paginatedTrades,
      total: filteredTrades.length,
      page: Math.floor(offset / limit) + 1,
      limit,
    });
  } catch (error) {
    console.error('거래 조회 에러:', error);
    return NextResponse.json({ error: '거래 목록을 불러오는데 실패했습니다' }, { status: 500 });
  }
}

// POST /api/trades - 새 거래 등록
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 입력 검증 (프론트 API에서는 최소 검증만 수행)
    const validatedData = createTradeSchema.parse(body);

  // Backend proxy (preferred). 실패(404/오류) 시 로컬 fallback으로 전환
  if (BACKEND_BASE_URL) {
    try {
      const url = `${BACKEND_BASE_URL.replace(/\/$/, '')}/trades`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      });

      if (resp.ok) {
        const data = await resp.json();
        return NextResponse.json(data, { status: resp.status });
      }

      console.warn(`BACKEND proxy POST /trades failed with status ${resp.status}. Falling back to local.`);
    } catch (err) {
      console.warn('BACKEND proxy POST /trades error. Falling back to local.', err);
    }
  }

    // Fallback: local compute + in-memory store
    const newTrade: Trade = {
      id: Date.now().toString(), // 실제로는 UUID 사용 권장
      symbol: validatedData.symbol,
      type: validatedData.type,
      tradingType: validatedData.tradingType,
      quantity: validatedData.quantity,
      entryPrice: validatedData.entryPrice,
      exitPrice: validatedData.exitPrice,
      entryTime: new Date(validatedData.entryTime),
      exitTime: validatedData.exitTime ? new Date(validatedData.exitTime) : undefined,
      memo: validatedData.memo,
      stopLoss: validatedData.stopLoss,
      indicators: validatedData.indicators,
      status: validatedData.exitPrice ? 'closed' : 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    newTrade.pnl = calculatePnL(newTrade);

    const strategyScore = computeStrategyScore(newTrade, validatedData.indicators);
    if (strategyScore) newTrade.strategyScore = strategyScore;

    const forbiddenPoints = computeForbiddenPoints(newTrade, trades, 100000);
    newTrade.forbiddenPenalty = TOTAL_FORBIDDEN_POINTS - forbiddenPoints;

    const base = strategyScore?.totalScore ?? 0;
    newTrade.finalScore = base + forbiddenPoints;

    trades.unshift(newTrade);

    return NextResponse.json(newTrade, { status: 201 });
  } catch (error) {
    console.error('거래 등록 에러:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력값이 올바르지 않습니다', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: '거래 등록에 실패했습니다' }, { status: 500 });
  }
}
