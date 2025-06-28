import ITransactionHistoryRepository from "./interfaces/ITransactionHistoryRepository.js";
import {TransactionHistoryRecord} from "../models/TransactionHistory.js";

/**
 * Transaction History Repository Implementation
 * Handles data access for transaction history
 */
class TransactionHistoryRepository extends ITransactionHistoryRepository {
  constructor(prisma, logger) {
    super();
    this.prisma = prisma;
    this.logger = logger;
  }

  /**
   * Find transaction history based on filter criteria
   */
  async findTransactionHistory(filter, page, limit) {
    try {
      this.logger.info('Fetching transaction history', { filter, page, limit });

      const whereClause = {
        createdBy: filter.userId
      };

      // Apply filters
      if (filter.orderRefNo) {
        whereClause.orderRefNo = filter.orderRefNo;
      }

      if (filter.transactionType) {
        whereClause.transactionType = filter.transactionType;
      }

      if (filter.orderStatus) {
        whereClause.orderStatus = filter.orderStatus;
      }

      if (filter.fromDate || filter.toDate) {
        whereClause.orderDate = {};
        if (filter.fromDate) {
          whereClause.orderDate.gte = filter.fromDate;
        }
        if (filter.toDate) {
          whereClause.orderDate.lte = filter.toDate;
        }
      }

      if (filter.securityName) {
        whereClause.securityDetail = {
          securityName: filter.securityName
        };
      }

      const [orders, total] = await Promise.all([
        this.prisma.orderDetail.findMany({
          where: whereClause,
          include: {
            securityDetail: true
          },
          orderBy: {
            orderDate: 'desc'
          },
          skip: (page - 1) * limit,
          take: limit
        }),
        this.prisma.orderDetail.count({
          where: whereClause
        })
      ]);

      const data = orders.map(order => new TransactionHistoryRecord({
        id: order.id,
        orderRefNo: order.orderRefNo,
        securityName: order.securityDetail.securityName,
        transactionType: order.transactionType,
        orderStatus: order.orderStatus,
        orderDate: order.orderDate,
        quantity: order.quantity || 0,
        orderValue: order.orderValue
      }));

      this.logger.info('Transaction history fetched successfully', { 
        count: data.length, 
        total 
      });

      return { data, total };
    } catch (error) {
      this.logger.error('Error fetching transaction history', error);
      throw error;
    }
  }

  /**
   * Validate if order reference number exists
   */
  async validateOrderRefNo(orderRefNo) {
    try {
      const order = await this.prisma.orderDetail.findFirst({
        where: { orderRefNo }
      });
      return !!order;
    } catch (error) {
      this.logger.error('Error validating order ref no', error);
      return false;
    }
  }

  /**
   * Validate if security name exists
   */
  async validateSecurityName(securityName) {
    try {
      const security = await this.prisma.securityDetail.findFirst({
        where: { securityName }
      });
      return !!security;
    } catch (error) {
      this.logger.error('Error validating security name', error);
      return false;
    }
  }
}

export default TransactionHistoryRepository;