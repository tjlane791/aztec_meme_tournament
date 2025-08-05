#!/bin/bash

# Fix HTTPS Images - Complete Solution
echo "🔧 Fixing HTTPS image issues..."

# Commands untuk dijalankan di VPS (3.26.45.220)
echo ""
echo "📋 Copy paste commands ini di VPS:"
echo ""

cat << 'VPS_COMMANDS'
# 1. SSH ke VPS
ssh ubuntu@3.26.45.220

# 2. Masuk ke direktori backend
cd ~/aztec_meme_tournament/backend

# 3. Backup server.js
cp server.js server.js.backup

# 4. Update upload-image endpoint untuk force HTTPS
sed -i 's|const baseUrl = isHttps ? `https://${host}` : `${protocol}://${host}`;|const baseUrl = `https://${host}`;|g' server.js

# 5. Fix existing image URLs di database
node -e "
const fs = require('fs-extra');
const path = require('path');

async function fixImageUrls() {
  const MEMES_PATH = path.join(__dirname, 'data', 'memes.json');
  
  try {
    const data = await fs.readFile(MEMES_PATH, 'utf8');
    const memesData = JSON.parse(data);
    
    let updated = false;
    
    memesData.memes.forEach(meme => {
      if (meme.imageUrl && meme.imageUrl.startsWith('http://3.26.45.220')) {
        const oldUrl = meme.imageUrl;
        meme.imageUrl = meme.imageUrl.replace('http://', 'https://');
        console.log(\`Updated: \${oldUrl} -> \${meme.imageUrl}\`);
        updated = true;
      }
    });
    
    if (updated) {
      await fs.writeFile(MEMES_PATH, JSON.stringify(memesData, null, 2));
      console.log('✅ Image URLs updated successfully!');
    } else {
      console.log('ℹ️ No HTTP image URLs found to update');
    }
    
  } catch (error) {
    console.error('❌ Error fixing image URLs:', error);
  }
}

fixImageUrls();
"

# 6. Restart backend
pm2 restart aztec-meme-backend

# 7. Test API
curl -k -s https://3.26.45.220/api/health

# 8. Test memes dengan HTTPS URLs
curl -k -s https://3.26.45.220/api/memes | jq '.memes[0].imageUrl'
VPS_COMMANDS

echo ""
echo "🎯 Solusi ini akan:"
echo "   1. Force HTTPS untuk semua upload image baru"
echo "   2. Fix existing image URLs dari HTTP ke HTTPS"
echo "   3. Restart backend dengan konfigurasi baru"
echo ""
echo "🚀 Setelah update di VPS, test di browser:"
echo "   http://localhost:3000" 