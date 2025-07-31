
'use client'

import React, { useState, useEffect } from 'react'
import { useCartStore } from '../cartStore'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Separator } from '../../../components/ui/separator'
import { Badge } from '../../../components/ui/badge'
import { 
  CreditCard,
  Shield, 
  ArrowLeft,
  Loader2 
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import axios from 'axios'

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const cartItems = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: ''
  })
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const tax = subtotal * 0.18 // 18% GST
  const shipping = subtotal > 500 ? 0 : 50 // Free shipping above ₹500
  const total = subtotal + tax + shipping

  // Load payment scripts
  useEffect(() => {
    // Load Razorpay script
    const razorpayScript = document.createElement('script')
    razorpayScript.src = 'https://checkout.razorpay.com/v1/checkout.js'
    razorpayScript.async = true
    document.body.appendChild(razorpayScript)

    // Load PayPal script
    // const paypalScript = document.createElement('script')
    // paypalScript.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=INR'
    // paypalScript.async = true
    // document.body.appendChild(paypalScript)

    return () => {
      document.body.removeChild(razorpayScript)
    //   document.body.removeChild(paypalScript)
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setCustomerDetails(prev => ({
      ...prev,
      [field]: value
    }))
    console.log(customerDetails)
  }

  const validateForm = () => {
    const required = ['name', 'email', 'phone', 'address', 'city', 'pincode', 'state']
    for (const field of required) {
      if (!customerDetails || "") {
        Swal.fire({
          icon: 'error',
          title: 'Missing Information',
          text: `Please fill in ${field.charAt(0).toUpperCase() + field.slice(1)}`
        })
        return false
      }
    }
    
    if (!selectedPaymentMethod) {
      Swal.fire({
        icon: 'error',
        title: 'Payment Method Required',
        text: 'Please select a payment method'
      })
      return false
    }
    
    return true
  }

 const handleRazorpayPayment = async () => {
  if (!validateForm()) return;

  setLoading(true);
  try {
    // ✅ Properly wrap the request body
    const orderResponse = await axios.post(`${api}/payment/create-order`, {
      cartItems,
      customerDetails,
    });

    console.log(cartItems)

    const order = orderResponse.data;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Your Store Name',
      description: 'Purchase from Your Store',
      order_id: order.id,
      prefill: {
        name: customerDetails.name,
        email: customerDetails.email,
        contact: customerDetails.phone,
      },
      theme: {
        color: '#3B82F6',
      },
      handler: async (response: any) => {
        try {
          // ✅ Send Razorpay payment response for verification
          const verifyResponse = await axios.post(`/${api}/payment/verify`, {
            razorpay_order_id: order.razorpay_order_id,
            razorpay_payment_id: order.razorpay_payment_id,
            razorpay_signature: order.razorpay_signature,
          });

          const verification = verifyResponse.data;

          if (verification.success) {
            clearCart();
            Swal.fire({
              icon: 'success',
              title: 'Payment Successful!',
              text: 'Your order has been placed successfully.',
              confirmButtonText: 'Continue Shopping',
            }).then(() => {
              router.push('/store/order-success');
            });
          } else {
            throw new Error('Payment verification failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Payment Verification Failed',
            text: 'There was an issue verifying your payment. Please contact support.',
          });
        }
      },
      modal: {
        ondismiss: () => {
          setLoading(false);
        },
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error('Razorpay payment error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Payment Failed',
      text: 'There was an issue processing your payment. Please try again.',
    });
  } finally {
    setLoading(false);
  }
};



  const handlePayment = () => {
    switch (selectedPaymentMethod) {
      case 'razorpay':
        handleRazorpayPayment()
        break
      default:
        Swal.fire({
          icon: 'error',
          title: 'Invalid Payment Method',
          text: 'Please select a valid payment method'
        })
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link href="/store">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/store/cartitems">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className='pb-2' htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={customerDetails.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label className='pb-2' htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerDetails.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label className='pb-2' htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={customerDetails.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <Label className='pb-2' htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={customerDetails.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="Enter pincode"
                  />
                </div>
              </div>
              <div>
                <Label className='pb-2' htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={customerDetails.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your full address"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className='pb-2' htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={customerDetails.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <Label className='pb-2' htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={customerDetails.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Enter state"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedPaymentMethod === 'razorpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedPaymentMethod('razorpay')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Razorpay</p>
                        <p className="text-sm text-gray-500">Cards, UPI, Netbanking, Wallets</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Popular</Badge>
                  </div>
                </div>

               
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.defaultImage}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>₹{subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Tax (18%)</p>
                    <p>₹{tax.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Shipping</p>
                    <p>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</p>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <p>Total</p>
                    <p>₹{total.toFixed(2)}</p>
                  </div>
                </div>

                <Button 
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full mt-6"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Complete Payment
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center space-x-2 mt-4">
                  <Shield className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-gray-500">Secure payment</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}