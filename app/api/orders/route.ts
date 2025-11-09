import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRole) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const { formData, cart } = await req.json();

    if (!formData || !cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const subtotal = cart.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);
    const tax = subtotal * 0.22;
    const total = subtotal + tax;
    const orderNumber = `HC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const supabase = createClient(supabaseUrl, serviceRole);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          order_number: orderNumber,
          customer_email: formData.email,
          customer_name: formData.name,
          customer_phone: formData.phone,
          status: 'pending',
          subtotal,
          tax,
          total,
          payment_status: 'unpaid',
          metadata: {
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
          },
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error('Order insert error', orderError);
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    const orderItems = cart.map((item: any) => ({
      order_id: order.id,
      product_name: item.name,
      product_slug: item.slug ?? null,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) {
      console.error('Order items insert error', itemsError);
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, orderNumber }, { status: 200 });
  } catch (e: any) {
    console.error('Orders API error', e);
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
