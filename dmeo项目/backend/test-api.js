// 简单的API测试脚本
const express = require('express');
const app = express();

app.use(express.json());

// 测试端点
app.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API测试成功',
    timestamp: new Date().toISOString()
  });
});

// 测试Qwen和私链集成
app.post('/test-integration', async (req, res) => {
  console.log('🔍 开始测试Qwen和私链集成...');
  
  try {
    const aiAnalysisService = require('./src/services/aiAnalysisService');
    
    // 测试私链连接
    const privateChainStatus = await aiAnalysisService.getPrivateChainCurrentBlock();
    
    // 测试Qwen连接
    const qwenTest = await aiAnalysisService.testQwenConnection();
    
    res.json({
      success: true,
      message: 'Qwen和私链集成测试成功',
      data: {
        privateChain: privateChainStatus,
        qwen: qwenTest
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Qwen和私链集成测试失败',
      error: error.message
    });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`测试服务器运行在 http://localhost:${PORT}`);
});