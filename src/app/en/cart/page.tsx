'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  };

  const updateQuantity = (index: number, newQty: number) => {
    if (newQty < 1) return;
    const newCart = [...cart];
    newCart[index].quantity = newQty;
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCart(newCart);
  };

  const removeItem = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCart(newCart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const applyCoupon = async () => {
    setCouponError('');
    try {
      const res = await fetch(`/api/coupons?code=${couponCode}`);
      if (!res.ok) throw new Error('Invalid coupon');
      const data = await res.json();
      const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const discountAmount = data.coupon.discountType === 'percentage' 
        ? (subtotal * data.coupon.discountValue / 100)
        : data.coupon.discountValue;
      setDiscount(discountAmount);
      localStorage.setItem('appliedCoupon', JSON.stringify({ code: couponCode, discount: discountAmount }));
    } catch (err) {
      setCouponError('Invalid or expired coupon code');
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const total = Math.max(0, subtotal - discount);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar lang="en" />
        <main className="flex-1 bg-pottery-desert">
          <div className="container-custom py-16 text-center">
            <h1 className="text-4xl font-bold text-pottery-earth mb-6">Your Cart is Empty</h1>
            <p className="text-pottery-clay mb-8">Start shopping to add items to your cart</p>
            <Link href="/en/products" className="btn-primary">Browse Products</Link>
          </div>
        </main>
        <Footer lang="en" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar lang="en" />
      <main className="flex-1 bg-pottery-desert">
        <div className="container-custom py-8">
          <h1 className="text-4xl font-bold text-pottery-earth mb-8">Shopping Cart</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-6 flex gap-6">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name.en}
                    className="w-24 h-24 object-cover rounded"
                    onError={(e) => e.currentTarget.src = `https://placehold.co/100x100/E8DCC4/8B6F47?text=Product`}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-pottery-earth">{item.product.name.en}</h3>
                    <p className="text-pottery-clay">{formatPrice(item.product.price, 'en')}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(index, item.quantity - 1)} className="p-1 hover:bg-pottery-sand rounded"><Minus size={16} /></button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(index, item.quantity + 1)} className="p-1 hover:bg-pottery-sand rounded"><Plus size={16} /></button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-pottery-earth">{formatPrice(item.product.price * item.quantity, 'en')}</p>
                    <button onClick={() => removeItem(index)} className="text-red-600 hover:text-red-800 mt-2"><Trash2 size={20} /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-pottery-earth mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between"><span>Subtotal:</span><span>{formatPrice(subtotal, 'en')}</span></div>
                  {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount:</span><span>-{formatPrice(discount, 'en')}</span></div>}
                  <div className="border-t pt-2 flex justify-between font-bold text-lg"><span>Total:</span><span className="text-pottery-terracotta">{formatPrice(total, 'en')}</span></div>
                </div>
                <div className="mb-4">
                  <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Coupon code" className="input-field mb-2" />
                  <button onClick={applyCoupon} className="btn-outline w-full">Apply Coupon</button>
                  {couponError && <p className="text-red-600 text-sm mt-1">{couponError}</p>}
                </div>
                <Link href="/en/checkout" className="btn-primary w-full block text-center">Proceed to Checkout</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer lang="en" />
    </div>
  );
}
