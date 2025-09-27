const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose'); // 添加mongoose导入

// 🔥 重要：先加载环境变量，再导入其他模块
dotenv.config({ path: path.join(__dirname, '.env') });

// 添加调试信息
console.log('🔍 调试信息:');
console.log('当前工作目录:', process.cwd());
console.log('__dirname:', __dirname);
console.log('QWEN_API_KEY 是否存在:', !!process.env.QWEN_API_KEY);
console.log('QWEN_API_KEY 前4位:', process.env.QWEN_API_KEY ? process.env.QWEN_API_KEY.substring(0, 4) + '...' : 'undefined');
console.log('QWEN_BASE_URL:', process.env.QWEN_BASE_URL);
console.log('QWEN_MODEL:', process.env.QWEN_MODEL);

// 🔥 环境变量加载后再导入依赖AI服务的模块
const riskAnalysisRoutes = require('./src/routes/riskAnalysis');
const contractRoutes = require('./src/routes/contracts');
const poolRoutes = require('./src/routes/pools');
const aiRiskControlRoutes = require('./src/routes/aiRiskControl');
const aiMonitoringRoutes = require('./src/routes/aiMonitoringRoutes');
const { setupDatabase } = require('./src/config/database');
const { setupRedis } = require('./src/config/redis');
const logger = require('./src/utils/logger');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "http://localhost:*", "ws://localhost:*"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false
}));

// 添加额外的安全头
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 路由配置
app.use('/api/risk-analysis', riskAnalysisRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/pools', poolRoutes);
app.use('/api/ai-risk-control', aiRiskControlRoutes);
app.use('/api/ai-monitoring', aiMonitoringRoutes);

// 健康检查
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 错误处理
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 启动服务器
async function startServer() {
    try {
        // 尝试连接数据库，但不阻塞服务启动
        try {
            await setupDatabase();
            logger.info('Database connected successfully');
        } catch (dbError) {
            logger.warn('Database connection failed, continuing without database:', dbError.message);
        }
        
        // 尝试连接Redis，但不阻塞服务启动
        try {
            await setupRedis();
            logger.info('Redis connected successfully');
        } catch (redisError) {
            logger.warn('Redis connection failed, continuing without Redis:', redisError.message);
        }
        
        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
            console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
            console.log(`📊 AI分析功能已启用（降级模式）`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

// 在现有代码中添加数据库连接监控
mongoose.connection.on('connected', () => {
    logger.info('✅ MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
    logger.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    logger.warn('⚠️ MongoDB disconnected');
});