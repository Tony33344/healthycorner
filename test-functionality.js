#!/usr/bin/env node

/**
 * Manual functionality test script
 * Tests all major features without Playwright
 */

const https = require('https');

const SUPABASE_URL = 'https://srdteagscxuhybzdagmm.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyZHRlYWdzY3h1aHliemRhZ21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Njc1OTIsImV4cCI6MjA3NjI0MzU5Mn0.bRMXkRwvyRyZoDrTbRJzmABR5Zm0X0Luv0DhfC4IFXM';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SUPABASE_URL);
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${ANON_KEY}`,
        'apikey': ANON_KEY,
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
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

async function testProducts() {
  console.log('\n📦 Testing Products...');
  try {
    const result = await makeRequest('GET', '/rest/v1/products?select=*&published=eq.true');
    if (result.status === 200 && Array.isArray(result.data)) {
      console.log(`✅ Products: Found ${result.data.length} published products`);
      result.data.slice(0, 3).forEach(p => {
        console.log(`   - ${p.name}: €${p.price}`);
      });
      return true;
    } else {
      console.log(`❌ Products: Failed (status ${result.status})`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Products: Error - ${error.message}`);
    return false;
  }
}

async function testBookingSubmission() {
  console.log('\n📅 Testing Booking Submission...');
  try {
    const testBooking = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+386 123 456 789',
      service: 'Yoga Class',
      date: '2025-12-01',
      time: '09:00',
      guests: 2,
      message: 'Test booking from automated test'
    };
    
    const result = await makeRequest('POST', '/rest/v1/bookings', testBooking);
    if (result.status === 201) {
      console.log('✅ Booking: Successfully created test booking');
      return true;
    } else {
      console.log(`❌ Booking: Failed (status ${result.status})`);
      console.log('   Response:', result.data);
      return false;
    }
  } catch (error) {
    console.log(`❌ Booking: Error - ${error.message}`);
    return false;
  }
}

async function testContactSubmission() {
  console.log('\n📧 Testing Contact Form...');
  try {
    const testMessage = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Message',
      message: 'This is a test message from automated test'
    };
    
    const result = await makeRequest('POST', '/rest/v1/contact_messages', testMessage);
    if (result.status === 201) {
      console.log('✅ Contact: Successfully created test message');
      return true;
    } else {
      console.log(`❌ Contact: Failed (status ${result.status})`);
      console.log('   Response:', result.data);
      return false;
    }
  } catch (error) {
    console.log(`❌ Contact: Error - ${error.message}`);
    return false;
  }
}

async function testGalleryItems() {
  console.log('\n🖼️  Testing Gallery...');
  try {
    const result = await makeRequest('GET', '/rest/v1/gallery_items?select=*&published=eq.true');
    if (result.status === 200) {
      console.log(`✅ Gallery: Found ${result.data.length} published items`);
      return true;
    } else {
      console.log(`❌ Gallery: Failed (status ${result.status})`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Gallery: Error - ${error.message}`);
    return false;
  }
}

async function testAdminProfile() {
  console.log('\n👤 Testing Admin Profile...');
  try {
    const result = await makeRequest('GET', '/rest/v1/profiles?select=*&email=eq.admin@healthycorner.com');
    if (result.status === 200 && result.data.length > 0) {
      const admin = result.data[0];
      if (admin.role === 'admin') {
        console.log('✅ Admin: Profile exists with admin role');
        console.log(`   Email: ${admin.email}`);
        console.log(`   Role: ${admin.role}`);
        return true;
      } else {
        console.log(`❌ Admin: Profile exists but role is '${admin.role}' instead of 'admin'`);
        return false;
      }
    } else {
      console.log('❌ Admin: Profile not found');
      return false;
    }
  } catch (error) {
    console.log(`❌ Admin: Error - ${error.message}`);
    return false;
  }
}

async function testOrders() {
  console.log('\n🛒 Testing Orders...');
  try {
    const result = await makeRequest('GET', '/rest/v1/orders?select=*&limit=5');
    if (result.status === 200) {
      console.log(`✅ Orders: Found ${result.data.length} orders`);
      return true;
    } else {
      console.log(`❌ Orders: Failed (status ${result.status})`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Orders: Error - ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🧪 Healthy Corner - Functionality Tests');
  console.log('========================================');
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log('');

  const results = {
    products: await testProducts(),
    booking: await testBookingSubmission(),
    contact: await testContactSubmission(),
    gallery: await testGalleryItems(),
    admin: await testAdminProfile(),
    orders: await testOrders(),
  };

  console.log('\n========================================');
  console.log('📊 Test Summary:');
  console.log('========================================');
  
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, result]) => {
    console.log(`${result ? '✅' : '❌'} ${test.padEnd(15)} ${result ? 'PASSED' : 'FAILED'}`);
  });
  
  console.log('========================================');
  console.log(`Result: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Application is working correctly.');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please review the errors above.');
    process.exit(1);
  }
}

main().catch(console.error);
