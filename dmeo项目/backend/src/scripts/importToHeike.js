const mongoose = require('mongoose');
const AnalysisResult = require('../models/AnalysisResult');
const TestTransaction = require('../models/TestTransaction');
const logger = require('../utils/logger');
require('dotenv').config();

// DeFi风险分析测试数据
const heikeTestData = [
  {
    contractAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    riskScore: 15,
    riskLevel: 'low',
    riskFactors: ['Uniswap官方代币', '代码已审计', '社区活跃度高', '流动性充足'],
    recommendation: '风险极低，Uniswap官方治理代币，可安全交互',
    confidence: 95,
    analysisType: 'ai-analysis',
    transactionData: {
      source: 'defi_scanner',
      protocol: 'Uniswap',
      tokenSymbol: 'UNI'
    },
    contractCode: '0x608060405234801561001057600080fd5b50600436106101...',
    transactionHistory: [
      {
        hash: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
        value: '1000000000000000000',
        timestamp: new Date('2024-01-15T10:30:00Z')
      },
      {
        hash: '0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567',
        value: '500000000000000000',
        timestamp: new Date('2024-01-16T14:20:00Z')
      }
    ]
  },
  {
    contractAddress: '0xA0b86a33E6441E13C7d3fF4A4C2C8a2e4c5d6e7f',
    riskScore: 85,
    riskLevel: 'critical',
    riskFactors: ['未审计合约', '开发者匿名', '流动性极低', '疑似蜜罐合约', '代码混淆'],
    recommendation: '极高风险！疑似诈骗合约，强烈建议避免任何交互',
    confidence: 92,
    analysisType: 'ai-analysis',
    transactionData: {
      source: 'security_scan',
      flags: ['honeypot', 'rug_pull_risk'],
      warningLevel: 'critical'
    },
    contractCode: '0x6080604052348015600f57600080fd5b506004361060285760003560e01c8063...',
    transactionHistory: [
      {
        hash: '0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678',
        value: '100000000000000000',
        timestamp: new Date('2024-01-10T08:15:00Z')
      }
    ]
  },
  {
    contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    riskScore: 25,
    riskLevel: 'low',
    riskFactors: ['MakerDAO DAI稳定币', '多次审计通过', '去中心化治理', '高流动性'],
    recommendation: '风险很低，DAI是成熟的去中心化稳定币，可安全使用',
    confidence: 98,
    analysisType: 'ai-analysis',
    transactionData: {
      source: 'defi_protocol_scan',
      protocol: 'MakerDAO',
      tokenSymbol: 'DAI',
      category: 'stablecoin'
    },
    contractCode: '0x608060405234801561001057600080fd5b50600436106102dc5760003560e01c...',
    transactionHistory: [
      {
        hash: '0xd4e5f6789012345678901234567890abcdef1234567890abcdef123456789',
        value: '10000000000000000000',
        timestamp: new Date('2024-01-18T16:45:00Z')
      },
      {
        hash: '0xe5f6789012345678901234567890abcdef1234567890abcdef1234567890',
        value: '5000000000000000000',
        timestamp: new Date('2024-01-19T09:30:00Z')
      }
    ]
  },
  {
    contractAddress: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    riskScore: 55,
    riskLevel: 'medium',
    riskFactors: ['新项目代币', '部分审计完成', '团队公开', '中等流动性'],
    recommendation: '中等风险，建议小额测试后再进行大额交互',
    confidence: 78,
    analysisType: 'test-analysis',
    transactionData: {
      source: 'community_analysis',
      protocol: 'NewDeFi',
      launchDate: '2024-01-01'
    },
    contractCode: '0x608060405234801561001057600080fd5b50600436106101f45760003560e01c...',
    transactionHistory: [
      {
        hash: '0xf6789012345678901234567890abcdef1234567890abcdef12345678901',
        value: '2000000000000000000',
        timestamp: new Date('2024-01-12T12:00:00Z')
      }
    ]
  },
  {
    contractAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    riskScore: 30,
    riskLevel: 'low',
    riskFactors: ['Chainlink LINK代币', 'Oracle网络核心', '多次审计', '机构采用'],
    recommendation: '风险较低，Chainlink是成熟的Oracle项目，可谨慎交互',
    confidence: 90,
    analysisType: 'ai-analysis',
    transactionData: {
      source: 'oracle_analysis',
      protocol: 'Chainlink',
      tokenSymbol: 'LINK',
      category: 'oracle'
    },
    contractCode: '0x608060405234801561001057600080fd5b50600436106102325760003560e01c...',
    transactionHistory: [
      {
        hash: '0x789012345678901234567890abcdef1234567890abcdef123456789012',
        value: '3000000000000000000',
        timestamp: new Date('2024-01-20T11:15:00Z')
      }
    ]
  }
];

// 对应的测试交易数据
const heikeTransactionData = [
  {
    hash: '0x1111111111111111111111111111111111111111111111111111111111111111',
    contractAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    fromAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d4d4',
    toAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    value: '1000000000000000000',
    gas: '21000',
    gasPrice: '20000000000',
    riskScore: 15,
    status: 'approved',
    analysisType: 'ai-analysis'
  },
  {
    hash: '0x2222222222222222222222222222222222222222222222222222222222222222',
    contractAddress: '0xA0b86a33E6441E13C7d3fF4A4C2C8a2e4c5d6e7f',
    fromAddress: '0x8ba1f109551bD432803012645Hac136c22C57592',
    toAddress: '0xA0b86a33E6441E13C7d3fF4A4C2C8a2e4c5d6e7f',
    value: '500000000000000000',
    gas: '50000',
    gasPrice: '25000000000',
    riskScore: 85,
    status: 'blocked',
    analysisType: 'ai-analysis'
  },
  {
    hash: '0x3333333333333333333333333333333333333333333333333333333333333333',
    contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    fromAddress: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503',
    toAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    value: '10000000000000000000',
    gas: '30000',
    gasPrice: '22000000000',
    riskScore: 25,
    status: 'approved',
    analysisType: 'ai-analysis'
  },
  {
    hash: '0x4444444444444444444444444444444444444444444444444444444444444444',
    contractAddress: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    fromAddress: '0x1234567890123456789012345678901234567890',
    toAddress: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    value: '2000000000000000000',
    gas: '35000',
    gasPrice: '18000000000',
    riskScore: 55,
    status: 'analyzed',
    analysisType: 'test-analysis'
  }
];

async function importToHeike() {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ 已连接到MongoDB数据库: Hark');

    // 清空heike集合中的现有数据（可选）
    await AnalysisResult.deleteMany({});
    await TestTransaction.deleteMany({});
    console.log('🗑️  已清空现有数据');

    // 导入分析结果数据到heike集合
    const analysisResults = await AnalysisResult.insertMany(heikeTestData);
    console.log(`📊 成功导入 ${analysisResults.length} 条分析结果到heike集合`);

    // 导入交易数据
    const transactions = await TestTransaction.insertMany(heikeTransactionData);
    console.log(`💳 成功导入 ${transactions.length} 条测试交易数据`);

    // 显示导入的数据统计
    const analysisCount = await AnalysisResult.countDocuments();
    const transactionCount = await TestTransaction.countDocuments();
    const riskLevelStats = await AnalysisResult.aggregate([
      { $group: { _id: '$riskLevel', count: { $sum: 1 } } }
    ]);
    
    console.log('\n📈 === 导入数据统计 ===');
    console.log(`📋 分析结果总数: ${analysisCount}`);
    console.log(`🔄 测试交易总数: ${transactionCount}`);
    console.log('⚠️  风险等级分布:');
    riskLevelStats.forEach(stat => {
      const emoji = {
        'low': '🟢',
        'medium': '🟡', 
        'high': '🟠',
        'critical': '🔴'
      };
      console.log(`   ${emoji[stat._id] || '⚪'} ${stat._id}: ${stat.count} 个`);
    });

    console.log('\n🎉 数据导入完成！您现在可以在MongoDB Compass中查看heike集合的数据了。');

  } catch (error) {
    console.error('❌ 导入失败:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 数据库连接已关闭');
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  importToHeike()
    .then(() => {
      console.log('✨ 数据导入任务完成！');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 数据导入任务失败:', error);
      process.exit(1);
    });
}

module.exports = { importToHeike };