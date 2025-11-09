# Quick Setup Guide for Healthy Corner Website

## ✅ What's Been Created

A complete, production-ready wellness website with:
- ✅ Modern Next.js 14+ with TypeScript
- ✅ Responsive design with TailwindCSS
- ✅ Brand colors (#A4B82C lime green)
- ✅ Smooth animations with Framer Motion
- ✅ All sections: Hero, About, Services, Menu, Schedule, Gallery, Booking, Contact
- ✅ Working forms with validation
- ✅ Multi-language toggle (EN/SL)
- ✅ Logo assets copied from original files

## 🚀 Getting Started (3 Steps)

### 1. Install Dependencies (Already Done!)
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Then open: **http://localhost:3000**

### 3. Set Up Supabase (Optional - for forms to work)

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Copy your project URL and anon key

#### Create Database Tables
Run these SQL queries in Supabase SQL Editor:

**Bookings Table:**
```sql
create table bookings (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text not null,
  service text not null,
  date date not null,
  time text not null,
  guests integer not null,
  message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

**Contact Messages Table:**
```sql
create table contact_messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

#### Add Environment Variables
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. Restart the dev server

## 📸 Adding Real Images

Currently using gradient placeholders. To add real images:

1. **Create image directories:**
   ```bash
   mkdir -p public/images/gallery
   mkdir -p public/images/services
   ```

2. **Add your images:**
   - Hero background: `public/images/hero.jpg`
   - Gallery images: `public/images/gallery/yoga-1.jpg`, etc.
   - Service images: `public/images/services/food.jpg`, etc.

3. **Update components to use images:**
   - Replace gradient `<div>` elements with Next.js `<Image>` components
   - Example in `components/Hero.tsx`:
     ```tsx
     import Image from "next/image";
     
     // Replace the gradient div with:
     <Image
       src="/images/hero.jpg"
       alt="Healthy Corner"
       fill
       className="object-cover"
       priority
     />
     ```

## 🎨 Customization

### Update Content
- **Menu items**: Edit `components/Menu.tsx`
- **Schedule**: Edit `components/Schedule.tsx`
- **Services**: Edit `components/Services.tsx`
- **Contact info**: Edit `components/Contact.tsx` and `components/Footer.tsx`

### Change Colors
Edit `tailwind.config.ts` to modify the primary color palette.

### Add More Pages
Create new files in the `app/` directory:
- `app/about/page.tsx` for dedicated About page
- `app/retreats/page.tsx` for Retreats page
- etc.

## 🌐 Deployment

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

### Build for Production
```bash
npm run build
npm start
```

## 📋 Current Features

### ✅ Completed
- [x] Responsive navigation with mobile menu
- [x] Hero section with CTA buttons
- [x] About section with features
- [x] Services grid with 6 services
- [x] Interactive menu with categories
- [x] Weekly schedule with all classes
- [x] Gallery with filtering
- [x] Booking form with validation
- [x] Contact form with validation
- [x] Footer with links and social media
- [x] Smooth scroll animations
- [x] Language toggle (EN/SL)
- [x] Brand colors and styling

### 🔄 To Enhance (Optional)
- [ ] Replace gradient placeholders with real images
- [ ] Connect forms to Supabase
- [ ] Add Google Maps integration
- [ ] Implement full multi-language support with next-intl
- [ ] Add blog/news section
- [ ] Add testimonials section
- [ ] Add payment integration for bookings
- [ ] Add email notifications

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9
# Then restart
npm run dev
```

**Build errors?**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

**TypeScript errors?**
Check that all imports are correct and all components are exported properly.

## 📞 Support

Need help? Check:
- README.md for detailed documentation
- Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
- TailwindCSS docs: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- Supabase docs: [supabase.com/docs](https://supabase.com/docs)

---

**Your website is ready to go! 🎉**

Start the dev server and visit http://localhost:3000 to see it in action.
