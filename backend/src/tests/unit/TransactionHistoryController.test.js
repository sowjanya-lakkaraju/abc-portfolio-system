
import TransactionHistoryController from '../../src/controllers/TransactionHistoryController.js';
import { TransactionHistoryException } from '../../src/models/TransactionHistory.js';
// Mocks
const mockService = {
  getTransactionHistory: jest.fn()
};

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

const mockRequest = {
  user: { userId: 'user123' },
  query: {
    transactionType: 'Buy',
    page: '1',
    limit: '10'
  }
};

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

describe('TransactionHistoryController', () => {
  let controller;

  beforeEach(() => {
    controller = new TransactionHistoryController(mockService, mockLogger);
    jest.clearAllMocks();
  });

  describe('getTransactionHistory', () => {
    it('should return transaction history successfully', async () => {
      // Arrange
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 10
      };

      mockService.getTransactionHistory.mockResolvedValue(mockResult);

      // Act
      await controller.getTransactionHistory(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Transaction history retrieved successfully',
        data: mockResult
      });
    });

    it('should handle validation errors', async () => {
      // Arrange
      const validationError = new TransactionHistoryException(
        'Validation failed',
        400,
        [{ field: 'orderRefNo', message: 'Invalid Order Ref No.' }]
      );

      mockService.getTransactionHistory.mockRejectedValue(validationError);

      // Act
      await controller.getTransactionHistory(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'orderRefNo', message: 'Invalid Order Ref No.' }]
      });
    });

    it('should handle unexpected errors', async () => {
      // Arrange
      mockService.getTransactionHistory.mockRejectedValue(new Error('Unexpected error'));

      // Act
      await controller.getTransactionHistory(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error'
      });
    });
  });
});