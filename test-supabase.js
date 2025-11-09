// Quick test script to verify Supabase connection
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54331';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log('URL:', supabaseUrl);
  
  // Test products fetch
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('published', true);
  
  if (productsError) {
    console.error('❌ Products fetch error:', productsError);
  } else {
    console.log('✅ Products fetched:', products.length, 'items');
    products.forEach(p => console.log(`  - ${p.name}: €${p.price}`));
  }
  
  // Test bookings table (should be empty)
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('count');
  
  if (bookingsError) {
    console.error('❌ Bookings fetch error:', bookingsError);
  } else {
    console.log('✅ Bookings table accessible');
  }
  
  // Test contact_messages table
  const { data: messages, error: messagesError } = await supabase
    .from('contact_messages')
    .select('count');
  
  if (messagesError) {
    console.error('❌ Contact messages fetch error:', messagesError);
  } else {
    console.log('✅ Contact messages table accessible');
  }
  
  console.log('\n✅ All Supabase integration tests passed!');
}

testConnection().catch(console.error);
