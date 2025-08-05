import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import LazyBackgroundAnimation from './components/LazyBackgroundAnimation';

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [eligibility, setEligibility] = useState({ 
    canVote: false, 
    canCreate: false, 
    voteCount: 0, 
    remainingVotes: 0, 
    voteLimit: 2,
    hasCreatedMeme: false
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    imageUrl: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const account = accounts[0];
        
        setProvider(provider);
        setAccount(account);
        
        // Check eligibility
        checkEligibility(account);
      } else {
        setError('Please install MetaMask or another wallet provider');
      }
    } catch (error) {
      setError('Failed to connect wallet: ' + error.message);
    }
  };

  // Check if address is eligible
  const checkEligibility = async (address) => {
    try {
      const response = await axios.post('/api/check-eligibility', { address });
      setEligibility(response.data);
    } catch (error) {
      console.error('Error checking eligibility:', error);
    }
  };

  // Load memes
  const loadMemes = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const response = await axios.get('/api/memes', {
        httpsAgent: new (require('https').Agent)({
          rejectUnauthorized: false
        })
      });
      setMemes(response.data.memes);
    } catch (error) {
      console.error('Error loading memes:', error);
      setError('Failed to load memes: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Vote for meme
  const voteForMeme = async (memeId) => {
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!eligibility.canVote) {
      setError('Your address is not eligible for voting');
      return;
    }

    try {
      const response = await axios.post(`/api/memes/${memeId}/vote`, {
        voterAddress: account
      });
      
      if (response.data.success) {
        setSuccess('Vote recorded successfully!');
        loadMemes(); // Reload memes to update vote counts
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to vote');
      setTimeout(() => setError(null), 5000);
    }
  };

  // Upload image file
  const uploadImage = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/api/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setCreateForm({
          ...createForm,
          imageUrl: response.data.imageUrl
        });
        setSelectedFile(null);
        return response.data.imageUrl;
      }
    } catch (error) {
      setError('Failed to upload image: ' + (error.response?.data?.error || error.message));
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setCreateForm({
        ...createForm,
        imageUrl: '' // Clear URL when file is selected
      });
    }
  };

  // Create new meme (modified to handle file upload)
  const createMeme = async (e) => {
    e.preventDefault();
    
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!eligibility.canCreate) {
      setError('Your address is not eligible for creating memes');
      return;
    }

    try {
      let finalImageUrl = createForm.imageUrl;

      // If file is selected, upload it first
      if (selectedFile) {
        finalImageUrl = await uploadImage(selectedFile);
      }

      if (!finalImageUrl) {
        setError('Please provide an image URL or upload an image file');
        return;
      }

      const response = await axios.post('/api/memes', {
        ...createForm,
        imageUrl: finalImageUrl,
        creatorAddress: account
      });
      
      if (response.data.success) {
        setSuccess('Meme created successfully!');
        setCreateForm({ title: '', description: '', imageUrl: '' });
        setSelectedFile(null);
        setShowCreateForm(false);
        loadMemes(); // Reload memes to show new meme
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create meme');
      setTimeout(() => setError(null), 5000);
    }
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    setCreateForm({
      ...createForm,
      [e.target.name]: e.target.value
    });
  };

  // Load memes on component mount
  useEffect(() => {
    loadMemes();
  }, []);

  // Check eligibility when account changes
  useEffect(() => {
    if (account) {
      checkEligibility(account);
    }
  }, [account]);

  return (
    <div className="container">
      {/* Animated Background */}
      <LazyBackgroundAnimation />
      
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
          <img 
            src="/images/aztec-logo.png" 
            alt="Aztec Logo" 
            style={{ width: '80px', height: '80px', borderRadius: '10px' }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h1>Aztec Meme Tournament</h1>
        </div>
        <p>Vote for your favorite memes! Only eligible addresses can vote and create memes.</p>
      </div>

      {/* Wallet Connection Section */}
      <div className="wallet-section">
        <div className="wallet-info">
          <div>
            {account ? (
              <div>
                <span>Connected: </span>
                <span className="address-display">{account}</span>
                <span className={`eligibility-badge ${eligibility.canVote ? 'eligible' : 'not-eligible'}`}>
                  {eligibility.canVote ? `Can Vote (${eligibility.remainingVotes}/${eligibility.voteLimit} left)` : 'Cannot Vote'}
                </span>
                <span className={`eligibility-badge ${eligibility.canCreate ? 'eligible' : 'not-eligible'}`}>
                  {eligibility.canCreate ? 'Can Create' : eligibility.hasCreatedMeme ? 'Already Created Meme' : 'Cannot Create'}
                </span>
              </div>
            ) : (
              <span>Not connected</span>
            )}
          </div>
          <button className="connect-button" onClick={connectWallet}>
            {account ? 'Connected' : 'Connect Wallet'}
          </button>
        </div>
      </div>

      {/* Create Meme Section */}
      {account && (
        <div className="create-meme-section">
          <h3>Create New Meme</h3>
          {eligibility.canCreate ? (
            !showCreateForm ? (
              <button 
                className="submit-button" 
                onClick={() => setShowCreateForm(true)}
              >
                Create New Meme
              </button>
            ) : (
              <form className="create-meme-form" onSubmit={createMeme}>
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    name="title"
                    value={createForm.title}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    name="description"
                    value={createForm.description}
                    onChange={handleFormChange}
                    required
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Image (URL or File Upload):</label>
                  <div style={{ marginBottom: '10px' }}>
                    <input
                      type="url"
                      name="imageUrl"
                      value={createForm.imageUrl}
                      onChange={handleFormChange}
                      placeholder="https://example.com/image.jpg"
                      disabled={selectedFile}
                    />
                    <span style={{ margin: '0 10px', color: '#666' }}>OR</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      disabled={createForm.imageUrl}
                    />
                  </div>
                  {selectedFile && (
                    <div style={{ fontSize: '14px', color: '#4CAF50', marginTop: '5px' }}>
                      Selected: {selectedFile.name}
                    </div>
                  )}
                  {uploading && (
                    <div style={{ fontSize: '14px', color: '#2196F3', marginTop: '5px' }}>
                      Uploading image...
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="submit-button">
                    Create Meme
                  </button>
                  <button 
                    type="button" 
                    className="connect-button"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )
          ) : (
            <div style={{ color: '#f44336', fontSize: '14px' }}>
              {eligibility.hasCreatedMeme 
                ? 'You have already created a meme. Only one meme per address allowed.' 
                : 'Your address is not eligible for creating memes.'
              }
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {/* Memes Grid */}
      {loading ? (
        <div className="loading">Loading memes...</div>
      ) : (
        <div className="meme-grid">
          {memes.map((meme) => (
            <div key={meme.id} className="meme-card">
              <img 
                src={meme.imageUrl} 
                alt={meme.title} 
                className="meme-image"
                onError={(e) => {
                  console.error('Failed to load image:', meme.imageUrl);
                  // Use a simple data URL instead of external placeholder
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
                }}
                onLoad={() => console.log('Image loaded successfully:', meme.imageUrl)}
              />
              <div className="meme-content">
                <h3 className="meme-title">{meme.title}</h3>
                <p className="meme-description">{meme.description}</p>
                <div className="meme-stats">
                  <span className="vote-count">Votes: {meme.votes}</span>
                  <span className="vote-percentage">{meme.votePercentage}%</span>
                </div>
                <button
                  className="vote-button"
                  onClick={() => voteForMeme(meme.id)}
                  disabled={!account || !eligibility.canVote || eligibility.remainingVotes === 0 || meme.voters.includes(account?.toLowerCase())}
                >
                  {!account 
                    ? 'Connect Wallet to Vote' 
                    : !eligibility.canVote 
                    ? 'Not Eligible to Vote'
                    : eligibility.remainingVotes === 0
                    ? 'Vote Limit Reached'
                    : meme.voters.includes(account?.toLowerCase())
                    ? 'Already Voted for This Meme'
                    : `Vote for this Meme (${eligibility.remainingVotes} left)`
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && memes.length === 0 && (
        <div className="loading">No memes available yet. Be the first to create one!</div>
      )}
      
      {/* Footer with Credits */}
      <div style={{
        textAlign: 'center',
        padding: '20px',
        marginTop: '40px',
        color: 'white',
        opacity: 0.8,
        fontSize: '0.9rem'
      }}>
        <span>Created by: </span>
        <a 
          href="https://x.com/Babichevbatya" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: '#1DA1F2',
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.color = '#0d8bd9'}
          onMouseLeave={(e) => e.target.style.color = '#1DA1F2'}
        >
          @yyehazel
        </a>
      </div>
    </div>
  );
}

export default App; 