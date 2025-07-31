import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'; 

export function middleware(req: NextRequest) {
    
  const authHeader = req.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.decode(token); 
    return NextResponse.next();
  } catch (err) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}


export const config = {
  matcher: [
  //   '/api/vendor/coustomer', '/api/vendor/coustomer/:id*','/api/vendor/complaint', '/api/vendor/complaint/:id*','/api/vendor/filterProduct',
  //   '/api/vendor/filterProduct/:id*','/api/vendor/invoice', '/api/vendor/invoice/:id*','/api/vendor/order', '/api/vendor/order/:id*','/api/vendor/permission', 
  //   '/api/vendor/permission/:id*','/api/vendor/product','/api/vendor/product/:id*','/api/vendor/refund', '/api/vendor/refund/:id*','/api/vendor/return',
  //   '/api/vendor/return/:id*','/api/vendor/selling', '/api/vendor/selling/:id*','/api/vendor/taxrule', '/api/vendor/taxrule/:id*','/api/vendor/deliverytracking',
  // '/api/vendor/deliverytracking/:id*','/api/vendor/coupon','/api/vendor/coupon/:id*','/api/vendor/review','/api/vendor/review/:id*',
],
};
