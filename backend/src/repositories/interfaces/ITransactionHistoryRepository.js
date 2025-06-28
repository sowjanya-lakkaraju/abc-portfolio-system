/**
 * Transaction History Repository Interface
 * Defines the contract for transaction history data access
 */
class ITransactionHistoryRepository {
  /**
   * Find transaction history based on filter criteria
   * @param {Object} filter - Filter criteria
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<{data: Array, total: number}>}
   */
  async findTransactionHistory(filter, page, limit) {
    throw new Error('Method not implemented');
  }

  /**
   * Validate if order reference number exists
   * @param {string} orderRefNo - Order reference number
   * @returns {Promise<boolean>}
   */
  async validateOrderRefNo(orderRefNo) {
    throw new Error('Method not implemented');
  }

  /**
   * Validate if security name exists
   * @param {string} securityName - Security name
   * @returns {Promise<boolean>}
   */
  async validateSecurityName(securityName) {
    throw new Error('Method not implemented');
  }
}

export default ITransactionHistoryRepository;