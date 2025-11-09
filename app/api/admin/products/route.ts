import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateSlug } from '@/lib/supabase';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRole) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }
  const supabase = createClient(supabaseUrl, serviceRole);
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const res = NextResponse.json({ products: data ?? [] }, { status: 200 });
  res.headers.set('Cache-Control', 'no-store, max-age=0, private');
  return res;
}

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRole) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }
  const supabase = createClient(supabaseUrl, serviceRole);
  try {
    const body = await req.json();
    const {
      name,
      description = null,
      price,
      compare_at_price = null,
      published = false,
      featured = false,
    } = body || {};

    if (!name || price === undefined || price === null || isNaN(Number(price))) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = generateSlug(String(name));
    const insertPayload: any = {
      name,
      slug,
      description,
      long_description: null,
      price: Number(price),
      compare_at_price: compare_at_price === null || compare_at_price === '' ? null : Number(compare_at_price),
      category: 'workshop',
      stock_quantity: 0,
      track_inventory: false,
      metadata: {},
      published: !!published,
      featured: !!featured,
    };

    const { data, error } = await supabase
      .from('products')
      .insert([insertPayload])
      .select('*')
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const res = NextResponse.json({ product: data }, { status: 201 });
    res.headers.set('Cache-Control', 'no-store, max-age=0, private');
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 });
  }
}
