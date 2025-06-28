import { ValidationError } from '../models/TransactionHistory.js';

/**
 * Transaction History Validator
 * Handles validation of transaction history filters
 */
class TransactionHistoryValidator {
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Validate transaction history filter
   */
  async validateFilter(filter) {
    const errors = [];

    // Validate Order Ref No
    if (filter.orderRefNo) {
      const isValidOrderRef = await this.repository.validateOrderRefNo(filter.orderRefNo);
      if (!isValidOrderRef) {
        errors.push(new ValidationError('orderRefNo', 'Invalid Order Ref No.'));
      }
    }

    // Validate Security Name
    if (filter.securityName) {
      const isValidSecurity = await this.repository.validateSecurityName(filter.securityName);
      if (!isValidSecurity) {
        errors.push(new ValidationError('securityName', 'Invalid Security Name'));
      }
    }

    // Validate Transaction Type
    if (filter.transactionType && !['Buy', 'Sell'].includes(filter.transactionType)) {
      errors.push(new ValidationError('transactionType', 'Invalid Transaction Type'));
    }

    // Validate Order Status
    const validStatuses = ['Submitted', 'Cancelled', 'Executed', 'Completed', 'Failed'];
    if (filter.orderStatus && !validStatuses.includes(filter.orderStatus)) {
      errors.push(new ValidationError('orderStatus', 'Invalid Order Status'));
    }

    // Validate Date Range
    if (filter.fromDate && filter.toDate) {
      if (filter.fromDate >= filter.toDate) {
        errors.push(new ValidationError('fromDate', 'Invalid From Date or To Date'));
        errors.push(new ValidationError('toDate', 'Invalid From Date or To Date'));
      }
    }

    return errors;
  }
}

export default TransactionHistoryValidator;