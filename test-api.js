const https = require('https');

const API_BASE = 'https://wnrph10p1c.execute-api.us-east-1.amazonaws.com/Dev';

const endpoints = [
  { path: '/ai/analyze', payload: { text: 'Test message for analysis' } },
  { path: '/ai/translate', payload: { text: 'Hello world', targetLanguage: 'es' } },
  { path: '/ai/polly', payload: { text: 'Test audio', language: 'en' } },
  { path: '/ai/detect-language', payload: { text: 'Hello world test' } }
];

function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const data = JSON.stringify(endpoint.payload);
    const url = new URL(API_BASE + endpoint.path);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          endpoint: endpoint.path,
          status: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 300,
          response: responseData,
          headers: res.headers
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        endpoint: endpoint.path,
        status: 'ERROR',
        success: false,
        error: error.message
      });
    });

    req.write(data);
    req.end();
  });
}

async function testAllEndpoints() {
  console.log('🧪 Testing AWS API Gateway endpoints...\n');
  console.log(`Base URL: ${API_BASE}\n`);
  
  for (const endpoint of endpoints) {
    console.log(`Testing ${endpoint.path}...`);
    const result = await testEndpoint(endpoint);
    
    if (result.success) {
      console.log(`✅ ${result.endpoint} - Status: ${result.status}`);
      console.log(`   Response: ${result.response.substring(0, 100)}${result.response.length > 100 ? '...' : ''}`);
    } else {
      console.log(`❌ ${result.endpoint} - Status: ${result.status}`);
      console.log(`   Error: ${result.error || result.response}`);
    }
    console.log('');
  }
}

testAllEndpoints().catch(console.error);