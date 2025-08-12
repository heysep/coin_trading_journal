import { apiClient } from '@/lib/axios';
import { Trade, TradesResponse, CreateTradeRequest, TradeFilters } from '@/types/trade';

// 거래 API 클라이언트 함수들
export const tradesApi = {
  // 거래 목록 조회
  getTrades: async (filters?: TradeFilters): Promise<TradesResponse> => {
    try {
      const params = new URLSearchParams();

      if (filters?.symbol) params.append('symbol', filters.symbol);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const url = `/api/trades${params.toString() ? `?${params.toString()}` : ''}`;
      // Next API 라우트는 항상 동일 오리진으로 보냄 (외부 baseURL 설정 무시)
      const response = await apiClient.get<TradesResponse>(url, { baseURL: '' });

      // Date 객체로 변환
      const transformedTrades = response.data.trades.map((trade) => ({
        ...trade,
        entryTime: new Date(trade.entryTime),
        exitTime: trade.exitTime ? new Date(trade.exitTime) : undefined,
        createdAt: new Date(trade.createdAt),
        updatedAt: new Date(trade.updatedAt),
      }));

      return {
        ...response.data,
        trades: transformedTrades,
      };
    } catch (error) {
      console.error('거래 목록 조회 실패:', error);
      throw new Error('거래 목록을 불러오는데 실패했습니다');
    }
  },

  // 새 거래 등록
  createTrade: async (tradeData: CreateTradeRequest): Promise<Trade> => {
    try {
      // Next API 라우트는 항상 동일 오리진으로 보냄
      const response = await apiClient.post<Trade>('/api/trades', tradeData, { baseURL: '' });

      // Date 객체로 변환
      return {
        ...response.data,
        entryTime: new Date(response.data.entryTime),
        exitTime: response.data.exitTime ? new Date(response.data.exitTime) : undefined,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('거래 등록 실패:', error);
      throw new Error('거래 등록에 실패했습니다');
    }
  },

  // 거래 수정 (향후 확장용)
  updateTrade: async (id: string, tradeData: Partial<CreateTradeRequest>): Promise<Trade> => {
    try {
      // Next API 라우트는 항상 동일 오리진으로 보냄
      const response = await apiClient.put<Trade>(`/api/trades/${id}`, tradeData, { baseURL: '' });

      return {
        ...response.data,
        entryTime: new Date(response.data.entryTime),
        exitTime: response.data.exitTime ? new Date(response.data.exitTime) : undefined,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error) {
      console.error('거래 수정 실패:', error);
      throw new Error('거래 수정에 실패했습니다');
    }
  },

  // 거래 삭제 (향후 확장용)
  deleteTrade: async (id: string): Promise<void> => {
    try {
      // Next API 라우트는 항상 동일 오리진으로 보냄
      await apiClient.delete(`/api/trades/${id}`, { baseURL: '' });
    } catch (error) {
      console.error('거래 삭제 실패:', error);
      throw new Error('거래 삭제에 실패했습니다');
    }
  },
};
