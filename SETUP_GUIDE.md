# Healthy Corner - Complete Setup Guide

## Prerequisites
- Node.js 18+ installed
- Supabase account (free tier works)
- Git installed

## Quick Start (5 minutes)

### Option A: Use Supabase Cloud (Recommended)

#### Step 1: Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - Name: `healthy-corner`
   - Database Password: (save this!)
   - Region: Choose closest to you
4. Wait 2-3 minutes for project creation

#### Step 2: Get Your Credentials
1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - keep this secret!

#### Step 3: Create Environment File
```bash
# In the project root, create .env.local
cp .env.example .env.local
```

Edit `.env.local` with your actual values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://srdteagscxuhybzdagmm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Step 4: Run Database Migrations
1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-setup.sql`
4. Paste and click "Run"
5. Wait for success message (should see "Success. No rows returned")

#### Step 5: Create Admin User
1. In Supabase Dashboard, go to **Authentication** > **Users**
2. Click "Add user" > "Create new user"
3. Enter:
   - Email: `admin@healthycorner.com` (or your email)
   - Password: (create a strong password)
   - Auto Confirm User: ✅ YES
4. Click "Create user"

5. Go back to **SQL Editor** and run:
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@healthycorner.com';
```

#### Step 6: Create Storage Buckets
1. Go to **Storage** in Supabase Dashboard
2. Click "New bucket"
3. Create bucket:
   - Name: `gallery`
   - Public: ✅ YES
4. Click "Create bucket"
5. Repeat for second bucket:
   - Name: `products`
   - Public: ✅ YES

#### Step 7: Install Dependencies & Run
```bash
npm install
npm run dev
```

Visit: http://localhost:3000

#### Step 8: Test Admin Access
1. Go to: http://localhost:3000/login
2. Login with your admin credentials
3. You should see the Admin Dashboard
4. Test the Media Manager: http://localhost:3000/admin/media

---

### Option B: Use Local Supabase (Development)

#### Step 1: Initialize Supabase Locally
```bash
# Make sure Docker is running
supabase init
supabase start
```

This will output your local credentials:
```
API URL: http://localhost:54321
anon key: eyJhb...
service_role key: eyJhb...
```

#### Step 2: Create .env.local
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key_from_above>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key_from_above>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Step 3: Run Migrations
```bash
# Copy the SQL file to supabase migrations
cp supabase-setup.sql supabase/migrations/20241027000000_initial_setup.sql

# Apply migrations
supabase db reset
```

#### Step 4: Create Admin User
```bash
# Access local Supabase Studio
open http://localhost:54323

# Or use SQL
supabase db execute "
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('admin@healthycorner.com', crypt('admin123', gen_salt('bf')), now());

UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@healthycorner.com';
"
```

#### Step 5: Run the App
```bash
npm install
npm run dev
```

---

## Troubleshooting

### Error: "Invalid API key"
**Solution**: Check your `.env.local` file has the correct `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Error: "Failed to fetch"
**Solution**: 
1. Check `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Ensure Supabase project is running (cloud) or `supabase status` shows running (local)

### Error: "Permission denied" when uploading images
**Solution**:
1. Verify storage buckets exist (`gallery` and `products`)
2. Check buckets are set to PUBLIC
3. Verify your user has `admin` role in profiles table

### Error: "Table does not exist"
**Solution**: Run the database migrations (Step 4 above)

### Admin can't login
**Solution**:
1. Check user exists in Authentication > Users
2. Verify email is confirmed
3. Run the UPDATE query to set role to 'admin'
4. Check `.env.local` has correct Supabase URL

### Images not displaying in gallery
**Solution**:
1. Check images exist in `public/images/` folders
2. Restart dev server: `npm run dev`
3. Clear browser cache

### Build errors
**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

---

## Verification Checklist

After setup, verify everything works:

- [ ] Dev server runs without errors: `npm run dev`
- [ ] Homepage loads: http://localhost:3000
- [ ] Gallery shows real images (ice bath & food photos)
- [ ] Shop section displays products
- [ ] Login page works: http://localhost:3000/login
- [ ] Admin dashboard accessible after login
- [ ] Media manager loads: http://localhost:3000/admin/media
- [ ] Can upload an image in media manager
- [ ] Products tab shows sample products
- [ ] Orders tab is visible

---

## Next Steps After Setup

### 1. Customize Products
1. Go to Admin Dashboard > Products tab
2. Edit existing products or add new ones
3. Set prices, descriptions, and categories
4. Toggle "Published" to make them visible

### 2. Upload Gallery Images
1. Go to Media Manager
2. Upload images from your local folders
3. Add titles and descriptions
4. Publish them to show on homepage

### 3. Configure Branding
- Update logo in `public/images/`
- Modify colors in `tailwind.config.ts`
- Edit content in components

### 4. Deploy to Production
See `DEPLOYMENT_INSTRUCTIONS.md` for Netlify deployment

---

## Environment Variables Reference

### Required
```env
NEXT_PUBLIC_SUPABASE_URL=          # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Public anon key (safe to expose)
```

### Optional but Recommended
```env
SUPABASE_SERVICE_ROLE_KEY=         # For admin operations (keep secret!)
NEXT_PUBLIC_SITE_URL=              # Your site URL
```

### For Testing
```env
BASE_URL=http://localhost:3000
ADMIN_EMAIL=admin@healthycorner.com
ADMIN_PASSWORD=your_password
```

---

## Database Schema Overview

### Core Tables
- `bookings` - Customer bookings
- `contact_messages` - Contact form submissions
- `services` - Available services
- `profiles` - User profiles with roles
- `gallery_items` - Media library
- `products` - Product catalog
- `product_images` - Product photos
- `orders` - Customer orders
- `order_items` - Order line items

### Storage Buckets
- `gallery` - Gallery images
- `products` - Product images

---

## Support

### Common Issues
1. **Port 3000 already in use**: Change port with `PORT=3001 npm run dev`
2. **Supabase connection timeout**: Check internet connection and Supabase status
3. **RLS policy errors**: Ensure user has correct role in profiles table

### Getting Help
- Check `CMS_ECOMMERCE_GUIDE.md` for detailed feature documentation
- Review `IMPLEMENTATION_COMPLETE.md` for technical details
- Check Supabase logs in dashboard for database errors
- Review browser console for frontend errors

---

## Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Testing
npm test                # Run Playwright tests
npm run test:ui         # Run tests with UI

# Supabase (local)
supabase start          # Start local Supabase
supabase stop           # Stop local Supabase
supabase status         # Check status
supabase db reset       # Reset database
```

---

**Setup Time**: ~5-10 minutes  
**Difficulty**: Beginner-friendly  
**Status**: Production-ready
