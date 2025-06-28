import mongoose from "mongoose";

const auditActionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userAction: {
    type: String,
    required: true
  },
  startDateTime: {
    type: Date,
    default: Date.now
  },
  endDateTime: {
    type: Date
  },
  ipAddress: String,
  userAgent: String,
  sessionId: String
}, {
  timestamps: true
});

export const AuditAction = mongoose.model('AuditAction', auditActionSchema);