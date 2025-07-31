import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'INR' } = await request.json();
    console.log(amount, currency);

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const options = {
      amount: amount, // amount in paise (smallest currency unit)
      currency: currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// import { NextResponse } from 'next/server'
// import Razorpay from 'razorpay'

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID!,
//   key_secret: process.env.RAZORPAY_KEY_SECRET!
// })

// export async function POST(request: Request) {
//   try {
//     const { amount, currency, customer, items } = await request.json()

//     const options = {
//       amount: Math.round(amount * 100), // Convert to paisa
//       currency: currency || 'INR',
//       receipt: `order_${Date.now()}`,
//       payment_capture: 1,
//       notes: {
//         customer_name: customer.name,
//         customer_email: customer.email,
//         customer_phone: customer.phone
//       }
//     }

//     const order = await razorpay.orders.create(options)

//     return NextResponse.json({
//       success: true,
//       order_id: order.id,
//       amount: order.amount,
//       currency: order.currency,
//       id: order.id
//     })
//   } catch (error) {
//     console.error('Razorpay order creation error:', error)
//     return NextResponse.json(
//       { success: false, error: 'Failed to create order' },
//       { status: 500 }
//     )
//   }
// }