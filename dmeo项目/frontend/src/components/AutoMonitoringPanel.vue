<template>
  <div class="auto-monitoring-panel">
    <!-- 页面标题 -->
    <div class="header-title">
      <el-icon class="title-icon"><Monitor /></el-icon>
      <span>{{ t('nav.autoMonitoring') }}</span>
    </div>
    
    <!-- 监控状态 -->
    <div class="monitoring-status" :class="{ active: isMonitoring }">
      <div class="status-dot"></div>
      <span>{{ isMonitoring ? t('autoMonitoring.status.monitoring') : t('autoMonitoring.status.stopped') }}</span>
    </div>

    <!-- 监控控制按钮 -->
    <div class="control-buttons">
      <FocusButton 
        type="success" 
        size="medium"
        :loading="isStarting"
        @click="startMonitoring"
        :disabled="isMonitoring"
        :icon="VideoPlay"
      >
        {{ t('autoMonitoring.controls.startMonitoring') }}
      </FocusButton>
      <FocusButton 
        type="danger" 
        size="medium"
        :loading="isStopping"
        @click="stopMonitoring"
        :disabled="!isMonitoring"
        :icon="VideoPause"
      >
        {{ t('autoMonitoring.controls.stopMonitoring') }}
      </FocusButton>
    </div>

    <!-- 实时监控数据标题 -->
    <h3>{{ t('autoMonitoring.realtimeData.title') }}</h3>
    
    <!-- 统计卡片网格 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🔍</div>
        <div class="stat-content">
          <div class="stat-value">{{ realtimeData.stats.totalTransactions }}</div>
          <div class="stat-label">{{ t('autoMonitoring.realtimeData.totalTransactions') }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⚠️</div>
        <div class="stat-content">
          <div class="stat-value">{{ realtimeData.stats.highRiskTransactions }}</div>
          <div class="stat-label">{{ t('autoMonitoring.realtimeData.highRiskTransactions') }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🛡️</div>
        <div class="stat-content">
          <div class="stat-value">{{ realtimeData.stats.blockedTransactions }}</div>
          <div class="stat-label">{{ t('autoMonitoring.realtimeData.blockedTransactions') }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-content">
          <div class="stat-value">{{ parseFloat(realtimeData.stats.averageRiskLevel).toFixed(1) }}%</div>
          <div class="stat-label">{{ t('autoMonitoring.realtimeData.averageRiskLevel') }}</div>
        </div>
      </div>
    </div>

    <!-- 最近检测结果标题 -->
    <h3>{{ t('autoMonitoring.recentDetections.title') }}</h3>
    
    <!-- 检测结果列表 -->
    <div v-if="realtimeData.recentAnalysis.length === 0" class="no-data">
      {{ t('autoMonitoring.recentDetections.noData') }}
    </div>
    <div v-else class="detection-list">
      <div 
        v-for="detection in realtimeData.recentAnalysis.slice(0, 5)" 
        :key="detection.transactionHash"
        class="detection-item"
        :class="[
          `risk-${getRiskLevel(detection.riskLevel)}`,
          { 'frequent-trading': isFrequentTrading(detection) }
        ]"
      >
        <div class="detection-header">
          <span class="tx-hash">{{ formatTxHash(detection.transactionHash) }}</span>
          <el-tag v-if="isFrequentTrading(detection)" type="warning" size="small" class="frequent-tag">
            ⚡ 频繁交易
          </el-tag>
          <el-tag :type="getRiskTagType(detection.riskLevel)" size="small">
            {{ t('autoMonitoring.recentDetections.riskLabel') }}: {{ parseFloat(detection.riskLevel).toFixed(1) }}%
          </el-tag>
        </div>
        <div class="detection-details">
          <div class="malicious-patterns" v-if="detection.maliciousPatterns && detection.maliciousPatterns.length > 0">
            <span class="label">{{ t('autoMonitoring.recentDetections.detectedLabel') }}:</span>
            <span class="patterns">{{ detection.maliciousPatterns.join(', ') }}</span>
          </div>
          <div class="timestamp">{{ formatTimestamp(detection.timestamp) }}</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">
          <div class="logo-icon">
            <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#21d4fd"/>
                  <stop offset="100%" stop-color="#1b6dff"/>
                </linearGradient>
              </defs>
              <path d="M20 4C11.2 4 4 11.2 4 20s7.2 16 16 16 16-7.2 16-16S28.8 4 20 4zm0 28c-6.6 0-12-5.4-12-12S13.4 8 20 8s12 5.4 12 12-5.4 12-12 12z" fill="url(#logoGrad)"/>
              <circle cx="20" cy="20" r="6" fill="url(#logoGrad)" opacity="0.8"/>
            </svg>
          </div>
          <span class="logo-text">AIxETH</span>
        </div>
        
        <div class="footer-links">
          <div class="link-group">
            <h4>Learn</h4>
            <ul>
              <li><a href="#">AI与区块链入门</a></li>
              <li><a href="#">智能合约开发</a></li>
              <li><a href="#">应用案例</a></li>
            </ul>
          </div>
          
          <div class="link-group">
            <h4>Build</h4>
            <ul>
              <li><a href="#">开发者门户</a></li>
              <li><a href="#">API文档</a></li>
            </ul>
          </div>
          
          <div class="link-group">
            <h4>Connect</h4>
            <ul>
              <li><a href="#">技术活动</a></li>
              <li><a href="#">开发者社区</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="social-links">
         
        </div>
        <div class="copyright">
          <!-- 版权信息 -->
          <p>© 2025 COPYRIGHT AIXETH FOUNDATION. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElButton, ElIcon, ElTag, ElSlider, ElInputNumber, ElMessage } from 'element-plus'
import { Monitor, VideoPlay, VideoPause } from '@element-plus/icons-vue'
import { aiMonitoringAPI } from '../services/aiMonitoringAPI.js'
import { useWeb3Store } from '../stores/web3.js'
import FocusButton from './FocusButton.vue'

// 国际化
const { t } = useI18n()

// Web3 Store
const web3Store = useWeb3Store()

// 钱包状态
const walletConnected = computed(() => web3Store.isConnected)
const walletAddress = computed(() => web3Store.account)

// 监控状态
const isMonitoring = ref(false)
const isStarting = ref(false)
const isStopping = ref(false)

// 实时数据
const realtimeData = ref({
  stats: {
    totalTransactions: 0,
    highRiskTransactions: 0,
    blockedTransactions: 0,
    averageRiskLevel: 0
  },
  recentAnalysis: []
})

// 监控配置
const config = reactive({
  riskThreshold: 70,
  monitoringInterval: 5
})

// 定时器
let realtimeTimer = null

// 启动监控
const startMonitoring = async () => {
  isStarting.value = true
  try {
    // 检查钱包连接状态
    if (!walletConnected.value || !walletAddress.value) {
      ElMessage.warning('请先连接钱包后再启动监控')
      return
    }
    
    console.log('启动监控，钱包地址:', walletAddress.value)
    
    const response = await aiMonitoringAPI.startMonitoring({
      riskThreshold: config.riskThreshold,
      monitoringInterval: config.monitoringInterval,
      addresses: [walletAddress.value] // 只监控当前连接的钱包地址
    })
    
    if (response.success) {
      isMonitoring.value = true
      startRealtimeUpdates()
      ElMessage.success(`监控已启动，正在监控钱包: ${walletAddress.value.slice(0, 6)}...${walletAddress.value.slice(-4)}`)
    } else {
      ElMessage.error(response.message || '启动监控失败')
    }
  } catch (error) {
    console.error('启动监控失败:', error)
    ElMessage.error('启动监控失败: ' + error.message)
  } finally {
    isStarting.value = false
  }
}

// 停止监控
const stopMonitoring = async () => {
  isStopping.value = true
  try {
    const response = await aiMonitoringAPI.stopMonitoring()
    
    if (response.success) {
      isMonitoring.value = false
      stopRealtimeUpdates()
      ElMessage.success('监控已停止')
    } else {
      ElMessage.error('停止监控失败: ' + response.message)
    }
  } catch (error) {
    console.error('停止监控失败:', error)
    ElMessage.error('停止监控失败: ' + error.message)
  } finally {
    isStopping.value = false
  }
}

// 获取实时数据
const fetchRealtimeData = async () => {
  try {
    console.log('正在获取实时数据...')
    const response = await aiMonitoringAPI.getRealtimeData()
    console.log('实时数据响应:', response)
    if (response.success) {
      realtimeData.value = response.data
      console.log('实时数据已更新:', response.data)
    } else {
      console.warn('获取实时数据失败:', response.message)
    }
  } catch (error) {
    console.error('获取实时数据失败:', error)
  }
}

// 启动实时数据更新
const startRealtimeUpdates = () => {
  console.log('启动实时数据更新，间隔:', config.monitoringInterval, '秒')
  fetchRealtimeData() // 立即获取一次
  realtimeTimer = setInterval(() => {
    console.log('定时获取实时数据...')
    fetchRealtimeData()
  }, config.monitoringInterval * 1000)
}

// 停止实时数据更新
const stopRealtimeUpdates = () => {
  if (realtimeTimer) {
    clearInterval(realtimeTimer)
    realtimeTimer = null
  }
}

// 更新配置
const updateConfig = async () => {
  try {
    await aiMonitoringAPI.updateConfig(config)
    if (isMonitoring.value) {
      // 如果正在监控，重启定时器以应用新的间隔
      stopRealtimeUpdates()
      startRealtimeUpdates()
    }
  } catch (error) {
    console.error('更新配置失败:', error)
  }
}

// 获取风险等级
const getRiskLevel = (riskScore) => {
  if (riskScore >= 80) return 'high'
  if (riskScore >= 50) return 'medium'
  return 'low'
}

// 获取风险标签类型
const getRiskTagType = (riskScore) => {
  if (riskScore >= 80) return 'danger'
  if (riskScore >= 50) return 'warning'
  return 'success'
}

// 格式化交易哈希
const formatTxHash = (hash) => {
  if (!hash) return 'N/A'
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`
}

// 格式化时间戳
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A'
  return new Date(timestamp).toLocaleString('zh-CN')
}

// 判断是否为频繁交易
const isFrequentTrading = (detection) => {
  if (!detection.maliciousPatterns) return false
  
  // 检查是否包含频繁交易相关的恶意模式
  const frequentPatterns = ['高频交易攻击', '频繁交易', '高频交易']
  return detection.maliciousPatterns.some(pattern => 
    frequentPatterns.some(fp => pattern.includes(fp))
  )
}

// 组件挂载时获取监控状态
onMounted(async () => {
  try {
    const status = await aiMonitoringAPI.getStatus()
    if (status.success && status.data.isMonitoring) {
      isMonitoring.value = true
      startRealtimeUpdates()
    }
    
    // 获取初始数据
    fetchRealtimeData()
  } catch (error) {
    console.error('获取监控状态失败:', error)
  }
})

// 组件卸载时清理定时器
onUnmounted(() => {
  stopRealtimeUpdates()
})
</script>

<style scoped>
.auto-monitoring-panel {
  width: 100%;
  padding: 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 0;
  box-shadow: none;
  color: #e2e8f0;
  min-height: calc(100vh - 64px);
}

.header-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  padding: 24px;
  text-align: center;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%);
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

.title-icon {
  font-size: 28px;
  color: #22c55e;
}

.monitoring-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  font-size: 14px;
  font-weight: 500;
  margin: 24px;
  width: fit-content;
}

.monitoring-status.active {
  border-color: rgba(34, 197, 94, 0.5);
  color: #22c55e;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  animation: pulse 2s infinite;
}

.monitoring-status.active .status-dot {
  background: #22c55e;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.control-buttons {
  display: flex;
  gap: 16px;
  margin: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(34, 197, 94, 0.2);
}

.auto-monitoring-panel h3 {
  color: #22c55e;
  font-size: 20px;
  font-weight: 600;
  margin: 32px 24px 20px 24px;
  text-shadow: 0 0 8px rgba(34, 197, 94, 0.4);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin: 0 24px 32px 24px;
}

.stat-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.stat-card:hover {
  border-color: rgba(34, 197, 94, 0.5);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.15);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 32px;
  opacity: 0.8;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #22c55e;
  line-height: 1;
  margin-bottom: 4px;
  text-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.no-data {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  padding: 40px 20px;
  background: rgba(15, 23, 42, 0.4);
  border: 1px dashed rgba(34, 197, 94, 0.3);
  border-radius: 8px;
  margin-bottom: 32px;
}

.detection-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0 24px 32px 24px;
}

.detection-item {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.detection-item:hover {
  border-color: rgba(34, 197, 94, 0.5);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.15);
  transform: translateY(-2px);
}

.detection-item.risk-high {
  border-color: rgba(239, 68, 68, 0.5);
  background: rgba(239, 68, 68, 0.05);
}

.detection-item.risk-medium {
  border-color: rgba(245, 158, 11, 0.5);
  background: rgba(245, 158, 11, 0.05);
}

.detection-item.risk-low {
  border-color: rgba(34, 197, 94, 0.5);
  background: rgba(34, 197, 94, 0.05);
}

.detection-item.frequent-trading {
  border-left: 4px solid #f59e0b;
}

.detection-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.tx-hash {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #22c55e;
  font-weight: 600;
  background: rgba(34, 197, 94, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.frequent-tag {
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from { box-shadow: 0 0 5px rgba(245, 158, 11, 0.5); }
  to { box-shadow: 0 0 15px rgba(245, 158, 11, 0.8); }
}

.detection-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.malicious-patterns {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: wrap;
}

.malicious-patterns .label {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  font-size: 14px;
  min-width: fit-content;
}

.malicious-patterns .patterns {
  color: #ef4444;
  font-weight: 600;
  font-size: 14px;
  flex: 1;
}

.timestamp {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-family: 'Courier New', monospace;
}

.footer {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-top: 1px solid rgba(59, 130, 246, 0.2);
  padding: 40px 0;
  margin-top: 60px;
}

.footer-content {
  width: 100%;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 40px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 10px rgba(33, 212, 253, 0.5));
}

.logo-text {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #21d4fd 0%, #1b6dff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(33, 212, 253, 0.3);
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.link-group h4 {
  color: #22c55e;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  text-shadow: 0 0 8px rgba(34, 197, 94, 0.4);
}

.link-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-group li {
  margin-bottom: 12px;
}

.link-group a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  position: relative;
}

.link-group a:hover {
  color: #22c55e;
  text-shadow: 0 0 8px rgba(34, 197, 94, 0.4);
  transform: translateX(4px);
}

.footer-bottom {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(34, 197, 94, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 28px;
  padding-right: 28px;
}

.social-links {
  display: flex;
  gap: 20px;
}

.copyright {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

.copyright p {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .auto-monitoring-panel {
    padding: 20px;
    margin: 10px;
  }
  
  .control-buttons {
    flex-direction: column;
    gap: 12px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .footer {
    margin: 40px -20px -20px -20px;
    width: calc(100% + 40px);
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 0 20px;
  }
  
  .footer-links {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
    padding-left: 20px;
    padding-right: 20px;
  }
  
  .detection-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .header-title {
    font-size: 20px;
  }
  
  .stat-value {
    font-size: 24px;
  }
  
  .logo-text {
    font-size: 24px;
  }
}
</style>