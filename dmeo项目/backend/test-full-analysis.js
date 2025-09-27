// 完整AI分析测试脚本
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(express.json());

// 测试完整的AI合约分析
app.post('/test-full-analysis', async (req, res) => {
  try {
    const aiAnalysisService = require('./src/services/aiAnalysisService');
    
    const testContractAddress = "0x1234567890123456789012345678901234567890";
    
    console.log('开始测试完整AI分析...');
    
    // 确保Qwen客户端已初始化
    if (!aiAnalysisService.qwen) {
        console.log('Qwen客户端未初始化，正在初始化...');
        await aiAnalysisService.initializeQwenClient();
    }
    
    // 执行完整的AI分析
    const analysisResult = await aiAnalysisService.analyzeContract(testContractAddress);
    
    console.log('AI分析完成:', JSON.stringify(analysisResult, null, 2));
    
    res.json({
      success: true,
      message: '完整AI分析测试成功',
      contractAddress: testContractAddress,
      analysis: analysisResult
    });
  } catch (error) {
    console.error('AI分析测试失败:', error);
    res.status(500).json({
      success: false,
      message: 'AI分析测试失败',
      error: error.message,
      stack: error.stack
    });
  }
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`完整分析测试服务器运行在 http://localhost:${PORT}`);
});