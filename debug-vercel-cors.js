const axios = require('axios');
const https = require('https');

// Disable SSL verification for self-signed certificates
const agent = new https.Agent({
  rejectUnauthorized: false
});

const VERCEL_DOMAIN = 'https://aztec-meme-vote-2hmekej7w-tjlane791s-projects.vercel.app';
const BACKEND_URL = 'https://3.26.45.220';

console.log('🔍 Vercel CORS Debug Tool');
console.log('========================');
console.log(`Frontend: ${VERCEL_DOMAIN}`);
console.log(`Backend: ${BACKEND_URL}`);
console.log('');

async function testCORS() {
  try {
    console.log('1️⃣ Testing CORS headers...');
    
    // Test OPTIONS request (preflight)
    const optionsResponse = await axios({
      method: 'OPTIONS',
      url: `${BACKEND_URL}/api/memes`,
      headers: {
        'Origin': VERCEL_DOMAIN,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      },
      httpsAgent: agent,
      timeout: 10000
    });
    
    console.log('✅ OPTIONS request successful');
    console.log('CORS Headers:');
    console.log('- Access-Control-Allow-Origin:', optionsResponse.headers['access-control-allow-origin']);
    console.log('- Access-Control-Allow-Methods:', optionsResponse.headers['access-control-allow-methods']);
    console.log('- Access-Control-Allow-Headers:', optionsResponse.headers['access-control-allow-headers']);
    console.log('');
    
  } catch (error) {
    console.log('❌ OPTIONS request failed:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Headers:', error.response.headers);
    }
    console.log('');
  }
}

async function testActualRequest() {
  try {
    console.log('2️⃣ Testing actual GET request...');
    
    const response = await axios({
      method: 'GET',
      url: `${BACKEND_URL}/api/memes`,
      headers: {
        'Origin': VERCEL_DOMAIN,
        'Content-Type': 'application/json'
      },
      httpsAgent: agent,
      timeout: 10000
    });
    
    console.log('✅ GET request successful');
    console.log('Status:', response.status);
    console.log('CORS Headers:');
    console.log('- Access-Control-Allow-Origin:', response.headers['access-control-allow-origin']);
    console.log('- Access-Control-Allow-Credentials:', response.headers['access-control-allow-credentials']);
    console.log('Data length:', response.data ? response.data.length : 'No data');
    console.log('');
    
  } catch (error) {
    console.log('❌ GET request failed:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Headers:', error.response.headers);
      console.log('Data:', error.response.data);
    }
    console.log('');
  }
}

async function testBackendStatus() {
  try {
    console.log('3️⃣ Testing backend status...');
    
    const response = await axios({
      method: 'GET',
      url: `${BACKEND_URL}/api/health`,
      httpsAgent: agent,
      timeout: 5000
    });
    
    console.log('✅ Backend is running');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    console.log('');
    
  } catch (error) {
    console.log('❌ Backend status check failed:', error.message);
    console.log('');
  }
}

async function testSSL() {
  try {
    console.log('4️⃣ Testing SSL certificate...');
    
    const response = await axios({
      method: 'GET',
      url: `${BACKEND_URL}/api/memes`,
      timeout: 5000
    });
    
    console.log('✅ SSL certificate is valid');
    console.log('');
    
  } catch (error) {
    if (error.code === 'CERT_SELF_SIGNED') {
      console.log('⚠️  Self-signed certificate detected (this is expected)');
      console.log('Frontend needs to handle this properly');
      console.log('');
    } else {
      console.log('❌ SSL test failed:', error.message);
      console.log('');
    }
  }
}

async function runAllTests() {
  await testBackendStatus();
  await testSSL();
  await testCORS();
  await testActualRequest();
  
  console.log('🎯 Summary:');
  console.log('If you see CORS errors above, the backend needs to be updated.');
  console.log('If SSL errors, the frontend needs to handle self-signed certificates.');
  console.log('Run: ./quick-update.sh on VPS to update backend');
}

runAllTests().catch(console.error); 