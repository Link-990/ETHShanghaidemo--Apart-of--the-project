import { useRiskAnalysisService } from './riskAnalysisService'
import { ElMessage, ElMessageBox } from 'element-plus'

class TransactionSecurityService {
  constructor() {
    this.riskService = useRiskAnalysisService()
    this.blacklist = new Set() // 黑名单合约
    this.whitelist = new Set() // 白名单合约
    this.securityRules = this.initSecurityRules()
  }

  // 初始化安全规则
  initSecurityRules() {
    return {
      // 高风险函数签名
      dangerousFunctions: [
        '0xa9059cbb', // transfer
        '0x23b872dd', // transferFrom
        '0x095ea7b3', // approve
        '0x2e1a7d4d', // withdraw
      ],
      
      // 可疑合约特征
      suspiciousPatterns: [
        /selfdestruct/i,
        /delegatecall/i,
        /suicide/i,
        /honeypot/i,
      ],
      
      // 风险阈值
      riskThresholds: {
        block: 80,    // 阻止交易
        warn: 50,     // 警告用户
        monitor: 30   // 监控记录
      }
    }
  }

  // 主要安全校验入口
  async validateTransaction(transaction) {
    try {
      console.log('🔍 Starting transaction security validation:', transaction)
      
      const securityReport = {
        transaction,
        timestamp: Date.now(),
        checks: {},
        riskScore: 0,
        riskLevel: 'low',
        riskFactors: [],
        recommendation: '',
        action: 'allow' // allow, warn, block
      }

      // 1. 黑白名单检查
      const listCheck = await this.checkBlackWhiteList(transaction.to)
      securityReport.checks.listCheck = listCheck
      
      if (listCheck.isBlacklisted) {
        securityReport.riskScore = 100
        securityReport.riskLevel = 'critical'
        securityReport.riskFactors.push('合约在黑名单中')
        securityReport.action = 'block'
        securityReport.recommendation = '该合约已被标记为恶意，强烈建议取消交易'
        return securityReport
      }

      if (listCheck.isWhitelisted) {
        securityReport.riskScore = Math.max(0, securityReport.riskScore - 20)
        securityReport.riskFactors.push('合约在白名单中')
      }

      // 2. AI风险分析
      const aiAnalysis = await this.riskService.analyzeContract(
        transaction.to, 
        transaction
      )
      securityReport.checks.aiAnalysis = aiAnalysis
      securityReport.riskScore = Math.max(securityReport.riskScore, aiAnalysis.riskScore)
      securityReport.riskFactors.push(...aiAnalysis.riskFactors)

      // 3. 交易参数安全检查
      const paramCheck = await this.checkTransactionParams(transaction)
      securityReport.checks.paramCheck = paramCheck
      securityReport.riskScore += paramCheck.riskScore
      securityReport.riskFactors.push(...paramCheck.riskFactors)

      // 4. 合约代码安全检查
      const codeCheck = await this.checkContractCode(transaction.to)
      securityReport.checks.codeCheck = codeCheck
      securityReport.riskScore += codeCheck.riskScore
      securityReport.riskFactors.push(...codeCheck.riskFactors)

      // 5. 确定最终风险等级和行动
      securityReport.riskLevel = this.calculateRiskLevel(securityReport.riskScore)
      securityReport.action = this.determineAction(securityReport.riskScore)
      securityReport.recommendation = this.generateRecommendation(securityReport)

      console.log('✅ Transaction security validation completed:', securityReport)
      return securityReport

    } catch (error) {
      console.error('❌ Transaction security validation failed:', error)
      return {
        transaction,
        timestamp: Date.now(),
        error: error.message,
        riskScore: 50,
        riskLevel: 'medium',
        action: 'warn',
        recommendation: '安全校验失败，建议谨慎操作'
      }
    }
  }

  // 黑白名单检查
  async checkBlackWhiteList(contractAddress) {
    return {
      isBlacklisted: this.blacklist.has(contractAddress.toLowerCase()),
      isWhitelisted: this.whitelist.has(contractAddress.toLowerCase()),
      listStatus: this.blacklist.has(contractAddress.toLowerCase()) ? 'blacklisted' :
                  this.whitelist.has(contractAddress.toLowerCase()) ? 'whitelisted' : 'unknown'
    }
  }

  // 交易参数检查
  async checkTransactionParams(transaction) {
    const risks = []
    let riskScore = 0

    // 检查交易金额
    if (transaction.value && BigInt(transaction.value) > BigInt('1000000000000000000')) {
      risks.push('交易金额较大')
      riskScore += 15
    }

    // 检查Gas价格
    if (transaction.gasPrice && BigInt(transaction.gasPrice) > BigInt('100000000000')) {
      risks.push('Gas价格异常高')
      riskScore += 10
    }

    // 检查函数调用
    if (transaction.data && transaction.data !== '0x') {
      const functionSig = transaction.data.slice(0, 10)
      if (this.securityRules.dangerousFunctions.includes(functionSig)) {
        risks.push('调用高风险函数')
        riskScore += 20
      }
    }

    return {
      riskScore,
      riskFactors: risks,
      details: {
        value: transaction.value,
        gasPrice: transaction.gasPrice,
        dataLength: transaction.data ? transaction.data.length : 0
      }
    }
  }

  // 合约代码检查
  async checkContractCode(contractAddress) {
    const risks = []
    let riskScore = 0

    try {
      // 这里可以调用后端API获取合约代码分析
      // 暂时使用模拟检查
      const codeAnalysis = await this.analyzeContractCode(contractAddress)
      
      if (codeAnalysis.hasSuspiciousPatterns) {
        risks.push('代码包含可疑模式')
        riskScore += 25
      }

      if (codeAnalysis.isProxy) {
        risks.push('代理合约，实现可能变更')
        riskScore += 15
      }

      if (!codeAnalysis.isVerified) {
        risks.push('合约源码未验证')
        riskScore += 10
      }

    } catch (error) {
      risks.push('无法获取合约代码')
      riskScore += 20
    }

    return {
      riskScore,
      riskFactors: risks
    }
  }

  // 模拟合约代码分析
  async analyzeContractCode(contractAddress) {
    // 实际实现中，这里会调用后端API或区块链浏览器API
    return {
      hasSuspiciousPatterns: Math.random() > 0.8,
      isProxy: Math.random() > 0.7,
      isVerified: Math.random() > 0.3,
      codeSize: Math.floor(Math.random() * 10000)
    }
  }

  // 计算风险等级
  calculateRiskLevel(riskScore) {
    if (riskScore >= 80) return 'critical'
    if (riskScore >= 60) return 'high'
    if (riskScore >= 30) return 'medium'
    return 'low'
  }

  // 确定行动
  determineAction(riskScore) {
    if (riskScore >= this.securityRules.riskThresholds.block) return 'block'
    if (riskScore >= this.securityRules.riskThresholds.warn) return 'warn'
    return 'allow'
  }

  // 生成建议
  generateRecommendation(securityReport) {
    const { riskLevel, action, riskFactors } = securityReport
    
    if (action === 'block') {
      return '🚫 检测到严重安全风险，强烈建议取消此交易'
    }
    
    if (action === 'warn') {
      return `⚠️ 检测到${riskFactors.length}个风险因素，请仔细评估后决定`
    }
    
    return '✅ 未发现明显安全风险，但仍建议保持谨慎'
  }

  // 处理安全校验结果
  async handleSecurityResult(securityReport) {
    const { action, riskScore, riskLevel, recommendation } = securityReport

    switch (action) {
      case 'block':
        await ElMessageBox.alert(
          `风险评分: ${riskScore}\n${recommendation}`,
          '🚫 交易被阻止',
          {
            confirmButtonText: '我知道了',
            type: 'error',
            showClose: false
          }
        )
        return false // 阻止交易

      case 'warn':
        try {
          await ElMessageBox.confirm(
            `风险评分: ${riskScore}\n${recommendation}\n\n是否继续执行交易？`,
            '⚠️ 安全警告',
            {
              confirmButtonText: '继续交易',
              cancelButtonText: '取消交易',
              type: 'warning'
            }
          )
          return true // 用户选择继续
        } catch {
          return false // 用户选择取消
        }

      case 'allow':
      default:
        ElMessage.success('✅ 交易安全校验通过')
        return true
    }
  }

  // 添加到黑名单
  addToBlacklist(contractAddress) {
    this.blacklist.add(contractAddress.toLowerCase())
    console.log('Added to blacklist:', contractAddress)
  }

  // 添加到白名单
  addToWhitelist(contractAddress) {
    this.whitelist.add(contractAddress.toLowerCase())
    console.log('Added to whitelist:', contractAddress)
  }
}

export const useTransactionSecurityService = () => {
  return new TransactionSecurityService()
}