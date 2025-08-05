#!/bin/bash

echo "🚀 Backend VPS Update Script"
echo "============================"

# Configuration
VPS_IP="3.26.45.220"
VPS_USER="ubuntu"
PROJECT_DIR="/var/www/aztec-meme-vote"

echo "📋 Updating Backend at: $VPS_IP"
echo ""

# Step 1: Pull latest changes
echo "1️⃣ Pulling latest changes..."
ssh $VPS_USER@$VPS_IP << 'EOF'
cd /var/www/aztec-meme-vote
git pull origin main
echo "✅ Git pull completed"
EOF

# Step 2: Install dependencies
echo ""
echo "2️⃣ Installing dependencies..."
ssh $VPS_USER@$VPS_IP << 'EOF'
cd /var/www/aztec-meme-vote/backend
npm install --production
echo "✅ Dependencies installed"
EOF

# Step 3: Restart backend
echo ""
echo "3️⃣ Restarting backend..."
ssh $VPS_USER@$VPS_IP << 'EOF'
pm2 restart aztec-meme-backend
echo "✅ Backend restarted"
EOF

# Step 4: Check status
echo ""
echo "4️⃣ Checking backend status..."
ssh $VPS_USER@$VPS_IP "pm2 status"

# Step 5: Setup HTTPS (if not already done)
echo ""
echo "5️⃣ Setting up HTTPS..."
ssh $VPS_USER@$VPS_IP << 'EOF'
cd /var/www/aztec-meme-vote
if [ ! -f "/etc/ssl/certs/backend-selfsigned.crt" ]; then
    echo "Setting up HTTPS for the first time..."
    chmod +x setup-backend-https.sh
    ./setup-backend-https.sh
else
    echo "HTTPS already configured"
fi
EOF

# Step 6: Test the backend
echo ""
echo "6️⃣ Testing backend..."
echo "Testing HTTP endpoint..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://$VPS_IP/api/memes

echo "Testing HTTPS endpoint..."
curl -s -o /dev/null -w "HTTPS Status: %{http_code}\n" -k https://$VPS_IP/api/memes

echo ""
echo "🎯 Backend Update Complete!"
echo "==========================="
echo ""
echo "📊 Next Steps:"
echo "1. Run: node debug-backend-test.js"
echo "2. Check frontend: https://aztec-meme-vote-2hmekej7w-tjlane791s-projects.vercel.app"
echo "3. If issues persist, check logs: ssh $VPS_USER@$VPS_IP 'pm2 logs aztec-meme-backend'" 