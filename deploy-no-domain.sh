#!/bin/bash

echo "🚀 Deploying Aztec Meme Tournament to VPS (No Domain)..."

# Configuration
PROJECT_DIR="/var/www/aztec-meme-vote"
VPS_IP="3.26.45.220"

# Update system
echo "📦 Updating system..."
sudo apt update
sudo apt upgrade -y

# Install Node.js
echo "📦 Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2
echo "📦 Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

# Install Nginx
echo "📦 Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo apt install nginx -y
    sudo systemctl enable nginx
    sudo systemctl start nginx
fi

# Create project directory
echo "📁 Creating project directory..."
sudo mkdir -p $PROJECT_DIR
sudo chown $USER:$USER $PROJECT_DIR

# Copy project files (assuming you're running this from project root)
echo "📁 Copying project files..."
cp -r . $PROJECT_DIR/

# Setup Backend
echo "🔧 Setting up Backend..."
cd $PROJECT_DIR/backend

# Install backend dependencies
npm install --production

# Create PM2 ecosystem config
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'aztec-meme-backend',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Create necessary directories
mkdir -p logs uploads data
chmod 755 uploads

# Start backend with PM2
echo "🚀 Starting backend..."
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# Setup Frontend
echo "🔧 Setting up Frontend..."
cd $PROJECT_DIR/frontend

# Install frontend dependencies
npm install

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Create Nginx configuration for IP address
echo "🌐 Setting up Nginx..."
sudo tee /etc/nginx/sites-available/aztec-meme-vote > /dev/null << EOF
server {
    listen 80;
    server_name $VPS_IP _;

    # Frontend (React build)
    location / {
        root $PROJECT_DIR/frontend/build;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Uploads
    location /uploads/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # File upload size
    client_max_body_size 10M;
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/aztec-meme-vote /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

echo "✅ Deployment completed!"
echo "🌐 Frontend: http://$VPS_IP"
echo "🔧 Backend API: http://$VPS_IP/api"
echo "📊 PM2 status: pm2 status"
echo "📝 Backend logs: pm2 logs aztec-meme-backend"
echo "📝 Nginx logs: sudo tail -f /var/log/nginx/access.log"
echo ""
echo "⚠️ Note: This is HTTP only. For production, consider getting a domain and SSL certificate." 