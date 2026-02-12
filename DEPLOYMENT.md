# Deployment Guide - Al Zare' Pottery

## Option 1: Deploy to Vercel (with GitHub Storage) ⭐ RECOMMENDED

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Your project pushed to GitHub

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Al Zare' Pottery"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/alzare-pottery.git
git push -u origin main
```

### Step 2: Get GitHub Personal Access Token
1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Generate new token
3. Select scopes: `repo` (full control)
4. Copy the token (save it securely!)

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add Environment Variables:
   ```
   ADMIN_PASSWORD=your_strong_password
   JWT_SECRET=random_32_character_string_here
   NEXT_PUBLIC_WHATSAPP_NUMBER=+971XXXXXXXXX
   NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
   GITHUB_TOKEN=your_github_token_from_step2
   GITHUB_REPO=YOUR-USERNAME/alzare-pottery
   GITHUB_BRANCH=main
   ```
5. Click "Deploy"

### Step 4: Enable GitHub Storage (IMPORTANT!)
Since Vercel is serverless, file writes don't persist. You need to update `/src/lib/data.ts` to use GitHub API for writes.

**Option A - Use My Updated data.ts:**
I'll provide an updated version that automatically uses GitHub storage in production.

**Option B - Manual Implementation:**
Add this to your data.ts:
```typescript
const isProduction = process.env.VERCEL === '1';

async function writeToGitHub(path: string, content: string) {
  if (!isProduction) {
    // Local development - use file system
    fs.writeFileSync(path, content);
    return;
  }
  
  // Production - commit to GitHub
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH;
  
  const url = \`https://api.github.com/repos/\${repo}/contents/\${path}\`;
  
  // Get file SHA (required for update)
  const getRes = await fetch(url, {
    headers: { Authorization: \`token \${token}\` }
  });
  const fileData = await getRes.json();
  
  // Update file
  await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: \`token \${token}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Update from admin dashboard',
      content: Buffer.from(content).toString('base64'),
      sha: fileData.sha,
      branch: branch,
    }),
  });
}
```

### Done!
Your site is now live at `https://your-project.vercel.app`

---

## Option 2: Deploy to Traditional VPS (Simpler for File Storage)

### Prerequisites
- VPS (DigitalOcean, Linode, AWS EC2, etc.)
- Ubuntu 22.04 or similar
- SSH access

### Step 1: Setup Server
```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (web server)
apt install -y nginx

# Install certbot (SSL)
apt install -y certbot python3-certbot-nginx
```

### Step 2: Deploy Application
```bash
# Clone your repository
cd /var/www
git clone https://github.com/YOUR-USERNAME/alzare-pottery.git
cd alzare-pottery

# Install dependencies
npm install

# Create .env.local
nano .env.local
# Add your environment variables:
# ADMIN_PASSWORD=your_password
# JWT_SECRET=your_secret
# NEXT_PUBLIC_WHATSAPP_NUMBER=+971XXXXXXXXX
# NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Build the application
npm run build

# Start with PM2
pm2 start npm --name "alzare-pottery" -- start
pm2 save
pm2 startup
```

### Step 3: Configure Nginx
```bash
nano /etc/nginx/sites-available/alzare-pottery
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
ln -s /etc/nginx/sites-available/alzare-pottery /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 4: Setup SSL (Free with Let's Encrypt)
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Done!
Visit `https://yourdomain.com`

---

## Option 3: Deploy to Railway.app (Easy Alternative)

1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Select your repository
4. Add environment variables
5. Deploy!

Railway gives you a free domain and handles everything automatically.

---

## Post-Deployment Checklist

- [ ] Admin login works
- [ ] Can add/edit products
- [ ] Images upload successfully
- [ ] Cart system works
- [ ] WhatsApp checkout opens correctly
- [ ] Both languages (EN/AR) work
- [ ] Mobile responsive
- [ ] SSL certificate installed
- [ ] Custom domain configured
- [ ] Backup system in place

---

## Backup Strategy

### Automated Backups (VPS)
```bash
# Create backup script
nano /root/backup-alzare.sh
```

Add:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d-%H%M)
cd /var/www/alzare-pottery
tar -czf /root/backups/alzare-$DATE.tar.gz data/ public/uploads/
# Keep only last 30 backups
ls -t /root/backups/alzare-*.tar.gz | tail -n +31 | xargs rm -f
```

Make executable and add to cron:
```bash
chmod +x /root/backup-alzare.sh
crontab -e
# Add: 0 2 * * * /root/backup-alzare.sh
```

### Manual Backups
Simply download:
- `/data/products.json`
- `/data/coupons.json`
- `/public/uploads/` folder

---

## Updating Your Site

### VPS:
```bash
cd /var/www/alzare-pottery
git pull
npm install
npm run build
pm2 restart alzare-pottery
```

### Vercel:
Just push to GitHub - Vercel auto-deploys!
```bash
git add .
git commit -m "Update products"
git push
```

---

## Troubleshooting

### File uploads not working on Vercel?
- You need GitHub storage implementation
- Or use Cloudflare R2 / AWS S3
- See README.md for details

### Admin can't login?
- Check environment variables in Vercel dashboard
- JWT_SECRET must be set
- Clear cookies and try again

### Site is slow?
- Enable Vercel Edge caching
- Optimize images (use Next.js Image component)
- Check your VPS resources

---

## Support & Maintenance

- Monitor with: `pm2 monit` (VPS) or Vercel Analytics
- Check logs: `pm2 logs alzare-pottery` (VPS)
- Update dependencies monthly: `npm update`

Good luck with your pottery business! 🏺
