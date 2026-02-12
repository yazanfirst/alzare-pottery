'use client';

import { Language } from '@/types';
import { getTranslation } from '@/lib/utils';
import { Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  lang: Language;
}

export default function Footer({ lang }: FooterProps) {
  const isRTL = lang === 'ar';
  const t = (key: string) => getTranslation(lang, key);

  return (
    <footer className={`bg-pottery-earth text-white mt-16 ${isRTL ? 'font-arabic' : 'font-english'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {lang === 'ar' ? 'قصاري الزارع' : "Al Zare' Pottery"}
            </h3>
            <p className="text-pottery-sand">
              {lang === 'ar' 
                ? 'فخار إماراتي تقليدي مصنوع يدوياً بعناية وحرفية عالية. نحافظ على التراث ونصنع قطعاً فنية فريدة.'
                : 'Traditional Emirati pottery handcrafted with care and expertise. Preserving heritage while creating unique artistic pieces.'
              }
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h3>
            <div className="space-y-3">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <Phone size={18} />
                <span>{process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}</span>
              </div>
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <Mail size={18} />
                <span>info@alzarepottery.ae</span>
              </div>
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <MapPin size={18} />
                <span>{lang === 'ar' ? 'دبي، الإمارات العربية المتحدة' : 'Dubai, UAE'}</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href={`/${lang}`} className="text-pottery-sand hover:text-white">
                  {t('home')}
                </a>
              </li>
              <li>
                <a href={`/${lang}/products`} className="text-pottery-sand hover:text-white">
                  {t('products')}
                </a>
              </li>
              <li>
                <a href={`/${lang}/cart`} className="text-pottery-sand hover:text-white">
                  {t('cart')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-pottery-clay mt-8 pt-8 text-center text-pottery-sand">
          <p>
            &copy; {new Date().getFullYear()} {lang === 'ar' ? 'قصاري الزارع' : "Al Zare' Pottery"}. 
            {lang === 'ar' ? ' جميع الحقوق محفوظة.' : ' All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
