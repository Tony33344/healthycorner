#!/usr/bin/env node

/**
 * Supabase Setup Script
 * Creates storage buckets and admin user
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

async function createBucket(name) {
  try {
    console.log(`Creating bucket: ${name}...`);
    await makeRequest('POST', '/storage/v1/bucket', {
      id: name,
      name: name,
      public: true,
      file_size_limit: 52428800, // 50MB
      allowed_mime_types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    });
    console.log(`✅ Bucket '${name}' created successfully`);
  } catch (error) {
    if (error.message.includes('already exists') || error.message.includes('409')) {
      console.log(`ℹ️  Bucket '${name}' already exists`);
    } else {
      console.error(`❌ Error creating bucket '${name}':`, error.message);
    }
  }
}

async function createAdminUser() {
  try {
    console.log('\nCreating admin user...');
    const email = 'admin@healthycorner.com';
    const password = 'admin123';
    
    // Create user via admin API
    const user = await makeRequest('POST', '/auth/v1/admin/users', {
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'admin'
      }
    });
    
    console.log(`✅ Admin user created: ${email}`);
    console.log(`   User ID: ${user.id}`);
    
    // Update profile role
    try {
      await makeRequest('POST', '/rest/v1/rpc/set_user_role', {
        user_id: user.id,
        new_role: 'admin'
      });
      console.log(`✅ Admin role set in profiles table`);
    } catch (e) {
      console.log(`ℹ️  Profile update: ${e.message}`);
    }
    
  } catch (error) {
    if (error.message.includes('already exists') || error.message.includes('User already registered')) {
      console.log(`ℹ️  Admin user already exists`);
    } else {
      console.error(`❌ Error creating admin user:`, error.message);
    }
  }
}

async function checkTables() {
  try {
    console.log('\nChecking database tables...');
    const tables = await makeRequest('GET', '/rest/v1/?select=*');
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting Supabase setup...\n');
  console.log(`Project URL: ${SUPABASE_URL}\n`);
  
  // Create storage buckets
  await createBucket('gallery');
  await createBucket('products');
  
  // Create admin user
  await createAdminUser();
  
  // Check database
  await checkTables();
  
  console.log('\n✨ Setup complete!\n');
  console.log('Next steps:');
  console.log('1. Run: npm install');
  console.log('2. Run: npm run dev');
  console.log('3. Visit: http://localhost:3000');
  console.log('4. Login with: admin@healthycorner.com / admin123\n');
}

main().catch(console.error);
