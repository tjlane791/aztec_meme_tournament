# 🚀 Setup Frontend Vercel + Backend VPS HTTPS

## 📋 Konfigurasi

- **Frontend**: Vercel (HTTPS otomatis)
- **Backend**: VPS dengan self-signed SSL
- **Tidak ada mixed content error**

## 🔧 Langkah-langkah Setup

### 1. **Setup Backend di VPS**

```bash
# Masuk ke VPS
ssh root@3.26.45.220

# Masuk ke direktori project
cd /var/www/aztec-meme-vote

# Pull perubahan terbaru
git pull origin main

# Setup backend dengan HTTPS
chmod +x setup-backend-https.sh
./setup-backend-https.sh
```

### 2. **Deploy Backend**

```bash
# Install dependencies
cd backend
npm install --production

# Start dengan PM2
pm2 start server.js --name "aztec-meme-backend"
pm2 save
pm2 startup
```

### 3. **Deploy Frontend ke Vercel**

```bash
# Di local machine
cd frontend

# Build frontend
npm run build

# Deploy ke Vercel
vercel --prod
```

## 🌐 URL Configuration

### Backend (VPS)
- **API**: `https://3.26.45.220`
- **Uploads**: `https://3.26.45.220/uploads/`

### Frontend (Vercel)
- **Website**: `https://aztec-meme-vote.vercel.app` (atau domain Vercel Anda)

## ⚠️ Important Notes

### Self-Signed Certificate Warning
Browser akan menampilkan warning karena self-signed certificate. Ini normal untuk development.

### CORS Configuration
Backend sudah dikonfigurasi untuk menerima request dari:
- `https://*.vercel.app`
- `https://aztec-meme-vote.vercel.app`
- `https://3.26.45.220`

## 🔍 Testing

### Test Backend
```bash
# Test API
curl https://3.26.45.220/api/memes

# Test dengan browser
# Buka: https://3.26.45.220/api/memes
# Klik "Advanced" → "Proceed to site"
```

### Test Frontend
1. Buka frontend Vercel
2. Connect wallet
3. Test vote dan create meme

## 🛠️ Troubleshooting

### Backend tidak bisa diakses
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs aztec-meme-backend

# Check nginx
sudo systemctl status nginx
sudo nginx -t
```

### CORS Error
```bash
# Check CORS di backend
curl -H "Origin: https://aztec-meme-vote.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS https://3.26.45.220/api/memes
```

### SSL Certificate Error
```bash
# Regenerate certificate
sudo rm /etc/ssl/certs/backend-selfsigned.crt
sudo rm /etc/ssl/private/backend-selfsigned.key
./setup-backend-https.sh
```

## 📊 Monitoring

### PM2 Commands
```bash
pm2 status
pm2 logs aztec-meme-backend
pm2 restart aztec-meme-backend
```

### Nginx Commands
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔄 Update Process

### Update Backend
```bash
# Di VPS
cd /var/www/aztec-meme-vote
git pull origin main
cd backend
npm install --production
pm2 restart aztec-meme-backend
```

### Update Frontend
```bash
# Di local
cd frontend
npm run build
vercel --prod
```

## 🎯 Keuntungan Setup Ini

✅ **Frontend HTTPS** - Aman dan professional  
✅ **Backend HTTPS** - Tidak ada mixed content  
✅ **Vercel Performance** - CDN global  
✅ **VPS Control** - Kontrol penuh backend  
✅ **Scalable** - Bisa upgrade nanti  

## 🚀 Production Ready

Untuk production, pertimbangkan:
1. **Domain**: Beli domain untuk backend
2. **Let's Encrypt**: SSL certificate gratis
3. **Custom Domain**: Untuk frontend Vercel
4. **Monitoring**: Sentry, LogRocket, dll

## 🎉 Selesai!

Setelah setup selesai:
- Frontend: `https://aztec-meme-vote.vercel.app`
- Backend: `https://3.26.45.220`
- Tidak ada mixed content error! 🚀 