import { Order } from "../models/Order.js";
import { Account } from "../models/Account.js";
import { Security } from "../models/Security.js";
import logger from "../utils/logger.js";
import { AppError } from "../utils/apperror.js";

class TransactionService {
 
  async getTransactionHistory(userId, filters) {
    try {
      const query = { userId };
      
      // Build query based on filters
      if (filters.orderRefNo) query.orderRefNo = filters.orderRefNo;
      if (filters.transactionType) query.transactionType = filters.transactionType;
      if (filters.orderStatus) query.orderStatus = filters.orderStatus;
      
      if (filters.fromDate && filters.toDate) {
        query.createdAt = {
          $gte: new Date(filters.fromDate),
          $lte: new Date(filters.toDate)
        };
      }

      const limit = 50;
      const offset = filters.page ? (filters.page - 1) * limit : 0;
      const transactions = await Order.find(query)
        .populate('securityId', 'securityName')
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);

      return transactions;
    } catch (error) {
      logger.error('Transaction history error:', error);
      throw new AppError('Failed to fetch transaction history', 500);
    }
  }
}

export const transactionService = new TransactionService();