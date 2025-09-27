const mongoose = require('mongoose');
const { getMainConnection } = require('../config/database');

const testAnalysisResultSchema = new mongoose.Schema({
  contractAddress: {
    type: String,
    required: true,
    index: true
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  riskLevel: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical']
  },
  riskFactors: [{
    type: String
  }],
  recommendation: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  analysisType: {
    type: String,
    default: 'test-analysis'
  },
  transactionData: {
    type: mongoose.Schema.Types.Mixed
  },
  testMode: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'testdata'  // 修改为使用Hark数据库的testdata集合
});

// 创建索引
testAnalysisResultSchema.index({ contractAddress: 1, createdAt: -1 });
testAnalysisResultSchema.index({ riskLevel: 1, createdAt: -1 });

/**
 * 获取测试分析模型（使用Hark数据库的testdata集合）
 */
function getTestAnalysisModel() {
    try {
        const mainConnection = getMainConnection();
        if (!mainConnection) {
            // 如果主数据库连接不可用，使用默认连接
            console.warn('Main database connection not available, using default mongoose connection');
            
            // 检查默认连接中是否已存在该模型
            if (mongoose.models.TestAnalysisResult) {
                return mongoose.models.TestAnalysisResult;
            }
            return mongoose.model('TestAnalysisResult', testAnalysisResultSchema);
        }

        // 检查主连接中是否已存在该模型
        if (mainConnection.models.TestAnalysisResult) {
            return mainConnection.models.TestAnalysisResult;
        }

        // 创建新的模型，使用Hark数据库连接
        return mainConnection.model('TestAnalysisResult', testAnalysisResultSchema);
    } catch (error) {
        console.error('Error getting test analysis model:', error);
        
        // 降级到默认连接
        try {
            if (mongoose.models.TestAnalysisResult) {
                return mongoose.models.TestAnalysisResult;
            }
            return mongoose.model('TestAnalysisResult', testAnalysisResultSchema);
        } catch (fallbackError) {
            console.error('Fallback model creation failed:', fallbackError);
            throw new Error('无法创建测试分析模型');
        }
    }
}

module.exports = getTestAnalysisModel;