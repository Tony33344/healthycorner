# Healthy Corner Website - Improvement Plan

## Priority 1: Critical Items (Required for Launch)

### 1. Add Real Images
**Current Issue**: Using gradient placeholders and missing images
- [ ] Hero background image (high-quality Alpine landscape)
- [ ] Logo files already exist but verify paths
- [ ] Gallery images (8+ photos of yoga, food, ice baths, facilities, nature)
- [ ] Service section background images (optional but recommended)

**Action**: 
```bash
# Add images to: /public/images/
- hero-background.jpg
- gallery/yoga-*.jpg
- gallery/food-*.jpg
- gallery/icebath-*.jpg
- gallery/nature-*.jpg
```

### 2. Complete Contact Information
**Current Issue**: Placeholder phone numbers
- [ ] Update phone number: `+386 XX XXX XXX` → actual number
- [ ] Verify email: `info@healthycorner.si`
- [ ] Add exact location details for Camp Menina

**Files to Update**:
- `components/Footer.tsx` (lines 116, 120)
- `components/Contact.tsx` (line 99)
- `components/Booking.tsx` (line 182)

### 3. Integrate Real Backend/Database
**Current Issue**: Forms only log to console (lines 43-46 in Booking.tsx, lines 23-32 in Contact.tsx)
- [ ] Set up Supabase database (credentials in `.env`)
- [ ] Create `bookings` table
- [ ] Create `contacts` table
- [ ] Implement actual form submission handlers
- [ ] Add email notifications (SendGrid, Resend, or Supabase)

### 4. Add Google Maps Integration
**Current Issue**: Map placeholder icon only (Contact.tsx line 131-136)
- [ ] Get Google Maps API key
- [ ] Integrate interactive map with Camp Menina location
- [ ] Alternative: Use Leaflet/OpenStreetMap (free)

---

## Priority 2: Important Enhancements

### 5. Implement Proper i18n (Internationalization)
**Current Issue**: Language toggle exists but content isn't translated
- [ ] Use next-intl fully (already installed)
- [ ] Create translation files:
  - `messages/en.json`
  - `messages/sl.json`
- [ ] Translate all content (currently only nav items have Slovenian)

### 6. SEO Improvements
**Current**: Basic metadata exists
- [ ] Add Open Graph tags for social sharing
- [ ] Add structured data (JSON-LD) for local business
- [ ] Add favicon and apple-touch-icons
- [ ] Create robots.txt and sitemap.xml
- [ ] Add meta descriptions for better search rankings

**Example additions to `layout.tsx`**:
```typescript
export const metadata: Metadata = {
  // ... existing
  openGraph: {
    title: 'Healthy Corner - Alpski Zdraviliški Kamp',
    description: '...',
    url: 'https://healthycorner.si',
    siteName: 'Healthy Corner',
    images: [{ url: '/images/og-image.jpg' }],
    locale: 'en_US',
    type: 'website',
  }
}
```

### 7. Accessibility Improvements
- [ ] Add `aria-label` attributes to icon buttons
- [ ] Improve keyboard navigation
- [ ] Add skip-to-content link
- [ ] Ensure color contrast meets WCAG AA standards
- [ ] Add alt text for all images (when real images are added)

### 8. Performance Optimization
- [ ] Add `next/image` optimization for all gallery images
- [ ] Implement lazy loading for below-fold sections
- [ ] Add loading skeletons for forms
- [ ] Consider code splitting for heavy animations

### 9. Missing Functional Elements
- [ ] "Learn More" buttons in Services don't lead anywhere
- [ ] "Book" buttons in Schedule need to connect to booking form
- [ ] Gallery lightbox needs real image support
- [ ] Footer policy links need actual pages

---

## Priority 3: Nice-to-Have Features

### 10. Add Testimonials Section
- [ ] Create new `Testimonials.tsx` component
- [ ] Add between Gallery and Booking sections
- [ ] Show customer reviews/success stories

### 11. Blog/News Section
- [ ] Add blog for wellness tips, recipes, updates
- [ ] Use Next.js 14 App Router for dynamic routes
- [ ] Integrate with CMS (Contentful, Sanity, or Strapi)

### 12. Online Payment Integration
- [ ] Add Stripe or PayPal for advance booking payments
- [ ] Implement deposit system for retreats
- [ ] Add pricing tiers and packages

### 13. User Dashboard
- [ ] Allow users to create accounts
- [ ] View booking history
- [ ] Manage preferences
- [ ] Track wellness progress

### 14. Email Marketing
- [ ] Newsletter signup form
- [ ] Integrate with Mailchimp or ConvertKit
- [ ] Send wellness tips, class updates

### 15. Social Proof Elements
- [ ] Instagram feed integration
- [ ] Live class availability counter
- [ ] "Recently booked" notifications (social proof)

### 16. Mobile App
- [ ] Progressive Web App (PWA) features
- [ ] Add to home screen functionality
- [ ] Offline access to schedule

---

## Quick Fixes (Can Do Now)

### Fix 1: Add Missing Import
**File**: `components/Menu.tsx` line 41
**Issue**: `Utensils` import is at the bottom
**Fix**: Already imported, just poor placement

### Fix 2: Improve Hero Background
**File**: `components/Hero.tsx` line 15
**Current**: Gradient placeholder
**Quick Fix**: Add a free stock photo from Unsplash/Pexels

### Fix 3: Update Statistics
**Files**: `components/About.tsx`, `components/BrandSection.tsx`
**Issue**: Stats might not be accurate (500+ guests, 5+ years)
**Fix**: Update with real numbers or remove

### Fix 4: Add Environment Variables
**File**: Create/update `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_maps_key
```

---

## Technical Debt

### Code Quality
- [ ] Add proper TypeScript types for all props
- [ ] Extract magic numbers/strings to constants
- [ ] Add error boundaries for better error handling
- [ ] Add loading states for async operations
- [ ] Write unit tests (Jest + React Testing Library)

### Security
- [ ] Add CSRF protection for forms
- [ ] Implement rate limiting on API routes
- [ ] Sanitize user inputs
- [ ] Add Content Security Policy headers

---

## Recommended Implementation Order

1. **Week 1**: Add real images, complete contact info, fix critical visual issues
2. **Week 2**: Set up database, implement form submissions, email notifications
3. **Week 3**: Add Google Maps, improve SEO, accessibility fixes
4. **Week 4**: Full i18n implementation, performance optimization
5. **Week 5+**: Nice-to-have features based on user feedback

---

## Resources Needed

- **Images**: 15-20 high-quality photos of facilities, classes, food, location
- **API Keys**: Google Maps, email service (SendGrid/Resend)
- **Content**: Complete translations for Slovenian version
- **Legal**: Privacy policy, terms of service, cookie policy content
- **Hosting**: Domain (healthycorner.si), hosting (Vercel recommended for Next.js)

---

## Estimated Effort

- **Priority 1**: 2-3 days
- **Priority 2**: 1-2 weeks
- **Priority 3**: 2-4 weeks
- **Total MVP**: 3-4 weeks with 1 developer

---

## Next Steps

1. Review this plan and prioritize based on launch timeline
2. Gather all required images and content
3. Set up necessary third-party services (Supabase, email, maps)
4. Start with Priority 1 items
5. Test thoroughly on multiple devices
6. Launch! 🚀
