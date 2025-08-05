#!/bin/bash

# Fix All Issues - CORS and Mixed Content
# This script fixes all the issues with the Aztec Meme Tournament application

echo "🔧 Fixing all issues in Aztec Meme Tournament..."

# Make scripts executable
chmod +x update-backend-fixes.sh
chmod +x deploy-frontend-fixes.sh

echo "📋 Issues to be fixed:"
echo "   1. CORS errors preventing API access"
echo "   2. Mixed content errors for image loading"
echo "   3. HTTPS enforcement for all resources"
echo "   4. Image upload functionality improvements"

echo ""
echo "🚀 Step 1: Updating backend with CORS and HTTPS fixes..."
./update-backend-fixes.sh

echo ""
echo "🚀 Step 2: Deploying frontend fixes to Vercel..."
./deploy-frontend-fixes.sh

echo ""
echo "✅ All fixes completed!"
echo ""
echo "🎯 Summary of fixes applied:"
echo "   Backend (VPS):"
echo "   - Enhanced CORS configuration for all Vercel domains"
echo "   - Fixed HTTPS image URL generation"
echo "   - Added Content-Security-Policy headers"
echo "   - Improved error handling for mixed content issues"
echo ""
echo "   Frontend (Vercel):"
echo "   - Fixed image URL handling to avoid mixed content"
echo "   - Enhanced HTTPS enforcement for image loading"
echo "   - Improved error handling for failed image loads"
echo "   - Added proper HTTPS agent configuration"
echo ""
echo "🌐 Your application should now work without errors at:"
echo "   https://aztec-meme-vote.vercel.app"
echo ""
echo "🔍 To test the fixes:"
echo "   1. Open the application in your browser"
echo "   2. Check the browser console for any remaining errors"
echo "   3. Try uploading and viewing images"
echo "   4. Test the voting functionality" 