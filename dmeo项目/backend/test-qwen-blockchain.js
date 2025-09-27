// Qwen分析私链数据详细测试
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { Web3 } = require('web3');

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(express.json());

// 测试Qwen分析私链数据
app.post('/test-qwen-blockchain', async (req, res) => {
  try {
    console.log('🔍 开始测试Qwen分析私链数据...');
    
    // 1. 连接私链
    const web3 = new Web3('http://localhost:8545');
    const currentBlock = await web3.eth.getBlockNumber();
    const blockInfo = await web3.eth.getBlock(currentBlock);
    
    console.log(`📊 私链当前区块: ${currentBlock}`);
    console.log(`⏰ 区块时间戳: ${new Date(Number(blockInfo.timestamp) * 1000).toISOString()}`);
    
    // 2. 初始化Qwen客户端
    const OpenAI = require('openai');
    const qwen = new OpenAI({
      apiKey: process.env.QWEN_API_KEY,
      baseURL: process.env.QWEN_BASE_URL
    });
    
    // 3. 构建包含私链数据的分析提示
    const prompt = `
作为DeFi风险分析专家，请分析以下私链数据：

私链信息：
- 当前区块号: ${currentBlock}
- 区块时间戳: ${new Date(Number(blockInfo.timestamp) * 1000).toISOString()}
- 区块哈希: ${blockInfo.hash}
- 交易数量: ${blockInfo.transactions.length}
- Gas使用量: ${blockInfo.gasUsed}
- Gas限制: ${blockInfo.gasLimit}

请基于这些私链数据提供风险分析，包括：
1. 网络活跃度评估
2. Gas使用效率分析
3. 潜在风险识别
4. 建议措施

请以JSON格式返回分析结果。
`;

    console.log('🤖 向Qwen发送私链数据分析请求...');
    
    // 4. 调用Qwen分析私链数据
    const response = await qwen.chat.completions.create({
      model: process.env.QWEN_MODEL || 'qwen-plus',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    const analysis = response.choices[0].message.content;
    console.log('✅ Qwen分析完成:', analysis);
    
    res.json({
      success: true,
      message: 'Qwen成功分析私链数据',
      privateChainData: {
        currentBlock: currentBlock.toString(),
        blockHash: blockInfo.hash,
        timestamp: new Date(Number(blockInfo.timestamp) * 1000).toISOString(),
        transactionCount: blockInfo.transactions.length,
        gasUsed: blockInfo.gasUsed.toString(),
        gasLimit: blockInfo.gasLimit.toString()
      },
      qwenAnalysis: analysis,
      integrationStatus: 'SUCCESS'
    });
    
  } catch (error) {
    console.error('❌ Qwen分析私链数据失败:', error);
    res.status(500).json({
      success: false,
      message: 'Qwen分析私链数据失败',
      error: error.message,
      integrationStatus: 'FAILED'
    });
  }
});

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`🔗 Qwen私链分析测试服务器运行在 http://localhost:${PORT}`);
});