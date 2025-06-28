import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './src/config/database.js';
import dotenv from 'dotenv'; 
dotenv.config();
import morgan from 'morgan';
import  errorHandler from './src/middleware/error.js';
import logger from './src/utils/logger.js';
import { transactionRoutes } from './src/routes/transaction-history-route.js';
const PORT = process.env.PORT || 5000;
// Routes
const app = express();
app.use(morgan('dev'));
// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes

app.use('/api/transactions', transactionRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Initialize services
async function startServer() {
  try {
    await connectDB();
   // await connectRedis();
   // await initKafka();
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;