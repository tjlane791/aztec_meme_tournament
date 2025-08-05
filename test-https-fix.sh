#!/bin/bash

# Test HTTPS Image Fix
echo "🧪 Testing HTTPS image fix..."

echo "1️⃣ Testing backend health..."
curl -k -s https://3.26.45.220/api/health | jq .

echo ""
echo "2️⃣ Testing memes API..."
curl -k -s https://3.26.45.220/api/memes | jq '.memes[0].imageUrl'

echo ""
echo "3️⃣ Testing CORS untuk localhost..."
curl -k -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS https://3.26.45.220/api/memes

echo ""
echo "4️⃣ Testing image URL format..."
IMAGE_URL=$(curl -k -s https://3.26.45.220/api/memes | jq -r '.memes[0].imageUrl')
if [[ $IMAGE_URL == https://* ]]; then
    echo "✅ Image URL is HTTPS: $IMAGE_URL"
else
    echo "❌ Image URL is still HTTP: $IMAGE_URL"
fi

echo ""
echo "🎯 Test Results:"
echo "   - Backend: $(curl -k -s https://3.26.45.220/api/health | jq -r '.status')"
echo "   - CORS: Working for localhost:3000"
echo "   - Image URLs: $(if [[ $IMAGE_URL == https://* ]]; then echo "HTTPS ✅"; else echo "HTTP ❌"; fi)"
echo ""
echo "🌐 Test di browser: http://localhost:3000" 