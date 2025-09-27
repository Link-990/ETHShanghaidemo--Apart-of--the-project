import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

class RiskAnalysisService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/api`,
      timeout: 30000
    })
  }

  async analyzeContract(contractAddress, transactionData) {
    try {
      console.log('🔍 Starting risk analysis for:', contractAddress)
      
      const response = await this.api.post('/risk-analysis/analyze-contract', {
        contractAddress,
        transactionData
      })
      
      console.log('📥 Received backend response:', response.data)
      
      // 🔧 修复：检查响应数据结构并提供降级处理
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.error || '分析请求失败')
      }
      
      const analysisData = response.data.data
      
      // 验证必要字段是否存在
      if (!analysisData) {
        throw new Error('后端返回的分析数据为空')
      }
      
      // 确保所有必要字段都存在，提供默认值
      const standardizedData = {
        riskScore: analysisData.riskScore || analysisData.ethAIRiskScore || 0,
        riskLevel: analysisData.riskLevel || analysisData.ethAIRiskLevel || 'medium',
        riskFactors: analysisData.riskFactors || analysisData.ethAIRiskFactors || ['AI分析完成'],
        recommendation: analysisData.recommendation || analysisData.ethAIRecommendation || '建议进行更详细的审计',
        // 🔧 修复：后端已经返回0-100范围的置信度，不需要再乘以100
        confidence: analysisData.confidence || analysisData.comprehensiveConfidence || 
                   (analysisData.ethAIConfidence || 85),
        
        // 🆕 新增：综合置信度相关字段
        comprehensiveConfidence: analysisData.comprehensiveConfidence,
        
        // 保留所有原始数据
        ...analysisData
      }
      
      console.log('✅ Risk analysis completed:', standardizedData)
      return standardizedData
      
    } catch (error) {
      console.error('❌ Contract analysis failed:', error)
      
      // 提供更详细的错误信息
      if (error.response) {
        // 服务器返回错误响应
        const errorMsg = error.response.data?.error || error.response.statusText || '服务器错误'
        throw new Error(`分析失败: ${errorMsg}`)
      } else if (error.request) {
        // 网络请求失败
        throw new Error('网络连接失败，请检查网络设置')
      } else {
        // 其他错误
        throw new Error(error.message || '合约风险分析失败')
      }
    }
  }

  async analyzePool(poolAddress, poolData) {
    try {
      const response = await this.api.post('/risk-analysis/analyze-pool', {
        poolAddress,
        poolData
      })
      return response.data.data
    } catch (error) {
      console.error('Pool analysis failed:', error)
      throw new Error('流动性池分析失败')
    }
  }

  async getRiskReport(address) {
    try {
      const response = await this.api.get(`/risk-analysis/report/${address}`)
      return response.data.data
    } catch (error) {
      console.error('Failed to get risk report:', error)
      throw new Error('获取风险报告失败')
    }
  }

  async testAnalyzeContract(contractAddress, testAnalysisData) {
    try {
      const response = await this.api.post('/risk-analysis/test-analyze-contract', {
        contractAddress,
        testAnalysisData
      })
      return response.data.data
    } catch (error) {
      console.error('Test contract analysis failed:', error)
      throw new Error('测试合约分析失败')
    }
  }
}

export const useRiskAnalysisService = () => {
  return new RiskAnalysisService()
}