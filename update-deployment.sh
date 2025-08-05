#!/bin/bash

echo "🔄 Updating Aztec Meme Tournament deployment..."

# Configuration
PROJECT_DIR="/var/www/aztec-meme-vote"

# Update backend
echo "🔧 Updating backend..."
cd $PROJECT_DIR/backend

# Pull latest changes (if using git)
# git pull origin main

# Install dependencies
npm install --production

# Restart backend
pm2 restart aztec-meme-backend

# Update frontend
echo "🔧 Updating frontend..."
cd $PROJECT_DIR/frontend

# Install dependencies
npm install

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Reload nginx
echo "🌐 Reloading nginx..."
sudo systemctl reload nginx

echo "✅ Update completed!"
echo "📊 Check status: pm2 status"
echo "📝 Check logs: pm2 logs aztec-meme-backend" 