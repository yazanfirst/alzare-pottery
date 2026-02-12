'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Check, Package, Tag } from 'lucide-react';

export default function ProductDetailPageAr() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetch(`/api/products?id=${params.id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch(() => router.push('/ar/products'));
  }, [params.id, router]);

  const addToCart = () => {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex((item: any) => item.product.id === product.id);

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar lang="ar" />
        <div className="flex-1 flex items-center justify-center">
          <div className="spinner h-12 w-12"></div>
        </div>
        <Footer lang="ar" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navbar lang="ar" />

      <main className="flex-1 bg-pottery-desert">
        <div className="container-custom py-8">
          <button onClick={() => router.back()} className="text-pottery-clay hover:underline mb-6">
            العودة إلى المنتجات →
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              <div>
                <div className="aspect-square bg-pottery-sand rounded-lg overflow-hidden mb-4">
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name.ar}
                    className="w-full h-full object-cover"
                    onError={e => {
                      e.currentTarget.src = `https://placehold.co/600x600/E8DCC4/8B6F47?text=${encodeURIComponent(product.name.ar)}`;
                    }}
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`aspect-square rounded-lg overflow-hidden ${selectedImage === idx ? 'ring-2 ring-pottery-clay' : ''}`}
                      >
                        <img
                          src={img}
                          alt={`${product.name.ar} ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={e => {
                            e.currentTarget.src = `https://placehold.co/150x150/E8DCC4/8B6F47?text=${idx + 1}`;
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="mb-4 flex items-center gap-2">
                  <span className="badge bg-pottery-clay text-white">{product.category}</span>
                  {product.featured && <span className="badge bg-pottery-terracotta text-white">مميز</span>}
                </div>

                <h1 className="text-4xl font-bold text-pottery-earth mb-4">{product.name.ar}</h1>

                <div className="price-tag mb-6">{formatPrice(product.price, 'ar')}</div>

                <div className="mb-6">
                  <div className="flex items-center space-x-2 space-x-reverse text-sm text-pottery-earth mb-2">
                    <Package size={16} />
                    <span>رمز المنتج: {product.sku}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {product.stock > 0 ? (
                      <>
                        <span className="badge badge-success">متوفر</span>
                        <span className="text-sm text-pottery-earth">({product.stock} متاح)</span>
                      </>
                    ) : (
                      <span className="badge badge-danger">غير متوفر</span>
                    )}
                  </div>
                </div>

                <div className="prose mb-6">
                  <h3 className="text-lg font-semibold text-pottery-earth mb-2">الوصف</h3>
                  <p className="text-pottery-earth leading-relaxed">{product.description.ar}</p>
                </div>

                {product.tags.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 space-x-reverse mb-2">
                      <Tag size={16} className="text-pottery-clay" />
                      <span className="text-sm font-medium text-pottery-earth">الوسوم:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map(tag => (
                        <span key={tag} className="badge bg-pottery-sand text-pottery-earth">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.stock > 0 && (
                  <div className="border-t pt-6">
                    <div className="flex items-center space-x-4 space-x-reverse mb-4">
                      <label className="text-sm font-medium text-pottery-earth">الكمية:</label>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-8 h-8 rounded bg-pottery-sand hover:bg-pottery-clay hover:text-white"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-medium">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          className="w-8 h-8 rounded bg-pottery-sand hover:bg-pottery-clay hover:text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={addToCart}
                      className="btn-primary w-full flex items-center justify-center space-x-2 space-x-reverse"
                    >
                      {addedToCart ? (
                        <>
                          <Check size={20} />
                          <span>تمت الإضافة إلى السلة!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={20} />
                          <span>أضف إلى السلة</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer lang="ar" />
    </div>
  );
}
