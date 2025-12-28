# SwasthyaSense - Deployment Guide

Complete deployment instructions for production environments.

---

## 🎯 Deployment Options

SwasthyaSense can be deployed to various platforms:

1. **Vercel** (Recommended) - Zero-config, optimized for Next.js
2. **Netlify** - Alternative serverless platform
3. **Self-hosted** - Docker, VPS, or custom server

---

## 🚀 Deploy to Vercel (Recommended)

### Prerequisites

- GitHub account
- Vercel account ([vercel.com/signup](https://vercel.com/signup))
- Environment variables ready

### Step-by-Step Instructions

#### 1. Push Code to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Production ready"

# Add remote repository
git remote add origin https://github.com/yourusername/swasthyasense.git

# Push to GitHub
git push -u origin main
```

#### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure project settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)

#### 3. Configure Environment Variables

In Vercel dashboard, add these environment variables:

```env
# Authentication - Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxxxx

# Clerk URLs (update with your production domain)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Admin Configuration
ADMIN_EMAIL=admin@yourdomain.com

# Optional: Google Cloud Healthcare API
# GOOGLE_CLOUD_PROJECT_ID=your_project_id
# GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

# Production Settings
NODE_ENV=production
```

#### 4. Deploy

1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Your app will be live at `https://your-project.vercel.app`

#### 5. Add Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update Clerk URLs to use custom domain

```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=https://yourdomain.com/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=https://yourdomain.com/signup
```

### Automatic Deployments

Vercel automatically deploys:
- **Production:** Every push to `main` branch → production URL
- **Preview:** Every pull request → preview URL

---

## 🌐 Deploy to Netlify

### Prerequisites

- GitHub account
- Netlify account ([netlify.com/signup](https://netlify.com/signup))

### Step-by-Step Instructions

#### 1. Prepare for Netlify

Add `netlify.toml` configuration file:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. Deploy to Netlify

1. Go to [app.netlify.com/start](https://app.netlify.com/start)
2. Connect to GitHub
3. Select your repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
5. Add environment variables (same as Vercel)
6. Click "Deploy site"

#### 3. Custom Domain

1. Go to Domain Settings
2. Add custom domain
3. Configure DNS

---

## 🐳 Self-Hosted with Docker

### Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  swasthyasense:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

### Deploy with Docker

```bash
# Build image
docker build -t swasthyasense .

# Run container
docker run -p 3000:3000 --env-file .env.production swasthyasense

# Or with docker-compose
docker-compose up -d
```

---

## 🔧 Production Configuration

### Next.js Configuration

Update `next.config.ts` for production:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/avif', 'image/webp'],
  },

  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin'
        }
      ]
    }
  ]
};

export default nextConfig;
```

### Firebase Security Rules

Update Firebase Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isSignedIn() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Hospital data
    match /hospitals/{hospitalId} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }

    // Predictions
    match /predictions/{predictionId} {
      allow read: if isSignedIn();
      allow create, update, delete: if isAdmin();
    }

    // User data
    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && request.auth.uid == userId;
    }
  }
}
```

---

## 🔐 Security Checklist

### Before Deploying

- [ ] All environment variables set correctly
- [ ] No hardcoded secrets in code
- [ ] Firebase security rules configured
- [ ] Clerk authentication tested
- [ ] HTTPS enabled on custom domain
- [ ] Error logging configured
- [ ] Rate limiting implemented
- [ ] CORS policies configured
- [ ] Security headers set
- [ ] Input validation on all API routes

###Post-Deployment

- [ ] Test authentication flow
- [ ] Verify API endpoints
- [ ] Check mobile responsiveness
- [ ] Test dark/light mode
- [ ] Monitor error logs
- [ ] Set up uptime monitoring
- [ ] Configure backup strategy
- [ ] Test performance (Lighthouse)

---

## 📊 Post-Deployment Monitoring

### Vercel Analytics

1. Enable Vercel Analytics in project settings
2. Monitor:
   - Page views
   - Core Web Vitals
   - Error rate
   - Response times

### Error Tracking

Recommended services:
- **Sentry** - Error monitoring
- **LogRocket** - Session replay
- **Datadog** - Application performance

### Uptime Monitoring

Recommended services:
- **UptimeRobot** - Free uptime monitoring
- **StatusCake** - Global monitoring
- **Pingdom** - Performance insights

---

## 🔄 Continuous Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Build project
        run: npm run build
        env:
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.CLERK_PUBLISHABLE_KEY }}
          # Add other environment variables
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🐛 Troubleshooting

### Build Failures

**Issue:** Build fails with "Module not found"
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Issue:** TypeScript errors
```bash
# Solution: Check TypeScript configuration
npm run lint
npx tsc --noEmit
```

### Runtime Errors

**Issue:** API routes return 500
- Check environment variables are set
- Verify API endpoint paths
- Check server logs

**Issue:** Authentication not working
- Verify Clerk API keys
- Check Clerk webhook configuration
- Ensure URLs match deployment domain

### Performance Issues

**Issue:** Slow page loads
- Enable Next.js Image Optimization
- Implement code splitting
- Use dynamic imports for heavy components

---

## 📞 Support

For deployment support:
- **Documentation:** [docs.swasthya sense.com/deploy](https://docs.swasthyasense.com/deploy)
- **Email:** deploy@swasthyasense.com
- **Discord:** [Join our community](https://discord.gg/swasthyasense)

---

## ✅ Production Checklist

### Pre-Launch
- [ ] All features tested
- [ ] Environment variables configured
- [ ] Security audit completed
- [ ] Performance optimization done
- [ ] Error handling implemented
- [ ] Analytics configured
- [ ] Backup strategy in place
- [ ] Domain configured
- [ ] SSL certificate active

### Launch Day
- [ ] Deploy to production
- [ ] Verify all pages load
- [ ] Test authentication
- [ ] Check API endpoints
- [ ] Monitor error logs
- [ ] Verify analytics tracking

### Post-Launch
- [ ] Monitor performance metrics
- [ ] Check error rates
- [ ] Gather user feedback
- [ ] Plan optimization iterations

---

<p align="center">
  <strong>SwasthyaSense Deployment Guide</strong><br>
  Production-Ready | Scalable | Secure
</p>
