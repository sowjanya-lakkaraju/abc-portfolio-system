import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderRefNo: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  securityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Security',
    required: true
  },
  transactionType: {
    type: String,
    enum: ['BUY', 'SELL'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  orderValue: {
    type: Number,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ['SUBMITTED', 'CANCELLED', 'EXECUTED', 'COMPLETED', 'FAILED'],
    default: 'SUBMITTED'
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate order reference number
orderSchema.pre('save', function(next) {
  if (!this.orderRefNo) {
    this.orderRefNo = `ORD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  next();
});

export const Order = mongoose.model('Order', orderSchema);