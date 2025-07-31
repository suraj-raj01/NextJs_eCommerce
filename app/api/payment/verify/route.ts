import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planData
    } = await request.json();

    // Create the expected signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    // Verify the signature
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is verified
      // Here you can:
      // 1. Update user subscription in database
      // 2. Send confirmation email
      // 3. Update user's plan status
      // 4. Log the transaction
      
      console.log('Payment verified successfully:', {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        planData: planData
      });

      // Example: Update user subscription (implement according to your database)
      // await updateUserSubscription(userId, planData);

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}



// import { NextRequest, NextResponse } from 'next/server';
// import crypto from 'crypto'

// export async function POST(request: Request) {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       customer,
//       items,
//       amount
//     } = await request.json()

//     // Verify signature
//     const body = razorpay_order_id + '|' + razorpay_payment_id
//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
//       .update(body.toString())
//       .digest('hex')

//     if (expectedSignature !== razorpay_signature) {
//       return NextResponse.json(
//         { success: false, error: 'Payment verification failed' },
//         { status: 400 }
//       )
//     }

//     // Save order to database
//     const orderData = {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       customer,
//       items,
//       amount,
//       status: 'paid',
//       created_at: new Date()
//     }

//     // TODO: Save to your database
//     console.log('Order to save:', orderData)

//     return NextResponse.json({
//       success: true,
//       message: 'Payment verified successfully'
//     })
//   } catch (error) {
//     console.error('Payment verification error:', error)
//     return NextResponse.json(
//       { success: false, error: 'Payment verification failed' },
//       { status: 500 }
//     )
//   }
// }