# 🚀 Deployment Guide - Aztec Meme Tournament

## 📋 Prerequisites
- Node.js 16+ 
- npm/yarn
- Vercel account
- Backend server (deployed separately)

## 🎯 Frontend Deployment (Vercel)

### 1. **Prepare for Deployment**
```bash
cd frontend
npm install
npm run build
```

### 2. **Environment Variables**
Set these in Vercel dashboard:
- `REACT_APP_API_URL` = Your backend URL
- `REACT_APP_NETWORK_ID` = 1 (for Ethereum mainnet)
- `REACT_APP_CHAIN_ID` = 0x1

### 3. **Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 4. **Update vercel.json**
Replace `https://your-backend-url.com` with your actual backend URL in `frontend/vercel.json`.

## 🔧 Backend Deployment

### Option 1: Railway/Render
- Upload backend folder
- Set environment variables
- Deploy

### Option 2: VPS
- Upload to server
- Install dependencies
- Run with PM2

## ⚡ Performance Optimizations

### ✅ Already Implemented:
- ✅ Lazy loading for background animation
- ✅ Image optimization with `willChange` and `backfaceVisibility`
- ✅ CSS animations with hardware acceleration
- ✅ Static asset caching headers
- ✅ React production build

### 🚀 Additional Optimizations:
- Image compression (WebP format)
- Code splitting
- Service worker for caching
- CDN for static assets

## 🔍 Testing Before Deploy

### 1. **Local Build Test**
```bash
cd frontend
npm run build
npm run test
```

### 2. **Performance Check**
- Lighthouse score should be >90
- First Contentful Paint <1.5s
- Largest Contentful Paint <2.5s

### 3. **Functionality Test**
- ✅ Wallet connection
- ✅ Meme creation
- ✅ Voting system
- ✅ Background animation
- ✅ Responsive design

## 📊 Monitoring

### Vercel Analytics
- Enable in Vercel dashboard
- Monitor Core Web Vitals
- Track user interactions

### Error Tracking
- Consider adding Sentry for error monitoring
- Monitor API response times

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🎯 Final Checklist

- [ ] Environment variables set
- [ ] Backend URL updated in vercel.json
- [ ] Build successful locally
- [ ] All images optimized
- [ ] Performance score >90
- [ ] Mobile responsive tested
- [ ] Wallet connection tested
- [ ] Voting system tested
- [ ] Background animation working

## 🚀 Ready to Deploy!

Your app is now optimized and ready for Vercel deployment! 

### **3. Buat Deployment Script untuk VPS**
```bash
# Buat deploy.sh
cat > deploy.sh << 'EOF'
#!/bin/bash

echo "🚀 Deploying Aztec Meme Tournament Backend..."

# Update system
sudo apt update

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    echo " Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    sudo npm install -g pm2
fi

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    sudo apt install nginx -y
    sudo systemctl enable nginx
    sudo systemctl start nginx
fi

# Create directory
sudo mkdir -p /var/www/aztec-meme-backend
sudo chown $USER:$USER /var/www/aztec-meme-backend

# Clone or pull from GitHub
if [ -d "/var/www/aztec-meme-backend/.git" ]; then
    echo "📥 Pulling latest changes..."
    cd /var/www/aztec-meme-backend
    git pull origin main
else
    echo "📥 Cloning from GitHub..."
    git clone https://github.com/username/aztec-meme-tournament.git /var/www/aztec-meme-backend
    cd /var/www/aztec-meme-backend
fi

# Install backend dependencies
echo " Installing backend dependencies..."
cd backend
npm install --production

# Create PM2 config
cat > ecosystem.config.js << 'PM2EOF'
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
PM2EOF

# Create logs directory
mkdir -p logs

# Create uploads directory
mkdir -p uploads

# Start with PM2
echo "🚀 Starting backend with PM2..."
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# Setup Nginx
echo "🌐 Setting up Nginx..."
sudo tee /etc/nginx/sites-available/aztec-meme-backend > /dev/null << 'NGINXEOF'
server {
    listen 80;
    server_name _;  # Replace with your domain

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    client_max_body_size 10M;
}
NGINXEOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/aztec-meme-backend /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

echo "✅ Deployment completed!"
echo " Backend running on: http://your-vps-ip"
echo "📊 PM2 status: pm2 status"
echo "📝 Logs: pm2 logs aztec-meme-backend"
EOF

chmod +x deploy.sh
```

### **4. Buat README untuk Deployment**
```bash
cat > VPS_DEPLOYMENT.md << 'EOF'
# 🚀 VPS Deployment Guide

## Quick Deploy
```bash
# Clone repository
git clone https://github.com/username/aztec-meme-tournament.git
cd aztec-meme-tournament

# Run deployment script
chmod +x deploy.sh
./deploy.sh
```

## Manual Deploy
```bash
# 1. Install dependencies
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
sudo apt install nginx -y

# 2. Clone repository
sudo mkdir -p /var/www/aztec-meme-backend
sudo chown $USER:$USER /var/www/aztec-meme-backend
git clone https://github.com/username/aztec-meme-tournament.git /var/www/aztec-meme-backend

# 3. Setup backend
cd /var/www/aztec-meme-backend/backend
npm install --production
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# 4. Setup Nginx
sudo cp nginx-config /etc/nginx/sites-available/aztec-meme-backend
sudo ln -s /etc/nginx/sites-available/aztec-meme-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Update Backend
```bash
cd /var/www/aztec-meme-backend
git pull origin main
cd backend
npm install --production
pm2 restart aztec-meme-backend
```

## Useful Commands
```bash
# Check status
pm2 status
pm2 logs aztec-meme-backend

# Restart
pm2 restart aztec-meme-backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```
EOF
```

### **5. Push ke GitHub**
```bash
git add .
git commit -m "Add deployment scripts and documentation"
git push origin main
```

## 🎯 **Langkah Selanjutnya:**

### **1. Push ke GitHub:**
```bash
git add .
git commit -m "Initial commit with deployment setup"
git push origin main
```

### **2. Di VPS, clone dan deploy:**
```bash
# Clone dari GitHub
git clone https://github.com/username/aztec-meme-tournament.git
cd aztec-meme-tournament

# Run deployment script
chmod +x deploy.sh
./deploy.sh
```

**Apakah Anda sudah punya repository GitHub? Saya bisa bantu setup repository dan push code!** 🚀

## 🚀 **Langkah-langkah untuk GitHub:**

### **1. Buat .gitignore di root:**
```bash
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
frontend/build/
backend/dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Uploaded files
backend/uploads/*
!backend/uploads/.gitkeep

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Temporary files
*.tmp
*.temp
EOF
```

### **2. Buat deploy.sh script:**
```bash
cat > deploy.sh << 'EOF'
#!/bin/bash

echo "🚀 Deploying Aztec Meme Tournament Backend..."

# Update system
sudo apt update

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    echo " Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    sudo npm install -g pm2
fi

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    sudo apt install nginx -y
    sudo systemctl enable nginx
    sudo systemctl start nginx
fi

# Create directory
sudo mkdir -p /var/www/aztec-meme-backend
sudo chown $USER:$USER /var/www/aztec-meme-backend

# Clone or pull from GitHub
if [ -d "/var/www/aztec-meme-backend/.git" ]; then
    echo "📥 Pulling latest changes..."
    cd /var/www/aztec-meme-backend
    git pull origin main
else
    echo "📥 Cloning from GitHub..."
    git clone https://github.com/username/aztec-meme-tournament.git /var/www/aztec-meme-backend
    cd /var/www/aztec-meme-backend
fi

# Install backend dependencies
echo " Installing backend dependencies..."
cd backend
npm install --production

# Create PM2 config
cat > ecosystem.config.js << 'PM2EOF'
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
PM2EOF

# Create logs directory
mkdir -p logs

# Create uploads directory
mkdir -p uploads

# Start with PM2
echo "🚀 Starting backend with PM2..."
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# Setup Nginx
echo "🌐 Setting up Nginx..."
sudo tee /etc/nginx/sites-available/aztec-meme-backend > /dev/null << 'NGINXEOF'
server {
    listen 80;
    server_name _;  # Replace with your domain

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    client_max_body_size 10M;
}
NGINXEOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/aztec-meme-backend /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

echo "✅ Deployment completed!"
echo " Backend running on: http://your-vps-ip"
echo "📊 PM2 status: pm2 status"
echo "📝 Logs: pm2 logs aztec-meme-backend"
EOF

chmod +x deploy.sh
```

### **3. Initialize Git dan Push:**
```bash
# Initialize git
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Aztec Meme Tournament with deployment setup"

# Add remote (ganti dengan URL repository Anda)
git remote add origin https://github.com/username/aztec-meme-tournament.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### **4. Di VPS nanti:**
```bash
# Clone dari GitHub
git clone https://github.com/username/aztec-meme-tournament.git
cd aztec-meme-tournament

# Run deployment script
chmod +x deploy.sh
./deploy.sh
```

**Apakah Anda sudah punya repository GitHub? Kalau belum, saya bisa bantu buat repository dan push code!** 🚀 