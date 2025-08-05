#!/bin/bash

# Deploy Frontend Fixes to Vercel
# This script deploys the frontend with fixes for mixed content and image loading issues

echo "🚀 Deploying frontend fixes to Vercel..."

# Navigate to frontend directory
cd frontend

echo "📦 Building frontend with fixes..."
npm run build

echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Frontend deployment completed!"
echo "🎯 The following fixes have been applied:"
echo "   - Fixed image URL handling to avoid mixed content issues"
echo "   - Enhanced HTTPS enforcement for image loading"
echo "   - Improved error handling for failed image loads"
echo "   - Added proper HTTPS agent configuration"

echo "🌐 Your app should now be available at:"
echo "   https://aztec-meme-vote.vercel.app" 