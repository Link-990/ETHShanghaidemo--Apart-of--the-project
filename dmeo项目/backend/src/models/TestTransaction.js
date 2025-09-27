const mongoose = require('mongoose');

const testTransactionSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true
  },
  contractAddress: {
    type: String,
    required: true,
    index: true
  },
  fromAddress: {
    type: String,
    required: true
  },
  toAddress: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  gas: {
    type: String
  },
  gasPrice: {
    type: String
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'analyzed', 'blocked', 'approved']
  },
  analysisType: {
    type: String,
    required: true,
    enum: ['ai-analysis', 'test-analysis']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 创建索引
testTransactionSchema.index({ contractAddress: 1, createdAt: -1 });
testTransactionSchema.index({ status: 1, createdAt: -1 });
testTransactionSchema.index({ riskScore: -1 });

module.exports = mongoose.model('TestTransaction', testTransactionSchema);