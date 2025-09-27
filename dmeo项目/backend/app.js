const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

// 导入路由
const aiMonitoringRoutes = require('./src/routes/aiMonitoringRoutes');
const riskAnalysisRoutes = require('./src/routes/riskAnalysis');
const aiRiskControlRoutes = require('./src/routes/aiRiskControl');


const app = express();

// 基础中间件
app.use(helmet());
app.use(compression()); 
app.use(morgan('combined')); // 日志记录

// CORS配置
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 请求解析
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 1000, // 限制每个IP 15分钟内最多1000个请求
  message: {
    success: false,
    message: '请求过于频繁，请稍后再试'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// API路由
app.use('/api/ai-monitoring', aiMonitoringRoutes);
app.use('/api/risk-analysis', riskAnalysisRoutes);
app.use('/api/ai-risk-control', aiRiskControlRoutes);

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AI监控服务运行正常',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API文档端点
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'AI监控服务API',
    version: '1.0.0',
    endpoints: {
      'GET /health': '健康检查',
      'GET /api/ai-monitoring/status': '获取监控状态',
      'POST /api/ai-monitoring/start': '启动监控',
      'POST /api/ai-monitoring/stop': '停止监控',
      'GET /api/ai-monitoring/realtime': '获取实时数据',
      'POST /api/ai-monitoring/analyze-transaction': '分析交易',
      'GET /api/ai-monitoring/analysis-history': '获取分析历史',
      'GET /api/ai-monitoring/risk-statistics': '获取风险统计',
      'GET /api/ai-monitoring/alerts': '获取预警列表',
      'POST /api/ai-monitoring/alerts/:id/handle': '处理预警',
      'GET /api/ai-monitoring/config': '获取配置',
      'POST /api/ai-monitoring/config': '更新配置',
      'POST /api/ai-monitoring/test-connection': '测试连接',
      'GET /api/ai-monitoring/network-info': '获取网络信息',
      'GET /api/ai-monitoring/address/:address': '获取地址信息',
      'GET /api/ai-monitoring/transaction/:hash': '获取交易详情'
    },
    websocket: {
      url: 'ws://localhost:8080',
      events: ['risk_alert', 'analysis_complete', 'monitoring_update']
    }
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    path: req.originalUrl
  });
});

// 全局错误处理
app.use((error, req, res, next) => {
  console.error('全局错误:', error);
  
  // 数据库连接错误
  if (error.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      message: '数据库连接失败'
    });
  }

  // 验证错误
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: '数据验证失败',
      errors: error.errors
    });
  }

  // JWT错误
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: '无效的访问令牌'
    });
  }

  // 默认错误
  res.status(error.status || 500).json({
    success: false,
    message: error.message || '服务器内部错误',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// 优雅关闭处理
process.on('SIGTERM', () => {
  console.log('收到SIGTERM信号，开始优雅关闭...');
  server.close(() => {
    console.log('HTTP服务器已关闭');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('收到SIGINT信号，开始优雅关闭...');
  server.close(() => {
    console.log('HTTP服务器已关闭');
    process.exit(0);
  });
});

// 未捕获异常处理
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
  process.exit(1);
});

// 启动服务器
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`AI监控服务已启动`);
  console.log(`HTTP服务器: http://localhost:${PORT}`);
  console.log(`WebSocket服务器: ws://localhost:8080`);
  console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`进程ID: ${process.pid}`);
});

// 初始化WebSocket服务器
if (aiMonitoringRoutes.ws) {
  aiMonitoringRoutes.ws(app);
}

module.exports = app;