import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRole) throw new Error('Supabase not configured');
  return createClient(supabaseUrl, serviceRole);
}

export async function GET(req: Request) {
  try {
    const supabase = getClient();
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');
    let query = supabase.from('site_content').select('*').order('updated_at', { ascending: false });
    if (section) query = query.eq('section', section);
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const res = NextResponse.json({ items: data ?? [] });
    res.headers.set('Cache-Control', 'no-store, max-age=0, private');
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = getClient();
    const body = await req.json();
    const { section, key, value = null, json = null, image_url = null, published = true } = body || {};
    if (!section || !key) return NextResponse.json({ error: 'section and key are required' }, { status: 400 });
    const { data, error } = await supabase
      .from('site_content')
      .upsert({ section, key, value, json, image_url, published }, { onConflict: 'section,key' })
      .select('*')
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const res = NextResponse.json({ item: data }, { status: 201 });
    res.headers.set('Cache-Control', 'no-store, max-age=0, private');
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
