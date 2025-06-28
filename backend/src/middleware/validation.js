import joi from 'joi';
import { AppError } from '../utils/apperror.js';

export const validateTransactionHistory = (req, res, next) => {
    console.log('Validating transaction history request:', req.query);
  const schema = joi.object({
    orderRefNo: joi.string().optional(),
    securityName: joi.string().optional(),
    transactionType: joi.string().valid('BUY', 'SELL').optional(),
    orderStatus: joi.string().valid('SUBMITTED', 'CANCELLED', 'EXECUTED', 'COMPLETED', 'FAILED').optional(),
    fromDate: joi.date().optional(),
    toDate: joi.date().greater(joi.ref('fromDate')).optional()
  }).and('fromDate', 'toDate');

  // At least one filter required
  const hasFilter = Object.keys(req.query).some(key => 
    ['orderRefNo', 'securityName', 'transactionType', 'orderStatus', 'fromDate'].includes(key)
  );

  if (!hasFilter) {
    return next(new AppError('At least one search filter is required', 400));
  }

  const { error } = schema.validate(req.query);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  next();
};