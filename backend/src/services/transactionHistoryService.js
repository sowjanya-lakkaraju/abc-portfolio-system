import ITransactionHistoryService from './interfaces/ITransactionHistoryService.js';

import { TransactionHistoryFilter,TransactionHistoryException } from '../models/TransactionHistory.js';


/**
 * Transaction History Service Implementation
 * Contains business logic for transaction history operations
 */
class TransactionHistoryService extends ITransactionHistoryService {
  constructor(repository, validator, auditService, logger) {
    super();
    this.repository = repository;
    this.validator = validator;
    this.auditService = auditService;
    this.logger = logger;
  }

  /**
   * Get transaction history based on filter criteria
   */
  async getTransactionHistory(filter, page = 1, limit = 10) {
    const startTime = Date.now();
    
    try {
      this.logger.info('Starting transaction history retrieval', { filter, page, limit });

      // Validate input
      const validationErrors = await this.validator.validateFilter(filter);
      if (validationErrors.length > 0) {
        throw new TransactionHistoryException(
          'Validation failed',
          400,
          validationErrors
        );
      }

      // Check if at least one search filter is provided
      if (!this._hasAtLeastOneFilter(filter)) {
        throw new TransactionHistoryException(
          'At least one search filter must be provided',
          400
        );
      }

      // Fetch data
      const result = await this.repository.findTransactionHistory(filter, page, limit);

      const response = new TransactionHistoryResponse({
        data: result.data,
        total: result.total,
        page,
        limit
      });

      // Audit the action
      await this.auditService.logAction(
        filter.userId,
        'TRANSACTION_HISTORY_VIEWED',
        startTime,
        Date.now()
      );

      this.logger.info('Transaction history retrieved successfully', {
        userId: filter.userId,
        recordCount: result.data.length
      });

      return response;
    } catch (error) {
      this.logger.error('Error retrieving transaction history', error);
      
      if (error instanceof TransactionHistoryException) {
        throw error;
      }
      
      throw new TransactionHistoryException(
        'Internal server error occurred while retrieving transaction history',
        500
      );
    }
  }

  /**
   * Check if at least one filter is provided
   * @private
   */
  _hasAtLeastOneFilter(filter) {
    return !!(
      filter.orderRefNo ||
      filter.securityName ||
      filter.transactionType ||
      filter.orderStatus ||
      filter.fromDate ||
      filter.toDate
    );
  }
}

export default TransactionHistoryService;