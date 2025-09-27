const http = require('http');

const postData = JSON.stringify({
  contractAddress: '0x1234567890123456789012345678901234567890'
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/risk-analysis/analyze-contract',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('完整API响应:');
      console.log(JSON.stringify(response, null, 2));
      
      console.log('\n=== 关键字段检查 ===');
      console.log('success:', response.success);
      console.log('data存在:', !!response.data);
      
      if (response.data) {
        console.log('\n=== data字段内容 ===');
        console.log('riskScore:', response.data.riskScore);
        console.log('riskLevel:', response.data.riskLevel);
        console.log('confidence:', response.data.confidence);
        console.log('comprehensiveConfidence:', response.data.comprehensiveConfidence);
        console.log('confidenceBreakdown:', response.data.confidenceBreakdown);
        
        console.log('\n=== 所有data字段 ===');
        Object.keys(response.data).forEach(key => {
          console.log(`${key}:`, typeof response.data[key], response.data[key]);
        });
      }
    } catch (error) {
      console.log('响应不是JSON格式:');
      console.log(data);
    }
  });
});

req.on('error', (e) => {
  console.error(`请求遇到问题: ${e.message}`);
});

req.write(postData);
req.end();