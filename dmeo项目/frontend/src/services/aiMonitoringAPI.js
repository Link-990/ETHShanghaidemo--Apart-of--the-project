import axios from 'axios'

// API基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8080'

// 创建axios实例
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/ai-monitoring`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API request failed:', error)
    
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // 未授权，可能需要重新登录
          console.error('Unauthorized access')
          break
        case 403:
          // 禁止访问
          console.error('Access forbidden')
          break
        case 404:
          // 接口不存在
          console.error('API endpoint not found')
          break
        case 500:
          // 服务器内部错误
          console.error('Internal server error')
          break
        default:
          console.error(`Request failed: ${status}`)
      }
      
      return Promise.reject(data || error.response)
    } else if (error.request) {
      // 网络错误
      console.error('Network connection failed')
      return Promise.reject({ message: '网络连接失败，请检查网络设置' })
    } else {
      // 其他错误
      console.error('Request configuration error:', error.message)
      return Promise.reject({ message: error.message })
    }
  }
)

// AI监控API服务类
class AIMonitoringAPI {
  constructor() {
    this.websocket = null
    this.eventListeners = new Map()
  }

  // 获取监控状态
  async getStatus() {
    try {
      const response = await apiClient.get('/status')
      return response
    } catch (error) {
      throw new Error(`获取监控状态失败: ${error.message || error}`)
    }
  }

  // 启动监控
  async startMonitoring(config = {}) {
    try {
      const response = await apiClient.post('/start', config)
      return response
    } catch (error) {
      throw new Error(`启动监控失败: ${error.message || error}`)
    }
  }

  // 停止监控
  async stopMonitoring() {
    try {
      const response = await apiClient.post('/stop')
      return response
    } catch (error) {
      throw new Error(`停止监控失败: ${error.message || error}`)
    }
  }

  // 获取实时数据
  async getRealtimeData() {
    try {
      const response = await apiClient.get('/realtime')
      return response
    } catch (error) {
      throw new Error(`获取实时数据失败: ${error.message || error}`)
    }
  }

  // 分析单个交易
  async analyzeTransaction(transactionData) {
    try {
      const response = await apiClient.post('/analyze-transaction', transactionData)
      return response
    } catch (error) {
      throw new Error(`交易分析失败: ${error.message || error}`)
    }
  }

  // 通过交易哈希分析
  async analyzeTransactionByHash(transactionHash) {
    try {
      const response = await apiClient.post('/analyze-transaction', {
        transactionHash: transactionHash
      })
      return response
    } catch (error) {
      throw new Error(`交易分析失败: ${error.message || error}`)
    }
  }

  // 获取分析历史
  async getAnalysisHistory(page = 1, limit = 20, filters = {}) {
    try {
      const params = {
        page,
        limit,
        ...filters
      }
      const response = await apiClient.get('/analysis-history', { params })
      return response
    } catch (error) {
      throw new Error(`获取分析历史失败: ${error.message || error}`)
    }
  }

  // 获取风险统计
  async getRiskStatistics(timeRange = '24h') {
    try {
      const response = await apiClient.get('/risk-statistics', {
        params: { timeRange }
      })
      return response
    } catch (error) {
      throw new Error(`获取风险统计失败: ${error.message || error}`)
    }
  }

  // 获取预警列表
  async getAlerts(page = 1, limit = 20, filters = {}) {
    try {
      const params = {
        page,
        limit,
        ...filters
      }
      const response = await apiClient.get('/alerts', { params })
      return response
    } catch (error) {
      throw new Error(`获取预警列表失败: ${error.message || error}`)
    }
  }

  // 处理预警
  async handleAlert(alertId, action) {
    try {
      const response = await apiClient.post(`/alerts/${alertId}/handle`, action)
      return response
    } catch (error) {
      throw new Error(`处理预警失败: ${error.message || error}`)
    }
  }

  // 获取监控配置
  async getConfig() {
    try {
      const response = await apiClient.get('/config')
      return response
    } catch (error) {
      throw new Error(`获取配置失败: ${error.message || error}`)
    }
  }







  // 获取地址信息
  async getAddressInfo(address) {
    try {
      const response = await apiClient.get(`/address/${address}`)
      return response
    } catch (error) {
      throw new Error(`获取地址信息失败: ${error.message || error}`)
    }
  }

  // 获取网络信息


  // 获取交易详情
  async getTransactionDetails(hash) {
    try {
      const response = await apiClient.get(`/transaction/${hash}`)
      return response
    } catch (error) {
      throw new Error(`获取交易详情失败: ${error.message || error}`)
    }
  }

  // 合约审计
  async auditContract(contractData) {
    try {
      const response = await apiClient.post('/analyze-transaction', {
        ...contractData,
        analysisType: 'audit'
      })
      return response
    } catch (error) {
      throw new Error(`合约审计失败: ${error.message || error}`)
    }
  }

  // 漏洞检测
  async checkVulnerabilities(contractData) {
    try {
      const response = await apiClient.post('/analyze-transaction', {
        ...contractData,
        analysisType: 'vulnerability'
      })
      return response
    } catch (error) {
      throw new Error(`漏洞检测失败: ${error.message || error}`)
    }
  }

  // Gas优化分析
  async optimizeGas(contractData) {
    try {
      const response = await apiClient.post('/analyze-transaction', {
        ...contractData,
        analysisType: 'gas'
      })
      return response
    } catch (error) {
      throw new Error(`Gas优化分析失败: ${error.message || error}`)
    }
  }

  // WebSocket连接管理
  connectWebSocket() {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      try {
        this.websocket = new WebSocket(WS_BASE_URL)

        this.websocket.onopen = () => {
          console.log('WebSocket connection established')
          resolve()
        }

        this.websocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            this.handleWebSocketMessage(data)
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }

        this.websocket.onclose = (event) => {
          console.log('WebSocket connection closed:', event.code, event.reason)
          // 自动重连
          setTimeout(() => {
            console.log('Attempting to reconnect WebSocket...')
            this.connectWebSocket()
          }, 5000)
        }

        this.websocket.onerror = (error) => {
          console.error('WebSocket connection error:', error)
          reject(error)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  // 处理WebSocket消息
  handleWebSocketMessage(data) {
    const { type, data: messageData } = data

    // 触发对应的事件监听器
    if (this.eventListeners.has(type)) {
      const listeners = this.eventListeners.get(type)
      listeners.forEach(callback => {
        try {
          callback(messageData)
        } catch (error) {
          console.error(`Event listener execution failed (${type}):`, error)
        }
      })
    }

    // 处理特定消息类型
    switch (type) {
      case 'status':
        console.log('Service status updated:', messageData)
        break
      case 'risk_alert':
        console.log('Risk alert:', messageData)
        this.handleRiskAlert(messageData)
        break
      case 'analysis_complete':
        console.log('Analysis completed:', messageData)
        break
      case 'monitoring_update':
        console.log('Monitoring update:', messageData)
        break
      case 'pong':
        // 心跳响应
        break
      default:
        console.log('Unknown message type:', type, messageData)
    }
  }

  // 处理风险预警
  handleRiskAlert(alertData) {
    // 可以在这里添加全局的风险预警处理逻辑
    // 比如显示通知、播放声音等
    if (alertData.riskLevel === 'critical' || alertData.riskLevel === 'high') {
      // 高风险预警
      console.warn('High risk alert:', alertData)
    }
  }

  // 添加事件监听器
  addEventListener(eventType, callback) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, [])
    }
    this.eventListeners.get(eventType).push(callback)
  }

  // 移除事件监听器
  removeEventListener(eventType, callback) {
    if (this.eventListeners.has(eventType)) {
      const listeners = this.eventListeners.get(eventType)
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  // 发送WebSocket消息
  sendWebSocketMessage(message) {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket not connected, unable to send message')
    }
  }

  // 发送心跳
  sendHeartbeat() {
    this.sendWebSocketMessage({ type: 'ping' })
  }

  // 订阅事件
  subscribe(channels) {
    this.sendWebSocketMessage({
      type: 'subscribe',
      channels: channels
    })
  }

  // 断开WebSocket连接
  disconnectWebSocket() {
    if (this.websocket) {
      this.websocket.close()
      this.websocket = null
    }
  }

  // 检查服务健康状态
  async checkHealth() {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`)
      return response.data
    } catch (error) {
      throw new Error(`健康检查失败: ${error.message || error}`)
    }
  }
}

// 创建单例实例
const aiMonitoringAPI = new AIMonitoringAPI()

// 导出API实例和相关工具
export { aiMonitoringAPI }
export { apiClient as APIClient }

// 默认导出
export default aiMonitoringAPI