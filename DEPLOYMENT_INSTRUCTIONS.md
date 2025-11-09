# 🚀 DEPLOYMENT INSTRUCTIONS - Healthy Corner

## ✅ What Has Been Done

All code has been updated and is ready for deployment:

1. ✅ **Netlify Configuration** - `netlify.toml` created
2. ✅ **Booking Form** - Connected to Supabase
3. ✅ **Contact Form** - Connected to Supabase
4. ✅ **Authentication System** - Complete with login and admin dashboard
5. ✅ **Admin Dashboard** - View and manage bookings and messages
6. ✅ **SQL Schema** - Ready to execute in Supabase

---

## 📋 DEPLOYMENT STEPS

### STEP 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - **Name**: `healthycorner`
   - **Database Password**: Generate strong password (SAVE IT!)
   - **Region**: `eu-central-1` (closest to Slovenia)
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

### STEP 2: Run SQL Setup

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Open the file `supabase-setup.sql` in this project
4. Copy ALL the SQL code
5. Paste into Supabase SQL Editor
6. Click **"Run"** or press `Ctrl+Enter`
7. Wait for success message

### STEP 3: Verify Tables Created

1. Go to **Table Editor** in Supabase
2. Verify you see these tables:
   - ✅ `bookings`
   - ✅ `contact_messages`
   - ✅ `services` (with 7 rows of data)
3. Check each table has RLS enabled (shield icon 🛡️)

### STEP 4: Create Admin User

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter:
   - **Email**: `admin@healthycorner.si` (or your email)
   - **Password**: Create strong password (SAVE IT!)
   - **Auto Confirm User**: ✅ Check this box
4. Click **"Create user"**

### STEP 5: Get Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy these values (you'll need them next):
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### STEP 6: Create Local Environment File

```bash
# In your project directory
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key_optional
```

### STEP 7: Test Locally

```bash
# Start development server
npm run dev
```

Open http://localhost:3000

**Test the following:**

1. **Booking Form**:
   - Scroll to booking section
   - Fill out and submit
   - Check Supabase Dashboard → `bookings` table for entry

2. **Contact Form**:
   - Scroll to contact section
   - Fill out and submit
   - Check Supabase Dashboard → `contact_messages` table for entry

3. **Admin Login**:
   - Go to http://localhost:3000/login
   - Login with admin credentials you created
   - Should redirect to http://localhost:3000/admin

4. **Admin Dashboard**:
   - View bookings and messages
   - Try changing status of a booking
   - Verify it updates in Supabase

### STEP 8: Build for Production

```bash
# Stop dev server (Ctrl+C)

# Build production version
npm run build
```

**Expected output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

**If build fails**, fix errors before proceeding!

### STEP 9: Test Production Build Locally

```bash
npm start
```

Open http://localhost:3000 and test all forms again.

### STEP 10: Commit Changes to Git

```bash
# Check what's changed
git status

# Add all files
git add .

# Commit
git commit -m "Add Supabase integration, authentication, and admin dashboard"

# Push to repository
git push origin main
```

### STEP 11: Deploy to Netlify

```bash
# Login to Netlify
netlify login

# Initialize Netlify site
netlify init
```

**Follow the prompts:**
- **What would you like to do?** → `Create & configure a new site`
- **Team** → Select your team
- **Site name** → `healthycorner` (or leave blank)
- **Build command** → `npm run build`
- **Directory to deploy** → `.next`
- **Netlify functions folder** → Press Enter (leave empty)

### STEP 12: Set Environment Variables on Netlify

```bash
# Set Supabase URL
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://xxxxxxxxxxxxx.supabase.co"

# Set Supabase Anon Key
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Optional: Google Maps API Key
netlify env:set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY "your_google_maps_key"
```

**Verify variables:**
```bash
netlify env:list
```

### STEP 13: Deploy to Production

```bash
netlify deploy --prod
```

**Expected output:**
```
✔ Deploy is live!
Website URL: https://healthycorner.netlify.app
```

---

## 🧪 POST-DEPLOYMENT TESTING

### Test Live Site

1. **Visit**: https://healthycorner.netlify.app
2. **Test Booking Form**:
   - Fill out and submit
   - Check Supabase for entry
3. **Test Contact Form**:
   - Fill out and submit
   - Check Supabase for entry
4. **Test Admin Login**:
   - Go to https://healthycorner.netlify.app/login
   - Login with admin credentials
   - Verify dashboard loads
5. **Test Admin Dashboard**:
   - View bookings and messages
   - Change status of items
   - Verify updates work

---

## 🎯 FEATURES IMPLEMENTED

### Public Features
- ✅ Responsive website with all sections
- ✅ Working booking form (saves to Supabase)
- ✅ Working contact form (saves to Supabase)
- ✅ Smooth animations and transitions
- ✅ Mobile-friendly design

### Admin Features
- ✅ Secure login system (/login)
- ✅ Admin dashboard (/admin)
- ✅ View all bookings with details
- ✅ View all contact messages
- ✅ Update booking status (pending/confirmed/cancelled/completed)
- ✅ Update message status (unread/read/replied)
- ✅ Real-time data from Supabase
- ✅ Statistics dashboard
- ✅ Secure logout

### Security
- ✅ Row Level Security (RLS) enabled
- ✅ Public can only INSERT data
- ✅ Only authenticated users can VIEW/UPDATE
- ✅ Environment variables for sensitive data
- ✅ Secure authentication with Supabase Auth

---

## 📱 HOW TO USE

### For Customers
1. Visit website
2. Browse services, menu, schedule
3. Fill out booking form or contact form
4. Receive confirmation message

### For Admin
1. Go to https://healthycorner.netlify.app/login
2. Login with admin credentials
3. View dashboard with all bookings and messages
4. Update status of bookings (confirm, cancel, complete)
5. Mark messages as read or replied
6. Logout when done

---

## 🔐 ADMIN CREDENTIALS

**Login URL**: https://healthycorner.netlify.app/login

**Email**: admin@healthycorner.si (or the email you created)
**Password**: (the password you set in Supabase)

**⚠️ IMPORTANT**: Keep these credentials secure!

---

## 🌐 OPTIONAL: Custom Domain

To use `healthycorner.si` instead of `healthycorner.netlify.app`:

```bash
netlify domains:add healthycorner.si
```

Then configure DNS at your domain registrar:
```
A record:     @   → 75.2.60.5
CNAME record: www → healthycorner.netlify.app
```

---

## 📊 MONITORING

### View Bookings
1. Login to Supabase Dashboard
2. Go to **Table Editor** → **bookings**
3. View all bookings, export to CSV

### View Messages
1. Login to Supabase Dashboard
2. Go to **Table Editor** → **contact_messages**
3. View all messages, export to CSV

### Netlify Logs
```bash
netlify logs
```

---

## 🎉 SUCCESS!

Your Healthy Corner website is now live with:
- ✅ Full booking system
- ✅ Contact form
- ✅ Admin dashboard
- ✅ Secure authentication
- ✅ Database backend

**Live URL**: https://healthycorner.netlify.app
**Admin Login**: https://healthycorner.netlify.app/login
**Admin Dashboard**: https://healthycorner.netlify.app/admin

---

## 📞 SUPPORT

If you encounter issues:
1. Check browser console for errors (F12)
2. Check Netlify deploy logs: `netlify logs`
3. Check Supabase logs in dashboard
4. Verify environment variables are set
5. Ensure RLS policies are enabled

---

**Created**: October 21, 2025
**Status**: ✅ Ready for Deployment
**Stack**: Next.js 14 + TypeScript + Supabase + Netlify
