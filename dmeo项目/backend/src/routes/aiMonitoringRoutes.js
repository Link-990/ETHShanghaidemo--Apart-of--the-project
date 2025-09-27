const express = require('express');
const router = express.Router();
const AIMonitoringService = require('../services/aiMonitoringService');
const BlockchainDataService = require('../services/blockchainDataService');
const aiConfig = require('../config/aiConfig');

// 初始化服务
let aiMonitoringService = null;
let blockchainDataService = null;

// 初始化AI监控服务
async function initializeServices() {
  try {
    blockchainDataService = new BlockchainDataService(aiConfig);
    aiMonitoringService = new AIMonitoringService(aiConfig);
    
    console.log('AI监控服务已初始化');
  } catch (error) {
    console.error('AI监控服务初始化失败:', error);
  }
}

// 启动时初始化服务
initializeServices();

// 获取监控状态
router.get('/status', async (req, res) => {
  try {
    if (!aiMonitoringService) {
      return res.status(503).json({
        success: false,
        message: 'AI监控服务未初始化'
      });
    }

    const status = await aiMonitoringService.getMonitoringStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('获取监控状态失败:', error);
    res.status(500).json({
      success: false,
      message: '获取监控状态失败',
      error: error.message
    });
  }
});

// 启动监控
router.post('/start', async (req, res) => {
  try {
    if (!aiMonitoringService) {
      return res.status(503).json({
        success: false,
        message: 'AI监控服务未初始化'
      });
    }

    const { addresses, rules } = req.body;
    
    await aiMonitoringService.startMonitoring({
      addresses: addresses || [],
      customRules: rules || {}
    });

    res.json({
      success: true,
      message: 'AI监控已启动',
      data: {
        monitoringAddresses: addresses || [],
        customRules: rules || {}
      }
    });
  } catch (error) {
    console.error('启动监控失败:', error);
    res.status(500).json({
      success: false,
      message: '启动监控失败',
      error: error.message
    });
  }
});

// 停止监控
router.post('/stop', async (req, res) => {
  try {
    if (!aiMonitoringService) {
      return res.status(503).json({
        success: false,
        message: 'AI监控服务未初始化'
      });
    }

    await aiMonitoringService.stopMonitoring();

    res.json({
      success: true,
      message: 'AI监控已停止'
    });
  } catch (error) {
    console.error('停止监控失败:', error);
    res.status(500).json({
      success: false,
      message: '停止监控失败',
      error: error.message
    });
  }
});

// 获取实时监控数据
router.get('/realtime', async (req, res) => {
  try {
    if (!aiMonitoringService) {
      return res.status(503).json({
        success: false,
        message: 'AI监控服务未初始化'
      });
    }

    const realtimeData = await aiMonitoringService.getRealtimeData();
    res.json({
      success: true,
      data: realtimeData
    });
  } catch (error) {
    console.error('获取实时数据失败:', error);
    res.status(500).json({
      success: false,
      message: '获取实时数据失败',
      error: error.message
    });
  }
});

// 分析单个交易
router.post('/analyze-transaction', async (req, res) => {
  try {
    if (!aiMonitoringService) {
      return res.status(503).json({
        success: false,
        message: 'AI监控服务未初始化'
      });
    }

    const { transactionHash, transactionData } = req.body;

    if (!transactionHash && !transactionData) {
      return res.status(400).json({
        success: false,
        message: '请提供交易哈希或交易数据'
      });
    }

    let analysisResult;
    
    if (transactionHash) {
      // 通过交易哈希分析
      analysisResult = await aiMonitoringService.analyzeTransactionByHash(transactionHash);
    } else {
      // 直接分析交易数据
      analysisResult = await aiMonitoringService.analyzeTransaction(transactionData);
    }

    res.json({
      success: true,
      data: analysisResult
    });
  } catch (error) {
    console.error('交易分析失败:', error);
    res.status(500).json({
      success: false,
      message: '交易分析失败',
      error: error.message
    });
  }
});

// 获取历史分析结果
router.get('/analysis-history', async (req, res) => {
  try {
    if (!aiMonitoringService) {
      return res.status(503).json({
        success: false,
        message: 'AI监控服务未初始化'
      });
    }

    const { 
      page = 1, 
      limit = 20, 
      riskLevel, 
      startTime, 
      endTime,
      address 
    } = req.query;

    const filters = {
      riskLevel: riskLevel,
      startTime: startTime ? new Date(startTime) : null,
      endTime: endTime ? new Date(endTime) : null,
      address: address
    };

    const history = await aiMonitoringService.getAnalysisHistory(
      parseInt(page), 
      parseInt(limit), 
      filters
    );

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('获取历史分析失败:', error);
    res.status(500).json({
      success: false,
      message: '获取历史分析失败',
      error: error.message
    });
  }
});

// 获取风险统计
router.get('/risk-statistics', async (req, res) => {
  try {
    if (!aiMonitoringService) {
      return res.status(503).json({
        success: false,
        message: 'AI监控服务未初始化'
      });
    }

    const { timeRange = '24h' } = req.query;
    const statistics = await aiMonitoringService.getRiskStatistics(timeRange);

    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('获取风险统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取风险统计失败',
      error: error.message
    });
  }
});

// 获取预警列表
router.get('/alerts', async (req, res) => {
  try {
    if (!aiMonitoringService) {
      return res.status(503).json({
        success: false,
        message: 'AI监控服务未初始化'
      });
    }

    const { 
      page = 1, 
      limit = 20, 
      severity,
      status = 'active'
    } = req.query;

    const alerts = await aiMonitoringService.getAlerts(
      parseInt(page), 
      parseInt(limit), 
      { severity, status }
    );

    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('获取预警列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取预警列表失败',
      error: error.message
    });
  }
});

// 处理预警
router.post('/alerts/:alertId/handle', async (req, res) => {
  try {
    if (!aiMonitoringService) {
      return res.status(503).json({
        success: false,
        message: 'AI监控服务未初始化'
      });
    }

    const { alertId } = req.params;
    const { action, comment } = req.body;

    const result = await aiMonitoringService.handleAlert(alertId, {
      action: action,
      comment: comment,
      handledBy: req.user?.id || 'system',
      handledAt: new Date()
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('处理预警失败:', error);
    res.status(500).json({
      success: false,
      message: '处理预警失败',
      error: error.message
    });
  }
});

// 更新监控配置








// 获取地址信息
router.get('/address/:address', async (req, res) => {
  try {
    if (!blockchainDataService) {
      return res.status(503).json({
        success: false,
        message: '区块链数据服务未初始化'
      });
    }

    const { address } = req.params;
    const addressInfo = await blockchainDataService.getAddressInfo(address);

    res.json({
      success: true,
      data: addressInfo
    });
  } catch (error) {
    console.error('获取地址信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取地址信息失败',
      error: error.message
    });
  }
});

// 获取交易详情
router.get('/transaction/:hash', async (req, res) => {
  try {
    if (!blockchainDataService) {
      return res.status(503).json({
        success: false,
        message: '区块链数据服务未初始化'
      });
    }

    const { hash } = req.params;
    const transaction = await blockchainDataService.getTransaction(hash);

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('获取交易详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取交易详情失败',
      error: error.message
    });
  }
});

// WebSocket连接处理（实时数据推送）
router.ws = function(app) {
  const WebSocket = require('ws');
  const wss = new WebSocket.Server({ port: 8080 });

  wss.on('connection', (ws) => {
    console.log('WebSocket客户端已连接');

    // 发送初始状态
    ws.send(JSON.stringify({
      type: 'status',
      data: { connected: true, timestamp: Date.now() }
    }));

    // 监听AI监控服务事件
    if (aiMonitoringService) {
      const handleRiskAlert = (alert) => {
        ws.send(JSON.stringify({
          type: 'risk_alert',
          data: alert
        }));
      };

      const handleAnalysisComplete = (analysis) => {
        ws.send(JSON.stringify({
          type: 'analysis_complete',
          data: analysis
        }));
      };

      const handleMonitoringUpdate = (update) => {
        ws.send(JSON.stringify({
          type: 'monitoring_update',
          data: update
        }));
      };

      aiMonitoringService.on('riskAlert', handleRiskAlert);
      aiMonitoringService.on('analysisComplete', handleAnalysisComplete);
      aiMonitoringService.on('monitoringUpdate', handleMonitoringUpdate);

      // 清理事件监听器
      ws.on('close', () => {
        console.log('WebSocket客户端已断开');
        aiMonitoringService.off('riskAlert', handleRiskAlert);
        aiMonitoringService.off('analysisComplete', handleAnalysisComplete);
        aiMonitoringService.off('monitoringUpdate', handleMonitoringUpdate);
      });
    }

    // 处理客户端消息
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        
        switch (data.type) {
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
            break;
          case 'subscribe':
            // 处理订阅请求
            console.log('客户端订阅:', data.channels);
            break;
          default:
            console.log('未知消息类型:', data.type);
        }
      } catch (error) {
        console.error('处理WebSocket消息失败:', error);
      }
    });
  });

  console.log('WebSocket服务器已启动，端口: 8080');
};

// 错误处理中间件
router.use((error, req, res, next) => {
  console.error('AI监控API错误:', error);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? error.message : '请联系管理员'
  });
});

module.exports = router;