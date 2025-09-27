import { defineStore } from 'pinia'
import Web3 from 'web3'

export const useWeb3Store = defineStore('web3', {
  state: () => ({
    web3: null,
    account: null,
    networkId: null,
    networkName: '',
    isConnected: false
  }),

  actions: {
    async connectWallet() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // 强制请求权限，即使之前已经连接过
          await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }]
          })
          
          // 然后请求账户
          const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          })
          
          if (!accounts || accounts.length === 0) {
            throw new Error('用户拒绝连接钱包')
          }
          
          this.web3 = new Web3(window.ethereum)
          this.account = accounts[0]
          
          // 获取网络信息
          this.networkId = await this.web3.eth.net.getId()
          this.networkName = this.getNetworkName(this.networkId)
          
          this.isConnected = true
          
          console.log('Wallet connected successfully:', {
            account: this.account,
            networkId: this.networkId,
            networkName: this.networkName,
            web3Ready: !!this.web3
          })
          
          // 监听账户变化
          window.ethereum.on('accountsChanged', this.handleAccountsChanged)
          window.ethereum.on('chainChanged', this.handleChainChanged)
          
        } catch (error) {
          console.error('Failed to connect wallet:', error)
          if (error.code === 4001) {
            throw new Error('用户拒绝连接钱包')
          } else {
            throw new Error('钱包连接失败: ' + (error.message || '未知错误'))
          }
        }
      } else {
        throw new Error('请安装MetaMask钱包')
      }
    },

    async getBalance() {
      try {
        if (!this.web3 || !this.account) {
          console.warn('Web3 or account not available for balance check')
          return '0.0000'
        }
        
        console.log('Getting balance for account:', this.account)
        const balance = await this.web3.eth.getBalance(this.account)
        console.log('Raw balance (wei):', balance)
        
        const etherBalance = this.web3.utils.fromWei(balance, 'ether')
        console.log('Balance in ether:', etherBalance)
        
        // 确保返回格式化的数值字符串，保留4位小数
        const formattedBalance = parseFloat(etherBalance).toFixed(4)
        console.log('Formatted balance:', formattedBalance)
        
        return formattedBalance
      } catch (error) {
        console.error('Error getting balance:', error)
        return '0.0000'
      }
    },

    getNetworkName(networkId) {
      const networks = {
        1: 'Ethereum Mainnet',
        3: 'Ropsten Testnet',
        4: 'Rinkeby Testnet',
        5: 'Goerli Testnet',
        56: 'BSC Mainnet',
        97: 'BSC Testnet',
        137: 'Polygon Mainnet',
        80001: 'Polygon Mumbai'
      }
      return networks[networkId] || `Network ${networkId}`
    },

    handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        this.disconnect()
        // 清理localStorage
        localStorage.removeItem('walletConnected')
        localStorage.removeItem('walletAddress')
      } else {
        this.account = accounts[0]
        // 更新localStorage
        localStorage.setItem('walletConnected', 'true')
        localStorage.setItem('walletAddress', accounts[0])
      }
    },

    handleChainChanged(chainId) {
      window.location.reload()
    },

    disconnect() {
      this.web3 = null
      this.account = null
      this.networkId = null
      this.networkName = ''
      this.isConnected = false
      // 清理localStorage
      localStorage.removeItem('walletConnected')
      localStorage.removeItem('walletAddress')
    }
  }
})