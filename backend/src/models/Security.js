import mongoose from "mongoose";

const securitySchema = new mongoose.Schema({
  securityName: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Security = mongoose.model('Security', securitySchema);