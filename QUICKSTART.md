# Al Zare' Pottery - Quick Start Guide

## ⚡ Fast Setup (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
http://localhost:3000
```

## 🔑 Default Admin Login
- URL: http://localhost:3000/admin/login
- Password: `admin123` (change in .env.local)

## 📱 WhatsApp Integration
- Update phone number in `.env.local`:
  ```
  NEXT_PUBLIC_WHATSAPP_NUMBER=+971XXXXXXXXX
  ```

## 🎨 Add Your Logo
- Replace `/public/logo.png` with your logo file
- Recommended size: 200x80px PNG with transparency

## ✅ What Works Out of the Box
- ✅ Bilingual website (English/Arabic)
- ✅ 10 sample products
- ✅ Working cart system
- ✅ Admin dashboard
- ✅ Coupon system (try code: WELCOME10)
- ✅ Product filters and search
- ✅ WhatsApp checkout

## 🚀 Deploy to Production
See README.md for detailed deployment instructions.

## 📝 Next Steps
1. Login to admin: `/admin/login`
2. Add your real products
3. Upload product images
4. Create coupons
5. Customize colors in `tailwind.config.js`
6. Update WhatsApp number
7. Deploy!

