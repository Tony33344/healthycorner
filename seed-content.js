#!/usr/bin/env node

/**
 * Seed site_content table with current website content
 */

const https = require('https');

const SUPABASE_URL = 'https://srdteagscxuhybzdagmm.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyZHRlYWdzY3h1aHliemRhZ21tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDY2NzU5MiwiZXhwIjoyMDc2MjQzNTkyfQ.2QoGcSoMbS4uUGV1AsBMLK1h-fqFM0WMlPxO1pDHLMI';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SUPABASE_URL);
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      }
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(response)}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

const contentItems = [
  // Hero Section
  {
    section: 'hero',
    key: 'title',
    value: 'healthy corner',
    published: true
  },
  {
    section: 'hero',
    key: 'subtitle',
    value: 'ALPSKI ZDRAVILIŠKI KAMP',
    published: true
  },
  {
    section: 'hero',
    key: 'description',
    value: 'Your wellness sanctuary in the heart of the Alps. Experience transformation through healthy living, yoga, and cold therapy.',
    published: true
  },
  {
    section: 'hero',
    key: 'background_image',
    value: null,
    image_url: '/images/hero-bg.jpg',
    published: true
  },

  // About Section
  {
    section: 'about',
    key: 'heading',
    value: 'Your Journey to Wellness Begins Here',
    published: true
  },
  {
    section: 'about',
    key: 'intro1',
    value: 'Nestled in the breathtaking Camp Menina, Healthy Corner is more than just a wellness retreat—it\'s a transformative experience that reconnects you with your body, mind, and nature.',
    published: true
  },
  {
    section: 'about',
    key: 'intro2',
    value: 'We combine ancient wisdom with modern wellness practices, offering a unique blend of nutritious cuisine, yoga, the powerful Wim Hof method, and invigorating ice baths. Our mission is to help you discover your optimal health and vitality in the pure Alpine air.',
    published: true
  },

  // Brand Section
  {
    section: 'brand',
    key: 'heading',
    value: 'The Healthy Corner Way',
    published: true
  },
  {
    section: 'brand',
    key: 'description',
    value: 'Our philosophy combines ancient wisdom with modern wellness science',
    published: true
  },

  // Services Section
  {
    section: 'services',
    key: 'heading',
    value: 'Our Services',
    published: true
  },
  {
    section: 'services',
    key: 'description',
    value: 'Discover our range of wellness services designed to transform your health and vitality',
    published: true
  },

  // Menu Section
  {
    section: 'menu',
    key: 'heading',
    value: 'Healthy Menu',
    published: true
  },
  {
    section: 'menu',
    key: 'description',
    value: 'Nourish your body with our organic, locally-sourced meals',
    published: true
  },

  // Schedule Section
  {
    section: 'schedule',
    key: 'heading',
    value: 'Daily Schedule',
    published: true
  },
  {
    section: 'schedule',
    key: 'description',
    value: 'A typical day at Healthy Corner wellness retreat',
    published: true
  },

  // Gallery Section
  {
    section: 'gallery',
    key: 'heading',
    value: 'Gallery',
    published: true
  },
  {
    section: 'gallery',
    key: 'description',
    value: 'Experience the beauty of our wellness retreat through images',
    published: true
  },

  // Testimonials Section
  {
    section: 'testimonials',
    key: 'heading',
    value: 'What Our Guests Say',
    published: true
  },
  {
    section: 'testimonials',
    key: 'description',
    value: 'Real stories from people who transformed their lives at Healthy Corner',
    published: true
  },

  // Shop Section
  {
    section: 'shop',
    key: 'heading',
    value: 'Wellness Shop',
    published: true
  },
  {
    section: 'shop',
    key: 'description',
    value: 'Premium wellness products and retreat packages',
    published: true
  },

  // Booking Section
  {
    section: 'booking',
    key: 'heading',
    value: 'Book Your Experience',
    published: true
  },
  {
    section: 'booking',
    key: 'description',
    value: 'Reserve your spot for a transformative wellness journey',
    published: true
  },

  // Newsletter Section
  {
    section: 'newsletter',
    key: 'heading',
    value: 'Stay Connected',
    published: true
  },
  {
    section: 'newsletter',
    key: 'description',
    value: 'Subscribe to our newsletter for wellness tips and exclusive offers',
    published: true
  },
  {
    section: 'newsletter',
    key: 'button_text',
    value: 'Subscribe',
    published: true
  },

  // Contact Section
  {
    section: 'contact',
    key: 'heading',
    value: 'Get in Touch',
    published: true
  },
  {
    section: 'contact',
    key: 'address',
    value: 'Camp Menina, Mozirje, Slovenia',
    published: true
  },
  {
    section: 'contact',
    key: 'phone',
    value: '+386 XX XXX XXX',
    published: true
  },
  {
    section: 'contact',
    key: 'email',
    value: 'info@healthycorner.si',
    published: true
  }
];

async function seedContent() {
  console.log('🌱 Seeding site content...\n');

  for (const item of contentItems) {
    try {
      console.log(`  Upserting ${item.section}.${item.key}...`);
      await makeRequest('POST', '/rest/v1/site_content', item);
      console.log(`  ✅ ${item.section}.${item.key}`);
    } catch (error) {
      console.error(`  ❌ Failed to upsert ${item.section}.${item.key}:`, error.message);
    }
  }

  console.log('\n✨ Content seeding complete!\n');
}

seedContent().catch(console.error);
