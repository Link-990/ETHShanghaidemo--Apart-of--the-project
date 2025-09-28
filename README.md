# 🚀 AIxETH - AI驱动的以太坊生态智能风险防护系统

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![Solidity](https://img.shields.io/badge/solidity-%5E0.8.20-blue)](https://soliditylang.org/)
[![Vue.js](https://img.shields.io/badge/vue.js-3.x-green)](https://vuejs.org/)

## 🎯 项目概述

**AIxETH** 是专为以太坊生态打造的下一代AI驱动风险防护系统，代表了人工智能与以太坊区块链技术融合的前沿探索。项目致力于通过先进的AI技术为以太坊生态提供全方位的智能安全保障。

### ✨ 核心特性

- 🧠 **AI驱动风险分析** - 实时交易风险检测
- ⚡ **实时监控系统** - 监控以太坊网络异常活动（
- 🛡️ **智能合约审计** - 自动化Solidity代码安全分析
- 📊 **可视化仪表板** - 直观的风险数据展示界面

### 前端技术栈

- **Vue 3** + **Vite** - 现代化前端框架
- **Element Plus** - 企业级UI组件库
- **Chart.js** - 数据可视化
- **Ethers.js** / **Web3.js** - 区块链交互
- **Pinia** - 状态管理
- **Vue Router** - 路由管理

### 后端技术栈

- **Node.js** + **Express** - 服务端框架
- **MongoDB** + **Mongoose** - 数据存储
- **Redis** - 缓存和会话管理
- **WebSocket** - 实时通信
- **Qwen API** - AI分析服务
- **Winston** - 日志管理

### 区块链技术

- **Solidity** - 智能合约开发
- **Hardhat** - 开发和测试框架
- **OpenZeppelin** - 安全合约库
- **Ethers.js** - 区块链交互

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- MongoDB >= 4.4
- Redis >= 6.0
- Git

### 安装步骤

```bash
# 克隆项目
git clone https://github.com/your-username/AIxETH.git
cd AIxETH

# 安装根目录依赖
npm install

# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install

# 返回根目录
cd ..
```

### 环境配置

1. **后端环境配置**

```bash
# 复制环境变量模板
cp backend/.env.example backend/.env

# 编辑环境变量
# 填入MongoDB连接字符串、Redis配置、Qwen API key
```

2. **前端环境配置**

```bash
# 复制环境变量模板
cp frontend/.env.example frontend/.env

# 配置API端点和其他前端环境变量
```

### 启动开发环境

```bash
# 启动完整开发环境（前端+后端）
npm run dev

# 或者分别启动
npm run backend:dev  # 启动后端服务
npm run frontend:dev # 启动前端服务
```

### 智能合约部署

```bash
# 编译合约
npm run compile

# 启动本地区块链网络
npm run node

# 部署到本地网络
npm run deploy:local

# 部署到测试网络
npm run deploy:testnet
```

# 📁 项目结构（点击展开/收起）
<details>
<summary>📁 项目结构（点击展开/收起）</summary>

## 📁 项目结构 
 
 AIxETH/黑客松/ 
 ├── 📁 artifacts/                    # 编译产物和构建文件 
 │   ├── @openzeppelin/              # OpenZeppelin合约编译结果 
 │   ├── build-info/                 # 构建信息 
 │   └── contracts/                  # 智能合约编译产物 
 │       ├── AIRiskController.sol/   # AI风险控制器编译结果 
 │       └── RiskAnalyzer.sol/       # 风险分析器编译结果 
 │ 
 ├── 📁 backend/                     # 后端服务 
 │   ├── 📄 .env                     # 环境变量配置 
 │   ├── 📄 app.js                   # Express应用主文件 
 │   ├── 📄 server.js                # 服务器启动文件 
 │   ├── 📄 package.json             # 后端依赖配置 
 │   ├── 📁 src/                     # 源代码目录 
 │   │   ├── 📁 config/              # 配置文件 
 │   │   │   ├── aiConfig.js         # AI服务配置 
 │   │   │   ├── database.js         # 数据库配置 
 │   │   │   └── redis.js            # Redis配置 
 │   │   ├── 📁 middleware/          # 中间件 
 │   │   │   └── rateLimiter.js      # 速率限制中间件 
 │   │   ├── 📁 models/              # 数据模型 
 │   │   │   ├── AnalysisResult.js   # 分析结果模型 
 │   │   │   ├── TestAnalysisResult.js # 测试分析结果 
 │   │   │   └── TestTransaction.js  # 测试交易模型 
 │   │   ├── 📁 routes/              # API路由 
 │   │   │   ├── aiMonitoringRoutes.js # AI监控路由 
 │   │   │   ├── aiRiskControl.js    # AI风险控制路由 
 │   │   │   ├── contracts.js        # 合约相关路由 
 │   │   │   ├── pools.js            # 流动性池路由 
 │   │   │   └── riskAnalysis.js     # 风险分析路由 
 │   │   ├── 📁 services/            # 业务服务层 
 │   │   │   ├── aiAnalysisService.js      # Qwen AI分析服务 
 │   │   │   ├── aiMonitoringService.js    # AI监控服务 
 │   │   │   ├── aiRiskAnalyzer.js         # AI风险分析器 
 │   │   │   ├── aiRiskControlService.js   # AI风险控制服务 
 │   │   │   ├── blockchainDataService.js  # 区块链数据服务 
 │   │   │   ├── confidenceCalculator.js   # 置信度计算器 
 │   │   │   ├── contractService.js        # 合约服务 
 │   │   │   ├── dependencyTrustService.js # 依赖信任服务 
 │   │   │   ├── etherscanService.js       # Etherscan API服务 
 │   │   │   ├── onchainBehaviorService.js # 链上行为分析 
 │   │   │   ├── staticAnalysisService.js  # 静态分析服务 
 │   │   │   └── testAnalysisService.js    # 测试分析服务 
 │   │   ├── 📁 scripts/             # 脚本工具 
 │   │   │   ├── backupData.js       # 数据备份脚本 
 │   │   │   ├── importToHeike.js    # 数据导入脚本 
 │   │   │   └── restoreData.js      # 数据恢复脚本 
 │   │   └── 📁 utils/               # 工具函数 
 │   │       └── logger.js           # 日志工具 
 │   ├── 📁 logs/                    # 日志文件 
 │   └── 📄 test- .js                # 各种测试文件 
 │ 
 ├── 📁 contracts/                   # 智能合约源码 
 │   ├── 📄 AIRiskController.sol     # AI风险控制器合约 
 │   └── 📄 RiskAnalyzer.sol         # 风险分析器合约 
 │ 
 ├── 📁 frontend/                    # 前端应用 
 │   ├── 📄 .env                     # 前端环境变量 
 │   ├── 📄 index.html               # HTML入口文件 
 │   ├── 📄 package.json             # 前端依赖配置 
 │   ├── 📄 vite.config.js           # Vite构建配置 
 │   ├── 📁 public/                  # 静态资源 
 │   │   └── vite.svg                # Vite图标 
 │   └── 📁 src/                     # 前端源码 
 │       ├── 📄 App.vue              # 根组件 
 │       ├── 📄 main.js              # 应用入口 
 │       ├── 📁 components/          # Vue组件 
 │       │   ├── AIAnalysisPanel.vue      # AI分析面板 
 │       │   ├── AutoMonitoringPanel.vue  # 自动监控面板 
 │       │   ├── FocusButton.vue          # 焦点按钮组件 
 │       │   ├── HomePage.vue             # 主页组件 
 │       │   └── RiskWarningModal.vue     # 风险警告弹窗 
 │       ├── 📁 locales/             # 国际化文件 
 │       │   ├── en-US.js            # 英文语言包 
 │       │   ├── zh-CN.js            # 中文语言包 
 │       │   └── index.js            # 语言配置入口 
 │       ├── 📁 services/            # 前端服务层 
 │       │   ├── aiMonitoringAPI.js        # AI监控API 
 │       │   ├── aiRiskControlService.js   # AI风险控制服务 
 │       │   ├── riskAnalysisService.js    # 风险分析服务 
 │       │   └── transactionSecurityService.js # 交易安全服务 
 │       └── 📁 stores/              # 状态管理 
 │           └── web3.js             # Web3状态管理 
 │ 
 ├── 📁 scripts/                     # 部署脚本 
 │   └── 📄 deploy.js                # 智能合约部署脚本 
 │ 
 ├── 📁 deployments/                 # 部署记录 
 │   └── 📄 deployment- .json        # 部署配置文件 
 │ 
 ├── 📁 cache/                       # 缓存文件 
 │   └── 📄 solidity-files-cache.json # Solidity文件缓存 
 │ 
 ├── 📄 package.json                 # 根项目配置 
 ├── 📄 hardhat.config.js            # Hardhat配置 
 ├── 📄 check-balance.js             # 余额检查脚本 
 ├── 📄 check-transactions.js        # 交易检查脚本 
 └── 📄 test-api*.js                 # API测试脚本

</details>

## 🔧 核心模块说明

### 🎯 Qwen AI分析引擎

- **aiAnalysisService.js** - 核心Qwen分析逻辑，集成通义千问模型
- **aiRiskAnalyzer.js** - 专业风险评估算法
- **aiMonitoringService.js** - 实时监控和异常检测
- **confidenceCalculator.js** - 智能置信度计算

### 🛡️ 风险控制系统

- **AIRiskController.sol** - 链上AI风险控制合约
- **RiskAnalyzer.sol** - 风险数据分析合约
- **aiRiskControlService.js** - 风险控制策略执行

### 🌐 区块链集成

- **blockchainDataService.js** - 多链数据获取
- **etherscanService.js** - Etherscan API集成
- **onchainBehaviorService.js** - 链上行为模式分析

### 📊 前端界面

- **AutoMonitoringPanel.vue** - 自动监控仪表板
- **AIAnalysisPanel.vue** - AI分析结果展示
-

## 🤖 AI模型创新

### Qwen集成特色

- **金融专业性** - 针对金融风控场景优化
- **实时响应** - 低延迟的风险预警



### AI分析能力

- **智能合约代码审计** - 自动识别安全漏洞
- **交易模式识别** - 检测异常交易行为
- **风险预测评估** - 预测潜在风险事件

## 📊 用户界面设计

### 主要界面

- **🏠 主页** - 项目概览和快速导航
- **📊 监控面板** - 实时风险监控仪表板
- **🔍 AI分析** - 智能合约分析界面
- **⚠️ 风险警告** - 实时风险提醒弹窗

### 设计特色

- **响应式设计** - 支持多设备访问
- **暗色主题** - 专业的金融界面风格
- **国际化支持** - 中英文双语界面（有待完善）

## 🧪选择 Holesky测试网集成

### 关于Holesky测试网

**Holesky** 是以太坊官方推出的新一代测试网络，专为开发者和质押者设计，是Goerli测试网的继任者。

#### Holesky测试网特点

- **🆕 最新测试网** - 以太坊基金会官方维护的最新测试网
- **🔄 长期支持** - 替代即将弃用的Goerli测试网
- **⚡ 高性能** - 更快的区块确认和更好的网络稳定性
- **🎯 质押友好** - 专门优化了质押和验证者功能
- **🔗 主网兼容** - 与以太坊主网保持最高兼容性

### 🔧 Holesky网络配置

#### 网络参数

```bash
# Holesky测试网基本信息
Network Name: Holesky
Chain ID: 17000
Currency Symbol: ETH
RPC URL: https://ethereum-holesky-rpc.publicnode.com
Block Explorer: https://holesky.etherscan.io
```

#### 环境变量配置

```bash
# backend/.env 配置
WEB3_PROVIDER_URL=https://ethereum-holesky-rpc.publicnode.com
CHAIN_ID=17000

# MongoDB配置
MONGODB_URI=mongodb://localhost:27017/Hark

# 智能合约地址（部署后更新）
RISK_ANALYZER_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
AI_RISK_CONTROLLER_CONTRACT_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

### 🚀 连接Holesky测试网

#### 1. 测试网络连接

```bash
# 运行Holesky连接测试
node backend/test-holesky-connection.js
```

测试脚本会验证：

- ✅ 网络连接状态
- ✅ 链ID验证 (17000)
- ✅ 最新区块信息
- ✅ 网络响应时间

#### 2. 获取测试ETH

由于Holesky是测试网，您需要获取测试ETH：

**官方水龙头：**

- [Holesky PoW Faucet](https://holesky-faucet.pk910.de/)
- [Ethereum Foundation Faucet](https://faucet.quicknode.com/ethereum/holesky)

**社区水龙头：**

- [Alchemy Holesky Faucet](https://www.alchemy.com/faucets/ethereum-holesky)
- [Infura Holesky Faucet](https://www.infura.io/faucet/holesky)

### 🔍 Holesky集成验证

#### 连接测试输出示例

```bash
正在测试Holesky测试网连接...
WEB3_PROVIDER_URL: https://ethereum-holesky-rpc.publicnode.com
CHAIN_ID: 17000

网络信息: {
  name: 'holesky',
  chainId: 17000,
  ensAddress: null
}
```

🤖 Qwen + Holesky 集成分析

项目特色功能：**Qwen AI分析Holesky测试网数据**

```javascript
// Qwen分析Holesky网络数据示例
const holeskyAnalysis = await qwen.chat.completions.create({
  model: 'qwen-plus',
  messages: [{
    role: 'user',
    content: `
    作为DeFi风险分析专家，请分析以下Holesky测试网数据：
    
    网络信息：
    - 链ID: 17000
    - 当前区块: ${blockNumber}
    - Gas使用率: ${gasUsed/gasLimit * 100}%
    - 网络活跃度: ${transactionCount}笔交易
    
    请提供风险评估和建议。
    `
  }]
});
```

### 📊 Holesky网络监控

#### 实时监控功能

- **🔄 区块监控** - 实时监控新区块生成
- **📈 网络活跃度** - 分析交易量和活跃地址
- **⚠️ 异常检测** - 识别异常交易模式

#### 监控配置

```javascript
// AI监控配置
monitoring: {
  analysisInterval: 5000,        // 5秒分析间隔
  transactionBufferSize: 100,    // 交易缓冲区
  batchSize: 10,                 // 批处理大小
  
  riskThresholds: {
    high: 80,     // 高风险阈值
    medium: 50,   // 中风险阈值
    low: 20       // 低风险阈值
  }
}
```

### 🛠️ 开发工作流

#### 1. 本地开发

```bash
# 启动本地Hardhat网络进行快速开发
npm run node
npm run deploy:local
```

#### 2. Holesky测试

```bash
# 部署到Holesky测试网
npm run deploy:testnet

# 测试Holesky集成
node backend/test-holesky-connection.js
```

#### 3. 生产准备

```bash
# 在Holesky上进行完整测试
npm run test
node backend/test-full-analysis.js
```

### 🔗 Holesky生态工具

#### 区块浏览器

- **Holesky Etherscan**: https://holesky.etherscan.io
- **Holesky Beaconchain**: https://holesky.beaconcha.in

#### 开发工具

- **MetaMask配置**: 添加Holesky网络到MetaMask
- **Remix IDE**: 直接连接Holesky进行合约部署
- **Hardhat**: 配置Holesky网络进行自动化部署

### 🎯 为什么选择Holesky

#### 技术优势

- **🔄 持续更新** - 与以太坊主网保持同步更新
- **🛡️ 稳定可靠** - 官方维护，长期支持保证
- **⚡ 性能优越** - 更快的确认时间和更好的网络性能
- **🧪 测试完整** - 支持完整的以太坊功能测试

#### 项目适配

- **AI分析验证** - 在真实网络环境中验证Qwen分析准确性
- **实时监控验证** - 验证实时监控系统的稳定性
- **用户体验测试** - 在真实网络延迟下测试用户体验

### 📈 Holesky部署状态

当前项目在Holesky测试网的部署状态：

```bash
✅ 网络连接: 正常
✅ 合约部署: 已完成
✅ AI服务集成: 运行中
✅ 实时监控: 活跃
✅ 前端界面: 可访问
```

通过Holesky测试网，AIxETH项目能够在接近主网的环境中验证所有功能，确保在正式部署到以太坊主网时的稳定性和可靠性。

- **单元测试** - 核心功能模块测试
- **集成测试** - API接口测试
- **AI模型测试** - Qwen分析准确性测试
- **区块链测试** - 智能合约功能测试

## 🗺️ 开发路线图

### 🎯 现阶段 (当前)

- ✅ 基础架构搭建
- ✅ Qwen AI集成
- ✅ 智能合约开发
- ✅ 前端界面实现
- ✅ 实时监控系统

## 🤝 贡献指南

### 参与贡献

Links [项目创建]((https://github.com/Link-990))

Max [模型训练贡献]([https://github.com/0vszero)

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情



### 技术创新（希望加入的uu一起补充）

- **🤖 AI+ETH原生融合** - Qwen与以太坊的深度集成
- **⚡ 实时性能** - 毫秒级风险检测响应
- **🛡️ 预测性防护** - 主动风险预警机制
- **🎯 个性化AI** - 基于用户行为的智能推荐

## 📞 联系我们

- **项目主页**: [GitHub Repository]([Link-990 (Links)](https://github.com/Link-990))

## 🙏 致谢
这只是项目一部份，希望更多小伙伴加入我们
感谢以下技术和平台的支持：

Anne老师[项目创建指导](https://github.com/WZF-Anne)
- 阿里云通义千问 (Qwen) AI服务
- OpenZeppelin安全框架
- Vue.js开源社区

---

# **特别声明**

本项目只是一部分，还有待完善。

期待大家加入

如有雷同地方纯属巧合
