#!/bin/bash

# Healthy Corner - Quick Setup Script
# This script helps you set up the project quickly

set -e

echo "🌿 Healthy Corner - Setup Script"
echo "================================="
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ .env.local already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing .env.local"
    else
        rm .env.local
    fi
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    
    echo ""
    echo "Please enter your Supabase credentials:"
    echo "(You can find these in your Supabase Dashboard > Settings > API)"
    echo ""
    
    read -p "Supabase URL (e.g., https://xxxxx.supabase.co): " SUPABASE_URL
    read -p "Supabase Anon Key: " SUPABASE_ANON_KEY
    read -p "Supabase Service Role Key (optional, press Enter to skip): " SUPABASE_SERVICE_KEY
    
    cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_KEY

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Testing
BASE_URL=http://localhost:3000
ADMIN_EMAIL=admin@healthycorner.com
ADMIN_PASSWORD=admin123
EOF
    
    echo "✅ .env.local created successfully!"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run database migrations in Supabase Dashboard (see SETUP_GUIDE.md)"
echo "2. Create an admin user in Supabase Authentication"
echo "3. Create storage buckets: 'gallery' and 'products'"
echo "4. Run: npm run dev"
echo ""
echo "For detailed instructions, see SETUP_GUIDE.md"
echo ""
