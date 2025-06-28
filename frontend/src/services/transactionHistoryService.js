/**
 * Transaction History API Service
 * Handles API communication for transaction history
 */
class TransactionHistoryService {
  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Get transaction history from API
   */
  async getTransactionHistory(filter, page = 1, limit = 10) {
    const queryParams = new URLSearchParams();
    
    // Add filter parameters
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    const response = await fetch(`${this.baseUrl}/transactions/history?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming JWT auth
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export default TransactionHistoryService;