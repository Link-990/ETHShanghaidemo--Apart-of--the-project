const { ethers } = require('ethers');
require('dotenv').config();

async function testHoleskyConnection() {
    try {
        console.log('正在测试Holesky测试网连接...');
        console.log('WEB3_PROVIDER_URL:', process.env.WEB3_PROVIDER_URL);
        console.log('CHAIN_ID:', process.env.CHAIN_ID);
        
        // 创建provider
        const provider = new ethers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL);
        
        // 测试连接
        const network = await provider.getNetwork();
        console.log('网络信息:', {
            name: network.name,
            chainId: network.chainId.toString(),
            ensAddress: network.ensAddress
        });
        
        // 获取最新区块号
        const blockNumber = await provider.getBlockNumber();
        console.log('最新区块号:', blockNumber);
        
        // 获取最新区块信息
        const block = await provider.getBlock('latest');
        console.log('最新区块信息:', {
            number: block.number,
            hash: block.hash,
            timestamp: new Date(block.timestamp * 1000).toISOString(),
            gasLimit: block.gasLimit.toString(),
            gasUsed: block.gasUsed.toString()
        });
        
        console.log('✅ Holesky测试网连接成功！');
        
    } catch (error) {
        console.error('❌ 连接失败:', error.message);
        console.error('错误详情:', error);
    }
}

// 运行测试
testHoleskyConnection();