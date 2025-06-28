
import { TransactionHistoryService } from '../../src/services/TransactionHistoryService.js';
import { TransactionHistoryFilter, TransactionHistoryException } from '../../src/models/TransactionHistory.js';

// Mocks
const mockRepository = {
  findTransactionHistory: jest.fn(),
  validateOrderRefNo: jest.fn(),
  validateSecurityName: jest.fn()
};

const mockValidator = {
  validateFilter: jest.fn()
};

const mockAuditService = {
  logAction: jest.fn()
};

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

describe('TransactionHistoryService', () => {
  let service;

  beforeEach(() => {
    service = new TransactionHistoryService(
      mockRepository,
      mockValidator,
      mockAuditService,
      mockLogger
    );
    jest.clearAllMocks();
  });

  describe('getTransactionHistory', () => {
    it('should return transaction history successfully', async () => {
      // Arrange
      const filter = new TransactionHistoryFilter({
        userId: 'user123',
        transactionType: 'Buy'
      });

      const mockData = [
        {
          id: '1',
          orderRefNo: 'ORD001',
          securityName: 'AAPL',
          transactionType: 'Buy',
          orderStatus: 'Completed',
          orderDate: new Date(),
          quantity: 100,
          orderValue: '1000.00'
        }
      ];

      mockValidator.validateFilter.mockResolvedValue([]);
      mockRepository.findTransactionHistory.mockResolvedValue({
        data: mockData,
        total: 1
      });

      // Act
      const result = await service.getTransactionHistory(filter, 1, 10);

      // Assert
      expect(result.data).toEqual(mockData);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(mockAuditService.logAction).toHaveBeenCalled();
    });

    it('should throw validation error when validation fails', async () => {
      // Arrange
      const filter = new TransactionHistoryFilter({ userId: 'user123' });
      const validationErrors = [
        { field: 'orderRefNo', message: 'Invalid Order Ref No.' }
      ];

      mockValidator.validateFilter.mockResolvedValue(validationErrors);

      // Act & Assert
      await expect(service.getTransactionHistory(filter))
        .rejects.toThrow(TransactionHistoryException);
    });

    it('should throw error when no filters provided', async () => {
      // Arrange
      const filter = new TransactionHistoryFilter({ userId: 'user123' });
      mockValidator.validateFilter.mockResolvedValue([]);

      // Act & Assert
      await expect(service.getTransactionHistory(filter))
        .rejects.toThrow('At least one search filter must be provided');
    });

    it('should handle repository errors', async () => {
      // Arrange
      const filter = new TransactionHistoryFilter({
        userId: 'user123',
        transactionType: 'Buy'
      });

      mockValidator.validateFilter.mockResolvedValue([]);
      mockRepository.findTransactionHistory.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.getTransactionHistory(filter))
        .rejects.toThrow('Internal server error occurred while retrieving transaction history');
    });
  });
});