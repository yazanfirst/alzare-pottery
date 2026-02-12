import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getProducts } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const products = getProducts();
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col font-arabic" dir="rtl">
      <Navbar lang="ar" />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[600px] bg-gradient-to-l from-pottery-sand to-pottery-desert flex items-center overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-64 h-64 bg-pottery-clay rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-pottery-terracotta rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="container-custom relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-6xl font-bold text-pottery-earth mb-6 leading-tight">
                فخار مصنوع<br />
                <span className="text-pottery-terracotta">يدوياً</span>
              </h1>
              <p className="text-xl text-pottery-earth mb-8 leading-relaxed">
                فن الطين الإماراتي التقليدي يلتقي بالتصميم الحديث. كل قطعة تروي قصة من التراث والحرفية.
              </p>
              <Link href="/ar/products" className="btn-primary inline-flex items-center space-x-2 space-x-reverse text-lg">
                <span>تسوق المجموعة</span>
                <ArrowLeft size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-pottery-earth mb-4">المنتجات المميزة</h2>
              <p className="text-pottery-clay text-lg">اكتشف مجموعتنا المختارة</p>
            </div>

            <div className="product-grid">
              {featuredProducts.map(product => (
                <Link 
                  key={product.id} 
                  href={`/ar/products/${product.id}`}
                  className="card group hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="aspect-square bg-pottery-sand relative overflow-hidden">
                    <img 
                      src={product.images[0]} 
                      alt={product.name.ar}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/400x400/E8DCC4/8B6F47?text=${encodeURIComponent(product.name.ar)}`;
                      }}
                    />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="badge badge-danger text-lg">غير متوفر</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-pottery-earth mb-2 group-hover:text-pottery-clay">
                      {product.name.ar}
                    </h3>
                    <p className="text-pottery-earth text-sm mb-4 line-clamp-2">
                      {product.description.ar}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="price-tag">{formatPrice(product.price, 'ar')}</span>
                      <span className="text-sm text-pottery-clay font-medium group-hover:underline">
                        عرض التفاصيل
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/ar/products" className="btn-outline inline-flex items-center space-x-2 space-x-reverse">
                <span>عرض جميع المنتجات</span>
                <ArrowLeft size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-pottery-desert">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-pottery-earth mb-4">تسوق حسب الفئة</h2>
              <p className="text-pottery-clay text-lg">اعثر على القصرية المثالية لاحتياجاتك</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { en: 'Indoor Planters', ar: 'قصاري داخلية' },
                { en: 'Outdoor Planters', ar: 'قصاري خارجية' },
                { en: 'Decorative Pots', ar: 'قصاري زخرفية' },
                { en: 'Garden Sets', ar: 'طقم حديقة' },
                { en: 'Custom Orders', ar: 'طلبات خاصة' },
                { en: 'Traditional Clay Pots', ar: 'قصاري طينية تقليدية' }
              ].map(category => (
                <Link
                  key={category.en}
                  href={`/ar/products?category=${encodeURIComponent(category.en)}`}
                  className="bg-white rounded-lg p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <div className="text-pottery-clay font-semibold">{category.ar}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-pottery-earth mb-6">حرفتنا</h2>
              <p className="text-lg text-pottery-earth leading-relaxed mb-6">
                في قصاري الزارع، نحافظ على فن الفخار الإماراتي القديم. كل قطعة مصنوعة يدوياً 
                من قبل حرفيين مهرة باستخدام تقنيات تقليدية تم تناقلها عبر الأجيال، مع دمج 
                الحساسيات التصميمية المعاصرة.
              </p>
              <p className="text-lg text-pottery-earth leading-relaxed">
                من طين الصحراء الإماراتية الغني إلى اللمسة النهائية المزججة، كل قصرية تروي قصة 
                من التفاني والتراث والفن.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer lang="ar" />
    </div>
  );
}
