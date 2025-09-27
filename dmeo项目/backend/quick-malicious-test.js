const { Web3 } = require('web3');
const web3 = new Web3('http://localhost:8545');

async function quickMaliciousTest() {
  console.log('🎯 快速恶意交易检测测试');
  console.log('=' * 50);
  
  const accounts = await web3.eth.getAccounts();
  console.log(`使用账户: ${accounts[0]} -> ${accounts[1]}`);
  
  // 测试1: 快速连续交易（高频攻击）
  console.log('\n🚨 测试1: 高频交易攻击 (30秒内5笔交易)');
  for (let i = 0; i < 5; i++) {
    try {
      const tx = await web3.eth.sendTransaction({
        from: accounts[0],
        to: accounts[1],
        value: web3.utils.toWei('0.001', 'ether'),
        gas: 21000,
        gasPrice: web3.utils.toWei('20', 'gwei')
      });
      console.log(`✅ 快速交易 ${i + 1}/5: ${tx.transactionHash}`);
      
      // 短间隔，触发高频检测
      if (i < 4) await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      console.error(`❌ 交易 ${i + 1} 失败:`, error.message);
    }
  }
  
  console.log('\n⏰ 等待10秒让AI分析...');
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // 测试2: 大额转账
  console.log('\n🚨 测试2: 异常大额转账');
  try {
    const tx = await web3.eth.sendTransaction({
      from: accounts[0],
      to: accounts[2] || accounts[1],
      value: web3.utils.toWei('15', 'ether'), // 大额转账
      gas: 21000,
      gasPrice: web3.utils.toWei('20', 'gwei')
    });
    console.log(`✅ 大额转账: ${tx.transactionHash} - 金额: 15 ETH`);
  } catch (error) {
    console.error('❌ 大额转账失败:', error.message);
  }
  
  console.log('\n⏰ 等待10秒让AI分析...');
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // 测试3: 异常Gas价格
  console.log('\n🚨 测试3: Gas价格操纵');
  try {
    const tx = await web3.eth.sendTransaction({
      from: accounts[0],
      to: accounts[1],
      value: web3.utils.toWei('0.1', 'ether'),
      gas: 21000,
      gasPrice: web3.utils.toWei('500', 'gwei') // 异常高Gas
    });
    console.log(`✅ 高Gas交易: ${tx.transactionHash} - Gas: 500 Gwei`);
  } catch (error) {
    console.error('❌ 高Gas交易失败:', error.message);
  }
  
  console.log('\n📊 测试完成！请查看AI监控服务日志以确认检测结果');
  console.log('💡 预期结果:');
  console.log('- 高频交易应被检测为风险等级 45+ (频繁交易)');
  console.log('- 大额转账应被检测为风险等级 25+ (大额交易)');
  console.log('- 高Gas交易应被检测为风险等级 25+ (异常Gas价格)');
}

quickMaliciousTest().catch(console.error);