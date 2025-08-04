# 🚀 Quick Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension

## Installation & Running

### 1. Install Dependencies
```bash
# Install all dependencies
npm run install-all
```

### 2. Start Both Servers
```bash
# Start backend and frontend simultaneously
npm run dev
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Testing the API
```bash
node test-api.js
```

## Features Implemented

### ✅ Dashboard Features
- **Grid Layout**: Meme cards dengan hover effects
- **Vote Buttons**: Hanya untuk eligible addresses
- **Vote Percentage**: Persentase suara setiap meme
- **Real-time Updates**: Vote langsung terupdate

### ✅ Wallet Integration
- **MetaMask Connection**: Connect wallet dengan satu klik
- **Address Display**: Tampilkan connected address
- **Eligibility Badges**: Indikator visual untuk status eligible

### ✅ Voting System
- **Eligible Addresses Only**: Hanya address di JSON yang bisa vote
- **One Vote Per Address**: Mencegah double voting
- **Vote Validation**: Server-side validation

### ✅ Create Meme System
- **Eligible Creators Only**: Hanya address eligible yang bisa create
- **Form Validation**: Title, description, dan image URL required
- **Real-time Creation**: Meme baru langsung muncul di dashboard

### ✅ Backend API
- **RESTful Endpoints**: GET, POST untuk semua operasi
- **JSON Data Storage**: File-based storage untuk simplicity
- **Error Handling**: Proper error responses
- **CORS Enabled**: Frontend bisa akses API

## File Structure
```
aztec_meme_vote/
├── backend/
│   ├── data/
│   │   ├── eligible-addresses.json  # Eligible addresses
│   │   └── memes.json               # Meme data with votes
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
├── package.json                     # Root package.json
├── test-api.js                     # API testing script
├── README.md                       # Main documentation
└── SETUP.md                        # This file
```

## Customization

### Adding Eligible Addresses
Edit `backend/data/eligible-addresses.json`:
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

### Changing Styling
Edit `frontend/src/index.css` untuk mengubah tampilan.

### Adding New Memes
Menggunakan form di frontend atau edit `backend/data/memes.json` langsung.

## Troubleshooting

### Common Issues
1. **Port already in use**: Kill existing processes on ports 3000/5000
2. **CORS errors**: Backend sudah dikonfigurasi untuk allow CORS
3. **Wallet not connecting**: Pastikan MetaMask terinstall dan unlocked
4. **Address not eligible**: Cek `eligible-addresses.json`

### Commands
```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9

# Restart servers
npm run dev

# Test API
node test-api.js
```

## Next Steps
- [ ] Add image upload functionality
- [ ] Implement blockchain integration
- [ ] Add user authentication
- [ ] Create admin panel
- [ ] Add tournament rounds
- [ ] Implement rewards system 