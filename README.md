# Healthy Corner - Wellness Retreat Website

A modern, full-featured wellness retreat website with admin CMS, e-commerce, and media management. Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## 🚀 New Features
- ✅ **Admin CMS** - Full content management system
- ✅ **Media Manager** - Upload and manage gallery images
- ✅ **E-Commerce** - Product catalog with shopping cart
- ✅ **Order Management** - Track and manage orders
- ✅ **Real Images** - Gallery with actual ice bath & food photos
- ✅ **Testing Suite** - Playwright end-to-end tests

## ⚡ Quick Start

**IMPORTANT**: You need Supabase credentials to run this app.

### Option 1: Automated Setup
```bash
./setup.sh
```

### Option 2: Manual Setup
See **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for detailed instructions.

### Quick Steps
1. Create Supabase project at https://supabase.com
2. Copy `.env.example` to `.env.local`
3. Add your Supabase credentials
4. Run migrations from `supabase-setup.sql`
5. Create storage buckets (`gallery`, `products`)
6. Create admin user
7. Run `npm install && npm run dev`

**Full guide**: [QUICK_START.md](./QUICK_START.md)

## 🌿 Features

- **Modern Design**: Clean, energetic design with lime green (#A4B82C) brand colors
- **Responsive**: Fully responsive design that works on all devices
- **Interactive**: Smooth animations and transitions using Framer Motion
- **Booking System**: Online booking for classes and wellness programs
- **Multi-language**: Support for Slovenian and English (toggle in navigation)
- **Gallery**: Beautiful image gallery with category filtering
- **Schedule**: Weekly class schedule with detailed information
- **Menu**: Comprehensive food menu with dietary tags
- **Contact Form**: Easy-to-use contact form with validation

## 🚀 Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Backend**: Supabase (for bookings and contact messages)
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   cd /home/jack/CascadeProjects/windsurf-project-3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Add your Supabase credentials
   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Supabase Setup

To enable the booking and contact forms, you need to set up Supabase:

1. Create a new project at [supabase.com](https://supabase.com)

2. Create the following tables:

### Bookings Table
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

### Contact Messages Table
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

3. Add your Supabase URL and anon key to `.env.local`

## 🎨 Brand Identity

- **Primary Color**: Lime Green (#A4B82C)
- **Logo**: Circular design with lowercase 'h' and smile
- **Tagline**: "ALPSKI ZDRAVILIŠKI KAMP" (Alpine Health Camp)
- **Typography**: Clean, modern sans-serif (Inter)

## 📁 Project Structure

```
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── Navigation.tsx       # Header navigation
│   ├── Hero.tsx            # Hero section
│   ├── About.tsx           # About section
│   ├── Services.tsx        # Services section
│   ├── Menu.tsx            # Food menu section
│   ├── Schedule.tsx        # Class schedule
│   ├── Gallery.tsx         # Image gallery
│   ├── Booking.tsx         # Booking form
│   ├── Contact.tsx         # Contact section
│   └── Footer.tsx          # Footer
├── lib/
│   ├── utils.ts            # Utility functions
│   └── supabase.ts         # Supabase client
└── public/
    └── images/             # Add your images here
```

## 🖼️ Adding Images

Replace the gradient placeholders with actual images:

1. Add images to the `public/images/` directory
2. Update the components to use actual images instead of gradient backgrounds
3. Recommended image locations:
   - Hero section: `public/images/hero.jpg`
   - Gallery: `public/images/gallery/`
   - Services: `public/images/services/`

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Build for Production

```bash
npm run build
npm start
```

## 📝 Customization

### Colors
Edit `tailwind.config.ts` to change the primary color scheme.

### Content
- Update text content in each component file
- Modify menu items in `components/Menu.tsx`
- Update schedule in `components/Schedule.tsx`
- Change services in `components/Services.tsx`

### Multi-language
The navigation includes a language toggle. To fully implement multi-language support:
1. Use `next-intl` library (already included)
2. Create translation files
3. Update components to use translations

## 🤝 Support

For questions or support, contact:
- Email: info@healthycorner.si
- Phone: +386 XX XXX XXX

## 📄 License

© 2024 Healthy Corner. All rights reserved.
