<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    :title="warningTitle"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="risk-warning-modal"
  >
    <div class="warning-content">
      <!-- 风险等级指示器 -->
      <div class="risk-indicator" :class="riskLevelClass">
        <el-icon class="warning-icon"><Warning /></el-icon>
        <span class="risk-level">{{ riskLevelText }}</span>
      </div>

      <!-- 风险详情 -->
      <div class="risk-details">
        <h3>{{ t('riskWarning.detectedRisks') }}</h3>
        <ul class="risk-factors">
          <li v-for="factor in riskData.riskFactors" :key="factor" class="risk-factor">
            <el-icon><Close /></el-icon>
            {{ factor }}
          </li>
        </ul>
      </div>

      <!-- 风险评分 -->
      <div class="risk-score">
        <div class="score-circle" :class="riskLevelClass">
          <span class="score-number">{{ parseFloat(riskData.riskScore).toFixed(1) }}</span>
          <span class="score-label">{{ t('riskWarning.riskScoreLabel') }}</span>
        </div>
      </div>

      <!-- AI建议 -->
      <div class="ai-recommendation">
          <h3>{{ t('riskWarning.aiRecommendation') }}</h3>
          <p>{{ riskData.recommendation }}</p>
        </div>

      <!-- 合约信息 -->
      <div class="contract-info">
        <el-descriptions :column="1" border>
          <el-descriptions-item :label="t('riskWarning.contractAddress')">
            <el-link :href="getEtherscanUrl(contractAddress)" target="_blank">
              {{ formatAddress(contractAddress) }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item :label="t('riskWarning.confidence')">
            {{ riskData.confidence }}%
          </el-descriptions-item>
          <el-descriptions-item v-if="riskData.comprehensiveConfidence" :label="t('riskWarning.comprehensiveConfidence')">
            {{ riskData.comprehensiveConfidence }}%
          </el-descriptions-item>
        </el-descriptions>
      </div>

    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel" size="large">
          {{ t('riskWarning.cancelTransaction') }}
        </el-button>
        <el-button 
          type="danger" 
          @click="handleProceed" 
          size="large"
          :disabled="riskData.riskLevel === 'critical'"
        >
          {{ riskData.riskLevel === 'critical' ? t('riskWarning.riskTooHigh') : t('riskWarning.continueTransaction') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Warning, Close } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  visible: Boolean,
  riskData: Object,
  contractAddress: String
})

const emit = defineEmits(['update:visible', 'proceed', 'cancel'])

const warningTitle = computed(() => {
  const level = props.riskData?.riskLevel || 'medium'
  return t(`riskWarning.titles.${level}`)
})

const riskLevelClass = computed(() => {
  return `risk-${props.riskData?.riskLevel || 'medium'}`
})

const riskLevelText = computed(() => {
  const level = props.riskData?.riskLevel || 'medium'
  return t(`riskWarning.levels.${level}`)
})

const handleCancel = () => {
  emit('update:visible', false)
  emit('cancel')
}

const handleProceed = () => {
  emit('update:visible', false)
  emit('proceed')
}

const formatAddress = (address) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString('zh-CN')
}

const getEtherscanUrl = (address) => {
  return `https://etherscan.io/address/${address}`
}

const getProgressColor = (value) => {
  if (value >= 0.8) return '#67c23a'  // 绿色 - 高分
  if (value >= 0.6) return '#e6a23c'  // 橙色 - 中等
  if (value >= 0.4) return '#f56c6c'  // 红色 - 低分
  return '#909399'  // 灰色 - 极低分
}
</script>

<style scoped lang="scss">
.risk-warning-modal {
  .warning-content {
    padding: 20px 0;
  }

  .risk-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 24px;

    .warning-icon {
      font-size: 32px;
      margin-right: 12px;
    }

    .risk-level {
      font-size: 24px;
      font-weight: bold;
    }

    &.risk-low {
      background: #f0f9ff;
      color: #0369a1;
      border: 2px solid #38bdf8;
    }

    &.risk-medium {
      background: rgba(251, 191, 36, 0.1);
      color: #fbbf24;
      border: 2px solid #fbbf24;
    }

    &.risk-high {
      background: #eff6ff;
      color: #2563eb;
      border: 2px solid #60a5fa;
    }

    &.risk-critical {
      background: #1f2937;
      color: #3b82f6;
      border: 2px solid #3b82f6;
      animation: pulse 2s infinite;
    }
  }

  .risk-details {
    margin-bottom: 24px;

    h3 {
      color: #374151;
      margin-bottom: 12px;
    }

    .risk-factors {
      list-style: none;
      padding: 0;

      .risk-factor {
        display: flex;
        align-items: center;
        padding: 8px 0;
        color: #2563eb;

        .el-icon {
          margin-right: 8px;
          color: #3b82f6;
        }
      }
    }
  }

  .risk-score {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;

    .score-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 4px solid;

      .score-number {
        font-size: 32px;
        font-weight: bold;
      }

      .score-label {
        font-size: 12px;
        margin-top: 4px;
      }

      &.risk-low {
        border-color: #38bdf8;
        color: #0369a1;
      }

      &.risk-medium {
        border-color: #fbbf24;
        color: #d97706;
      }

      &.risk-high {
        border-color: #60a5fa;
        color: #2563eb;
      }

      &.risk-critical {
        border-color: #3b82f6;
        color: #3b82f6;
      }
    }
  }

  .ai-recommendation {
    margin-bottom: 24px;
    padding: 16px;
    background: #f8fafc;
    border-radius: 8px;

    h3 {
      color: #374151;
      margin-bottom: 8px;
    }

    p {
      color: #6b7280;
      line-height: 1.6;
    }
  }

  .contract-info {
    margin-bottom: 16px;
  }

  .dialog-footer {
    display: flex;
    justify-content: space-between;
    gap: 16px;

    .el-button {
      flex: 1;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>