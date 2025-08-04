# File Upload Feature

## Overview
Sistem sekarang mendukung upload file gambar dari local device, tidak hanya URL gambar.

## Fitur Baru

### 1. Upload File
- User bisa upload file gambar (JPG, PNG, GIF, dll)
- Ukuran maksimal: 5MB
- File disimpan di folder `backend/uploads/`
- Nama file dibuat unik dengan timestamp

### 2. Form Create Meme yang Diperbarui
- Input URL gambar (opsional)
- **ATAU** input file upload
- Keduanya tidak bisa digunakan bersamaan
- Preview nama file yang dipilih
- Indikator saat upload berlangsung

### 3. Backend Changes
- Endpoint baru: `POST /api/upload-image`
- Menggunakan multer untuk handle file upload
- Validasi tipe file (hanya gambar)
- Static serving untuk file uploads di `/uploads/`

### 4. Frontend Changes
- State baru: `selectedFile`, `uploading`
- Function `uploadImage()` untuk upload file
- Function `handleFileSelect()` untuk handle file selection
- Form yang diperbarui dengan input file

## Cara Penggunaan

### Untuk User:
1. Klik "Create New Meme"
2. Isi title dan description
3. **Pilih salah satu:**
   - Masukkan URL gambar, ATAU
   - Klik "Choose File" dan pilih gambar dari device
4. Klik "Create Meme"

### Untuk Developer:
```javascript
// Upload file
const formData = new FormData();
formData.append('image', file);

const response = await axios.post('/api/upload-image', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// Response: { imageUrl: '/uploads/filename.jpg' }
```

## Struktur File
```
backend/
├── uploads/           # Folder untuk file upload
├── data/
│   ├── memes.json
│   └── eligible-addresses.json
└── server.js
```

## Testing
File `test-upload.js` tersedia untuk testing upload functionality.

## Security
- Validasi tipe file (hanya gambar)
- Limit ukuran file (5MB)
- Nama file unik untuk menghindari konflik
- File disimpan di folder terpisah 