const { MongoClient } = require('mongodb');

async function checkDetectionResults() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    console.log('🔗 连接到MongoDB数据库');
    
    const db = client.db('Hark');
    
    console.log('\n📊 查询最近的交易分析结果...');
    const analysisCollection = db.collection('transaction_analysis');
    
    const recentAnalysis = await analysisCollection
      .find({})
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();
    
    if (recentAnalysis.length === 0) {
      console.log('❌ 未找到任何分析结果');
    } else {
      console.log(`✅ 找到 ${recentAnalysis.length} 条分析结果:`);
      
      recentAnalysis.forEach((analysis, index) => {
        console.log(`\n--- 分析结果 ${index + 1} ---`);
        console.log(`交易哈希: ${analysis.transactionHash || 'N/A'}`);
        console.log(`风险等级: ${analysis.riskLevel || 'N/A'}`);
        console.log(`检测到的恶意模式: ${JSON.stringify(analysis.maliciousPatterns || [])}`);
        console.log(`是否被拦截: ${analysis.blocked ? '是' : '否'}`);
        console.log(`分析时间: ${analysis.timestamp || 'N/A'}`);
        console.log(`建议: ${JSON.stringify(analysis.recommendations || [])}`);
      });
    }
    
    // 查询预警记录
    console.log('\n🚨 查询预警记录...');
    const alertsCollection = db.collection('security_alerts');
    
    const recentAlerts = await alertsCollection
      .find({})
      .sort({ timestamp: -1 })
      .limit(5)
      .toArray();
    
    if (recentAlerts.length === 0) {
      console.log('❌ 未找到任何预警记录');
    } else {
      console.log(`✅ 找到 ${recentAlerts.length} 条预警记录:`);
      
      recentAlerts.forEach((alert, index) => {
        console.log(`\n--- 预警 ${index + 1} ---`);
        console.log(`类型: ${alert.type || 'N/A'}`);
        console.log(`严重程度: ${alert.severity || 'N/A'}`);
        console.log(`描述: ${alert.description || 'N/A'}`);
        console.log(`时间: ${alert.timestamp || 'N/A'}`);
      });
    }
    
 
    console.log('\n📈 统计分析...');
    const highRiskCount = await analysisCollection.countDocuments({
      riskLevel: { $gte: 25 }
    });
    
    const blockedCount = await analysisCollection.countDocuments({
      blocked: true
    });
    
    const maliciousPatternCount = await analysisCollection.countDocuments({
      'maliciousPatterns.0': { $exists: true }
    });
    
    console.log(`高风险交易数量 (风险等级 ≥ 25): ${highRiskCount}`);
    console.log(`被拦截交易数量: ${blockedCount}`);
    console.log(`检测到恶意模式的交易数量: ${maliciousPatternCount}`);
    
  } catch (error) {
    console.error('❌ 查询失败:', error);
  } finally {
    await client.close();
    console.log('\n🔚 数据库连接已关闭');
  }
}

checkDetectionResults().catch(console.error);