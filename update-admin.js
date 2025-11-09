#!/usr/bin/env node

/**
 * Update admin role in profiles table
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

async function updateAdminRole() {
  try {
    console.log('Updating admin role...');
    
    // Update profile role
    const result = await makeRequest(
      'PATCH',
      '/rest/v1/profiles?email=eq.admin@healthycorner.com',
      { role: 'admin' }
    );
    
    console.log('✅ Admin role updated successfully');
    console.log('Result:', result);
    
    // Verify
    const profile = await makeRequest(
      'GET',
      '/rest/v1/profiles?email=eq.admin@healthycorner.com&select=*'
    );
    
    console.log('\n✅ Verified profile:');
    console.log(profile);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateAdminRole();
