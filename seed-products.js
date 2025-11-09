#!/usr/bin/env node

/**
 * Seed sample products into the database
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
        'Prefer': 'return=representation'
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

const sampleProducts = [
  {
    name: '3-Day Wellness Retreat',
    slug: '3-day-wellness-retreat',
    description: 'Immerse yourself in nature with yoga, ice baths, and healthy meals',
    long_description: 'A transformative 3-day experience combining daily yoga sessions, Wim Hof breathing workshops, ice bath therapy, and nutritious organic meals. Perfect for beginners looking to reset and recharge.',
    price: 299.00,
    compare_at_price: 399.00,
    category: 'retreat',
    stock_quantity: 10,
    track_inventory: true,
    published: true,
    featured: true,
    metadata: {
      duration: '3 days',
      includes: ['Accommodation', 'All meals', 'Yoga classes', 'Ice bath sessions', 'Breathing workshops']
    }
  },
  {
    name: '7-Day Wellness Retreat',
    slug: '7-day-wellness-retreat',
    description: 'Complete wellness transformation with extended retreat experience',
    long_description: 'Our signature 7-day retreat offers a deep dive into holistic wellness. Includes daily yoga, meditation, ice bath therapy, Wim Hof method training, forest bathing, and gourmet healthy cuisine.',
    price: 699.00,
    compare_at_price: 899.00,
    category: 'retreat',
    stock_quantity: 8,
    track_inventory: true,
    published: true,
    featured: true,
    metadata: {
      duration: '7 days',
      includes: ['Accommodation', 'All meals', 'Daily yoga', 'Ice bath sessions', 'Workshops', 'Massage']
    }
  },
  {
    name: 'Wim Hof Method Workshop',
    slug: 'wim-hof-workshop',
    description: 'Learn the powerful breathing technique and cold exposure method',
    long_description: 'A comprehensive 4-hour workshop teaching the Wim Hof breathing technique, cold exposure training, and mindset practices. Includes theory, practice sessions, and ice bath experience.',
    price: 89.00,
    compare_at_price: null,
    category: 'workshop',
    stock_quantity: 20,
    track_inventory: true,
    published: true,
    featured: true,
    metadata: {
      duration: '4 hours',
      level: 'All levels',
      includes: ['Breathing session', 'Ice bath', 'Training materials']
    }
  },
  {
    name: 'Private Yoga Session',
    slug: 'private-yoga-session',
    description: 'One-on-one personalized yoga instruction',
    long_description: 'Personalized yoga session tailored to your needs and goals. Perfect for beginners or those wanting focused attention on specific areas.',
    price: 60.00,
    compare_at_price: null,
    category: 'workshop',
    stock_quantity: 50,
    track_inventory: true,
    published: true,
    featured: false,
    metadata: {
      duration: '60 minutes',
      level: 'All levels'
    }
  },
  {
    name: 'Organic Herbal Tea Blend',
    slug: 'organic-herbal-tea',
    description: 'Our signature wellness tea blend',
    long_description: 'A carefully crafted blend of organic herbs including chamomile, mint, and alpine flowers. Supports relaxation and digestion. 100g package.',
    price: 15.00,
    compare_at_price: null,
    category: 'food',
    stock_quantity: 100,
    track_inventory: true,
    published: true,
    featured: false,
    metadata: {
      weight: '100g',
      organic: true,
      ingredients: ['Chamomile', 'Mint', 'Alpine flowers']
    }
  },
  {
    name: 'Healthy Corner T-Shirt',
    slug: 'healthy-corner-tshirt',
    description: 'Organic cotton t-shirt with our logo',
    long_description: 'Comfortable organic cotton t-shirt featuring the Healthy Corner logo. Available in multiple sizes. Perfect for yoga and casual wear.',
    price: 25.00,
    compare_at_price: null,
    category: 'merchandise',
    stock_quantity: 50,
    track_inventory: true,
    published: true,
    featured: false,
    metadata: {
      material: 'Organic cotton',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['White', 'Green']
    }
  },
  {
    name: 'Monthly Membership',
    slug: 'monthly-membership',
    description: 'Unlimited access to all yoga classes',
    long_description: 'Monthly membership includes unlimited yoga classes, access to ice bath facilities, and 10% discount on workshops and retreats.',
    price: 99.00,
    compare_at_price: null,
    category: 'membership',
    stock_quantity: 999,
    track_inventory: false,
    published: true,
    featured: true,
    metadata: {
      duration: '30 days',
      includes: ['Unlimited yoga', 'Ice bath access', '10% workshop discount']
    }
  }
];

async function seedProducts() {
  console.log('🌱 Seeding products...\n');
  
  for (const product of sampleProducts) {
    try {
      console.log(`Creating: ${product.name}...`);
      const result = await makeRequest('POST', '/rest/v1/products', product);
      console.log(`✅ Created: ${product.name}`);
    } catch (error) {
      if (error.message.includes('duplicate') || error.message.includes('409')) {
        console.log(`ℹ️  Already exists: ${product.name}`);
      } else {
        console.error(`❌ Error creating ${product.name}:`, error.message);
      }
    }
  }
  
  console.log('\n✨ Product seeding complete!\n');
}

seedProducts().catch(console.error);
