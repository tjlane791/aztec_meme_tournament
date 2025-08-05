#!/bin/bash

echo "🚀 Backend Deployment Test Script"
echo "=================================="

# Configuration
VPS_IP="3.26.45.220"
VPS_USER="ubuntu"
PROJECT_DIR="/var/www/aztec-meme-vote"

echo "📋 Testing Backend at: $VPS_IP"
echo ""

# Test 1: Check if VPS is accessible
echo "1️⃣ Testing VPS Accessibility..."
if ping -c 1 $VPS_IP > /dev/null 2>&1; then
    echo "✅ VPS is accessible"
else
    echo "❌ VPS is not accessible"
    exit 1
fi

# Test 2: Check if backend is running
echo ""
echo "2️⃣ Testing Backend Service..."
if ssh $VPS_USER@$VPS_IP "pm2 status | grep aztec-meme-backend" > /dev/null 2>&1; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not running"
fi

# Test 3: Check backend logs
echo ""
echo "3️⃣ Checking Backend Logs..."
ssh $VPS_USER@$VPS_IP "pm2 logs aztec-meme-backend --lines 5"

# Test 4: Test HTTP endpoint
echo ""
echo "4️⃣ Testing HTTP Endpoint..."
if curl -s -o /dev/null -w "%{http_code}" http://$VPS_IP/api/memes | grep -q "200"; then
    echo "✅ HTTP endpoint working"
else
    echo "❌ HTTP endpoint not working"
fi

# Test 5: Test HTTPS endpoint (if available)
echo ""
echo "5️⃣ Testing HTTPS Endpoint..."
if curl -s -o /dev/null -w "%{http_code}" -k https://$VPS_IP/api/memes | grep -q "200"; then
    echo "✅ HTTPS endpoint working"
else
    echo "❌ HTTPS endpoint not working"
fi

# Test 6: Check CORS headers
echo ""
echo "6️⃣ Testing CORS Headers..."
CORS_TEST=$(curl -s -I -H "Origin: https://aztec-meme-vote-2hmekej7w-tjlane791s-projects.vercel.app" https://$VPS_IP/api/memes -k 2>/dev/null | grep -i "access-control-allow-origin" || echo "No CORS headers found")

if echo "$CORS_TEST" | grep -q "access-control-allow-origin"; then
    echo "✅ CORS headers present: $CORS_TEST"
else
    echo "❌ CORS headers missing"
fi

echo ""
echo "🎯 Backend Test Complete!"
echo "=========================" 