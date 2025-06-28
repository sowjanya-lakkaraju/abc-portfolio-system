
import { transactionService } from '../services/transactionService.js';



class TransactionController {
   async getTransactionHistory(req, res, next) {
    try {
      
      const userId = 1;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: user not found" });
    }
      const filters = req.query;

      // Log audit action
     // await auditService.logAction(userId, 'TRANSACTION_HISTORY_VIEW', req);

      const transactions = await transactionService.getTransactionHistory(userId, filters);

      res.status(200).json({
        success: true,
        data: transactions
      });
    } catch (error) {
      next(error);
    }
  }
}


export const transactionController = new TransactionController();