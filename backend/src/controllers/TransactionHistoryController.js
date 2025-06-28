

import { TransactionHistoryFilter, TransactionHistoryException } from '../models/TransactionHistory.js';

/**
 * Transaction History Controller
 * Handles HTTP requests for transaction history
 */
class TransactionHistoryController {
  constructor(service, logger) {
    this.service = service;
    this.logger = logger;
  }

  /**
   * Get transaction history endpoint
   */
  async getTransactionHistory(req, res) {
    try {
      const { userId } = req.user; // Assuming user is authenticated
      const {
        orderRefNo,
        securityName,
        transactionType,
        orderStatus,
        fromDate,
        toDate,
        page = 1,
        limit = 10
      } = req.query;

      const filter = new TransactionHistoryFilter({
        userId,
        orderRefNo,
        securityName,
        transactionType,
        orderStatus,
        fromDate: fromDate ? new Date(fromDate) : null,
        toDate: toDate ? new Date(toDate) : null
      });

      const result = await this.service.getTransactionHistory(
        filter,
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        message: 'Transaction history retrieved successfully',
        data: result
      });
    } catch (error) {
      if (error instanceof TransactionHistoryException) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          errors: error.validationErrors
        });
      } else {
        this.logger.error('Unexpected error in transaction history controller', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  }
}
export default TransactionHistoryController;