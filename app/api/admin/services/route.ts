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

export async function GET() {
  try {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const res = NextResponse.json({ services: data ?? [] }, { status: 200 });
    res.headers.set('Cache-Control', 'no-store, max-age=0, private');
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      description = null,
      duration_minutes = null,
      price_eur = null,
      max_guests = 1,
      active = true,
    } = body || {};

    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const supabase = getClient();
    const { data, error } = await supabase
      .from('services')
      .insert([
        {
          name,
          description,
          duration_minutes: duration_minutes === null ? null : Number(duration_minutes),
          price_eur: price_eur === null ? null : Number(price_eur),
          max_guests: Number(max_guests ?? 1),
          active: !!active,
        },
      ])
      .select('*')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const res = NextResponse.json({ service: data }, { status: 201 });
    res.headers.set('Cache-Control', 'no-store, max-age=0, private');
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
