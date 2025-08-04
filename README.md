# 🎭 Aztec Meme Tournament

Website tournament meme berbasis vote dengan sistem wallet connection dan eligible address validation.

## 🎯 Sistem yang Benar

### **Eligible Addresses** (Bisa Vote DAN Create)
```json
{
  "eligibleAddresses": [
    "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    "0x1234567890123456789012345678901234567890",
    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    // ... semua address yang eligible
  ],
  "votingAddresses": [
    "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    "0xYOUR_NEW_ADDRESS_HERE"
  ]
}
```

### **Vote Limit: 2 kali per address**

Mari saya update backend untuk implementasi yang benar:

## Fitur

- ✅ **Dashboard dengan grid meme** - Tampilkan semua meme dalam layout yang menarik
- ✅ **Sistem voting** - Hanya address yang terdaftar di JSON yang bisa vote
- ✅ **Create meme** - Hanya address eligible yang bisa membuat meme baru
- ✅ **Wallet connection** - Integrasi dengan MetaMask/wallet crypto
- ✅ **Vote percentage** - Menampilkan persentase suara setiap meme
- ✅ **Eligibility badges** - Indikator visual untuk status eligible address
- ✅ **Real-time updates** - Vote dan create meme langsung terupdate

## Struktur Project

```
aztec_meme_vote/
├── backend/
│   ├── data/
│   │   ├── eligible-addresses.json  # Daftar address yang bisa vote/create
│   │   └── memes.json               # Data meme dengan vote
│   ├── package.json
│   └── server.js                    # Express server
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js                   # Main React component
│   │   ├── index.js
│   │   └── index.css                # Styling
│   └── package.json
└── README.md
```

## Cara Menjalankan

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Jalankan Backend

```bash
cd backend
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

### 3. Jalankan Frontend

```bash
cd frontend
npm start
```

Frontend akan berjalan di `http://localhost:3000`

## Cara Menggunakan

1. **Connect Wallet**: Klik "Connect Wallet" untuk menghubungkan MetaMask
2. **Check Eligibility**: Sistem akan mengecek apakah address Anda eligible untuk vote/create
3. **Vote Meme**: Klik tombol "Vote for this Meme" pada meme yang Anda suka
4. **Create Meme**: Jika eligible, Anda bisa membuat meme baru dengan mengisi form

## Eligible Addresses

Daftar address yang bisa vote dan create meme ada di `backend/data/eligible-addresses.json`:

- `eligibleAddresses`: Address yang bisa create meme
- `votingAddresses`: Address yang bisa vote

## API Endpoints

- `GET /api/memes` - Ambil semua meme dengan persentase vote
- `POST /api/memes/:id/vote` - Vote untuk meme tertentu
- `POST /api/memes` - Create meme baru
- `POST /api/check-eligibility` - Cek eligibility address
- `GET /api/eligible-addresses` - Ambil daftar eligible addresses

## Teknologi yang Digunakan

- **Backend**: Node.js, Express.js
- **Frontend**: React.js, Ethers.js
- **Styling**: CSS3 dengan gradient dan animations
- **Wallet**: MetaMask integration
- **Data Storage**: JSON files

## Customization

### Menambah Eligible Address

Edit file `backend/data/eligible-addresses.json`:

```json
{
  "eligibleAddresses": [
    "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    "0xYOUR_NEW_ADDRESS_HERE"
  ],
  "votingAddresses": [
    "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    "0xYOUR_NEW_ADDRESS_HERE"
  ]
}
```

### Mengubah Styling

Edit file `frontend/src/index.css` untuk mengubah tampilan website.

## Troubleshooting

1. **Wallet tidak connect**: Pastikan MetaMask terinstall dan unlocked
2. **Address tidak eligible**: Cek apakah address ada di `eligible-addresses.json`
3. **Backend error**: Pastikan server berjalan di port 5000
4. **CORS error**: Backend sudah dikonfigurasi untuk allow CORS

## License

MIT License 