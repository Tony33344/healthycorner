import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) throw new Error('Supabase not configured');
  return createClient(supabaseUrl, anonKey);
}

export async function GET(req: Request) {
  try {
    const supabase = getClient();
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');
    
    let query = supabase
      .from('site_content')
      .select('*')
      .eq('published', true)
      .order('key', { ascending: true });
    
    if (section) {
      query = query.eq('section', section);
    }
    
    const { data, error } = await query;
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    const res = NextResponse.json({ content: data ?? [] });
    res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
