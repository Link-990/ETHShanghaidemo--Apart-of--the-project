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
  console.log(`响应头: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('API响应:');
      console.log('success:', response.success);
      console.log('data.confidence:', response.data?.confidence);
      console.log('data.comprehensiveConfidence:', response.data?.comprehensiveConfidence);
      console.log('data.confidenceBreakdown:', response.data?.confidenceBreakdown);
      
      if (response.data?.confidenceBreakdown) {
        console.log('confidenceBreakdown.verified_source:', response.data.confidenceBreakdown.verified_source);
        console.log('confidenceBreakdown.test_coverage:', response.data.confidenceBreakdown.test_coverage);
        console.log('confidenceBreakdown.static_analysis_score:', response.data.confidenceBreakdown.static_analysis_score);
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