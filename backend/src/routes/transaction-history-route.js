import express from "express";
import { validateTransactionHistory } from "../middleware/validation.js";
import { transactionController } from "../controllers/transactionController.js";
const router = express.Router();

router.get('/history', validateTransactionHistory,transactionController.getTransactionHistory); // Route to get transaction history with validation middleware


export const transactionRoutes = router;