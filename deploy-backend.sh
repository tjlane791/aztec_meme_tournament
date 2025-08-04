#!/bin/bash

# Deploy Backend to VPS
echo "🚀 Deploying Backend to VPS..."

# Configuration
VPS_IP="3.26.45.220"
VPS_USER="root"  # Sesuaikan dengan username VPS Anda
BACKEND_DIR="/root/aztec-meme-vote/backend"  # Sesuaikan dengan path di VPS

# 1. Copy backend files to VPS
echo "📁 Copying backend files to VPS..."
scp -r backend/* $VPS_USER@$VPS_IP:$BACKEND_DIR/

# 2. SSH into VPS and restart backend
echo "🔄 Restarting backend on VPS..."
ssh $VPS_USER@$VPS_IP << 'EOF'
cd /root/aztec-meme-vote/backend

# Install dependencies if needed
npm install

# Create uploads directory if it doesn't exist
mkdir -p uploads
chmod 755 uploads

# Kill existing process
pkill -f "node server.js" || true

# Start backend with PM2
pm2 delete aztec-meme-backend || true
pm2 start server.js --name "aztec-meme-backend"
pm2 save

# Check if server is running
sleep 3
if curl -f http://localhost:5000/api/memes > /dev/null 2>&1; then
    echo "✅ Backend is running successfully!"
else
    echo "❌ Backend failed to start!"
    pm2 logs aztec-meme-backend --lines 10
fi
EOF

echo "🎉 Deployment completed!"
echo "📊 Check backend status: ssh $VPS_USER@$VPS_IP 'pm2 status'"
echo "📋 Check logs: ssh $VPS_USER@$VPS_IP 'pm2 logs aztec-meme-backend'" 