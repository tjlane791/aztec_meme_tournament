# 🔧 Troubleshooting Guide - Aztec Meme Vote

## 🖼️ Image Not Found Issues

### **Problem Description**
Gambar meme tidak muncul saat di-deploy di VPS, padahal di local berfungsi normal.

### **Root Causes**
1. **URL Gambar Relatif**: Backend menyimpan path relatif `/uploads/filename`
2. **CORS Issues**: Frontend tidak bisa mengakses gambar dari domain berbeda
3. **Static File Serving**: Konfigurasi static files tidak optimal
4. **Firewall/Network**: Port atau firewall blocking akses gambar

### **Solutions Applied**

#### ✅ **1. Fixed Image URL Generation**
```javascript
// Before
const imageUrl = `/uploads/${req.file.filename}`;

// After  
const protocol = req.protocol;
const host = req.get('host');
const baseUrl = `${protocol}://${host}`;
const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
```

#### ✅ **2. Enhanced CORS Configuration**
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.vercel.app'],
  credentials: true
}));
```

#### ✅ **3. Static File Headers**
```javascript
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, path) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
}));
```

#### ✅ **4. Frontend Error Handling**
```javascript
<img 
  src={meme.imageUrl} 
  alt={meme.title} 
  className="meme-image"
  onError={(e) => {
    console.error('Failed to load image:', meme.imageUrl);
    e.target.src = 'data:image/svg+xml;base64,...';
  }}
  onLoad={() => console.log('Image loaded successfully:', meme.imageUrl)}
/>
```

### **Debugging Steps**

#### **1. Run Debug Script**
```bash
node debug-images.js
```

#### **2. Check Backend Status**
```bash
# SSH to VPS
ssh root@3.26.45.220

# Check if backend is running
pm2 status
pm2 logs aztec-meme-backend

# Test API directly
curl http://localhost:5000/api/memes
```

#### **3. Check File Permissions**
```bash
# On VPS
ls -la /root/aztec-meme-vote/backend/uploads/
chmod 755 uploads/
chmod 644 uploads/*
```

#### **4. Test Image URLs**
```bash
# Test from local machine
curl -I http://3.26.45.220:5000/uploads/filename.jpg
```

### **Deployment Commands**

#### **Deploy Backend**
```bash
./deploy-backend.sh
```

#### **Deploy Frontend**
```bash
cd frontend
npm run build
vercel --prod
```

### **Common Issues & Fixes**

#### **Issue 1: CORS Error**
```
Access to image at 'http://3.26.45.220:5000/uploads/image.jpg' 
from origin 'https://your-frontend.vercel.app' has been blocked by CORS policy
```
**Fix**: Update CORS configuration in `backend/server.js`

#### **Issue 2: 404 Not Found**
```
GET http://3.26.45.220:5000/uploads/image.jpg 404 (Not Found)
```
**Fix**: 
- Check if file exists in uploads directory
- Verify static file serving configuration
- Check file permissions

#### **Issue 3: Network Error**
```
Failed to fetch: NetworkError when attempting to fetch resource
```
**Fix**:
- Check if backend is running on VPS
- Verify firewall settings
- Test network connectivity

### **Monitoring & Logs**

#### **Backend Logs**
```bash
pm2 logs aztec-meme-backend --lines 50
```

#### **Frontend Console**
Open browser DevTools → Console to see image loading errors

#### **Network Tab**
Check Network tab in DevTools to see failed image requests

### **Performance Optimization**

#### **Image Optimization**
- Compress images before upload
- Use WebP format when possible
- Implement lazy loading

#### **Caching**
- Static files cached for 1 year
- API responses cached appropriately

### **Security Considerations**

#### **File Upload Security**
- File type validation
- File size limits (5MB)
- Secure filename generation

#### **CORS Security**
- Specific origin whitelist
- Credentials handling
- Proper headers

### **Testing Checklist**

- [ ] Backend API accessible
- [ ] Image upload working
- [ ] Image URLs generated correctly
- [ ] Static files served properly
- [ ] CORS headers set correctly
- [ ] Frontend can display images
- [ ] Error handling works
- [ ] Performance acceptable

### **Emergency Fixes**

#### **Quick CORS Fix**
```bash
# On VPS, restart backend with updated CORS
pm2 restart aztec-meme-backend
```

#### **Reset Uploads Directory**
```bash
# On VPS
rm -rf uploads/*
mkdir -p uploads
chmod 755 uploads
```

#### **Check Backend Health**
```bash
curl -f http://3.26.45.220:5000/api/memes || echo "Backend down"
``` 