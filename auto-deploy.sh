#!/bin/bash

# Automated Netlify Deployment Script
set -e

echo "🚀 Automated Netlify Deployment for Healthy Corner"
echo "=================================================="
echo ""

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Deploy using netlify deploy
echo "🌐 Deploying to Netlify..."
echo ""

# Use netlify deploy with manual site creation
netlify deploy --prod --dir=.next --site=healthy-corner-wellness || {
    echo ""
    echo "⚠️  Deployment requires manual site linking."
    echo ""
    echo "Please run these commands manually:"
    echo "1. netlify sites:create --name healthy-corner-wellness"
    echo "2. netlify env:set NEXT_PUBLIC_SUPABASE_URL 'https://srdteagscxuhybzdagmm.supabase.co'"
    echo "3. netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyZHRlYWdzY3h1aHliemRhZ21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Njc1OTIsImV4cCI6MjA3NjI0MzU5Mn0.bRMXkRwvyRyZoDrTbRJzmABR5Zm0X0Luv0DhfC4IFXM'"
    echo "4. netlify env:set SUPABASE_SERVICE_ROLE_KEY 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyZHRlYWdzY3h1aHliemRhZ21tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDY2NzU5MiwiZXhwIjoyMDc2MjQzNTkyfQ.2QoGcSoMbS4uUGV1AsBMLK1h-fqFM0WMlPxO1pDHLMI'"
    echo "5. netlify env:set NEXT_PUBLIC_SITE_URL 'https://healthy-corner-wellness.netlify.app'"
    echo "6. netlify deploy --prod --dir=.next"
    exit 1
}

echo ""
echo "✨ Deployment complete!"
