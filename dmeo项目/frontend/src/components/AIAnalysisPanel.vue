<template>
  <div class="ai-analysis-panel">
    <div class="panel-header">
      <div class="header-title">
        <el-icon class="title-icon"><Cpu /></el-icon>
        <span>{{ t('aiAnalysis.title') }}</span>
      </div>
      <div class="ai-status" :class="{ active: isAnalyzing }">
        <div class="status-dot"></div>
        <span>{{ isAnalyzing ? t('aiAnalysis.status.analyzing') : t('aiAnalysis.status.ready') }}</span>
      </div>
    </div>

    <!-- 快速分析区域 -->
    <div class="quick-analysis">
      <h3>{{ t('aiAnalysis.quickAnalysis') }}</h3>
      <div class="input-group">
        <el-input
          v-model="contractAddress"
          :placeholder="t('aiAnalysis.inputPlaceholder')"
          size="large"
          clearable
        >
          <template #prepend>
            <el-icon><Link /></el-icon>
          </template>
        </el-input>
        <el-button 
          type="primary" 
          size="large" 
          @click="analyzeContract"
          :loading="isAnalyzing"
          :disabled="!contractAddress"
        >
          <el-icon><MagicStick /></el-icon>
          {{ t('aiAnalysis.analyzeButton') }}
        </el-button>
      </div>
    </div>

    <!-- AI分析结果 -->
    <div v-if="analysisResult" class="analysis-result">
      <div class="result-header">
        <h3>{{ t('aiAnalysis.report') }}</h3>
        <el-tag :type="getRiskTagType(analysisResult.riskScore)" size="large">
          {{ t('aiAnalysis.riskScore') }}: {{ parseFloat(analysisResult.riskScore).toFixed(1) }}
        </el-tag>
      </div>

      <!-- 风险等级可视化 -->
      <div class="risk-visualization">
        <div class="risk-meter">
          <div class="meter-bg">
            <div 
              class="meter-fill" 
              :style="{ width: analysisResult.riskScore + '%' }"
              :class="getRiskLevelClass(analysisResult.riskLevel)"
            ></div>
          </div>
          <div class="risk-labels">
            <span class="label low">{{ t('riskWarning.lowRisk').replace('⚠️ ', '').replace(' 警告', '') }}</span>
            <span class="label medium">{{ t('riskWarning.mediumRisk').replace('🚨 ', '').replace('等风险警告', '等风险') }}</span>
            <span class="label high">{{ t('riskWarning.highRisk').replace('🔥 ', '').replace('风险警告', '风险') }}</span>
            <span class="label critical">{{ t('riskWarning.criticalRisk').replace('💀 ', '').replace('严重风险警告', '严重') }}</span>
          </div>
        </div>
      </div>

      <!-- AI检测的风险因素 -->
      <div class="risk-factors">
        <h4>🔍 {{ t('aiAnalysis.riskLevel') }}：</h4>
        <div class="factors-list">
          <div 
            v-for="factor in analysisResult.riskFactors" 
            :key="factor"
            class="factor-item"
          >
            <el-icon class="factor-icon"><Warning /></el-icon>
            <span>{{ factor }}</span>
          </div>
        </div>
      </div>

      <!-- AI建议 -->
      <div class="ai-recommendation">
        <h4>🤖 {{ t('aiAnalysis.recommendation') }}：</h4>
        <div class="recommendation-content">
          <p>{{ analysisResult.recommendation }}</p>
          <div class="confidence-section">
            <div class="confidence-badge">
              <span>{{ t('aiAnalysis.confidence') }}: {{ analysisResult.confidence }}%</span>
            </div>
            <div v-if="analysisResult.comprehensiveConfidence" class="comprehensive-confidence-badge">
              <span>{{ t('aiAnalysis.comprehensiveConfidence') }}: {{ analysisResult.comprehensiveConfidence }}%</span>
            </div>
          </div>
        </div>

        <!-- 详细风险分析展示 -->
        <div v-if="analysisResult.detailedAnalysis">
          <h4>📊 详细分析报告</h4>
          <el-tabs v-model="activeAnalysisTab" type="border-card">
            <!-- 智能合约安全分析 -->
            <el-tab-pane label="🔒 安全分析" name="security">
              <div class="security-metrics">
                <div class="metric-item">
                  <span class="metric-label">权限管理:</span>
                  <el-tag :type="getSecurityTagType(analysisResult.detailedAnalysis.security?.accessControl)">
                    {{ analysisResult.detailedAnalysis.security?.accessControl || '未检测' }}
                  </el-tag>
                </div>
                <div class="metric-item">
                  <span class="metric-label">重入攻击防护:</span>
                  <el-tag :type="getSecurityTagType(analysisResult.detailedAnalysis.security?.reentrancyProtection)">
                    {{ analysisResult.detailedAnalysis.security?.reentrancyProtection || '未检测' }}
                  </el-tag>
                </div>
                <div class="metric-item">
                  <span class="metric-label">溢出保护:</span>
                  <el-tag :type="getSecurityTagType(analysisResult.detailedAnalysis.security?.overflowProtection)">
                    {{ analysisResult.detailedAnalysis.security?.overflowProtection || '未检测' }}
                  </el-tag>
                </div>
              </div>
            </el-tab-pane>

            <!-- AI特性分析 -->
            <el-tab-pane label="🤖 AI特性" name="ai-features">
              <div class="ai-features-grid">
                <div class="feature-card" v-for="(value, key) in analysisResult.detailedAnalysis.ethAIFeatures" :key="key">
                  <div class="feature-icon">
                    {{ getFeatureIcon(key) }}
                  </div>
                  <div class="feature-content">
                    <div class="feature-name">{{ getFeatureName(key) }}</div>
                    <div class="feature-status" :class="{ active: value }">
                      {{ value ? '✅ 已启用' : '❌ 未启用' }}
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- 稳定性指标 -->
            <el-tab-pane label="📈 稳定性" name="stability">
              <div class="stability-charts">
                <div class="chart-container">
                  <h5>AI置信度</h5>
                  <div class="progress-bar">
                    <div class="progress-fill" 
                         :style="{ width: (analysisResult.detailedAnalysis.stabilityMetrics?.aiConfidence * 20) + '%' }">
                    </div>
                    <span class="progress-text">{{ analysisResult.detailedAnalysis.stabilityMetrics?.aiConfidence || 0 }}/5</span>
                  </div>
                </div>
                <div class="chart-container">
                  <h5>系统韧性</h5>
                  <div class="progress-bar">
                    <div class="progress-fill" 
                         :style="{ width: (analysisResult.detailedAnalysis.stabilityMetrics?.systemResilience * 100) + '%' }">
                    </div>
                    <span class="progress-text">{{ ((analysisResult.detailedAnalysis.stabilityMetrics?.systemResilience || 0) * 100).toFixed(1) }}%</span>
                  </div>
                </div>
                <div class="chart-container">
                  <h5>ETH集成度</h5>
                  <div class="progress-bar">
                    <div class="progress-fill" 
                         :style="{ width: (analysisResult.detailedAnalysis.stabilityMetrics?.ethIntegrationLevel * 100) + '%' }">
                    </div>
                    <span class="progress-text">{{ ((analysisResult.detailedAnalysis.stabilityMetrics?.ethIntegrationLevel || 0) * 100).toFixed(1) }}%</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- 实时监控控制 -->
            <el-tab-pane label="🔍 监控控制" name="monitoring">
              <div class="monitoring-controls">
                <div class="control-group">
                  <h5>启动智能监控</h5>
                  <el-button 
                    type="primary" 
                    @click="startContractMonitoring"
                    :loading="isStartingMonitoring"
                    :disabled="isMonitoringActive"
                  >
                    <el-icon><Monitor /></el-icon>
                    {{ isMonitoringActive ? '监控中...' : '开始监控' }}
                  </el-button>
                </div>
                
                <div class="control-group" v-if="isMonitoringActive">
                  <h5>监控状态</h5>
                  <div class="monitoring-status-display">
                    <div class="status-item">
                      <span class="status-label">监控地址:</span>
                      <code>{{ contractAddress }}</code>
                    </div>
                    <div class="status-item">
                      <span class="status-label">风险阈值:</span>
                      <el-tag type="warning">{{ monitoringConfig.riskThreshold }}分</el-tag>
                    </div>
                    <div class="status-item">
                      <span class="status-label">监控时长:</span>
                      <span>{{ formatMonitoringDuration() }}</span>
                    </div>
                  </div>
                </div>

                <div class="control-group">
                  <h5>风险控制动作</h5>
                  <div class="risk-actions">
                    <el-button 
                      type="warning" 
                      size="small"
                      @click="executeRiskAction('pause')"
                      :disabled="!isMonitoringActive"
                    >
                      ⏸️ 暂停合约
                    </el-button>
                    <el-button 
                      type="danger" 
                      size="small"
                      @click="executeRiskAction('emergency_stop')"
                      :disabled="!isMonitoringActive"
                    >
                      🚨 紧急停止
                    </el-button>
                    <el-button 
                      type="info" 
                      size="small"
                      @click="executeRiskAction('enhanced_monitoring')"
                      :disabled="!isMonitoringActive"
                    >
                      🔍 增强监控
                    </el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>



        <!-- 详细分析 -->
        <el-collapse>
          <el-collapse-item :title="t('aiAnalysis.detailedAnalysis.title')" name="details">
            <div class="analysis-details">
              <el-descriptions :column="2" border>
                <el-descriptions-item :label="t('aiAnalysis.detailedAnalysis.contractAddress')">
                  {{ formatAddress(contractAddress) }}
                </el-descriptions-item>
                <el-descriptions-item :label="t('aiAnalysis.detailedAnalysis.riskLevel')">
                  <el-tag :type="getRiskTagType(analysisResult.riskScore)">
                    {{ getRiskLevelText(analysisResult.riskLevel) }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item :label="t('aiAnalysis.detailedAnalysis.analysisTime')">
                  {{ formatTime(analysisTime) }}
                </el-descriptions-item>
                <el-descriptions-item :label="t('aiAnalysis.detailedAnalysis.aiModel')">
                  千问-Plus
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>

    <!-- 历史分析记录 -->
    <div class="analysis-history">
      <h3>{{ t('aiAnalysis.analysisHistory') }}</h3>
      <div v-if="analysisHistory.length === 0" class="empty-history">
        <el-empty :description="t('aiAnalysis.noHistory')" />
      </div>
      <div v-else class="history-list">
        <div 
          v-for="record in analysisHistory" 
          :key="record.id"
          class="history-item"
          @click="loadHistoryRecord(record)"
        >
          <div class="history-info">
            <div class="history-address">{{ formatAddress(record.contractAddress) }}</div>
            <div class="history-time">{{ formatTime(record.timestamp) }}</div>
          </div>
          <div class="history-score">
            <el-tag :type="getRiskTagType(record.riskScore)" size="small">
              {{ parseFloat(record.riskScore).toFixed(1) }}
            </el-tag>
          </div>
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
import { ref, computed, getCurrentInstance, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Cpu, Link, MagicStick, Warning } from '@element-plus/icons-vue'
import { useRiskAnalysisService } from '../services/riskAnalysisService'
import { useI18n } from 'vue-i18n'
import { aiMonitoringAPI } from '../services/aiMonitoringAPI.js'
import axios from 'axios'

// 定义事件发射
const emit = defineEmits(['analysis-completed'])

const { t } = useI18n()
const riskAnalysisService = useRiskAnalysisService()

const contractAddress = ref('')
const isAnalyzing = ref(false)
const analysisResult = ref(null)
const analysisTime = ref(null)
const analysisHistory = ref([])

// 实时监控数据
const realtimeData = ref({
  stats: {
    totalTransactions: 0,
    highRiskTransactions: 0,
    blockedTransactions: 0,
    averageRiskLevel: 0,
    maliciousPatternCount: 0
  },
  recentAnalysis: [],
  monitoringStatus: {
    isMonitoring: false,
    monitoredAddresses: [],
    transactionBufferSize: 0,
    analysisQueueSize: 0,
    riskThresholds: {
      high: 80,
      medium: 50,
      low: 20
    }
  },
  timestamp: null
})

// 新增：详细分析相关数据
const activeAnalysisTab = ref('security')
const isMonitoringActive = ref(false)
const isStartingMonitoring = ref(false)
const monitoringStartTime = ref(null)
const monitoringConfig = ref({
  riskThreshold: 70
})

// 定时器
let realtimeTimer = null

// 获取实时监控数据
const fetchRealtimeData = async () => {
  try {
    const response = await aiMonitoringAPI.getRealtimeData()
    if (response.success) {
      realtimeData.value = response.data
    }
  } catch (error) {
    console.error('获取实时数据失败:', error)
    // 不显示错误消息，避免页面上出现多个错误提示
  }
}

// 启动实时数据更新
const startRealtimeUpdates = () => {
  fetchRealtimeData() // 立即获取一次
  realtimeTimer = setInterval(fetchRealtimeData, 5000) // 每5秒更新一次
}

// 停止实时数据更新
const stopRealtimeUpdates = () => {
  if (realtimeTimer) {
    clearInterval(realtimeTimer)
    realtimeTimer = null
  }
}

// 组件挂载时启动实时更新
onMounted(() => {
  startRealtimeUpdates()
})

// 组件卸载时停止实时更新
onUnmounted(() => {
  stopRealtimeUpdates()
})

// 分析合约
const analyzeContract = async () => {
  if (!contractAddress.value) {
    ElMessage.warning(t('aiAnalysis.messages.enterAddress'))
    return
  }

  // 前端地址验证 - 增强版
  const cleanAddress = contractAddress.value.trim()
  
  // 基础格式检查
  if (!cleanAddress) {
    ElMessage.error(t('aiAnalysis.messages.addressRequired'))
    return
  }
  
  // 移除可能的空格和特殊字符
  const normalizedAddress = cleanAddress.replace(/\s+/g, '')
  
  // 检查地址格式
  if (!normalizedAddress.startsWith('0x')) {
    ElMessage.error(t('aiAnalysis.messages.invalidPrefix'))
    return
  }
  
  if (normalizedAddress.length !== 42) {
    ElMessage.error(t('aiAnalysis.messages.invalidLength', { length: normalizedAddress.length }))
    return
  }
  
  // 检查是否为有效的十六进制字符
  const hexPattern = /^0x[a-fA-F0-9]{40}$/
  if (!hexPattern.test(normalizedAddress)) {
    ElMessage.error(t('aiAnalysis.messages.invalidCharacters'))
    return
  }

  isAnalyzing.value = true
  analysisTime.value = Date.now()

  try {
    const result = await riskAnalysisService.analyzeContract(
      normalizedAddress,
      { source: 'manual_analysis' }
    )
    
    analysisResult.value = result
    
    // 保存到历史记录
    analysisHistory.value.unshift({
      id: Date.now(),
      contractAddress: normalizedAddress, // 使用标准化地址
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      timestamp: analysisTime.value
    })

    // 只保留最近10条记录
    if (analysisHistory.value.length > 10) {
      analysisHistory.value = analysisHistory.value.slice(0, 10)
    }

    // 发射分析完成事件
    emit('analysis-completed', {
      isRisk: result.riskScore > 60,
      riskScore: result.riskScore,
      source: 'ai-analysis'
    })

    ElMessage.success(t('aiAnalysis.messages.analysisComplete', { score: result.riskScore }))
  } catch (error) {
    console.error('Analysis failed:', error)
    
    // 根据错误类型显示不同的错误信息
    let errorMessage = t('aiAnalysis.messages.analysisFailed')
    if (error.message.includes('地址')) {
      errorMessage = error.message
    } else if (error.message.includes('网络')) {
      errorMessage = t('aiAnalysis.messages.networkError')
    } else if (error.message.includes('服务')) {
      errorMessage = t('aiAnalysis.messages.serviceUnavailable')
    } else {
      errorMessage = `${t('aiAnalysis.messages.analysisFailed')}：${error.message}`
    }
    
    ElMessage.error(errorMessage)
  } finally {
    isAnalyzing.value = false
  }
}

// 加载历史记录
const loadHistoryRecord = (record) => {
  contractAddress.value = record.contractAddress
  // 这里可以重新加载详细分析结果
  ElMessage.info(t('aiAnalysis.messages.historyLoaded'))
}

// 工具函数
const formatAddress = (address) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const formatTxHash = (hash) => {
  if (!hash) return ''
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString('zh-CN')
}

const getRiskTagType = (score) => {
  if (score >= 80) return 'danger'
  if (score >= 60) return 'warning'
  if (score >= 30) return 'info'
  return 'success'
}

const getRiskLevel = (score) => {
  if (score >= 80) return 'high'
  if (score >= 60) return 'medium'
  if (score >= 30) return 'low'
  return 'safe'
}

const getRiskLevelClass = (level) => {
  return `risk-${level}`
}

const getRiskLevelText = (level) => {
  const texts = {
    low: '低风险',
    medium: '中等风险',
    high: '高风险',
    critical: '严重风险'
  }
  return texts[level] || '未知'
}

const getProgressColor = (value) => {
  if (value >= 0.8) return '#67c23a'  // 绿色 - 高分
  if (value >= 0.6) return '#e6a23c'  // 橙色 - 中等
  if (value >= 0.4) return '#f56c6c'  // 红色 - 低分
  return '#909399'  // 灰色 - 极低分
}
</script>

<style scoped>
.ai-analysis-panel {
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 24px;
  padding: 40px;
  color: white;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(59, 130, 246, 0.3),
    0 0 0 1px rgba(59, 130, 246, 0.1);
  position: relative;
  overflow: hidden;
  min-height: calc(100vh - 64px);
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  border-radius: 0;
  
  /* 深色毛玻璃光泽效果 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.05) 50%, transparent 70%),
      linear-gradient(-45deg, transparent 30%, rgba(139, 92, 246, 0.05) 50%, transparent 70%);
    animation: panelScanLines 8s linear infinite;
    pointer-events: none;
    z-index: 1;
  }
  
  /* 增强的内部光泽 */
  &::after {
    content: '';
    position: absolute;
    top: 1px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    background: linear-gradient(135deg, 
      rgba(59, 130, 246, 0.15) 0%,
      rgba(139, 92, 246, 0.08) 50%,
      rgba(15, 23, 42, 0.05) 100%
    );
    pointer-events: none;
  }
}

.ai-analysis-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.05) 50%, transparent 70%),
    linear-gradient(-45deg, transparent 30%, rgba(139, 92, 246, 0.05) 50%, transparent 70%);
  animation: panelScanLines 8s linear infinite;
  pointer-events: none;
  z-index: 1;
}

.ai-analysis-panel > * {
  position: relative;
  z-index: 3;
}

@keyframes panelScanLines {
  0% {
    transform: translateX(-100%) translateY(-100%);
  }
  100% {
    transform: translateX(100%) translateY(100%);
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.title-icon {
  font-size: 28px;
  color: #3b82f6;
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 25px;
  backdrop-filter: blur(15px);
  box-shadow: 
    0 0 20px rgba(34, 197, 94, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.8);
}

.ai-status.active {
  border-color: rgba(251, 191, 36, 0.4);
  box-shadow: 
    0 0 20px rgba(251, 191, 36, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.ai-status.active .status-dot {
  background: #fbbf24;
  box-shadow: 0 0 15px rgba(251, 191, 36, 1);
  animation: pulse 2s infinite;
}

.quick-analysis {
  margin-bottom: 28px;
}

.quick-analysis h3 {
  margin-bottom: 18px;
  font-size: 20px;
  color: #e2e8f0;
  text-shadow: 0 0 8px rgba(226, 232, 240, 0.3);
}

.input-group {
  display: flex;
  gap: 16px;
}

.input-group .el-input {
  flex: 1;
}

.input-group :deep(.el-input__wrapper) {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 0 15px rgba(59, 130, 246, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.input-group :deep(.el-input__wrapper:hover) {
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 
    0 0 20px rgba(59, 130, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.input-group :deep(.el-input__wrapper.is-focus) {
  border-color: #3b82f6;
  box-shadow: 
    0 0 25px rgba(59, 130, 246, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.input-group :deep(.el-input__inner) {
  color: #e2e8f0;
  background: transparent;
}

.input-group :deep(.el-input__inner::placeholder) {
  color: rgba(148, 163, 184, 0.7);
}

.input-group :deep(.el-button--primary) {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: 1px solid rgba(59, 130, 246, 0.5);
  border-radius: 12px;
  box-shadow: 
    0 0 20px rgba(59, 130, 246, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.input-group :deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  box-shadow: 
    0 0 30px rgba(59, 130, 246, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.analysis-result {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 28px;
  backdrop-filter: blur(15px);
  box-shadow: 
    0 0 30px rgba(139, 92, 246, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
}

.risk-visualization {
  margin-bottom: 24px;
}

.risk-meter {
  position: relative;
}

.meter-bg {
  height: 14px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.meter-fill {
  height: 100%;
  border-radius: 7px;
  transition: width 0.8s ease;
  position: relative;
  overflow: hidden;
}

.meter-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.meter-fill.risk-low { 
  background: linear-gradient(90deg, #22c55e, #16a34a);
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.5);
}
.meter-fill.risk-medium { 
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.5);
}
.meter-fill.risk-high { 
  background: linear-gradient(90deg, #f97316, #ea580c);
  box-shadow: 0 0 15px rgba(249, 115, 22, 0.5);
}
.meter-fill.risk-critical { 
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
}

.risk-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 13px;
  opacity: 0.8;
}

.risk-factors {
  margin-bottom: 24px;
}

.factors-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}

.factor-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 0 15px rgba(251, 191, 36, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.factor-item:hover {
  border-color: rgba(251, 191, 36, 0.5);
  box-shadow: 
    0 0 20px rgba(251, 191, 36, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.factor-icon {
  color: #fbbf24;
  filter: drop-shadow(0 0 6px rgba(251, 191, 36, 0.6));
}

.ai-recommendation {
  margin-bottom: 24px;
}

.recommendation-content {
  margin-top: 16px;
  padding: 20px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 12px;
  border-left: 4px solid #22c55e;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 0 20px rgba(34, 197, 94, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.confidence-badge {
  margin-top: 16px;
  text-align: right;
  font-size: 14px;
  opacity: 0.8;
  color: #22c55e;
  text-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
}

.confidence-section {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comprehensive-confidence-badge {
  text-align: right;
  font-size: 14px;
  opacity: 0.9;
  color: #3b82f6;
  text-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
  font-weight: 600;
}

/* 实时监控样式 */
.realtime-monitoring {
  margin-bottom: 28px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(15px);
  box-shadow: 
    0 0 25px rgba(34, 197, 94, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.realtime-monitoring h3 {
  margin-bottom: 20px;
  font-size: 18px;
  color: #22c55e;
  text-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
}

.monitoring-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 24px;
  opacity: 0.8;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #e2e8f0;
  text-shadow: 0 0 8px rgba(226, 232, 240, 0.3);
}

.stat-label {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}

.recent-detections {
  margin-top: 20px;
}

.recent-detections h4 {
  margin-bottom: 16px;
  font-size: 16px;
  color: #e2e8f0;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #94a3b8;
  opacity: 0.7;
}

.detection-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detection-item {
  padding: 16px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.detection-item:hover {
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.1);
}

.detection-item.risk-high {
  border-color: rgba(239, 68, 68, 0.4);
  background: rgba(239, 68, 68, 0.05);
}

.detection-item.risk-medium {
  border-color: rgba(251, 191, 36, 0.4);
  background: rgba(251, 191, 36, 0.05);
}

.detection-item.risk-low {
  border-color: rgba(34, 197, 94, 0.4);
  background: rgba(34, 197, 94, 0.05);
}

.detection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.tx-hash {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #e2e8f0;
}

.detection-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.malicious-patterns {
  display: flex;
  align-items: center;
  gap: 8px;
}

.malicious-patterns .label {
  font-size: 12px;
  color: #94a3b8;
}

.malicious-patterns .patterns {
  font-size: 12px;
  color: #fbbf24;
}

.timestamp {
  font-size: 11px;
  color: #64748b;
  opacity: 0.8;
}

.analysis-history {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(15px);
  box-shadow: 
    0 0 25px rgba(100, 116, 139, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.history-item:hover {
  border-color: rgba(59, 130, 246, 0.4);
  background: rgba(15, 23, 42, 0.9);
  box-shadow: 
    0 0 20px rgba(59, 130, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.history-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.history-address {
  font-weight: 500;
  color: #e2e8f0;
}

.history-time {
  font-size: 12px;
  opacity: 0.7;
  color: #94a3b8;
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
  }
  50% { 
    opacity: 0.7; 
    transform: scale(1.1);
  }
}

.empty-history {
  text-align: center;
  padding: 24px;
  color: #94a3b8;
  opacity: 0.8;
}

/* Element Plus 组件样式覆盖 */
:deep(.el-tag) {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #e2e8f0;
  backdrop-filter: blur(10px);
}

:deep(.el-tag.el-tag--success) {
  background: rgba(34, 197, 94, 0.2);
  border-color: rgba(34, 197, 94, 0.5);
  color: #22c55e;
}

:deep(.el-tag.el-tag--warning) {
  background: rgba(251, 191, 36, 0.2);
  border-color: rgba(251, 191, 36, 0.5);
  color: #fbbf24;
}

:deep(.el-tag.el-tag--danger) {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
  color: #3b82f6;
}

:deep(.el-collapse) {
  background: transparent;
  border: none;
}

:deep(.el-collapse-item__header) {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  color: #e2e8f0;
  padding: 12px 16px;
}

:deep(.el-collapse-item__content) {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 16px;
}

:deep(.el-descriptions) {
  background: transparent;
}

:deep(.el-descriptions__table) {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
}

:deep(.el-descriptions__cell) {
  background: transparent;
  color: #e2e8f0;
  border-color: rgba(59, 130, 246, 0.2);
}

/* Footer样式 */
.footer {
  background: rgba(15, 23, 42, 0.95);
  border-top: 1px solid rgba(59, 130, 246, 0.2);
  margin-top: 48px;
  margin-left: -40px;
  margin-right: -40px;
  margin-bottom: -40px;
  padding: 48px 40px 40px;
  width: calc(100% + 80px);
}

.footer-content {
  max-width: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 48px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon svg {
  width: 32px;
  height: 32px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #e2e8f0;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  flex: 1;
}

.link-group h4 {
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.link-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-group li {
  margin-bottom: 8px;
}

.link-group a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
  
  &:hover {
    color: #3b82f6;
  }
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid rgba(59, 130, 246, 0.1);
}

.copyright {
  font-size: 12px;
  opacity: 0.6;
  letter-spacing: 0.5px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-analysis-panel {
    padding: 20px;
  }
  
  .header-title {
    font-size: 24px;
  }
  
  .input-group {
    flex-direction: column;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 30px;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 20px;
  }
}
</style>