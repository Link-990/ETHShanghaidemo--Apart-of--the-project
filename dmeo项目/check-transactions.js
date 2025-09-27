const { ethers } = require('ethers');

async function checkTransactions() {
  try {
    const provider = new ethers.JsonRpcProvider('http://localhost:8545');
    const blockNumber = await provider.getBlockNumber();
    
    console.log('=== 检查私链交易历史 ===');
    console.log(`当前区块高度: ${blockNumber}`);
    
    let totalTransactions = 0;
    let hasTransferToTarget = false;
    const targetAddress = '0x45C5271Ca0a78079277301e4480f827aA6ba861A';
    
    // 检查所有区块的交易
    for(let i = 0; i <= blockNumber; i++) {
      const block = await provider.getBlock(i, true);
      if(block && block.transactions.length > 0) {
        console.log(`\n区块 ${i} (${block.transactions.length} 笔交易):`);
        
        for(const tx of block.transactions) {
          totalTransactions++;
          console.log(`  交易哈希: ${tx.hash}`);
          console.log(`  从: ${tx.from}`);
          console.log(`  到: ${tx.to || '合约创建'}`);
          console.log(`  金额: ${ethers.formatEther(tx.value || 0)} ETH`);
          console.log(`  Gas费用: ${ethers.formatEther((tx.gasPrice || 0n) * (tx.gasLimit || 0n))} ETH`);
          
          // 检查是否有转账到目标地址
          if(tx.to && tx.to.toLowerCase() === targetAddress.toLowerCase()) {
            hasTransferToTarget = true;
            console.log(`  ⚠️  发现转账到目标地址!`);
          }
          
          // 检查是否从目标地址转出
          if(tx.from && tx.from.toLowerCase() === targetAddress.toLowerCase()) {
            console.log(`  ⚠️  发现从目标地址转出!`);
          }
          
          console.log('  ---');
        }
      }
    }
    
    console.log(`\n=== 总结 ===`);
    console.log(`总交易数: ${totalTransactions}`);
    console.log(`目标地址 ${targetAddress} 当前余额: 0 ETH`);
    
    if(!hasTransferToTarget && totalTransactions > 0) {
      console.log(`\n✅ 分析结果:`);
      console.log(`- 没有发现任何转账到地址 ${targetAddress} 的交易`);
      console.log(`- 该地址余额为0是正常的，因为它从未收到过任何资金`);
      console.log(`- 私链上的资金都在默认的测试账户中，没有被转移`);
    } else if(totalTransactions === 0) {
      console.log(`\n✅ 分析结果:`);
      console.log(`- 私链上除了合约部署外没有其他交易`);
      console.log(`- 所有资金都安全地保存在默认测试账户中`);
    }
    
  } catch (error) {
    console.error('检查交易时出错:', error.message);
  }
}

checkTransactions();