#!/bin/bash

echo "🔍 Testing Vercel CORS on VPS"
echo "============================="

# Update backend first
echo "📥 Updating backend..."
git pull origin main
cd backend
npm install --production
pm2 restart aztec-meme-backend

echo ""
echo "⏳ Waiting for backend to restart..."
sleep 3

echo ""
echo "🔍 Testing CORS with curl..."

# Test health endpoint
echo "1️⃣ Testing health endpoint:"
curl -k -H "Origin: https://aztec-meme-vote-2hmekej7w-tjlane791s-projects.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://3.26.45.220/api/health \
     -v

echo ""
echo "2️⃣ Testing memes endpoint:"
curl -k -H "Origin: https://aztec-meme-vote-2hmekej7w-tjlane791s-projects.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://3.26.45.220/api/memes \
     -v

echo ""
echo "3️⃣ Testing actual GET request:"
curl -k -H "Origin: https://aztec-meme-vote-2hmekej7w-tjlane791s-projects.vercel.app" \
     -H "Content-Type: application/json" \
     https://3.26.45.220/api/memes \
     -v

echo ""
echo "4️⃣ Testing with Node.js debug script:"
cd ..
node debug-vercel-cors.js

echo ""
echo "✅ Test completed!"
echo "Check the output above for CORS headers and errors." 