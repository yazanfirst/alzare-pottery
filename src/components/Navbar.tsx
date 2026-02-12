'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Home, Package, Shield } from 'lucide-react';
import { Language } from '@/types';
import { getTranslation } from '@/lib/utils';
import { useEffect, useState } from 'react';

const LOGO_ASSET = '/logo.png?v=20260213';

interface NavbarProps {
  lang: Language;
}

export default function Navbar({ lang }: NavbarProps) {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const isRTL = lang === 'ar';

  useEffect(() => {
    // Update cart count from localStorage
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    
    // Listen for cart updates
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const t = (key: string) => getTranslation(lang, key);
  const otherLang = lang === 'en' ? 'ar' : 'en';
  const otherLangPath = pathname.replace(`/${lang}`, `/${otherLang}`);
  const showAdminLink = process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_ENABLE_ADMIN_IN_PRODUCTION === 'true';

  return (
    <nav className={`bg-white shadow-lg sticky top-0 z-50 border-b-2 border-amber-500 ${isRTL ? 'font-arabic' : 'font-english'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center space-x-3">
            <img 
              src={LOGO_ASSET} 
              alt="Al Zare' Pottery" 
              className="h-12 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden">
              <div className="text-2xl font-bold text-amber-600">
                {lang === 'ar' ? 'قصاري الزارع' : "Al Zare'"}
              </div>
              <div className="text-sm text-gray-600">
                {lang === 'ar' ? 'فخار تقليدي' : 'Pottery'}
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
            <Link 
              href={`/${lang}`}
              className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} text-gray-700 hover:text-amber-600 transition-colors font-medium ${pathname === `/${lang}` ? 'text-amber-600 font-bold' : ''}`}
            >
              <Home size={20} />
              <span>{t('home')}</span>
            </Link>
            
            <Link 
              href={`/${lang}/products`}
              className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} text-gray-700 hover:text-amber-600 transition-colors font-medium ${pathname.includes('/products') ? 'text-amber-600 font-bold' : ''}`}
            >
              <Package size={20} />
              <span>{t('products')}</span>
            </Link>
            
            <Link 
              href={`/${lang}/cart`}
              className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} text-gray-700 hover:text-amber-600 transition-colors font-medium relative ${pathname.includes('/cart') ? 'text-amber-600 font-bold' : ''}`}
            >
              <ShoppingCart size={20} />
              <span>{t('cart')}</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>

            {showAdminLink && (
              <Link
                href="/admin/login"
                className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} text-gray-700 hover:text-amber-600 transition-colors font-medium ${pathname.startsWith('/admin') ? 'text-amber-600 font-bold' : ''}`}
              >
                <Shield size={20} />
                <span>{lang === 'ar' ? 'الإدارة' : 'Admin'}</span>
              </Link>
            )}
          </div>

          {/* Language Switch */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            <Link
              href={otherLangPath}
              className="px-4 py-2 rounded-lg border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white font-bold transition-all shadow-sm"
            >
              {otherLang.toUpperCase()}
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex justify-around border-t pt-3">
            <Link 
              href={`/${lang}`}
              className={`flex flex-col items-center ${pathname === `/${lang}` ? 'text-amber-600' : 'text-gray-600'}`}
            >
              <Home size={24} />
              <span className="text-xs mt-1 font-medium">{t('home')}</span>
            </Link>
            
            <Link 
              href={`/${lang}/products`}
              className={`flex flex-col items-center ${pathname.includes('/products') ? 'text-amber-600' : 'text-gray-600'}`}
            >
              <Package size={24} />
              <span className="text-xs mt-1 font-medium">{t('products')}</span>
            </Link>
            
            <Link 
              href={`/${lang}/cart`}
              className={`flex flex-col items-center relative ${pathname.includes('/cart') ? 'text-amber-600' : 'text-gray-600'}`}
            >
              <ShoppingCart size={24} />
              <span className="text-xs mt-1 font-medium">{t('cart')}</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {showAdminLink && (
              <Link
                href="/admin/login"
                className={`flex flex-col items-center ${pathname.startsWith('/admin') ? 'text-amber-600' : 'text-gray-600'}`}
              >
                <Shield size={24} />
                <span className="text-xs mt-1 font-medium">{lang === 'ar' ? 'الإدارة' : 'Admin'}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
