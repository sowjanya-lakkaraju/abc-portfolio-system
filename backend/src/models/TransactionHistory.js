/**
 * Transaction History Filter class
 */
class TransactionHistoryFilter {
  constructor({
    orderRefNo = null,
    securityName = null,
    transactionType = null,
    orderStatus = null,
    fromDate = null,
    toDate = null,
    userId
  } = {}) {
    this.orderRefNo = orderRefNo;
    this.securityName = securityName;
    this.transactionType = transactionType;
    this.orderStatus = orderStatus;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.userId = userId;
  }
}

/**
 * Transaction History Record class
 */
class TransactionHistoryRecord {
  constructor({
    id,
    orderRefNo,
    securityName,
    transactionType,
    orderStatus,
    orderDate,
    quantity,
    orderValue
  }) {
    this.id = id;
    this.orderRefNo = orderRefNo;
    this.securityName = securityName;
    this.transactionType = transactionType;
    this.orderStatus = orderStatus;
    this.orderDate = orderDate;
    this.quantity = quantity;
    this.orderValue = orderValue;
  }
}

/**
 * Transaction History Response class
 */
class TransactionHistoryResponse {
  constructor({ data, total, page, limit }) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}

/**
 * Validation Error class
 */
class ValidationError {
  constructor(field, message) {
    this.field = field;
    this.message = message;
  }
}

/**
 * Transaction History Exception class
 */
class TransactionHistoryException extends Error {
  constructor(message, statusCode = 400, validationErrors = []) {
    super(message);
    this.name = 'TransactionHistoryException';
    this.statusCode = statusCode;
    this.validationErrors = validationErrors;
  }
}

export  {
  TransactionHistoryFilter,
  TransactionHistoryRecord,
  TransactionHistoryResponse,
  ValidationError,
  TransactionHistoryException
};