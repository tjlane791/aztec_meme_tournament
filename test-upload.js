const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';

async function testUpload() {
  console.log('🧪 Testing File Upload Functionality');
  console.log('=====================================');

  try {
    // Test 1: Upload a test image
    console.log('1. Testing file upload...');
    
    // Create a simple test image (1x1 pixel PNG)
    const testImagePath = path.join(__dirname, 'test-image.png');
    
    // Create a minimal PNG file for testing
    const pngHeader = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
      0x49, 0x48, 0x44, 0x52, // IHDR
      0x00, 0x00, 0x00, 0x01, // width: 1
      0x00, 0x00, 0x00, 0x01, // height: 1
      0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, etc.
      0x91, 0x77, 0x53, 0xDE, // CRC
      0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
      0x49, 0x44, 0x41, 0x54, // IDAT
      0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // compressed data
      0x00, 0x00, 0x00, 0x00, // IEND chunk length
      0x49, 0x45, 0x4E, 0x44, // IEND
      0xAE, 0x42, 0x60, 0x82  // CRC
    ]);
    
    fs.writeFileSync(testImagePath, pngHeader);
    
    const formData = new FormData();
    formData.append('image', fs.createReadStream(testImagePath));
    
    const uploadResponse = await axios.post(`${BASE_URL}/api/upload-image`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    console.log('✅ Upload successful!');
    console.log(`   Image URL: ${uploadResponse.data.imageUrl}`);
    console.log(`   Filename: ${uploadResponse.data.filename}`);
    console.log('');
    
    // Test 2: Create meme with uploaded image
    console.log('2. Testing meme creation with uploaded image...');
    
    const createMemeResponse = await axios.post(`${BASE_URL}/api/memes`, {
      title: 'Test Meme with Upload',
      description: 'This meme was created using file upload',
      imageUrl: uploadResponse.data.imageUrl,
      creatorAddress: '0xeeccbc7c0dc6753747cd256f2bb3f1816f6ec359' // Eligible address from the list
    });
    
    console.log('✅ Meme created successfully!');
    console.log(`   Meme ID: ${createMemeResponse.data.meme.id}`);
    console.log(`   Title: ${createMemeResponse.data.meme.title}`);
    console.log('');
    
    // Test 3: Verify meme appears in list
    console.log('3. Testing meme retrieval...');
    
    const memesResponse = await axios.get(`${BASE_URL}/api/memes`);
    const testMeme = memesResponse.data.memes.find(m => m.id === createMemeResponse.data.meme.id);
    
    if (testMeme) {
      console.log('✅ Meme found in list!');
      console.log(`   Votes: ${testMeme.votes}`);
      console.log(`   Vote Percentage: ${testMeme.votePercentage}%`);
    } else {
      console.log('❌ Meme not found in list');
    }
    
    // Clean up test file
    fs.unlinkSync(testImagePath);
    console.log('🧹 Cleaned up test file');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.error || error.message);
  }
}

testUpload(); 