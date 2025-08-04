#!/bin/bash

echo "🔒 Setting up HTTPS for VPS..."

# Install certbot
sudo apt update
sudo apt install -y certbot

# Get SSL certificate (replace with your domain)
echo "📝 Enter your domain (e.g., api.yourdomain.com):"
read DOMAIN

if [ -z "$DOMAIN" ]; then
    echo "❌ Domain is required!"
    exit 1
fi

# Get SSL certificate
sudo certbot certonly --standalone -d $DOMAIN

# Create nginx config
sudo tee /etc/nginx/sites-available/aztec-api << EOF
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

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
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/aztec-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

echo "✅ HTTPS setup completed!"
echo "🌐 Your API is now available at: https://$DOMAIN"
echo "📝 Update your frontend to use: https://$DOMAIN" 