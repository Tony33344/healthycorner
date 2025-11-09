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

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = getClient();
    // Delete order items first
    const { error: itemsErr } = await supabase.from('order_items').delete().eq('order_id', params.id);
    if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 });

    // Delete order
    const { error: orderErr } = await supabase.from('orders').delete().eq('id', params.id);
    if (orderErr) return NextResponse.json({ error: orderErr.message }, { status: 500 });

    const res = NextResponse.json({ success: true }, { status: 200 });
    res.headers.set('Cache-Control', 'no-store, max-age=0, private');
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
