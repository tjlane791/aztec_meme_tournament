#!/bin/bash

echo "🔒 Setting up Backend HTTPS for Vercel Frontend..."

# Configuration
VPS_IP="3.26.45.220"
PROJECT_DIR="/var/www/aztec-meme-vote"

# Create SSL directory
sudo mkdir -p /etc/ssl/private
sudo mkdir -p /etc/ssl/certs

# Generate self-signed certificate for IP
echo "📝 Generating self-signed certificate for IP..."
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/backend-selfsigned.key \
    -out /etc/ssl/certs/backend-selfsigned.crt \
    -subj "/C=ID/ST=Jakarta/L=Jakarta/O=AztecMeme/OU=IT/CN=$VPS_IP"

# Create Nginx configuration for backend only
echo "🌐 Creating Nginx configuration for backend..."
sudo tee /etc/nginx/sites-available/aztec-backend > /dev/null << EOF
server {
    listen 80;
    server_name $VPS_IP _;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $VPS_IP _;

    ssl_certificate /etc/ssl/certs/backend-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/backend-selfsigned.key;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # CORS headers for Vercel
    add_header 'Access-Control-Allow-Origin' 'https://*.vercel.app' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
    add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;

    # Handle preflight requests
    if (\$request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' 'https://*.vercel.app' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;
        return 204;
    }

    # Backend API
    location / {
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

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # File upload size
    client_max_body_size 10M;
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/aztec-backend /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

echo "✅ Backend HTTPS setup completed!"
echo "🔧 Backend API: https://$VPS_IP"
echo "📝 Update frontend to use: https://$VPS_IP"
echo ""
echo "⚠️ Note: Self-signed certificate will show warning in browser"
echo "📝 For production, use a real domain with Let's Encrypt" 