<template>
  <div id="app">
    <!-- 顶部导航栏 -->
    <nav class="app-navbar">
      <div class="nav-content">
        <div class="nav-brand">
          <div class="brand-logo">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
            <span class="brand-text">AI × ETH</span>
          </div>
          <nav class="nav-menu" role="navigation" aria-label="主导航">
            <button 
              class="nav-item" 
              :class="{ active: activeTab === 'homepage' }"
              @click="activeTab = 'homepage'"
              :aria-pressed="activeTab === 'homepage'"
            >
              {{ t('nav.homepage') }}
            </button>
            <button 
              class="nav-item" 
              :class="{ active: activeTab === 'ai-analysis' }"
              @click="activeTab = 'ai-analysis'"
              :aria-pressed="activeTab === 'ai-analysis'"
            >
              {{ t('nav.aiAnalysis') }}
            </button>
            <button 
              class="nav-item" 
              :class="{ active: activeTab === 'auto-monitoring' }"
              @click="activeTab = 'auto-monitoring'"
              :aria-pressed="activeTab === 'auto-monitoring'"
            >
              {{ t('nav.autoMonitoring') }}
            </button>
          </nav>
        <div class="nav-actions">
          <!-- 语言选择 -->
          <el-dropdown 
            @command="changeLanguage"
            trigger="click"
            class="language-selector"
          >
            <el-button type="text" class="language-btn">
              <span class="flag">{{ currentLanguage.flag }}</span>
              <span class="lang-name">{{ currentLanguage.name }}</span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item 
                  v-for="lang in supportedLanguages" 
                  :key="lang.code"
                  :command="lang.code"
                  :class="{ active: locale === lang.code }"
                >
                  <span class="flag">{{ lang.flag }}</span>
                  <span>{{ lang.name }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- 连接钱包按钮 -->
          <el-button 
            type="primary" 
            @click="connectWallet"
            class="connect-wallet-btn"
            :class="{ connected: walletConnected }"
          >
            <el-icon><wallet /></el-icon>
            <span v-if="!walletConnected">{{ $t('wallet.connect') }}</span>
            <span v-else class="wallet-info">
              {{ walletAddress.slice(0, 6) }}...{{ walletAddress.slice(-4) }}
            </span>
          </el-button>
        </div>
      </div>
      </div>
    </nav>

    <!-- 首页 -->
    <HomePage 
      v-if="activeTab === 'homepage'"
    />
    
    <!-- AI智能分析面板 -->
    <div v-if="activeTab === 'ai-analysis'" class="fullscreen-panel">
      <AIAnalysisPanel 
        @analysis-completed="handleAnalysisCompleted"
      />
    </div>
    
    <!-- 自动监控面板 -->
    <AutoMonitoringPanel 
      v-if="activeTab === 'auto-monitoring'"
    />

    <!-- 风险警告弹窗 -->
      <RiskWarningModal
        v-model:visible="showRiskModal"
        :risk-data="currentRiskData"
        :contract-address="currentContractAddress"
        @proceed="handleProceed"
        @cancel="handleCancel"
      />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElButton, ElIcon, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { MagicStick, Setting, ArrowDown, Wallet } from '@element-plus/icons-vue'
import RiskWarningModal from './components/RiskWarningModal.vue'
import AIAnalysisPanel from './components/AIAnalysisPanel.vue'
import AutoMonitoringPanel from './components/AutoMonitoringPanel.vue'
import HomePage from './components/HomePage.vue'
import { useWeb3Store } from './stores/web3'
import { supportedLanguages } from './locales/index.js'
import Web3 from 'web3'

// 国际化
const { t, locale } = useI18n()

// 使用web3 store
const web3Store = useWeb3Store()

// 选项卡状态
const activeTab = ref('homepage')

// 搜索查询
const searchQuery = ref('')

// 钱包连接状态
const walletConnected = ref(false)
const walletAddress = ref('')

// 统计数据
const aiAnalysisCount = ref(0)
const testAnalysisCount = ref(0)
const riskCount = ref(0)

// 语言切换相关
const showLanguageDropdown = ref(false)
const currentLanguage = computed(() => {
  const lang = supportedLanguages.find(lang => lang.code === locale.value)
  return lang || supportedLanguages[0]
})

// 计算属性
const isConnected = computed(() => web3Store.isConnected)

const showRiskModal = ref(false)
const currentRiskData = ref(null)
const currentContractAddress = ref('')

// 连接钱包功能
const connectWallet = async () => {
  try {
    // 检查是否已经连接
    if (walletConnected.value) {
      // 如果已连接，显示钱包信息或断开连接
      const shouldDisconnect = confirm('钱包已连接，是否要断开连接？')
      if (shouldDisconnect) {
        walletConnected.value = false
        walletAddress.value = ''
        clearWalletState()
        console.log('钱包已断开连接')
      }
      return
    }

    // 检查是否安装了 MetaMask
    if (typeof window.ethereum === 'undefined') {
      const shouldInstall = confirm('检测到您未安装 MetaMask 钱包，是否前往安装？')
      if (shouldInstall) {
        window.open('https://metamask.io/download/', '_blank')
      }
      return
    }

    // 使用web3Store的连接方法
    await web3Store.connectWallet()
    
    // 更新本地状态
    walletConnected.value = true
    walletAddress.value = web3Store.account
    
    // 保存连接状态到本地存储
    localStorage.setItem('walletConnected', 'true')
    localStorage.setItem('walletAddress', web3Store.account)
    
    console.log('钱包连接成功:', web3Store.account)
    console.log('当前网络:', web3Store.networkName)
    
  } catch (error) {
    console.error('连接钱包失败:', error)
    
    if (error.message.includes('用户拒绝')) {
      alert('用户拒绝了连接请求')
    } else if (error.message.includes('MetaMask')) {
      alert('请安装或启用 MetaMask 钱包')
    } else {
      alert('连接钱包失败，请重试: ' + (error.message || '未知错误'))
    }
  }
}

// 检查现有连接状态
const checkExistingConnection = async () => {
  try {
    // 刷新页面时自动断开连接
    console.log('页面刷新，自动断开钱包连接')
    clearWalletState()
  } catch (error) {
    console.error('检查钱包连接状态失败', error)
    clearWalletState()
  }
}

// 清理钱包状态的辅助函数
const clearWalletState = () => {
  walletConnected.value = false
  walletAddress.value = ''
  web3Store.isConnected = false
  web3Store.account = null
  web3Store.web3 = null
  web3Store.networkId = null
  web3Store.networkName = ''
  localStorage.removeItem('walletConnected')
  localStorage.removeItem('walletAddress')
}

// 处理账户变化并同步本地状态
const handleAccountsChangedWithSync = (accounts) => {
  if (accounts.length === 0) {
    // 用户断开了所有账户
    clearWalletState()
    console.log('用户已断开钱包连接')
  } else {
    // 用户切换了账户
    const newAccount = accounts[0]
    walletConnected.value = true
    walletAddress.value = newAccount
    web3Store.account = newAccount
    web3Store.isConnected = true
    
    // 更新localStorage
    localStorage.setItem('walletConnected', 'true')
    localStorage.setItem('walletAddress', newAccount)
    
    console.log('用户切换到新账户:', newAccount)
  }
}

// 数据初始化
onMounted(async () => {
  // 从localStorage读取数据
  aiAnalysisCount.value = parseInt(localStorage.getItem('aiAnalysisCount') || '25')
  testAnalysisCount.value = parseInt(localStorage.getItem('testAnalysisCount') || '18')
  riskCount.value = parseInt(localStorage.getItem('riskCount') || '7')
  
  // 只检查钱包连接状态，不重复设置localStorage数据
  // checkExistingConnection 内部已经处理了localStorage的读取和设置
  await checkExistingConnection()
})

// 处理分析完成事件
const handleAnalysisCompleted = (result) => {
  aiAnalysisCount.value++
  localStorage.setItem('aiAnalysisCount', aiAnalysisCount.value.toString())
  
  if (result && result.riskScore > 70) {
    riskCount.value++
    localStorage.setItem('riskCount', riskCount.value.toString())
  }
}

// 处理风险检测事件
const handleRiskDetected = (riskData) => {
  riskCount.value++
  localStorage.setItem('riskCount', riskCount.value.toString())
  currentRiskData.value = riskData.riskData
  currentContractAddress.value = riskData.contractAddress
  showRiskModal.value = true
}

const handleProceed = () => {
  showRiskModal.value = false
}

const handleCancel = () => {
  showRiskModal.value = false
}

// 语言切换功能
const changeLanguage = (langCode) => {
  locale.value = langCode
  localStorage.setItem('locale', langCode)
  showLanguageDropdown.value = false
}

const toggleLanguageDropdown = () => {
  showLanguageDropdown.value = !showLanguageDropdown.value
}
</script>

<style scoped>
/* 全局样式 */
#app {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background: linear-gradient(135deg, 
    #0a0a23 0%, 
    #1a1a3e 20%, 
    #2d1b69 40%, 
    #4c1d95 60%, 
    #1e1b4b 80%, 
    #0f0f23 100%);
  background-size: 400% 400%;
  animation: blockchainGradientShift 20s ease-in-out infinite;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-x: hidden;
  position: fixed;
  top: 0;
  left: 0;
  padding: 0;
  margin: 0;
}

/* 主容器样式 - 区块链暗色主题 */
.main-container {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(3px);
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  box-shadow: inset 0 0 100px rgba(76, 29, 149, 0.05);
  z-index: 10;
}

.main-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(45deg, transparent 40%, rgba(59, 130, 246, 0.08) 50%, transparent 60%),
    linear-gradient(-45deg, transparent 40%, rgba(139, 92, 246, 0.08) 50%, transparent 60%);
  animation: scanLines 10s linear infinite;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
  will-change: transform;
}

@keyframes scanLines {
  0% {
    transform: translate3d(-25%, -25%, 0);
  }
  100% {
    transform: translate3d(25%, 25%, 0);
  }
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 100% 50%;
  }
  50% {
    background-position: 100% 100%;
  }
  75% {
    background-position: 0% 100%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.main-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse 300px 150px at 20% 80%, rgba(88, 28, 135, 0.4) 0%, rgba(147, 51, 234, 0.2) 30%, transparent 70%),
    radial-gradient(ellipse 280px 140px at 80% 20%, rgba(59, 130, 246, 0.3) 0%, rgba(99, 102, 241, 0.15) 40%, transparent 80%),
    radial-gradient(ellipse 250px 125px at 50% 50%, rgba(139, 92, 246, 0.25) 0%, rgba(168, 85, 247, 0.08) 50%, transparent 90%);
  animation: floatingOrbs 15s ease-in-out infinite;
  pointer-events: none;
  overflow: hidden;
  will-change: background, transform;
}

@keyframes floatingOrbs {
  0% {
    background: 
      radial-gradient(ellipse 300px 150px at 20% 80%, rgba(88, 28, 135, 0.4) 0%, rgba(147, 51, 234, 0.2) 30%, transparent 70%),
      radial-gradient(ellipse 280px 140px at 80% 20%, rgba(59, 130, 246, 0.3) 0%, rgba(99, 102, 241, 0.15) 40%, transparent 80%),
      radial-gradient(ellipse 250px 125px at 50% 50%, rgba(139, 92, 246, 0.25) 0%, rgba(168, 85, 247, 0.08) 50%, transparent 90%);
    transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
  }
  50% {
    background: 
      radial-gradient(ellipse 320px 160px at 80% 20%, rgba(88, 28, 135, 0.35) 0%, rgba(147, 51, 234, 0.18) 35%, transparent 75%),
      radial-gradient(ellipse 260px 130px at 20% 80%, rgba(59, 130, 246, 0.4) 0%, rgba(99, 102, 241, 0.2) 30%, transparent 70%),
      radial-gradient(ellipse 290px 145px at 60% 40%, rgba(139, 92, 246, 0.3) 0%, rgba(168, 85, 247, 0.12) 40%, transparent 80%);
    transform: translate3d(0, 0, 0) rotate(180deg) scale(1.02);
  }
  100% {
    background: 
      radial-gradient(ellipse 300px 150px at 20% 80%, rgba(88, 28, 135, 0.4) 0%, rgba(147, 51, 234, 0.2) 30%, transparent 70%),
      radial-gradient(ellipse 280px 140px at 80% 20%, rgba(59, 130, 246, 0.3) 0%, rgba(99, 102, 241, 0.15) 40%, transparent 80%),
      radial-gradient(ellipse 250px 125px at 50% 50%, rgba(139, 92, 246, 0.25) 0%, rgba(168, 85, 247, 0.08) 50%, transparent 90%);
    transform: translate3d(0, 0, 0) rotate(360deg) scale(1);
  }
}

.app-navbar {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border-bottom: 1px solid rgba(59, 130, 246, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(59, 130, 246, 0.3),
    0 0 0 1px rgba(59, 130, 246, 0.1);
}

.app-navbar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(59, 130, 246, 0.6) 50%, 
    transparent
  );
}

.nav-content {
  width: 100%;
  margin: 0;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fullscreen-panel {
  position: absolute;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: calc(100vh - 64px);
  overflow: auto;
  z-index: 50;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 40px;
  flex: 1;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 28px;
  height: 28px;
  color: #3b82f6;
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
  font-family: 'Orbitron', 'Exo 2', sans-serif;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.4);
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.nav-item {
  padding: 8px 16px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  white-space: nowrap;
  min-width: fit-content;
  border-radius: 6px;
  font-family: 'Rajdhani', 'Exo 2', sans-serif;
  letter-spacing: 0.5px;
}

.nav-item:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  color: #00d4ff;
  background: rgba(0, 212, 255, 0.1);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

/* 语言选择器样式 */
.language-selector {
  position: relative;
}

.language-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  transition: all 0.3s ease;
}

.language-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.language-btn .flag {
  font-size: 16px;
}

.language-btn .lang-name {
  font-weight: 500;
}

/* 连接钱包按钮样式 */
.connect-wallet-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(45deg, #00d4ff, #0099cc);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 212, 255, 0.3);
  font-family: 'Rajdhani', 'Exo 2', sans-serif;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.connect-wallet-btn:hover {
  background: linear-gradient(45deg, #00b8e6, #0088bb);
  box-shadow: 0 4px 12px rgba(0, 212, 255, 0.4);
  transform: translateY(-1px);
}

.connect-wallet-btn.connected {
  background: linear-gradient(45deg, #10b981, #059669);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.connect-wallet-btn.connected:hover {
  background: linear-gradient(45deg, #0d9488, #047857);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.wallet-info {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
}





.app-header {
  text-align: center;
  padding: 80px 20px 60px;
  position: relative;
  z-index: 1;
}

.header-content {
  max-width: 900px;
  margin: 0 auto;
}

.main-title {
  font-size: 3.2rem;
  margin-bottom: 16px;
  color: white;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.5px;
  font-family: 'Orbitron', 'Exo 2', sans-serif;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 40px;
  font-weight: 400;
}

.search-container {
  margin-top: 32px;
  display: flex;
  justify-content: center;
  animation: slideInFromLeft 0.8s ease-out 0.4s both;
}

.search-box {
  display: flex;
  align-items: center;
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 12px;
  padding: 4px;
  width: 100%;
  max-width: 600px;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.search-box:hover {
  border-color: rgba(0, 255, 255, 0.5);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 16px 20px;
  color: #ffffff;
  font-size: 16px;
  font-family: inherit;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-input:focus {
  color: #ffffff;
}

.search-btn {
  background: linear-gradient(135deg, #00d4ff, #0099cc);
  border: none;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover {
  background: linear-gradient(135deg, #00b8e6, #0088bb);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
}

.search-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.3);
}

.search-btn svg {
  width: 20px;
  height: 20px;
  color: #ffffff;
}
.app-main {
  min-height: calc(100vh + 100px);
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
  grid-gap: 32px;
  width: 100vw;
  margin: 0;
  padding: 80px 0 80px;
  margin-top: 40px;
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.02) 0%, rgba(59, 130, 246, 0.05) 100%);
  border-radius: 0;
  box-shadow: none;
}

/* 让自动监控面板显示为更宽更"方正"的矩形 */
.app-main > .auto-monitoring-panel {
  justify-self: stretch;
  width: 100%;
  margin: 0;
  padding: 0 24px;
}

.app-main > .homepage {
  width: 100%;
  margin: 0;
  padding: 0;
}

.app-main > .ai-analysis-panel {
  width: 100%;
  margin: 0;
  padding: 0 24px;
}

.main-card {
  background: rgba(15, 23, 42, 0.4);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  overflow: hidden;
  margin-bottom: 40px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 32px 0;
  margin-bottom: 24px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.title-icon {
  font-size: 1.5rem;
}

.card-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.badge-pulse {
  width: 6px;
  height: 6px;
  background: rgba(59, 130, 246, 0.8);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.monitor-container {
  padding: 0 32px 32px;
}

.footer-info {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-top: auto;
  padding: 40px 20px;
  background: transparent; /* 取消底部信息栏的卡片背景带 */
  border-top: none; /* 移除顶部边框 */
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.9;
}

.info-icon {
  font-size: 1.2rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.feature-tabs {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin: 48px 0;
  padding: 24px;
  background: rgba(15, 23, 42, 0.2);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 16px;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 32px;
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  min-width: 140px;
}

.tab-item:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(0, 255, 255, 0.3);
  color: #ffffff;
  transform: translateY(-2px);
}

.tab-item.active {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 153, 204, 0.2));
  border-color: rgba(0, 255, 255, 0.5);
  color: #00d4ff;
  animation: glow 2s ease-in-out infinite alternate;
}

.tab-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.tab-text {
  font-size: 14px;
  font-weight: 500;
}

.tab-icon {
  font-size: 16px;
}

.tab-text {
  font-weight: 500;
}

.content-area {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  padding: 32px;
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.footer-info {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-top: 40px;
  background: transparent; 
  border-top: none; 
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
}

.info-icon {
  font-size: 1.2rem;
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
  }
}

.main-container {
  animation: fadeInUp 0.8s ease-out;
}

.app-navbar {
  animation: slideInFromLeft 0.6s ease-out;
}

.main-title {
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.subtitle {
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.search-container {
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.feature-tabs {
  animation: fadeInUp 0.8s ease-out 0.8s both;
}

.content-area {
  animation: fadeInUp 0.8s ease-out 1s both;
}

.footer-info {
  animation: fadeInUp 0.8s ease-out 1.2s both;
}

.search-btn:focus {
  animation: glow 1s ease-in-out infinite;
}

.tab-item.active {
  animation: glow 2s ease-in-out infinite;
}

@media (max-width: 1024px) {
  .nav-content {
    padding: 0 16px;
  }
  
  .nav-brand {
    gap: 20px;
  }
  
  .nav-menu {
    gap: 8px;
  }
  
  .nav-item {
    padding: 6px 12px;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }
  
  .search-box {
    max-width: 100%;
  }
  
  .search-input {
    font-size: 14px;
    padding: 14px 50px 14px 16px;
  }
  
  .feature-tabs {
    flex-direction: column;
    gap: 8px;
  }
  
  .tab-item {
    justify-content: center;
  }
  
  .footer-info {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .content-area {
    padding: 20px;
  }
  
  .nav-brand {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .nav-menu {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  
  .nav-actions {
    gap: 12px;
    margin-left: auto;
  }
}

@media (max-width: 480px) {
  .nav-content {
    flex-direction: column;
    height: auto;
    padding: 12px 16px;
    gap: 12px;
  }
  
  .nav-brand {
    width: 100%;
    justify-content: space-between;
  }
  
  .nav-menu {
    width: 100%;
    justify-content: center;
  }
  
  .nav-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Exo+2:wght@300;400;500;600;700&family=Rajdhani:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Exo 2', 'Rajdhani', 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  letter-spacing: 0.3px;
}
</style>
