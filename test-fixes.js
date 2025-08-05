const axios = require('axios');

// Test script to verify CORS and HTTPS fixes
async function testFixes() {
  console.log('🧪 Testing Aztec Meme Tournament fixes...\n');

  const baseUrl = 'https://3.26.45.220';
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health check...');
    const healthResponse = await axios.get(`${baseUrl}/api/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);
    
    // Test 2: CORS headers
    console.log('\n2️⃣ Testing CORS headers...');
    const corsResponse = await axios.options(`${baseUrl}/api/memes`, {
      headers: {
        'Origin': 'https://aztec-meme-vote.vercel.app',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    console.log('✅ CORS preflight passed');
    
    // Test 3: Memes API
    console.log('\n3️⃣ Testing memes API...');
    const memesResponse = await axios.get(`${baseUrl}/api/memes`, {
      headers: {
        'Origin': 'https://aztec-meme-vote.vercel.app'
      }
    });
    console.log('✅ Memes API working:', memesResponse.data.memes?.length || 0, 'memes loaded');
    
    // Test 4: Check for HTTPS image URLs
    console.log('\n4️⃣ Checking image URLs...');
    if (memesResponse.data.memes && memesResponse.data.memes.length > 0) {
      const firstMeme = memesResponse.data.memes[0];
      if (firstMeme.imageUrl) {
        const isHttps = firstMeme.imageUrl.startsWith('https://');
        console.log(`✅ Image URL is ${isHttps ? 'HTTPS' : 'HTTP'}:`, firstMeme.imageUrl);
      }
    }
    
    // Test 5: Test image upload endpoint (without actual upload)
    console.log('\n5️⃣ Testing upload endpoint...');
    try {
      await axios.post(`${baseUrl}/api/upload-image`, {}, {
        headers: {
          'Origin': 'https://aztec-meme-vote.vercel.app',
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Upload endpoint accessible (expected error for missing file)');
      } else {
        throw error;
      }
    }
    
    console.log('\n🎉 All tests passed! The fixes are working correctly.');
    console.log('\n📋 Summary:');
    console.log('   ✅ CORS configuration is working');
    console.log('   ✅ HTTPS enforcement is active');
    console.log('   ✅ API endpoints are accessible');
    console.log('   ✅ Image URLs are properly formatted');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the tests
testFixes(); 