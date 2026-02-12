# Al Zare' Pottery - E-Commerce Website
## قصاري الزارع - موقع تجارة إلكترونية

A modern, bilingual (Arabic/English) e-commerce website for Al Zare' Pottery, featuring a complete admin dashboard and NO DATABASE requirement.

---

## 🚀 Features

### Customer Storefront
- ✅ Bilingual support (Arabic RTL / English LTR)
- ✅ Beautiful responsive design with pottery aesthetic
- ✅ Product catalog with filters and search
- ✅ Shopping cart (localStorage)
- ✅ Checkout with WhatsApp integration
- ✅ Featured products and categories
- ✅ Product image galleries
- ✅ Price in AED (Dirham)

### Admin Dashboard
- ✅ Secure JWT authentication
- ✅ Product management (Add/Edit/Delete)
- ✅ Bilingual product content (AR/EN)
- ✅ Image upload system
- ✅ Category and tag management
- ✅ Stock management
- ✅ Coupon/discount system
- ✅ Price guidance based on UAE market

### Technical Features
- ✅ Next.js 14 App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ JSON file-based storage (NO DATABASE)
- ✅ SEO-friendly pages
- ✅ Fast performance
- ✅ RTL support for Arabic

---

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Step 1: Extract and Install

```bash
# Extract the project files
cd alzare-pottery

# Install dependencies
npm install
```

### Step 2: Environment Variables

Create a `.env.local` file in the root directory:

```env
# Admin Authentication
ADMIN_PASSWORD=your_secure_password_here
JWT_SECRET=your_jwt_secret_key_minimum_32_characters_random_string

# WhatsApp Business Number (IMPORTANT: Change this to your number)
NEXT_PUBLIC_WHATSAPP_NUMBER=+971501234567

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**SECURITY NOTES:**
- Change `ADMIN_PASSWORD` to a strong password
- Generate a random `JWT_SECRET` (at least 32 characters)
- Update `NEXT_PUBLIC_WHATSAPP_NUMBER` to your actual WhatsApp Business number

### Step 3: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your website.

---

## 🗂️ Project Structure

```
alzare-pottery/
├── src/
│   ├── app/
│   │   ├── en/                    # English pages
│   │   ├── ar/                    # Arabic pages
│   │   ├── admin/                 # Admin dashboard
│   │   ├── api/                   # API routes
│   │   ├── globals.css            # Global styles
│   │   └── layout.tsx             # Root layout
│   ├── components/                # React components
│   ├── lib/
│   │   ├── data.ts               # JSON file operations
│   │   ├── auth.ts               # Authentication
│   │   ├── utils.ts              # Utilities
│   │   └── pricing.ts            # Price guidance
│   └── types/
│       └── index.ts              # TypeScript types
├── data/
│   ├── products.json             # Product data store
│   └── coupons.json              # Coupon data store
├── public/
│   ├── uploads/                  # Product images
│   └── logo.png                  # Brand logo
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

---

## 📊 Data Storage Explanation

### How It Works (Option A - JSON Files)

This project uses **JSON file-based storage** instead of a traditional database:

1. **Products** are stored in `/data/products.json`
2. **Coupons** are stored in `/data/coupons.json`
3. **Images** are stored in `/public/uploads/`

#### Advantages:
- ✅ No database server setup required
- ✅ Simple deployment
- ✅ Easy backups (just copy JSON files)
- ✅ Version control friendly

#### How Admin Changes Work:
1. Admin logs in with password
2. Admin creates/edits product
3. Server writes to JSON file using Node.js `fs` module
4. Changes are immediately reflected on the website

#### Security:
- Admin password stored in environment variable (NOT in code)
- JWT tokens for session management
- HTTP-only cookies prevent XSS attacks
- Admin routes protected with middleware

**LIMITATION:** File writes don't work on serverless platforms (Vercel, Netlify) - see Deployment section.

---

## 🔐 Admin Authentication

### How It Works:

1. **Single Admin Password:** One admin password stored in `ADMIN_PASSWORD` env variable
2. **JWT Session:** Upon successful login, a JWT token is issued
3. **HTTP-Only Cookie:** Token stored in secure cookie (7-day expiry)
4. **Protected Routes:** All admin API routes check authentication

### To Login:
1. Go to `/admin/login`
2. Enter password from `.env.local`
3. Access admin dashboard

### Security Limitations:
- Single user (no multi-admin support)
- Password stored in plaintext in env (use strong password)
- No password reset mechanism
- For production: Consider adding 2FA or OAuth

---

## 🚀 Deployment Options

### Option 1: Vercel (RECOMMENDED with GitHub Storage)

**PROBLEM:** Vercel is serverless - file writes don't persist between requests.

**SOLUTION:** Use GitHub as storage backend:

1. **Setup GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/alzare-pottery.git
   git push -u origin main
   ```

2. **Get GitHub Personal Access Token**
   - Go to GitHub Settings → Developer Settings → Personal Access Tokens
   - Generate new token with `repo` permissions
   - Copy the token

3. **Update Environment Variables in Vercel**
   ```env
   ADMIN_PASSWORD=your_password
   JWT_SECRET=your_secret
   NEXT_PUBLIC_WHATSAPP_NUMBER=+971XXXXXXXXX
   NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
   
   # GitHub storage (for production)
   GITHUB_TOKEN=your_github_token
   GITHUB_REPO=your-username/alzare-pottery
   GITHUB_BRANCH=main
   ```

4. **Modify `/src/lib/data.ts` for Production**
   - Add GitHub API integration
   - On write operations, commit to GitHub
   - On read operations, fetch from GitHub

5. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

### Option 2: VPS/Dedicated Server (Simplest)

If you have a VPS (like DigitalOcean, Linode, AWS EC2):

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone https://github.com/your-username/alzare-pottery.git
cd alzare-pottery
npm install
npm run build

# Create .env.local with production values

# Run with PM2 (process manager)
npm install -g pm2
pm2 start npm --name "alzare-pottery" -- start
pm2 save
pm2 startup
```

This way, file writes work normally!

### Option 3: Firebase/Supabase (Alternative)

If GitHub storage seems complex, you can:

1. Create Firebase project
2. Use Firestore for products/coupons
3. Use Firebase Storage for images
4. Update data.ts to use Firebase SDK

---

## 🎨 Customization

### Change Brand Logo
Replace `/public/logo.png` with your logo (recommended: 200x80px PNG with transparency)

### Change WhatsApp Number
Update in `.env.local`:
```env
NEXT_PUBLIC_WHATSAPP_NUMBER=+971501234567
```

### Change Colors
Edit `/tailwind.config.js`:
```javascript
colors: {
  pottery: {
    sand: '#E8DCC4',      // Light background
    clay: '#C89968',      // Primary brand color
    terracotta: '#C87941', // Accent color
    earth: '#8B6F47',     // Dark text
    desert: '#F5E6D3',    // Lightest bg
    olive: '#6B7B4E',     // Secondary accent
  },
}
```

### Add/Remove Categories
Edit `/src/lib/pricing.ts` to modify categories and price ranges.

---

## 📸 Image Prompts for AI Generation

Use these prompts with Midjourney, DALL-E, or Stable Diffusion:

### Product Images:
1. "Studio photograph of handmade ceramic planter, beige clay, soft natural shadows, UAE desert aesthetic, high detail, professional product photography, white background"

2. "Large terracotta garden pot, outdoor pottery, weathered finish, earthy tones, photographed in bright daylight, minimal background"

3. "Set of three geometric decorative pots, modern minimalist design, cream and terracotta colors, top-down view, studio lighting"

4. "Traditional Emirati clay water pot, authentic heritage design, natural brown clay, soft shadows, cultural photography"

5. "Garden planter collection, five pieces varying sizes, coordinated earth tones, arranged beautifully, lifestyle photography"

### Hero Banners:
1. "Hero banner for pottery website, beige sand desert background with clay pots, warm sunlight, minimal modern aesthetic, wide format 1920x600"

2. "Arabic pottery workshop, hands shaping clay on wheel, warm lighting, traditional craftsmanship, banner format, earthy tones"

---

## 💰 Pricing Guidance (AED)

Based on UAE market research:

| Category | Small | Medium | Large |
|----------|-------|--------|-------|
| Indoor Planters | 45-85 | 90-180 | 190-350 |
| Outdoor Planters | 65-120 | 130-240 | 250-480 |
| Decorative Pots | 55-95 | 100-190 | 200-380 |
| Garden Sets | 180-320 | 350-550 | 580-950 |
| Custom Orders | 150-250 | 280-450 | 480-850 |
| Traditional Clay | 35-70 | 75-140 | 150-280 |

Admin dashboard will auto-suggest prices based on category and size.

---

## 🛒 How to Use

### For Customers:
1. Browse products in English or Arabic
2. Filter by category, price, search
3. Add products to cart
4. Proceed to checkout
5. Fill in delivery information
6. Click "Send via WhatsApp" to complete order

### For Admin:
1. Login at `/admin/login`
2. **Add Product:**
   - Fill in name (EN/AR)
   - Add description (EN/AR)
   - Select category
   - Upload images
   - Set price (or use suggested)
   - Set stock quantity
   - Mark as featured (optional)
   - Save

3. **Create Coupon:**
   - Enter coupon code
   - Choose discount type (% or fixed AED)
   - Set start/end dates
   - Set usage limit
   - Activate

4. **Manage Products:**
   - Edit existing products
   - Delete products
   - Update stock levels

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Admin can't login
- Check `.env.local` exists
- Verify `ADMIN_PASSWORD` is set
- Clear browser cookies
- Check `JWT_SECRET` is at least 32 characters

### Images not showing
- Ensure images are in `/public/uploads/`
- Check image paths in `products.json`
- Verify file permissions

### Changes not saving on Vercel
- You need GitHub integration (see Deployment)
- Or use VPS deployment instead

---

## 📝 Sample Products

The project comes with 10 sample products in Arabic and English. You can:
- Edit them via admin dashboard
- Delete and add your own
- Use them as templates

---

## 🔄 Backup and Restore

### Backup:
```bash
# Just copy these files
cp data/products.json backups/products-$(date +%Y%m%d).json
cp data/coupons.json backups/coupons-$(date +%Y%m%d).json
cp -r public/uploads backups/uploads-$(date +%Y%m%d)/
```

### Restore:
```bash
# Replace with backup
cp backups/products-20260212.json data/products.json
cp backups/coupons-20260212.json data/coupons.json
```

---

## 📧 Support

For questions about this project:
- Check the code comments
- Review `/src/lib/` files for logic
- Examine `/src/app/api/` for API endpoints

---

## 🎯 Production Checklist

Before going live:

- [ ] Change `ADMIN_PASSWORD` to strong password
- [ ] Generate secure `JWT_SECRET` (32+ chars)
- [ ] Update `NEXT_PUBLIC_WHATSAPP_NUMBER`
- [ ] Replace sample products with real products
- [ ] Add real product images
- [ ] Test checkout flow
- [ ] Test coupon system
- [ ] Configure GitHub storage (for Vercel)
- [ ] Set up domain and SSL
- [ ] Test on mobile devices
- [ ] Test RTL Arabic layout
- [ ] Add your logo to `/public/logo.png`

---

## 📄 License

This project is provided as-is for Al Zare' Pottery.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
