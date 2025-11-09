#!/bin/bash

# Healthy Corner - Netlify Deployment Script
# This script builds and deploys the application to Netlify

set -e

echo "🚀 Starting Healthy Corner deployment..."
echo ""

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Please install it first:"
    echo "   npm install -g netlify-cli"
    exit 1
fi

# Build the application
echo "📦 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Check if site is linked
if [ ! -f ".netlify/state.json" ]; then
    echo "⚠️  Site not linked yet."
    echo "Please run: netlify link"
    echo "Or create a new site: netlify sites:create --name healthy-corner-wellness"
    exit 1
fi

# Deploy to production
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir=.next

echo ""
echo "✨ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Set environment variables on Netlify:"
echo "   netlify env:set NEXT_PUBLIC_SUPABASE_URL 'https://srdteagscxuhybzdagmm.supabase.co'"
echo "   netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY 'your-anon-key'"
echo "   netlify env:set SUPABASE_SERVICE_ROLE_KEY 'your-service-role-key'"
echo "   netlify env:set NEXT_PUBLIC_SITE_URL 'https://your-site.netlify.app'"
echo ""
echo "2. Redeploy after setting env vars:"
echo "   netlify deploy --prod --dir=.next"
