import { portfolioService } from '../services/portfolioService';
import { Order } from '../models/Order';
import { Account } from '../../models/Account';

jest.mock('../../models/Order');
jest.mock('../../models/Account');

describe('TransactionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTransactionHistory', () => {
    it('should return transaction history with orders and account', async () => {
      const userId = 'user123';
      const mockOrders = [
        { _id: '1', orderValue: 1000, transactionType: 'BUY' },
        { _id: '2', orderValue: 500, transactionType: 'SELL' }
      ];
      const mockAccount = { runningBalance: 10000 };

      Order.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockOrders)
        })
      });
      Account.findOne.mockResolvedValue(mockAccount);

      const result = await portfolioService.getPortfolioSummary(userId, {});

      expect(result.orders).toEqual(mockOrders);
      expect(result.account).toEqual(mockAccount);
      expect(result.metrics.totalInvestment).toBe(1000);
      expect(result.metrics.totalRedemption).toBe(500);
    });
  });

  describe('calculatePortfolioMetrics', () => {
    it('should calculate correct portfolio metrics', () => {
      const orders = [
        { orderValue: 1000, transactionType: 'BUY' },
        { orderValue: 2000, transactionType: 'BUY' },
        { orderValue: 500, transactionType: 'SELL' }
      ];

      const metrics = portfolioService.calculatePortfolioMetrics(orders);

      expect(metrics.totalInvestment).toBe(3000);
      expect(metrics.totalRedemption).toBe(500);
      expect(metrics.netInvestment).toBe(2500);
      expect(metrics.totalOrders).toBe(3);
    });
  });
});