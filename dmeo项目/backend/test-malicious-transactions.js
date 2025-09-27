const { Web3 } = require('web3');

// 连接到本地私链
const web3 = new Web3('http://localhost:8545');

// 恶意交易模拟器
class MaliciousTransactionSimulator {
    constructor() {
        this.accounts = [];
        this.maliciousPatterns = {
            // 1. 高频交易攻击 - 短时间内大量交易
            highFrequency: {
                name: '高频交易攻击',
                description: '在短时间内发送大量小额交易，可能是DDoS攻击或网络拥堵攻击',
                riskScore: 85
            },
            // 2. 异常大额转账
            largeAmount: {
                name: '异常大额转账',
                description: '单笔交易金额异常巨大，可能是资金盗取或洗钱行为',
                riskScore: 90
            },
            // 3. 可疑时间模式
            suspiciousTime: {
                name: '可疑时间交易',
                description: '在非正常时间（如深夜）进行大量交易，可能是自动化攻击',
                riskScore: 75
            },
            // 4. 循环转账模式
            circularTransfer: {
                name: '循环转账洗钱',
                description: '资金在多个账户间循环转移，典型的洗钱行为',
                riskScore: 95
            },
            // 5. Gas价格异常
            abnormalGas: {
                name: 'Gas价格操纵',
                description: '使用异常高的Gas价格，可能是抢跑交易或MEV攻击',
                riskScore: 80
            }
        };
    }

    async initialize() {
        console.log('🔧 初始化恶意交易模拟器...');
        this.accounts = await web3.eth.getAccounts();
        console.log(`✅ 获取到 ${this.accounts.length} 个账户`);
        
        // 显示账户余额
        for (let i = 0; i < Math.min(5, this.accounts.length); i++) {
            const balance = await web3.eth.getBalance(this.accounts[i]);
            console.log(`账户 ${i}: ${this.accounts[i]} - 余额: ${web3.utils.fromWei(balance, 'ether')} ETH`);
        }
    }

    // 1. 高频交易攻击模拟
    async simulateHighFrequencyAttack() {
        console.log('\n🚨 开始模拟: 高频交易攻击');
        console.log('描述: 在30秒内发送10笔快速交易');
        
        const pattern = this.maliciousPatterns.highFrequency;
        const transactions = [];
        
        for (let i = 0; i < 10; i++) {
            try {
                const tx = await web3.eth.sendTransaction({
                    from: this.accounts[0],
                    to: this.accounts[1],
                    value: web3.utils.toWei('0.001', 'ether'),
                    gas: 21000,
                    gasPrice: web3.utils.toWei('20', 'gwei')
                });
                
                transactions.push({
                    hash: tx.transactionHash,
                    pattern: pattern.name,
                    riskScore: pattern.riskScore,
                    timestamp: Date.now()
                });
                
                console.log(`✅ 高频交易 ${i + 1}/10: ${tx.transactionHash}`);
                
                // 短暂延迟模拟高频
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error) {
                console.error(`❌ 高频交易 ${i + 1} 失败:`, error.message);
            }
        }
        
        return transactions;
    }

    // 2. 异常大额转账模拟
    async simulateLargeAmountTransfer() {
        console.log('\n🚨 开始模拟: 异常大额转账');
        console.log('描述: 发送一笔异常大额的转账交易');
        
        const pattern = this.maliciousPatterns.largeAmount;
        
        try {
            const tx = await web3.eth.sendTransaction({
                from: this.accounts[0],
                to: this.accounts[2],
                value: web3.utils.toWei('50', 'ether'), // 大额转账
                gas: 21000,
                gasPrice: web3.utils.toWei('20', 'gwei')
            });
            
            console.log(`✅ 大额转账: ${tx.transactionHash} - 金额: 50 ETH`);
            
            return [{
                hash: tx.transactionHash,
                pattern: pattern.name,
                riskScore: pattern.riskScore,
                amount: '50 ETH',
                timestamp: Date.now()
            }];
        } catch (error) {
            console.error('❌ 大额转账失败:', error.message);
            return [];
        }
    }

    // 3. 循环转账洗钱模拟
    async simulateCircularTransfer() {
        console.log('\n🚨 开始模拟: 循环转账洗钱');
        console.log('描述: 资金在多个账户间循环转移');
        
        const pattern = this.maliciousPatterns.circularTransfer;
        const transactions = [];
        const amount = web3.utils.toWei('1', 'ether');
        
        // 创建循环: A -> B -> C -> A
        const transferChain = [
            { from: this.accounts[0], to: this.accounts[1] },
            { from: this.accounts[1], to: this.accounts[2] },
            { from: this.accounts[2], to: this.accounts[0] }
        ];
        
        for (let i = 0; i < transferChain.length; i++) {
            try {
                const transfer = transferChain[i];
                const tx = await web3.eth.sendTransaction({
                    from: transfer.from,
                    to: transfer.to,
                    value: amount,
                    gas: 21000,
                    gasPrice: web3.utils.toWei('20', 'gwei')
                });
                
                transactions.push({
                    hash: tx.transactionHash,
                    pattern: pattern.name,
                    riskScore: pattern.riskScore,
                    step: i + 1,
                    from: transfer.from,
                    to: transfer.to,
                    timestamp: Date.now()
                });
                
                console.log(`✅ 循环转账 ${i + 1}/3: ${tx.transactionHash}`);
                
                // 延迟以模拟洗钱间隔
                await new Promise(resolve => setTimeout(resolve, 3000));
            } catch (error) {
                console.error(`❌ 循环转账 ${i + 1} 失败:`, error.message);
            }
        }
        
        return transactions;
    }

    // 4. Gas价格操纵模拟
    async simulateGasManipulation() {
        console.log('\n🚨 开始模拟: Gas价格操纵攻击');
        console.log('描述: 使用异常高的Gas价格进行交易');
        
        const pattern = this.maliciousPatterns.abnormalGas;
        
        try {
            const tx = await web3.eth.sendTransaction({
                from: this.accounts[0],
                to: this.accounts[3],
                value: web3.utils.toWei('0.1', 'ether'),
                gas: 21000,
                gasPrice: web3.utils.toWei('1000', 'gwei') // 异常高的Gas价格
            });
            
            console.log(`✅ Gas操纵交易: ${tx.transactionHash} - Gas价格: 1000 Gwei`);
            
            return [{
                hash: tx.transactionHash,
                pattern: pattern.name,
                riskScore: pattern.riskScore,
                gasPrice: '1000 Gwei',
                timestamp: Date.now()
            }];
        } catch (error) {
            console.error('❌ Gas操纵交易失败:', error.message);
            return [];
        }
    }

    // 运行完整的恶意交易测试套件
    async runMaliciousTestSuite() {
        console.log('🎯 开始运行恶意交易检测测试套件');
        console.log('=' * 60);
        
        await this.initialize();
        
        const allTransactions = [];
        
        // 1. 高频交易攻击
        const highFreqTxs = await this.simulateHighFrequencyAttack();
        allTransactions.push(...highFreqTxs);
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // 2. 异常大额转账
        const largeTxs = await this.simulateLargeAmountTransfer();
        allTransactions.push(...largeTxs);
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // 3. 循环转账洗钱
        const circularTxs = await this.simulateCircularTransfer();
        allTransactions.push(...circularTxs);
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // 4. Gas价格操纵
        const gasTxs = await this.simulateGasManipulation();
        allTransactions.push(...gasTxs);
        
        // 总结报告
        console.log('\n📊 恶意交易测试总结');
        console.log('=' * 60);
        console.log(`总共发送了 ${allTransactions.length} 笔恶意交易`);
        
        const patternCounts = {};
        allTransactions.forEach(tx => {
            patternCounts[tx.pattern] = (patternCounts[tx.pattern] || 0) + 1;
        });
        
        Object.entries(patternCounts).forEach(([pattern, count]) => {
            console.log(`- ${pattern}: ${count} 笔`);
        });
        
        console.log('\n⏰ 请等待AI监控服务检测和分析这些恶意交易...');
        console.log('💡 你可以通过以下方式查看检测结果:');
        console.log('1. 查看后端服务器日志');
        console.log('2. 访问前端界面查看风险分析结果');
        console.log('3. 调用 /api/ai-monitoring/status 查看服务状态');
        
        return allTransactions;
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    const simulator = new MaliciousTransactionSimulator();
    simulator.runMaliciousTestSuite()
        .then(transactions => {
            console.log(`\n✅ 恶意交易测试完成，共发送 ${transactions.length} 笔交易`);
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ 恶意交易测试失败:', error);
            process.exit(1);
        });
}

module.exports = MaliciousTransactionSimulator;