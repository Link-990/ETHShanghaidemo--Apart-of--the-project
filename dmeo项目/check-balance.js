const { ethers } = require('ethers');

async function checkBalances() {
  try {
    const provider = new ethers.JsonRpcProvider('http://localhost:8545');
    
    // 检查指定地址
    const targetAddress = '0x45C5271Ca0a78079277301e4480f827aA6ba861A';
    console.log('=== 检查指定地址余额 ===');
    const targetBalance = await provider.getBalance(targetAddress);
    console.log(`地址: ${targetAddress}`);
    console.log(`余额: ${ethers.formatEther(targetBalance)} ETH`);
    
    console.log('\n=== 检查私链默认账户余额 ===');
    
    // 从hardhat配置获取默认账户
    const mnemonic = "test test test test test test test test test test test junk";
    const wallet = ethers.Wallet.fromPhrase(mnemonic);
    
    // 检查前10个账户
    for (let i = 0; i < 10; i++) {
      const derivedWallet = ethers.HDNodeWallet.fromPhrase(mnemonic, undefined, `m/44'/60'/0'/0/${i}`);
      const balance = await provider.getBalance(derivedWallet.address);
      console.log(`账户 ${i}: ${derivedWallet.address} - 余额: ${ethers.formatEther(balance)} ETH`);
    }
    
    // 检查网络信息
    console.log('\n=== 网络信息 ===');
    const network = await provider.getNetwork();
    console.log(`Chain ID: ${network.chainId}`);
    console.log(`Network Name: ${network.name}`);
    
    const blockNumber = await provider.getBlockNumber();
    console.log(`当前区块高度: ${blockNumber}`);
    
  } catch (error) {
    console.error('检查余额时出错:', error.message);
  }
}

checkBalances();