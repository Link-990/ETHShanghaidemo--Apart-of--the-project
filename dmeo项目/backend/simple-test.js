const { Web3 } = require('web3');
const web3 = new Web3('http://localhost:8545');

async function testHighFrequency() {
  console.log('🚨 开始高频交易攻击测试...');
  const accounts = await web3.eth.getAccounts();
  
  for (let i = 0; i < 6; i++) {
    try {
      const tx = await web3.eth.sendTransaction({
        from: accounts[0],
        to: accounts[1],
        value: web3.utils.toWei('0.001', 'ether'),
        gas: 21000
      });
      console.log(`✅ 高频交易 ${i + 1}/6: ${tx.transactionHash}`);
      await new Promise(resolve => setTimeout(resolve, 8000)); // 8秒间隔
    } catch (error) {
      console.error(`❌ 交易 ${i + 1} 失败:`, error.message);
    }
  }
  console.log('⏰ 等待AI监控服务分析...');
}

testHighFrequency().catch(console.error);