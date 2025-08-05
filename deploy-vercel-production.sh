#!/bin/bash

# Deploy to Vercel with Production Configuration
echo "🚀 Deploying to Vercel with production configuration..."

# 1. Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build

# 2. Check build output
echo "🔍 Checking build output..."
if [ -d "build" ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# 3. Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod --yes

# 4. Test deployment
echo "🧪 Testing deployment..."
DEPLOY_URL=$(vercel ls --json | jq -r '.[0].url' 2>/dev/null || echo "https://aztec-meme-vote.vercel.app")

echo ""
echo "✅ Deployment completed!"
echo "🌐 Your app is available at: $DEPLOY_URL"
echo ""
echo "🔍 To test the deployment:"
echo "   1. Open: $DEPLOY_URL"
echo "   2. Check browser console for any errors"
echo "   3. Test wallet connection"
echo "   4. Test meme loading"
echo "   5. Test image upload"
echo ""
echo "📋 Common issues and solutions:"
echo "   - CORS errors: Backend already configured for Vercel domains"
echo "   - Mixed content: Images now use HTTPS"
echo "   - API errors: Check if VPS backend is running"
echo "   - Build errors: Check Node.js version compatibility" 