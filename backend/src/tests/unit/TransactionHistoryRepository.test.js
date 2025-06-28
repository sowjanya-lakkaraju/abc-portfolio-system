

import TransactionHistoryRepository from '../../src/repositories/TransactionHistoryRepository.js';
import { TransactionHistoryFilter } from '../../src/models/TransactionHistory.js';

// Mock Prisma Client
const mockPrisma = {
  orderDetail: {
    findMany: jest.fn(),
    count: jest.fn(),
    findFirst: jest.fn()
  },
  securityDetail: {
    findFirst: jest.fn()
  }
};

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

describe('TransactionHistoryRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new TransactionHistoryRepository(mockPrisma, mockLogger);
    jest.clearAllMocks();
  });

  describe('findTransactionHistory', () => {
    it('should return transaction history with correct data structure', async () => {
      // Arrange
      const filter = new TransactionHistoryFilter({
        userId: 'user123',
        transactionType: 'Buy'
      });
      
      const mockOrders = [
        {
          id: '1',
          orderRefNo: 'ORD001',
          transactionType: 'Buy',
          orderStatus: 'Completed',
          orderDate: new Date('2024-01-01'),
          quantity: 100,
          orderValue: '1000.00',
          securityDetail: {
            securityName: 'AAPL'
          }
        }
      ];

      mockPrisma.orderDetail.findMany.mockResolvedValue(mockOrders);
      mockPrisma.orderDetail.count.mockResolvedValue(1);

      // Act
      const result = await repository.findTransactionHistory(filter, 1, 10);

      // Assert
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.data[0].id).toBe('1');
      expect(result.data[0].orderRefNo).toBe('ORD001');
      expect(result.data[0].securityName).toBe('AAPL');
    });

    it('should apply filters correctly', async () => {
      // Arrange
      const filter = new TransactionHistoryFilter({
        userId: 'user123',
        orderRefNo: 'ORD001',
        transactionType: 'Buy',
        fromDate: new Date('2024-01-01'),
        toDate: new Date('2024-01-31')
      });

      mockPrisma.orderDetail.findMany.mockResolvedValue([]);
      mockPrisma.orderDetail.count.mockResolvedValue(0);

      // Act
      await repository.findTransactionHistory(filter, 1, 10);

      // Assert
      expect(mockPrisma.orderDetail.findMany).toHaveBeenCalledWith({
        where: {
          createdBy: 'user123',
          orderRefNo: 'ORD001',
          transactionType: 'Buy',
          orderDate: {
            gte: new Date('2024-01-01'),
            lte: new Date('2024-01-31')
          }
        },
        include: {
          securityDetail: true
        },
        orderBy: {
          orderDate: 'desc'
        },
        skip: 0,
        take: 10
      });
    });

    it('should handle database errors', async () => {
      // Arrange
      const filter = new TransactionHistoryFilter({ userId: 'user123' });
      mockPrisma.orderDetail.findMany.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(repository.findTransactionHistory(filter, 1, 10))
        .rejects.toThrow('Database error');
    });
  });

  describe('validateOrderRefNo', () => {
    it('should return true for existing order reference', async () => {
      // Arrange
      mockPrisma.orderDetail.findFirst.mockResolvedValue({ id: '1' });

      // Act
      const result = await repository.validateOrderRefNo('ORD001');

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for non-existing order reference', async () => {
      // Arrange
      mockPrisma.orderDetail.findFirst.mockResolvedValue(null);

      // Act
      const result = await repository.validateOrderRefNo('INVALID');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('validateSecurityName', () => {
    it('should return true for existing security name', async () => {
      // Arrange
      mockPrisma.securityDetail.findFirst.mockResolvedValue({ id: '1' });

      // Act
      const result = await repository.validateSecurityName('AAPL');

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for non-existing security name', async () => {
      // Arrange
      mockPrisma.securityDetail.findFirst.mockResolvedValue(null);

      // Act
      const result = await repository.validateSecurityName('INVALID');

      // Assert
      expect(result).toBe(false);
    });
  });
});