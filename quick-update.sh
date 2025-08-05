#!/bin/bash

echo "🚀 Quick Backend Update"
echo "======================="

# Update backend
echo "📥 Pulling changes..."
git pull origin main

echo "📦 Installing dependencies..."
cd backend
npm install --production

echo "🔄 Restarting backend..."
pm2 restart aztec-meme-backend

echo "📊 Checking status..."
pm2 status

echo "✅ Done! Backend updated!" 