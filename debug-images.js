const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const BACKEND_URL = 'http://3.26.45.220:5000'; // Sesuaikan dengan IP VPS Anda
const UPLOADS_DIR = path.join(__dirname, 'backend', 'uploads');

async function debugImages() {
  console.log('🔍 Debugging Image Issues...\n');

  // 1. Check if uploads directory exists
  console.log('1. Checking uploads directory...');
  if (fs.existsSync(UPLOADS_DIR)) {
    const files = fs.readdirSync(UPLOADS_DIR);
    console.log(`✅ Uploads directory exists with ${files.length} files:`);
    files.forEach(file => {
      const filePath = path.join(UPLOADS_DIR, file);
      const stats = fs.statSync(filePath);
      console.log(`   - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
    });
  } else {
    console.log('❌ Uploads directory not found!');
  }

  // 2. Test backend API
  console.log('\n2. Testing backend API...');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/memes`);
    console.log('✅ Backend API is accessible');
    console.log(`   Found ${response.data.memes.length} memes`);
    
    // Check image URLs
    response.data.memes.forEach((meme, index) => {
      console.log(`   Meme ${index + 1}: ${meme.title}`);
      console.log(`   Image URL: ${meme.imageUrl}`);
    });
  } catch (error) {
    console.log('❌ Backend API error:', error.message);
  }

  // 3. Test image accessibility
  console.log('\n3. Testing image accessibility...');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/memes`);
    for (const meme of response.data.memes) {
      try {
        const imageResponse = await axios.get(meme.imageUrl, { 
          timeout: 5000,
          responseType: 'arraybuffer'
        });
        console.log(`✅ Image accessible: ${meme.imageUrl} (${imageResponse.data.length} bytes)`);
      } catch (imgError) {
        console.log(`❌ Image not accessible: ${meme.imageUrl}`);
        console.log(`   Error: ${imgError.message}`);
      }
    }
  } catch (error) {
    console.log('❌ Error testing images:', error.message);
  }

  // 4. Test upload endpoint
  console.log('\n4. Testing upload endpoint...');
  try {
    const testResponse = await axios.post(`${BACKEND_URL}/api/check-eligibility`, {
      address: '0x1234567890123456789012345678901234567890'
    });
    console.log('✅ Upload endpoint is accessible');
  } catch (error) {
    console.log('❌ Upload endpoint error:', error.message);
  }

  console.log('\n🎯 Debug Summary:');
  console.log('- Check if backend is running on VPS');
  console.log('- Verify CORS settings');
  console.log('- Check firewall settings');
  console.log('- Ensure uploads directory has proper permissions');
}

debugImages().catch(console.error); 