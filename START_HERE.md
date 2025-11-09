# 👋 START HERE - Healthy Corner Setup

## 🎯 What You Have

A complete wellness retreat website with:
- ✅ Public website (homepage, gallery, shop, booking, contact)
- ✅ Admin dashboard (manage bookings, messages, products, orders)
- ✅ Media manager (upload & organize images)
- ✅ E-commerce system (products, cart, checkout)
- ✅ Real images already loaded (ice bath & healthy food photos)
- ✅ Testing suite (Playwright)

## ⚠️ What You Need to Do

### The app won't work fully until you configure Supabase!

**Why?** The app needs a database (Supabase) to store:
- Bookings
- Contact messages
- Products
- Orders
- Gallery images
- User accounts

**How long?** 5-10 minutes

---

## 🚀 Setup in 3 Steps

### Step 1: Get Supabase Credentials (3 min)

1. Go to https://supabase.com/dashboard
2. Sign up / Login (free)
3. Click "New Project"
4. Name: `healthycorner`
5. Create a password (save it!)
6. Wait 2-3 minutes

7. Go to Settings > API
8. Copy these 3 values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`)

### Step 2: Configure the App (1 min)

```bash
# In the project folder, create .env.local
cp .env.example .env.local
```

Edit `.env.local` and paste your values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Step 3: Setup Database (5 min)

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Open the file `supabase-setup.sql` in this project
4. Copy ALL the SQL code
5. Paste into Supabase and click "Run"
6. Wait for "Success" message

7. Go to **Storage** in Supabase
8. Create 2 buckets (both PUBLIC):
   - `gallery`
   - `products`

9. Go to **Authentication** > **Users**
10. Click "Add user" > "Create new user"
11. Email: `admin@healthycorner.com`
12. Password: (create one - save it!)
13. Check "Auto Confirm User"
14. Click "Create user"

15. Go back to **SQL Editor** and run:
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@healthycorner.com';
```

---

## ✅ Run the App

```bash
npm install
npm run dev
```

Visit: http://localhost:3000

**The yellow warning banner should be gone!**

---

## 🧪 Test Everything Works

### Public Site
- [ ] Gallery shows real images
- [ ] Shop displays products
- [ ] Can add items to cart
- [ ] Booking form works
- [ ] Contact form works

### Admin Area
- [ ] Login at http://localhost:3000/login
- [ ] Dashboard loads
- [ ] See bookings & messages tabs
- [ ] See products tab (with sample products)
- [ ] See orders tab
- [ ] Media manager at http://localhost:3000/admin/media
- [ ] Can upload an image

---

## 📚 Documentation

### For Setup
- **SETUP_GUIDE.md** - Detailed setup instructions
- **QUICK_START.md** - Fast setup guide
- **CURRENT_STATUS.md** - What's done & what's needed

### For Features
- **CMS_ECOMMERCE_GUIDE.md** - How to use admin features
- **IMPLEMENTATION_COMPLETE.md** - Technical details

### For Deployment
- **DEPLOYMENT_INSTRUCTIONS.md** - Deploy to Netlify

---

## 🆘 Troubleshooting

### Yellow warning banner won't go away
→ Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

### "Invalid API key" error
→ Check `.env.local` has correct values from Supabase

### "Table does not exist"
→ Run the SQL from `supabase-setup.sql` in Supabase Dashboard

### Can't upload images
→ Create storage buckets in Supabase Dashboard > Storage

### Can't login as admin
→ Make sure you ran the UPDATE query to set role = 'admin'

---

## 🎉 What's Next?

After setup works:

1. **Customize Products**
   - Login to admin
   - Go to Products tab
   - Edit or add products

2. **Upload Gallery Images**
   - Go to Media Manager
   - Upload your own images
   - Organize by category

3. **Test Booking Flow**
   - Submit a test booking
   - Check it appears in admin dashboard

4. **Deploy to Production**
   - See DEPLOYMENT_INSTRUCTIONS.md
   - Deploy to Netlify

---

## 📞 Need Help?

1. Check **CURRENT_STATUS.md** for common issues
2. Review **SETUP_GUIDE.md** for detailed steps
3. Check Supabase logs in dashboard
4. Review browser console for errors

---

**Time Required**: 10-15 minutes total  
**Difficulty**: Beginner-friendly  
**Cost**: Free (using Supabase free tier)

**Let's get started! 🚀**
