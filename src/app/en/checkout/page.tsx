'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartItem } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    deliveryAddress: '',
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (savedCart.length === 0) {
      router.push('/en/cart');
      return;
    }
    setCart(savedCart);

    const appliedCoupon = JSON.parse(localStorage.getItem('appliedCoupon') || '{}');
    if (appliedCoupon.discount) {
      setDiscount(appliedCoupon.discount);
      setCouponCode(appliedCoupon.code);
    }
  }, [router]);

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const total = Math.max(0, subtotal - discount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate WhatsApp message
    const itemsList = cart.map(item => 
      `${item.product.name.en} x${item.quantity} - ${formatPrice(item.product.price * item.quantity, 'en')}`
    ).join('%0A');

    const message = `*New Order from Al Zare' Pottery*%0A%0A` +
      `*Customer Details:*%0A` +
      `Name: ${formData.fullName}%0A` +
      `Phone: ${formData.phoneNumber}%0A` +
      `Address: ${formData.deliveryAddress}%0A%0A` +
      `*Order Items:*%0A${itemsList}%0A%0A` +
      `*Subtotal:* ${formatPrice(subtotal, 'en')}%0A` +
      (discount > 0 ? `*Discount (${couponCode}):* -${formatPrice(discount, 'en')}%0A` : '') +
      `*Total:* ${formatPrice(total, 'en')}`;

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+971501234567';
    const whatsappURL = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${message}`;
    
    window.open(whatsappURL, '_blank');
    
    // Clear cart after order
    localStorage.removeItem('cart');
    localStorage.removeItem('appliedCoupon');
    
    // Redirect to thank you page (or home)
    setTimeout(() => router.push('/en'), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar lang="en" />
      <main className="flex-1 bg-pottery-desert">
        <div className="container-custom py-8">
          <h1 className="text-4xl font-bold text-pottery-earth mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer Info Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-8">
                <h2 className="text-2xl font-bold text-pottery-earth mb-6">Customer Information</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-pottery-earth mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="input-field"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pottery-earth mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="input-field"
                      placeholder="+971 50 123 4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pottery-earth mb-2">Delivery Address *</label>
                    <textarea
                      required
                      value={formData.deliveryAddress}
                      onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                      className="input-field"
                      rows={4}
                      placeholder="Enter your complete delivery address"
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full text-lg">
                    Send Order via WhatsApp
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-pottery-earth mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.product.name.en} x{item.quantity}</span>
                      <span>{formatPrice(item.product.price * item.quantity, 'en')}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(subtotal, 'en')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({couponCode}):</span>
                      <span>-{formatPrice(discount, 'en')}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-pottery-terracotta">{formatPrice(total, 'en')}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-pottery-sand rounded-lg text-sm text-pottery-earth">
                  <p className="font-medium mb-2">Payment on Delivery</p>
                  <p>You will be contacted via WhatsApp to confirm your order and arrange delivery payment.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer lang="en" />
    </div>
  );
}
