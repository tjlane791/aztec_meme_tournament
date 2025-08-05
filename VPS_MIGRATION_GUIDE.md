# 🚀 Panduan Migrasi dari Vercel ke VPS

## 📋 Masalah yang Dipecahkan

**Mixed Content Error** terjadi karena:
- Frontend di Vercel (HTTPS)
- Backend di VPS (HTTP)
- Browser memblokir request HTTP dari halaman HTTPS

**Solusi**: Migrasi frontend dan backend ke VPS yang sama dengan HTTPS.

## 🎯 Keuntungan Migrasi ke VPS

✅ **Tidak ada Mixed Content Error**  
✅ **Lebih fleksibel** - kontrol penuh atas server  
✅ **Lebih murah** - satu server untuk semua  
✅ **Lebih cepat** - frontend dan backend di server yang sama  
✅ **SSL otomatis** - dengan Let's Encrypt  
✅ **Monitoring** - dengan PM2  

## 📦 Prerequisites

- VPS Ubuntu/Debian
- Domain name (untuk SSL)
- SSH access ke VPS
- Node.js 16+ di VPS

## 🚀 Langkah-langkah Deployment

### 1. **Persiapkan VPS**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx

# Install Certbot
sudo apt install certbot python3-certbot-nginx -y
```

### 2. **Upload Project ke VPS**

```bash
# Dari local machine, upload ke VPS
scp -r /path/to/aztec_meme_vote root@3.26.45.220:/var/www/

# Atau clone dari GitHub
git clone https://github.com/username/aztec-meme-vote.git /var/www/aztec-meme-vote
```

### 3. **Setup Project**

```bash
# Masuk ke VPS
ssh root@3.26.45.220

# Masuk ke direktori project
cd /var/www/aztec-meme-vote

# Berikan permission
chmod +x deploy-full-vps.sh
chmod +x update-deployment.sh
```

### 4. **Update Konfigurasi**

Edit file `deploy-full-vps.sh`:
```bash
# Ganti dengan domain Anda
DOMAIN="your-actual-domain.com"
```

Edit file `backend/server.js`:
```javascript
// Ganti dengan domain Anda
origin: [
  'http://localhost:3000', 
  'https://your-actual-domain.com',
  'https://www.your-actual-domain.com'
]
```

### 5. **Jalankan Deployment**

```bash
# Jalankan script deployment
./deploy-full-vps.sh
```

### 6. **Setup SSL Certificate**

```bash
# Jika domain sudah diupdate, SSL akan otomatis
# Jika belum, jalankan manual:
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 🔧 Konfigurasi Nginx

Nginx akan dikonfigurasi otomatis dengan:

- **Frontend**: Serve React build dari `/var/www/aztec-meme-vote/frontend/build`
- **Backend API**: Proxy ke `http://localhost:5000`
- **Uploads**: Proxy ke backend
- **SSL**: Otomatis dengan Let's Encrypt
- **Caching**: Static assets di-cache 1 tahun
- **Gzip**: Compression untuk performa

## 📊 Monitoring

### PM2 Commands
```bash
# Check status
pm2 status

# View logs
pm2 logs aztec-meme-backend

# Restart
pm2 restart aztec-meme-backend

# Monitor
pm2 monit
```

### Nginx Commands
```bash
# Check status
sudo systemctl status nginx

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Reload config
sudo systemctl reload nginx
```

## 🔄 Update Deployment

Untuk update aplikasi:

```bash
# Jalankan script update
./update-deployment.sh

# Atau manual:
cd /var/www/aztec-meme-vote/backend
npm install --production
pm2 restart aztec-meme-backend

cd /var/www/aztec-meme-vote/frontend
npm install
npm run build

sudo systemctl reload nginx
```

## 🛠️ Troubleshooting

### Backend tidak start
```bash
# Check logs
pm2 logs aztec-meme-backend

# Check port
netstat -tlnp | grep :5000

# Restart
pm2 restart aztec-meme-backend
```

### Frontend tidak load
```bash
# Check nginx config
sudo nginx -t

# Check build files
ls -la /var/www/aztec-meme-vote/frontend/build/

# Reload nginx
sudo systemctl reload nginx
```

### SSL Error
```bash
# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Check nginx SSL config
sudo nginx -t
```

## 📁 Struktur File di VPS

```
/var/www/aztec-meme-vote/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── uploads/          # Uploaded images
│   ├── data/            # JSON data files
│   └── logs/            # PM2 logs
├── frontend/
│   ├── build/           # React production build
│   ├── src/
│   └── package.json
├── deploy-full-vps.sh
├── update-deployment.sh
└── VPS_MIGRATION_GUIDE.md
```

## 🔒 Security

- **Firewall**: Pastikan port 80, 443, dan 22 terbuka
- **SSL**: Otomatis dengan Let's Encrypt
- **Headers**: Security headers sudah dikonfigurasi
- **File permissions**: Uploads directory dengan permission yang tepat

## 📈 Performance

- **Gzip compression**: Aktif untuk semua file
- **Static caching**: Assets di-cache 1 tahun
- **PM2 clustering**: Bisa dikonfigurasi untuk multiple instances
- **Nginx caching**: Proxy caching untuk API

## 🎉 Selesai!

Setelah deployment selesai:

1. **Frontend**: `https://your-domain.com`
2. **Backend API**: `https://your-domain.com/api`
3. **Uploads**: `https://your-domain.com/uploads/`

Tidak ada lagi mixed content error! 🚀 