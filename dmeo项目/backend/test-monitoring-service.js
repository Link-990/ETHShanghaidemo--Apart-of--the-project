const AIMonitoringService = require('./src/services/aiMonitoringService');
require('dotenv').config();

async function testMonitoringService() {
    console.log('🔍 测试AI监控服务...');
    
    try {
        // 创建监控服务实例
        const monitoringService = new AIMonitoringService({
            web3ProviderUrl: process.env.WEB3_PROVIDER_URL
        });
        
        console.log('1. 测试服务初始化...');
        await monitoringService.initialize();
        console.log('✅ 服务初始化成功');
        
        console.log('2. 测试监控状态...');
        const status = monitoringService.getMonitoringStatus();
        console.log('监控状态:', status);
        
        console.log('3. 测试启动监控...');
        const startResult = await monitoringService.startMonitoring({
            addresses: [] // 监控所有地址
        });
        console.log('启动结果:', startResult);
        
        console.log('4. 等待5秒观察监控活动...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        console.log('5. 获取实时数据...');
        const realtimeData = await monitoringService.getRealtimeData();
        console.log('实时数据:', JSON.stringify(realtimeData, null, 2));
        
        console.log('6. 停止监控...');
        const stopResult = monitoringService.stopMonitoring();
        console.log('停止结果:', stopResult);
        
        console.log('✅ 监控服务测试完成');
        
    } catch (error) {
        console.error('❌ 测试失败:', error.message);
        console.error('错误详情:', error);
    }
}

// 运行测试
testMonitoringService();