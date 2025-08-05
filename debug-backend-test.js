#!/usr/bin/env node

const axios = require('axios');
const https = require('https');

console.log('🔍 Backend Debug Test Suite');
console.log('============================\n');

const BACKEND_URL = 'https://3.26.45.220';
const TEST_ORIGINS = [
  'https://aztec-meme-vote-2hmekej7w-tjlane791s-projects.vercel.app',
  'https://*.vercel.app',
  'http://localhost:3000'
];

// Test 1: Check if backend is accessible
async function testBackendAccess() {
  console.log('1️⃣ Testing Backend Access...');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/memes`, {
      timeout: 5000,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false // Allow self-signed certificates
      })
    });
    console.log('✅ Backend accessible:', response.status);
    console.log('📊 Memes count:', response.data.memes?.length || 0);
    return true;
  } catch (error) {
    console.log('❌ Backend not accessible:', error.message);
    return false;
  }
}

// Test 2: Test CORS headers
async function testCORSHeaders() {
  console.log('\n2️⃣ Testing CORS Headers...');
  
  for (const origin of TEST_ORIGINS) {
    try {
      const response = await axios.options(`${BACKEND_URL}/api/memes`, {
        headers: {
          'Origin': origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        },
        timeout: 5000,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });
      
      const corsHeaders = {
        'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
        'Access-Control-Allow-Methods': response.headers['access-control-allow-methods'],
        'Access-Control-Allow-Headers': response.headers['access-control-allow-headers']
      };
      
      console.log(`✅ CORS for ${origin}:`, corsHeaders);
    } catch (error) {
      console.log(`❌ CORS failed for ${origin}:`, error.message);
    }
  }
}

// Test 3: Test actual API call with CORS
async function testAPICallWithCORS() {
  console.log('\n3️⃣ Testing API Call with CORS...');
  
  for (const origin of TEST_ORIGINS) {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/memes`, {
        headers: {
          'Origin': origin
        },
        timeout: 5000,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });
      
      console.log(`✅ API call from ${origin}: Success`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Data: ${JSON.stringify(response.data).substring(0, 100)}...`);
    } catch (error) {
      console.log(`❌ API call from ${origin} failed:`, error.message);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Headers:`, error.response.headers);
      }
    }
  }
}

// Test 4: Test SSL Certificate
async function testSSLCertificate() {
  console.log('\n4️⃣ Testing SSL Certificate...');
  
  try {
    const response = await axios.get(`${BACKEND_URL}/api/memes`, {
      timeout: 5000,
      httpsAgent: new https.Agent({
        rejectUnauthorized: true // Test with strict SSL
      })
    });
    console.log('✅ SSL Certificate is valid');
  } catch (error) {
    if (error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' || 
        error.code === 'CERT_SIGNATURE_FAILURE') {
      console.log('⚠️ SSL Certificate is self-signed (expected for development)');
    } else {
      console.log('❌ SSL Certificate error:', error.message);
    }
  }
}

// Test 5: Test image upload endpoint
async function testImageUpload() {
  console.log('\n5️⃣ Testing Image Upload Endpoint...');
  
  try {
    const response = await axios.post(`${BACKEND_URL}/api/upload-image`, {}, {
      timeout: 5000,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    });
    console.log('✅ Upload endpoint accessible');
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Upload endpoint accessible (400 expected - no file provided)');
    } else {
      console.log('❌ Upload endpoint error:', error.message);
    }
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Backend Debug Tests...\n');
  
  const tests = [
    testBackendAccess,
    testCORSHeaders,
    testAPICallWithCORS,
    testSSLCertificate,
    testImageUpload
  ];
  
  for (const test of tests) {
    try {
      await test();
    } catch (error) {
      console.log('❌ Test failed:', error.message);
    }
  }
  
  console.log('\n🎯 Debug Test Complete!');
  console.log('========================');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testBackendAccess,
  testCORSHeaders,
  testAPICallWithCORS,
  testSSLCertificate,
  testImageUpload,
  runAllTests
}; 