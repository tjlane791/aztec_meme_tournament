const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('🧪 Testing Aztec Meme Tournament API...\n');

  try {
    // Test 1: Get all memes
    console.log('1. Testing GET /api/memes...');
    const memesResponse = await axios.get(`${BASE_URL}/api/memes`);
    console.log(`✅ Success! Found ${memesResponse.data.memes.length} memes`);
    console.log(`   Total votes: ${memesResponse.data.memes.reduce((sum, m) => sum + m.votes, 0)}`);
    console.log('');

    // Test 2: Get eligible addresses
    console.log('2. Testing GET /api/eligible-addresses...');
    const addressesResponse = await axios.get(`${BASE_URL}/api/eligible-addresses`);
    console.log(`✅ Success! Found ${addressesResponse.data.eligibleAddresses.length} eligible addresses`);
    console.log('');

    // Test 3: Check eligibility for a test address
    console.log('3. Testing POST /api/check-eligibility...');
    const testAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
    const eligibilityResponse = await axios.post(`${BASE_URL}/api/check-eligibility`, {
      address: testAddress
    });
    console.log(`✅ Success! Address ${testAddress}:`);
    console.log(`   Can create: ${eligibilityResponse.data.canCreate}`);
    console.log(`   Can vote: ${eligibilityResponse.data.canVote}`);
    console.log(`   Vote count: ${eligibilityResponse.data.voteCount}/${eligibilityResponse.data.voteLimit}`);
    console.log(`   Remaining votes: ${eligibilityResponse.data.remainingVotes}`);
    console.log('');

    // Test 4: Try to vote (should fail without proper voter address)
    console.log('4. Testing POST /api/memes/1/vote...');
    try {
      await axios.post(`${BASE_URL}/api/memes/1/vote`, {
        voterAddress: '0xINVALID_ADDRESS'
      });
    } catch (error) {
      console.log(`✅ Expected error: ${error.response?.data?.error || error.message}`);
    }
    console.log('');

    console.log('🎉 All API tests completed successfully!');
    console.log('\n📱 Frontend should be running at: http://localhost:3000');
    console.log('🔧 Backend API running at: http://localhost:5000');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the backend server is running on port 5000');
    }
  }
}

testAPI(); 