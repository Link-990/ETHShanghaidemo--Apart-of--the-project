const mongoose = require('mongoose');
const getTestAnalysisModel = require('../models/TestAnalysisResult');
const logger = require('../utils/logger');

class TestAnalysisService {
    constructor() {
        this.model = null;
    }

    /**
     * 获取测试分析模型
     */
    async getModel() {
        if (!this.model) {
            try {
                this.model = await getTestAnalysisModel();
                logger.info('Test analysis model initialized successfully');
            } catch (error) {
                logger.error('Failed to initialize test analysis model:', error);
                throw new Error('初始化测试分析模型失败: ' + error.message);
            }
        }
        return this.model;
    }

    /**
     * 保存测试分析结果
     */
    async saveTestAnalysis(contractAddress, analysisData) {
        try {
            const TestAnalysisResult = await this.getModel();
            
            const testRecord = new TestAnalysisResult({
                contractAddress,
                riskScore: analysisData.riskScore,
                riskLevel: analysisData.riskLevel,
                riskFactors: analysisData.riskFactors || [],
                recommendation: analysisData.recommendation || '',
                confidence: analysisData.confidence || 0,
                analysisType: 'test-analysis',
                transactionData: analysisData.transactionData,
                testMode: true
            });

            const saved = await testRecord.save();
            logger.info(`Test analysis saved to testdata database for contract: ${contractAddress}`);
            
            return saved;
        } catch (error) {
            logger.error('Failed to save test analysis:', error);
            throw new Error('保存测试分析失败: ' + error.message);
        }
    }

    /**
     * 获取测试分析历史
     */
    async getTestAnalysisHistory(contractAddress, limit = 10) {
        try {
            const TestAnalysisResult = await this.getModel();
            
            const query = contractAddress ? { contractAddress } : {};
            
            const history = await TestAnalysisResult.find(query)
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean();

            logger.info(`Retrieved ${history.length} test analysis records from testdata database`);
            return history;
        } catch (error) {
            logger.error('Failed to get test analysis history:', error);
            throw new Error('获取测试分析历史失败: ' + error.message);
        }
    }

    /**
     * 获取测试分析统计
     */
    async getTestAnalysisStats() {
        try {
            const TestAnalysisResult = await this.getModel();
            
            const stats = await TestAnalysisResult.aggregate([
                {
                    $group: {
                        _id: '$riskLevel',
                        count: { $sum: 1 },
                        avgRiskScore: { $avg: '$riskScore' }
                    }
                },
                {
                    $sort: { count: -1 }
                }
            ]);

            const totalCount = await TestAnalysisResult.countDocuments();
            
            logger.info(`Retrieved test analysis stats from testdata database: ${totalCount} total records`);
            return {
                total: totalCount,
                byRiskLevel: stats
            };
        } catch (error) {
            logger.error('Failed to get test analysis stats:', error);
            throw new Error('获取测试分析统计失败: ' + error.message);
        }
    }
}

module.exports = new TestAnalysisService();