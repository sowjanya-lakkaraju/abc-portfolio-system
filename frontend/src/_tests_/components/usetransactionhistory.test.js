import { renderHook, act } from '@testing-library/react';
import { useTransactionHistory } from '../../hooks/useTransactionHistory';
import TransactionHistoryService from '../../services/transactionHistoryService';

// Mock the service
jest.mock('../../services/TransactionHistoryService');

describe('useTransactionHistory', () => {
  let mockService;

  beforeEach(() => {
    mockService = new TransactionHistoryService();
    TransactionHistoryService.mockImplementation(() => mockService);
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useTransactionHistory());

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should fetch transaction history successfully', async () => {
    const mockResponse = {
      success: true,
      message: 'Success',
      data: {
        data: [],
        total: 0,
        page: 1,
        limit: 10
      }
    };

    mockService.getTransactionHistory.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useTransactionHistory());

    await act(async () => {
      await result.current.fetchTransactionHistory({ userId: 'test' });
    });

    expect(result.current.data).toEqual(mockResponse.data);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors correctly', async () => {
    const errorMessage = 'Network error';
    mockService.getTransactionHistory.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useTransactionHistory());

    await act(async () => {
      await result.current.fetchTransactionHistory({ userId: 'test' });
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });
});