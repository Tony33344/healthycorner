# Healthy Corner CMS & E-Commerce Guide

## Overview
This guide covers the new admin CMS and e-commerce features added to Healthy Corner.

## Features Implemented

### 1. Gallery with Real Images ✅
- **Location**: `components/Gallery.tsx`
- **Images**: Loaded from `public/images/icebath breathing/` and `public/images/izbrane hrana/`
- **Features**:
  - Category filtering (Ice Bath & Breathing, Healthy Food)
  - Lightbox modal for full-size viewing
  - Responsive Next.js Image optimization
  - Hover effects with titles and descriptions

### 2. Admin Media Manager ✅
- **Location**: `/admin/media`
- **Features**:
  - Upload images to Supabase Storage
  - Tag and categorize images
  - Publish/unpublish toggle
  - Reorder images (drag functionality)
  - Delete images
  - Filter by category
  - Real-time stats (Total, Published, Draft)

### 3. Product Management ✅
- **Location**: `/admin` (Products tab)
- **Features**:
  - Create/Edit/Delete products
  - Product fields:
    - Name, slug, description
    - Price, compare price
    - Category (retreat, workshop, merchandise, food, membership)
    - Stock tracking
    - Published/Featured status
  - Product images support (via product_images table)

### 4. Order Management ✅
- **Location**: `/admin` (Orders tab)
- **Features**:
  - View all orders
  - Update order status (pending → confirmed → processing → completed)
  - Track payment status
  - Customer information display
  - Order number generation (HC-YYYYMMDD-XXXX)

### 5. Public Shop ✅
- **Location**: `components/Shop.tsx` (added to homepage)
- **Features**:
  - Display published products
  - Add to cart functionality
  - Cart sidebar with:
    - Quantity adjustment
    - Remove items
    - Total calculation
  - Floating cart button with item count
  - Responsive design

### 6. Supabase Schema ✅
- **Location**: `supabase-setup.sql`
- **Tables Added**:
  - `profiles` - User roles (admin/customer)
  - `gallery_items` - Media management
  - `products` - Product catalog
  - `product_images` - Product image gallery
  - `orders` - Order tracking
  - `order_items` - Order line items
- **Storage Buckets**:
  - `gallery` - Gallery images
  - `products` - Product images
- **RLS Policies**: Secure admin-only mutations

### 7. Testing Suite ✅
- **Framework**: Playwright
- **Test Files**:
  - `tests/admin.spec.ts` - Admin dashboard, media manager, products, orders
  - `tests/shop.spec.ts` - Public shop, cart, gallery
- **Coverage**:
  - Admin authentication
  - Media upload workflow
  - Product CRUD operations
  - Order status updates
  - Shopping cart functionality
  - Gallery filtering and lightbox

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
npm install --save-dev @playwright/test
npx playwright install
```

### 2. Configure Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Run Database Migrations
```bash
# In Supabase Dashboard SQL Editor, run:
supabase-setup.sql
```

### 4. Create Admin User
```sql
-- In Supabase Dashboard > Authentication > Users
-- Create a new user, then run:
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-admin@email.com';
```

### 5. Create Storage Buckets
In Supabase Dashboard > Storage:
- Create bucket: `gallery` (public)
- Create bucket: `products` (public)

## Usage

### Admin Access
1. Navigate to `/login`
2. Sign in with admin credentials
3. Access features:
   - `/admin` - Main dashboard (bookings, messages, products, orders)
   - `/admin/media` - Media manager

### Media Management
1. Go to `/admin/media`
2. Click "Upload Image"
3. Select file, add title, description, category
4. Toggle "Publish immediately" if needed
5. Click "Upload Image"
6. Manage: reorder, publish/unpublish, delete

### Product Management
1. Go to `/admin` > Products tab
2. Click "Add Product"
3. Fill in product details
4. Set price, category, stock
5. Toggle published/featured status
6. Click "Save"

### Order Management
1. Go to `/admin` > Orders tab
2. View all orders with customer details
3. Update order status via dropdown
4. Track payment status

## Testing

### Run All Tests
```bash
npm test
```

### Run Tests with UI
```bash
npm run test:ui
```

### Run Specific Test File
```bash
npx playwright test tests/admin.spec.ts
```

### Test Environment Variables
Create `.env.test`:
```env
BASE_URL=http://localhost:3000
ADMIN_EMAIL=admin@healthycorner.com
ADMIN_PASSWORD=your_password
```

## API Endpoints (Future)

### Netlify Functions (Prepared)
Location: `netlify/functions/` (to be created)

Recommended functions:
- `create-order.ts` - Secure order creation
- `process-payment.ts` - Payment gateway integration
- `send-confirmation.ts` - Email notifications

## Database Schema

### Key Tables

#### profiles
```sql
- id (UUID, FK to auth.users)
- email (TEXT)
- role (TEXT: 'admin' | 'customer')
- full_name (TEXT)
```

#### gallery_items
```sql
- id (UUID)
- title (TEXT)
- description (TEXT)
- category (TEXT)
- image_url (TEXT)
- storage_path (TEXT)
- display_order (INTEGER)
- published (BOOLEAN)
```

#### products
```sql
- id (UUID)
- name (TEXT)
- slug (TEXT, UNIQUE)
- description (TEXT)
- price (DECIMAL)
- category (TEXT)
- stock_quantity (INTEGER)
- published (BOOLEAN)
- featured (BOOLEAN)
```

#### orders
```sql
- id (UUID)
- order_number (TEXT, UNIQUE)
- customer_id (UUID, FK)
- customer_email (TEXT)
- customer_name (TEXT)
- status (TEXT)
- total (DECIMAL)
- payment_status (TEXT)
```

## Security

### Row Level Security (RLS)
- **Public**: Can view published items, insert orders
- **Authenticated**: Can view own data
- **Admin**: Full CRUD access to all tables

### Storage Policies
- **Public**: Can view all images
- **Admin**: Can upload/delete images

## Deployment

### Netlify Configuration
`netlify.toml` includes:
- Build command: `npm run build`
- Publish directory: `.next`
- Environment variables setup
- Redirects for SPA routing

### Pre-Deployment Checklist
- [ ] Run database migrations
- [ ] Create admin user
- [ ] Set up storage buckets
- [ ] Configure environment variables
- [ ] Test admin login
- [ ] Upload sample products
- [ ] Run test suite
- [ ] Verify RLS policies

## Troubleshooting

### Images Not Loading
- Check Supabase Storage bucket permissions
- Verify image URLs in database
- Ensure RLS policies allow public read

### Admin Can't Upload
- Verify user role is 'admin' in profiles table
- Check storage bucket policies
- Ensure SUPABASE_SERVICE_ROLE_KEY is set

### Orders Not Creating
- Check RLS policies on orders table
- Verify order_number generation function
- Ensure customer data is valid

### Tests Failing
- Ensure dev server is running
- Check test environment variables
- Verify admin user exists
- Run `npx playwright install` for browsers

## Next Steps

### Recommended Enhancements
1. **Payment Integration**
   - Stripe or PayPal
   - Netlify Function for secure processing
   
2. **Email Notifications**
   - Order confirmations
   - Booking confirmations
   - Admin notifications

3. **Advanced Product Features**
   - Product variants (sizes, colors)
   - Product reviews
   - Related products

4. **Analytics**
   - Order analytics dashboard
   - Product performance metrics
   - Customer insights

5. **Inventory Management**
   - Low stock alerts
   - Automatic stock updates
   - Inventory history

## Support

For issues or questions:
1. Check Supabase logs
2. Review browser console
3. Check Netlify deploy logs
4. Verify environment variables

## License
Private - Healthy Corner Project
