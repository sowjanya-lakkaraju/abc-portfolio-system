import { useState, useCallback } from 'react';
import TransactionHistoryService from '../services/transactionHistoryService';

/**
 * Custom hook for transaction history operations
 */
export const useTransactionHistory = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const service = new TransactionHistoryService();

  const fetchTransactionHistory = useCallback(async (filter, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await service.getTransactionHistory(filter, page, limit);
      
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchTransactionHistory
  };
};