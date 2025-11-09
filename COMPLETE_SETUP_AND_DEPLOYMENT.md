# 🎯 COMPLETE SETUP & DEPLOYMENT GUIDE: Healthy Corner Website

## ⚠️ IMPORTANT: Follow steps in ORDER - Deployment is LAST!

This guide covers:
1. ✅ Project Setup & Dependencies
2. ✅ Supabase Database Configuration
3. ✅ Code Updates & Integration
4. ✅ Local Testing & Verification
5. ✅ Netlify Configuration Files
6. 🚀 DEPLOYMENT (Final Step)

---

## 📦 PART 1: PROJECT SETUP

### Step 1.1: Verify Project Structure

Navigate to project directory:
```bash
cd "/home/jack/CascadeProjects/healthy corner"
```

Verify these files exist:
- ✅ `package.json` - Dependencies
- ✅ `next.config.js` - Next.js config
- ✅ `tailwind.config.ts` - Tailwind config
- ✅ `.env.example` - Environment template
- ✅ `lib/supabase.ts` - Supabase client
- ✅ `components/Booking.tsx` - Booking form
- ✅ `components/Contact.tsx` - Contact form

### Step 1.2: Install Dependencies

```bash
# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

**Expected packages:**
- next@^14.2.0
- react@^18.3.0
- @supabase/supabase-js@^2.42.0
- framer-motion@^11.0.0
- react-hook-form@^7.51.0
- tailwindcss@^3.4.0
- typescript@^5.4.0

---

## 🗄️ PART 2: SUPABASE DATABASE SETUP

### Step 2.1: Create Supabase Project

**Option A: Via Supabase CLI**
```bash
# Login to Supabase
supabase login

# Create new project
supabase projects create healthycorner --org-id your-org-id --db-password YOUR_STRONG_PASSWORD --region eu-central-1
```

**Option B: Via Web Dashboard (Recommended)**
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - **Name**: `healthycorner`
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Choose closest to Slovenia (e.g., `eu-central-1`)
4. Click "Create new project"
5. Wait 2-3 minutes for provisioning

### Step 2.2: Create Database Tables

Go to Supabase Dashboard → SQL Editor → New Query

**Copy and execute this COMPLETE SQL schema:**

```sql
-- ============================================
-- HEALTHY CORNER DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE 1: BOOKINGS
-- ============================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  guests INTEGER NOT NULL CHECK (guests >= 1 AND guests <= 20),
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public to insert bookings
CREATE POLICY "Allow public insert bookings" 
ON public.bookings
FOR INSERT
TO anon
WITH CHECK (true);

-- RLS Policy: Allow authenticated users to view bookings
CREATE POLICY "Allow authenticated view bookings" 
ON public.bookings
FOR SELECT
TO authenticated
USING (true);

-- RLS Policy: Allow authenticated users to update bookings
CREATE POLICY "Allow authenticated update bookings" 
ON public.bookings
FOR UPDATE
TO authenticated
USING (true);

-- ============================================
-- TABLE 2: CONTACT MESSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_email ON public.contact_messages(email);

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public to insert messages
CREATE POLICY "Allow public insert messages" 
ON public.contact_messages
FOR INSERT
TO anon
WITH CHECK (true);

-- RLS Policy: Allow authenticated users to view messages
CREATE POLICY "Allow authenticated view messages" 
ON public.contact_messages
FOR SELECT
TO authenticated
USING (true);

-- RLS Policy: Allow authenticated users to update messages
CREATE POLICY "Allow authenticated update messages" 
ON public.contact_messages
FOR UPDATE
TO authenticated
USING (true);

-- ============================================
-- TABLE 3: SERVICES (Optional - for dynamic management)
-- ============================================
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  duration_minutes INTEGER,
  price_eur DECIMAL(10, 2),
  max_guests INTEGER DEFAULT 1,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default services
INSERT INTO public.services (name, description, duration_minutes, max_guests, active) VALUES
  ('Yoga Class', 'Group yoga session for all levels', 60, 15, true),
  ('Wim Hof Workshop', 'Breathing techniques and cold exposure training', 120, 20, true),
  ('Ice Bath Session', 'Guided cold water immersion experience', 30, 8, true),
  ('Wellness Retreat (3 days)', 'Complete 3-day wellness program', 4320, 12, true),
  ('Wellness Retreat (7 days)', 'Intensive 7-day wellness program', 10080, 12, true),
  ('Private Session', 'One-on-one personalized wellness session', 90, 1, true),
  ('Group Event', 'Custom group wellness event', 180, 30, true)
ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public to read active services
CREATE POLICY "Allow public read active services" 
ON public.services
FOR SELECT
TO anon
USING (active = true);

-- RLS Policy: Allow authenticated users to manage services
CREATE POLICY "Allow authenticated manage services" 
ON public.services
FOR ALL
TO authenticated
USING (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for bookings
CREATE TRIGGER update_bookings_updated_at 
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for contact_messages
CREATE TRIGGER update_contact_messages_updated_at 
BEFORE UPDATE ON public.contact_messages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for services
CREATE TRIGGER update_services_updated_at 
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### Step 2.3: Verify Tables Created

In Supabase Dashboard:
1. Go to **Table Editor**
2. Verify you see:
   - ✅ `bookings` table
   - ✅ `contact_messages` table
   - ✅ `services` table (with 7 rows)
3. Check each table has RLS enabled (shield icon)

### Step 2.4: Get Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)

**Save these securely - you'll need them next!**

---

## 🔧 PART 3: UPDATE APPLICATION CODE

### Step 3.1: Create Environment File

```bash
# Copy example to local env file
cp .env.example .env.local

# Edit the file
nano .env.local
# OR
code .env.local
```

**Add your Supabase credentials:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key_optional
```

**⚠️ IMPORTANT**: Never commit `.env.local` to Git!

### Step 3.2: Update Booking Component

Edit `components/Booking.tsx`:

**Find this code (around line 39-51):**
```typescript
const onSubmit = async (data: BookingFormData) => {
  setIsSubmitting(true);
  
  // Simulate API call - replace with actual Supabase integration
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  console.log("Booking data:", data);
  setSubmitSuccess(true);
  setIsSubmitting(false);
  reset();
  
  setTimeout(() => setSubmitSuccess(false), 5000);
};
```

**Replace with:**
```typescript
const onSubmit = async (data: BookingFormData) => {
  setIsSubmitting(true);
  
  try {
    const { error } = await supabase
      .from('bookings')
      .insert([{
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        date: data.date,
        time: data.time,
        guests: data.guests,
        message: data.message || null,
      }]);
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Booking submitted successfully!');
    setSubmitSuccess(true);
    reset();
    setTimeout(() => setSubmitSuccess(false), 5000);
  } catch (error) {
    console.error('Error submitting booking:', error);
    alert('Failed to submit booking. Please try again or contact us directly.');
  } finally {
    setIsSubmitting(false);
  }
};
```

**Add import at top of file (around line 6):**
```typescript
import { supabase } from '@/lib/supabase';
```

### Step 3.3: Update Contact Component

Edit `components/Contact.tsx`:

**Find this code (around line 21-33):**
```typescript
const onSubmit = async (data: ContactFormData) => {
  setIsSubmitting(true);
  
  // Simulate API call - replace with actual Supabase integration
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  console.log("Contact data:", data);
  setSubmitSuccess(true);
  setIsSubmitting(false);
  reset();
  
  setTimeout(() => setSubmitSuccess(false), 5000);
};
```

**Replace with:**
```typescript
const onSubmit = async (data: ContactFormData) => {
  setIsSubmitting(true);
  
  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert([{
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      }]);
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Message sent successfully!');
    setSubmitSuccess(true);
    reset();
    setTimeout(() => setSubmitSuccess(false), 5000);
  } catch (error) {
    console.error('Error submitting message:', error);
    alert('Failed to send message. Please try again or contact us directly.');
  } finally {
    setIsSubmitting(false);
  }
};
```

**Add import at top of file (around line 6):**
```typescript
import { supabase } from '@/lib/supabase';
```

### Step 3.4: Verify Supabase Client Configuration

Check `lib/supabase.ts` looks correct:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  guests: number;
  message?: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}
```

---

## 🧪 PART 4: LOCAL TESTING (CRITICAL!)

### Step 4.1: Start Development Server

```bash
# Start the dev server
npm run dev
```

**Expected output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

### Step 4.2: Open in Browser

Open: **http://localhost:3000**

**Verify all sections load:**
- ✅ Navigation
- ✅ Hero section
- ✅ About section
- ✅ Brand section
- ✅ Services grid
- ✅ Menu section
- ✅ Schedule
- ✅ Gallery
- ✅ Booking form
- ✅ Contact form
- ✅ Footer

### Step 4.3: Test Booking Form

1. Scroll to **Booking** section
2. Fill out the form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Phone: `+386 12 345 678`
   - Service: Select any
   - Date: Tomorrow's date
   - Time: Select any
   - Guests: `2`
   - Message: `Test booking`
3. Click **"Book Now"**
4. **Expected**: Green success message appears
5. **Verify in Supabase**:
   - Go to Supabase Dashboard → Table Editor → `bookings`
   - You should see your test entry!

### Step 4.4: Test Contact Form

1. Scroll to **Contact** section
2. Fill out the form:
   - Name: `Test Contact`
   - Email: `contact@example.com`
   - Subject: `Test Message`
   - Message: `This is a test message`
3. Click **"Send Message"**
4. **Expected**: Green success message appears
5. **Verify in Supabase**:
   - Go to Supabase Dashboard → Table Editor → `contact_messages`
   - You should see your test entry!

### Step 4.5: Check Browser Console

Open DevTools (F12) → Console tab

**Should NOT see:**
- ❌ Supabase connection errors
- ❌ 401 Unauthorized errors
- ❌ CORS errors
- ❌ Missing environment variable warnings

**Should see:**
- ✅ `Booking submitted successfully!` (after booking test)
- ✅ `Message sent successfully!` (after contact test)

### Step 4.6: Test Build

```bash
# Stop dev server (Ctrl+C)

# Build for production
npm run build
```

**Expected output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    XXX kB         XXX kB
└ ○ /_not-found                          XXX kB         XXX kB
```

**If build fails**, fix errors before proceeding!

### Step 4.7: Test Production Build Locally

```bash
# Start production server
npm start
```

Open: **http://localhost:3000**

**Test both forms again** to ensure they work in production mode!

---

## 📝 PART 5: CREATE NETLIFY CONFIGURATION

### Step 5.1: Create netlify.toml

Create file: `netlify.toml` in project root

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "10"

[[plugins]]
  package = "@netlify/plugin-nextjs"

# Redirects for Next.js routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

# Cache static assets
[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Step 5.2: Update .gitignore

Verify `.gitignore` includes:
```
# dependencies
/node_modules

# next.js
/.next/
/out/

# production
/build

# local env files
.env*.local
.env

# vercel
.vercel
```

### Step 5.3: Commit All Changes

```bash
# Check what's changed
git status

# Add all files
git add .

# Commit
git commit -m "Setup Supabase integration and prepare for Netlify deployment"

# Push to repository
git push origin main
```

---

## 🚀 PART 6: NETLIFY DEPLOYMENT (FINAL STEP!)

### Step 6.1: Login to Netlify CLI

```bash
# Login to Netlify
netlify login
```

**This will open browser** - authorize the CLI

### Step 6.2: Initialize Netlify Site

```bash
# Initialize new site
netlify init
```

**Follow the prompts:**

1. **What would you like to do?**
   → Select: `Create & configure a new site`

2. **Team:**
   → Select your team

3. **Site name (optional):**
   → Enter: `healthycorner`
   → (Or leave blank for auto-generated name)

4. **Your build command:**
   → Enter: `npm run build`

5. **Directory to deploy:**
   → Enter: `.next`

6. **Netlify functions folder:**
   → Press Enter (leave empty)

**Expected output:**
```
Site Created
Admin URL: https://app.netlify.com/sites/healthycorner
URL:       https://healthycorner.netlify.app
Site ID:   xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Step 6.3: Set Environment Variables on Netlify

```bash
# Set Supabase URL
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://xxxxxxxxxxxxx.supabase.co"

# Set Supabase Anon Key
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Optional: Google Maps API Key
netlify env:set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY "your_google_maps_key"
```

**Verify variables are set:**
```bash
netlify env:list
```

### Step 6.4: Deploy to Production

```bash
# Deploy to production
netlify deploy --prod
```

**Expected output:**
```
Deploy path:        /home/jack/CascadeProjects/healthy corner/.next
Functions path:     (none)
Configuration path: /home/jack/CascadeProjects/healthy corner/netlify.toml
Deploying to main site URL...
✔ Finished hashing XX files
✔ CDN requesting XX files
✔ Finished uploading XX assets
✔ Deploy is live!

Logs:              https://app.netlify.com/sites/healthycorner/deploys/...
Unique Deploy URL: https://xxxxxxxx--healthycorner.netlify.app
Website URL:       https://healthycorner.netlify.app
```

---

## ✅ PART 7: POST-DEPLOYMENT VERIFICATION

### Step 7.1: Visit Live Site

Open: **https://healthycorner.netlify.app**

**Check all sections load:**
- ✅ Navigation works
- ✅ All sections visible
- ✅ Animations working
- ✅ Mobile menu works
- ✅ Smooth scrolling works

### Step 7.2: Test Live Booking Form

1. Fill out booking form on live site
2. Submit
3. Check Supabase Dashboard for new entry
4. **If it works** ✅ - Forms are connected!
5. **If it fails** ❌ - Check browser console for errors

### Step 7.3: Test Live Contact Form

1. Fill out contact form on live site
2. Submit
3. Check Supabase Dashboard for new entry
4. **If it works** ✅ - Forms are connected!
5. **If it fails** ❌ - Check browser console for errors

### Step 7.4: Test on Mobile

Open site on mobile device:
- ✅ Responsive design works
- ✅ Mobile menu works
- ✅ Forms work on mobile
- ✅ Touch interactions work

### Step 7.5: Run Lighthouse Audit

In Chrome DevTools:
1. Open DevTools (F12)
2. Go to **Lighthouse** tab
3. Click **Analyze page load**
4. **Target scores:**
   - Performance: 80+
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 90+

---

## 🎉 SUCCESS CHECKLIST

- [ ] Supabase project created: `healthycorner`
- [ ] Database tables created and verified
- [ ] RLS policies enabled and working
- [ ] Environment variables set locally
- [ ] Booking form updated with Supabase integration
- [ ] Contact form updated with Supabase integration
- [ ] Local testing passed (both forms work)
- [ ] Production build successful
- [ ] netlify.toml created
- [ ] Changes committed to Git
- [ ] Netlify CLI logged in
- [ ] Netlify site initialized
- [ ] Environment variables set on Netlify
- [ ] Deployed to production
- [ ] Live booking form tested and working
- [ ] Live contact form tested and working
- [ ] Mobile testing completed
- [ ] Lighthouse audit passed

---

## 🔧 TROUBLESHOOTING

### Issue: Forms not submitting locally

**Check:**
1. `.env.local` file exists and has correct values
2. Restart dev server after adding env vars
3. Check browser console for errors
4. Verify Supabase URL and key are correct

**Test Supabase connection:**
```bash
# In browser console on localhost:3000
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
// Should show your Supabase URL
```

### Issue: Build fails

**Common causes:**
1. TypeScript errors - fix all type errors
2. Missing dependencies - run `npm install`
3. Syntax errors - check all files

**Fix:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Try build again
npm run build
```

### Issue: Forms work locally but not on Netlify

**Check:**
1. Environment variables set on Netlify
2. Verify with: `netlify env:list`
3. Redeploy after setting vars: `netlify deploy --prod`
4. Check Netlify deploy logs for errors

### Issue: Supabase RLS blocking inserts

**Fix:**
```sql
-- In Supabase SQL Editor, verify policies exist:
SELECT * FROM pg_policies WHERE tablename IN ('bookings', 'contact_messages');

-- If missing, re-run the RLS policy creation from Part 2
```

### Issue: CORS errors

**Fix:**
1. Go to Supabase Dashboard → Settings → API
2. Add your Netlify domain to allowed origins:
   - `https://healthycorner.netlify.app`
3. Redeploy site

---

## 📊 MONITORING & MAINTENANCE

### View Bookings

1. Go to Supabase Dashboard
2. Table Editor → `bookings`
3. View all bookings
4. Export to CSV if needed

### View Contact Messages

1. Go to Supabase Dashboard
2. Table Editor → `contact_messages`
3. View all messages
4. Update status to 'read' or 'replied'

### Check Netlify Logs

```bash
# View recent deploys
netlify deploys:list

# View site logs
netlify logs

# Check site status
netlify status
```

### Monitor Supabase Usage

1. Go to Supabase Dashboard → Settings → Usage
2. Check:
   - Database size
   - API requests
   - Bandwidth
   - Active connections

---

## 🌐 OPTIONAL: CUSTOM DOMAIN

To use `healthycorner.si`:

```bash
# Add custom domain
netlify domains:add healthycorner.si
```

**Configure DNS at your registrar:**
```
A record:     @   → 75.2.60.5
CNAME record: www → healthycorner.netlify.app
```

Wait 24-48 hours for DNS propagation.

---

## 📧 OPTIONAL: EMAIL NOTIFICATIONS

### Option 1: Supabase Webhooks

1. Go to Supabase Dashboard → Database → Webhooks
2. Create webhook for `bookings` table
3. Trigger: INSERT
4. HTTP Request to email service (SendGrid, Resend, etc.)

### Option 2: Zapier Integration

1. Connect Supabase to Zapier
2. Trigger: New row in `bookings`
3. Action: Send email via Gmail/Outlook

### Option 3: Supabase Edge Functions

Create serverless function to send emails on new bookings.

---

## 📚 RESOURCES

- **Netlify Docs**: https://docs.netlify.com/
- **Netlify CLI**: https://cli.netlify.com/
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Project README**: `README.md`

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT

1. **Add real images** - Replace gradient placeholders
2. **Update contact info** - Add real phone numbers
3. **Set up email notifications** - Get notified of new bookings
4. **Add Google Analytics** - Track visitors
5. **Configure backups** - Set up Supabase backups
6. **Add payment integration** - Stripe for deposits
7. **Create admin dashboard** - Manage bookings easily
8. **SEO optimization** - Add sitemap, meta tags
9. **Performance optimization** - Optimize images
10. **Monitor and iterate** - Based on user feedback

---

**🎉 CONGRATULATIONS! Your Healthy Corner website is now LIVE!**

**Live URL**: https://healthycorner.netlify.app
**Admin Panel**: https://app.netlify.com/sites/healthycorner
**Database**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID

---

**Created**: October 21, 2025
**Project**: Healthy Corner - Alpine Wellness Retreat
**Stack**: Next.js 14 + TypeScript + TailwindCSS + Supabase + Netlify
**Status**: ✅ Production Ready
