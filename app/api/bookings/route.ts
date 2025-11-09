import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRole) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const payload = await req.json();

    const supabase = createClient(supabaseUrl, serviceRole);

    const { error } = await supabase.from('bookings').insert([
      {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        service: payload.service,
        date: payload.date,
        time: payload.time,
        guests: payload.guests,
        message: payload.message ?? null,
      },
    ]);

    if (error) {
      console.error('Booking insert error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e: any) {
    console.error('Bookings API error', e);
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
