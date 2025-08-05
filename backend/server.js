const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadsDir);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://3.26.45.220',
    'https://3.26.45.220',
    'https://*.vercel.app',  // Allow all Vercel subdomains
    'https://aztec-meme-vote.vercel.app',  // Your specific Vercel domain
    'https://frontend-o4am4xzin-tjlane791s-projects.vercel.app',
    'https://frontend-alpha-three.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, path) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
}));

// Data file paths
const ELIGIBLE_ADDRESSES_PATH = path.join(__dirname, 'data', 'eligible-addresses.json');
const MEMES_PATH = path.join(__dirname, 'data', 'memes.json');

// Helper functions
const readJsonFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
};

const writeJsonFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    return false;
  }
};

// Check if address is eligible (can vote AND create)
const isEligible = async (address) => {
  const data = await readJsonFile(ELIGIBLE_ADDRESSES_PATH);
  if (!data) return false;
  return data.eligibleAddresses.includes(address.toLowerCase());
};

// Check vote count for an address
const getVoteCount = async (address) => {
  const data = await readJsonFile(MEMES_PATH);
  if (!data) return 0;
  
  let totalVotes = 0;
  data.memes.forEach(meme => {
    meme.voters.forEach(voter => {
      if (voter.toLowerCase() === address.toLowerCase()) {
        totalVotes++;
      }
    });
  });
  
  return totalVotes;
};

// Check if address has already created a meme
const hasCreatedMeme = async (address) => {
  const data = await readJsonFile(MEMES_PATH);
  if (!data) return false;
  
  return data.memes.some(meme => 
    meme.creatorAddress.toLowerCase() === address.toLowerCase()
  );
};

// Calculate vote percentage
const calculateVotePercentage = (memes) => {
  const totalVotes = memes.reduce((sum, meme) => sum + meme.votes, 0);
  return memes.map(meme => ({
    ...meme,
    votePercentage: totalVotes > 0 ? ((meme.votes / totalVotes) * 100).toFixed(1) : 0
  }));
};

// API Routes

// Get all memes with vote percentages
app.get('/api/memes', async (req, res) => {
  try {
    const data = await readJsonFile(MEMES_PATH);
    if (!data) {
      return res.status(500).json({ error: 'Failed to load memes' });
    }
    
    const memesWithPercentages = calculateVotePercentage(data.memes);
    res.json({ memes: memesWithPercentages });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get eligible addresses
app.get('/api/eligible-addresses', async (req, res) => {
  try {
    const data = await readJsonFile(ELIGIBLE_ADDRESSES_PATH);
    if (!data) {
      return res.status(500).json({ error: 'Failed to load eligible addresses' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Vote for a meme
app.post('/api/memes/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { voterAddress } = req.body;

    if (!voterAddress) {
      return res.status(400).json({ error: 'Voter address is required' });
    }

    // Check if address is eligible
    const isEligibleAddress = await isEligible(voterAddress);
    if (!isEligibleAddress) {
      return res.status(403).json({ error: 'Address not eligible for voting' });
    }

    // Check vote limit (max 2 votes)
    const currentVoteCount = await getVoteCount(voterAddress);
    if (currentVoteCount >= 2) {
      return res.status(403).json({ error: 'Vote limit reached (maximum 2 votes per address)' });
    }

    const data = await readJsonFile(MEMES_PATH);
    if (!data) {
      return res.status(500).json({ error: 'Failed to load memes' });
    }

    const meme = data.memes.find(m => m.id === id);
    if (!meme) {
      return res.status(404).json({ error: 'Meme not found' });
    }

    // Check if user already voted
    if (meme.voters.includes(voterAddress.toLowerCase())) {
      return res.status(400).json({ error: 'Already voted for this meme' });
    }

    // Add vote
    meme.votes += 1;
    meme.voters.push(voterAddress.toLowerCase());

    const success = await writeJsonFile(MEMES_PATH, data);
    if (!success) {
      return res.status(500).json({ error: 'Failed to save vote' });
    }

    const memesWithPercentages = calculateVotePercentage(data.memes);
    res.json({ 
      success: true, 
      meme: memesWithPercentages.find(m => m.id === id),
      message: 'Vote recorded successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload image file
app.post('/api/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    // Get the base URL from request
    const protocol = req.protocol;
    const host = req.get('host');
    
    // Force HTTPS for production
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? `https://${host}` 
      : `${protocol}://${host}`;
    
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    res.json({ 
      success: true, 
      imageUrl: imageUrl,
      filename: req.file.filename,
      message: 'Image uploaded successfully' 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Create new meme (modified to handle both URL and file upload)
app.post('/api/memes', async (req, res) => {
  try {
    const { title, description, imageUrl, creatorAddress } = req.body;

    if (!title || !description || !imageUrl || !creatorAddress) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if address is eligible for creating memes
    const canCreate = await isEligible(creatorAddress);
    if (!canCreate) {
      return res.status(403).json({ error: 'Address not eligible for creating memes' });
    }

    // Check if address has already created a meme
    const alreadyCreated = await hasCreatedMeme(creatorAddress);
    if (alreadyCreated) {
      return res.status(403).json({ error: 'Address has already created a meme. Only one meme per address allowed.' });
    }

    const data = await readJsonFile(MEMES_PATH);
    if (!data) {
      return res.status(500).json({ error: 'Failed to load memes' });
    }

    const newMeme = {
      id: uuidv4(),
      title,
      description,
      imageUrl,
      creatorAddress: creatorAddress.toLowerCase(),
      votes: 0,
      voters: [],
      createdAt: new Date().toISOString()
    };

    data.memes.push(newMeme);

    const success = await writeJsonFile(MEMES_PATH, data);
    if (!success) {
      return res.status(500).json({ error: 'Failed to save meme' });
    }

    res.json({ 
      success: true, 
      meme: newMeme,
      message: 'Meme created successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Check if address is eligible
app.post('/api/check-eligibility', async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    const isEligibleAddress = await isEligible(address);
    const currentVoteCount = await getVoteCount(address);
    const remainingVotes = Math.max(0, 2 - currentVoteCount);
    const hasCreated = await hasCreatedMeme(address);

    res.json({
      address: address.toLowerCase(),
      canCreate: isEligibleAddress && !hasCreated,
      canVote: isEligibleAddress,
      voteCount: currentVoteCount,
      remainingVotes: remainingVotes,
      voteLimit: 2,
      hasCreatedMeme: hasCreated
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 