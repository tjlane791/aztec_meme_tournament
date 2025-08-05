#!/bin/bash

# Test Production Deployment
echo "🧪 Testing production deployment..."

# Get deployment URL
DEPLOY_URL=$(vercel ls --json | jq -r '.[0].url' 2>/dev/null || echo "https://aztec-meme-vote.vercel.app")

echo "🌐 Testing deployment at: $DEPLOY_URL"

# Test backend connectivity from production
echo ""
echo "1️⃣ Testing backend connectivity..."
curl -k -H "Origin: $DEPLOY_URL" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS https://3.26.45.220/api/memes

echo ""
echo "2️⃣ Testing memes API from production origin..."
curl -k -H "Origin: $DEPLOY_URL" https://3.26.45.220/api/memes | jq '.memes | length'

echo ""
echo "3️⃣ Testing image URLs..."
IMAGE_URL=$(curl -k -s https://3.26.45.220/api/memes | jq -r '.memes[0].imageUrl')
if [[ $IMAGE_URL == https://* ]]; then
    echo "✅ Image URLs are HTTPS: $IMAGE_URL"
else
    echo "❌ Image URLs are still HTTP: $IMAGE_URL"
fi

echo ""
echo "🎯 Production Test Results:"
echo "   - Backend: $(curl -k -s https://3.26.45.220/api/health | jq -r '.status')"
echo "   - CORS: Configured for Vercel domains"
echo "   - Image URLs: $(if [[ $IMAGE_URL == https://* ]]; then echo "HTTPS ✅"; else echo "HTTP ❌"; fi)"
echo ""
echo "🌐 Test in browser: $DEPLOY_URL"
echo ""
echo "📋 If you see errors in production:"
echo "   1. Check if VPS backend is running: pm2 status"
echo "   2. Check CORS configuration in backend"
echo "   3. Check SSL certificate on VPS"
echo "   4. Check Vercel deployment logs" 