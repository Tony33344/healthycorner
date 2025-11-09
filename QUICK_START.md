# ⚡ QUICK START GUIDE - Healthy Corner

## 🚀 New Features Added!
- ✅ Gallery with real images (ice bath & healthy food)
- ✅ Admin Media Manager (upload & manage images)
- ✅ Product Management (e-commerce ready)
- ✅ Order Management
- ✅ Public Shop with cart
- ✅ Comprehensive testing suite

---

## 🎯 Quick Setup (10 minutes)

### Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
./setup.sh
```

This will guide you through entering your Supabase credentials.

### Option 2: Manual Setup

## 1️⃣ CREATE SUPABASE PROJECT (5 minutes)

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Name: `healthycorner`
4. Password: Generate strong password (SAVE IT!)
5. Region: `eu-central-1` (or closest to you)
6. Click **"Create new project"**
7. Wait 2-3 minutes for project creation

---

## 2️⃣ RUN SQL SETUP (2 minutes)

1. In Supabase, go to **SQL Editor**
2. Click **"New Query"**
3. Open file: `supabase-setup.sql`
4. Copy ALL SQL code (624 lines - includes new tables!)
5. Paste and click **"Run"**
6. Verify success: "Success. No rows returned"
7. Check **Table Editor** → see `bookings`, `products`, `gallery_items`, `orders`, etc.

---

## 3️⃣ CREATE STORAGE BUCKETS (1 minute)

1. Supabase → **Storage**
2. Click **"New bucket"**
3. Create:
   - Name: `gallery`
   - Public: ✅ YES
4. Click **"Create bucket"**
5. Repeat for:
   - Name: `products`
   - Public: ✅ YES

---

## 4️⃣ CREATE ADMIN USER (2 minutes)

1. Supabase → **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Email: `admin@healthycorner.com`
4. Password: (create strong password - SAVE IT!)
5. ✅ Check **"Auto Confirm User"**
6. Click **"Create user"**

7. Go to **SQL Editor** and run:
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@healthycorner.com';
```

---

## 5️⃣ GET CREDENTIALS (1 minute)

1. Supabase → **Project Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...`
   - **service_role key**: `eyJhbGc...` (keep secret!)

---

## 6️⃣ CREATE .ENV.LOCAL (1 minute)

**IMPORTANT**: Create this file manually (it's gitignored)

```bash
# Create from template
cp .env.example .env.local
```

Edit `.env.local` with your actual credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://srdteagscxuhybzdagmm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 7️⃣ INSTALL & TEST LOCALLY (5 minutes)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open http://localhost:3000

**Test Public Features:**
- ✅ Gallery shows real images (ice bath & healthy food)
- ✅ Shop section displays products
- ✅ Add product to cart
- ✅ Submit booking form → Check Supabase `bookings` table
- ✅ Submit contact form → Check Supabase `contact_messages` table

**Test Admin Features:**
- ✅ Login at http://localhost:3000/login
- ✅ View dashboard at http://localhost:3000/admin
- ✅ Check Products tab (should see sample products)
- ✅ Check Orders tab
- ✅ Visit Media Manager at http://localhost:3000/admin/media
- ✅ Try uploading an image

---

## 7️⃣ BUILD & DEPLOY (5 minutes)

```bash
# Build
npm run build

# Login to Netlify
netlify login

# Initialize site
netlify init
# → Create new site
# → Name: healthycorner
# → Build: npm run build
# → Deploy: .next

# Set environment variables
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://xxxxx.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGc..."

# Deploy!
netlify deploy --prod
```

---

## 8️⃣ TEST LIVE SITE (3 minutes)

Visit: https://healthycorner.netlify.app

**Test:**
- ✅ Booking form works
- ✅ Contact form works
- ✅ Login at /login works
- ✅ Admin dashboard at /admin works

---

## ✅ DONE!

Your site is live with:
- 🌐 Public website
- 📝 Working forms
- 🔐 Admin login
- 📊 Admin dashboard
- 💾 Supabase backend

---

## 🔑 ADMIN ACCESS

**URL**: https://healthycorner.netlify.app/login
**Email**: admin@healthycorner.si
**Password**: (the one you created)

---

## 📞 NEED HELP?

See detailed guides:
- `DEPLOYMENT_INSTRUCTIONS.md` - Step-by-step guide
- `IMPLEMENTATION_SUMMARY.md` - What was built
- `COMPLETE_SETUP_AND_DEPLOYMENT.md` - Full documentation

---

**Total Time**: ~20 minutes
**Status**: ✅ Ready to Deploy
