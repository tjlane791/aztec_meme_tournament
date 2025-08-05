#!/bin/bash

# Test Frontend di Localhost dengan Backend VPS
echo "🧪 Testing frontend di localhost dengan backend VPS..."

# 1. Test backend API dulu
echo "1️⃣ Testing backend API..."
curl -s https://3.26.45.220/api/health | jq .

# 2. Test CORS dengan localhost
echo ""
echo "2️⃣ Testing CORS untuk localhost..."
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS https://3.26.45.220/api/memes

# 3. Test memes API
echo ""
echo "3️⃣ Testing memes API..."
curl -s https://3.26.45.220/api/memes | jq '.memes | length'

# 4. Start frontend di localhost
echo ""
echo "4️⃣ Starting frontend di localhost..."
echo "   Frontend akan berjalan di: http://localhost:3000"
echo "   Backend API: https://3.26.45.220"
echo ""
echo "   Untuk test:"
echo "   1. Buka browser ke http://localhost:3000"
echo "   2. Buka Developer Tools (F12)"
echo "   3. Cek Console untuk error CORS"
echo "   4. Test connect wallet dan load memes"
echo "   5. Test upload gambar dan create meme"

# 5. Start frontend
cd frontend
npm start 