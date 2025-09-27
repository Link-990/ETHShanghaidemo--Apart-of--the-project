const mongoose = require('mongoose');
require('dotenv').config();

// 连接MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_risk_control');
    console.log('MongoDB连接成功');
  } catch (error) {
    console.error('MongoDB连接失败:', error);
    process.exit(1);
  }
}

// 定义交易分析结果模型
const TransactionAnalysisSchema = new mongoose.Schema({
  transactionHash: { type: String, required: true },
  blockNumber: Number,
  fromAddress: String,
  toAddress: String,
  value: String,
  gasPrice: String,
  gasUsed: Number,
  timestamp: Date,
  riskLevel: String,
  riskScore: Number,
  analysisResult: Object,
  createdAt: { type: Date, default: Date.now }
});

const TransactionAnalysis = mongoose.model('TransactionAnalysis', TransactionAnalysisSchema, 'transaction_analysis');

async function checkDuplicateTransactions() {
  try {
    await connectDB();
    
    console.log('开始检查重复交易记录...');
    
    // 查找重复的交易哈希
    const duplicates = await TransactionAnalysis.aggregate([
      {
        $group: {
          _id: "$transactionHash",
          count: { $sum: 1 },
          docs: { $push: "$$ROOT" }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);
    
    console.log(`发现 ${duplicates.length} 个重复的交易哈希`);
    
    if (duplicates.length > 0) {
      console.log('\n重复交易详情:');
      duplicates.forEach((duplicate, index) => {
        console.log(`\n${index + 1}. 交易哈希: ${duplicate._id}`);
        console.log(`   重复次数: ${duplicate.count}`);
        console.log(`   创建时间:`);
        duplicate.docs.forEach((doc, docIndex) => {
          console.log(`     ${docIndex + 1}. ${doc.createdAt} (ID: ${doc._id})`);
        });
      });
      
      // 统计总的重复记录数
      const totalDuplicateRecords = duplicates.reduce((sum, dup) => sum + dup.count, 0);
      const totalUniqueTransactions = duplicates.length;
      const extraRecords = totalDuplicateRecords - totalUniqueTransactions;
      
      console.log(`\n统计信息:`);
      console.log(`- 总重复记录数: ${totalDuplicateRecords}`);
      console.log(`- 唯一交易数: ${totalUniqueTransactions}`);
      console.log(`- 多余记录数: ${extraRecords}`);
    }
    
    // 检查总记录数
    const totalRecords = await TransactionAnalysis.countDocuments();
    console.log(`\n数据库中总交易记录数: ${totalRecords}`);
    
    // 检查最近的记录
    const recentRecords = await TransactionAnalysis.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('transactionHash createdAt riskLevel');
    
    console.log('\n最近10条记录:');
    recentRecords.forEach((record, index) => {
      console.log(`${index + 1}. ${record.transactionHash} - ${record.createdAt} - ${record.riskLevel}`);
    });
    
  } catch (error) {
    console.error('检查过程中出错:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n数据库连接已关闭');
  }
}

// 运行检查
checkDuplicateTransactions();