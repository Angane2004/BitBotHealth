# SwasthyaSense - Setup Instructions

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

**IMPORTANT:** Before running the application, you need to set up your environment variables.

1. Copy the `env.template` file to create `.env.local`:
   ```bash
   # On Windows (PowerShell)
   Copy-Item env.template .env.local
   
   # On Mac/Linux
   cp env.template .env.local
   ```

2. Get your **Clerk** credentials:
   - Go to [clerk.com](https://clerk.com) and create a free account
   - Create a new application
   - In the Clerk dashboard, go to **API Keys**
   - Copy your keys and update `.env.local`:
     ```bash
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
     CLERK_SECRET_KEY=sk_test_...
     ```

3. Get your **Firebase** credentials:
   - Go to [firebase.google.com](https://firebase.google.com)
   - Create a new project
   - Enable **Firestore Database**
   - Go to Project Settings → General → Your apps
   - Copy the config values and update `.env.local`:
     ```bash
     NEXT_PUBLIC_FIREBASE_API_KEY=...
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
     # ... etc
     ```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page!

## 📱 Application Flow

### Landing Page (/)
- Beautiful hero section with project overview
- Features showcase (Perceive → Predict → Reason → Act)
- Use cases and real-world impact
- CTA buttons for **Login** and **Sign Up**

### Authentication Flow
1. **Landing Page** (`/`) → Click "Login" or "Get Started"
2. **Login Page** (`/login`) → Clerk authentication form
   - Has link to signup page
   - After login → redirects to `/dashboard`
3. **Signup Page** (`/signup`) → Clerk registration form
   - Has link to login page
   - After signup → redirects to `/dashboard`

### Dashboard (Protected Routes)
- `/dashboard` or `/` (when authenticated) → Main dashboard
- `/predictions` → Department-wise forecasts
- `/hospitals` → Hospital management
- `/actions` → Action items and approvals
- `/reports` → Analytics and exports
- `/settings` → User preferences

## 🎨 Features

### Landing Page Highlights
- ✅ Gradient hero section with animated text
- ✅ Real-time statistics cards
- ✅ Agentic AI workflow visualization
- ✅ Use case demonstrations
- ✅ Call-to-action sections
- ✅ Responsive design (mobile + desktop)
- ✅ Dark/light mode support

### Authentication
- ✅ Clerk-powered authentication
- ✅ Custom branded login/signup pages
- ✅ Protected route middleware
- ✅ Automatic redirects after auth

### Dashboard
- ✅ AI-powered predictions
- ✅ Interactive charts
- ✅ Resource management
- ✅ Action recommendations
- ✅ Export capabilities

## 🔐 Important Notes

1. **Environment Variables**: The app will NOT work without proper Clerk and Firebase credentials
2. **Public Routes**: Landing page (`/`), `/login`, and `/signup` are public
3. **Protected Routes**: All dashboard routes require authentication
4. **Redirects**: After login/signup, users are redirected to `/dashboard`

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: Clerk
- **Database**: Firebase Firestore
- **Charts**: Recharts
- **Icons**: Lucide React

## 📚 Project Structure

```
app/
├── page.tsx                    # Landing page (public)
├── login/page.tsx              # Login page (public)
├── signup/page.tsx             # Signup page (public)
├── dashboard/page.tsx          # Dashboard redirect
├── (dashboard)/                # Protected dashboard routes
│   ├── layout.tsx              # Dashboard layout with sidebar
│   ├── page.tsx                # Main dashboard
│   ├── predictions/            # Predictions page
│   ├── hospitals/              # Hospitals page
│   ├── actions/                # Actions page
│   ├── reports/                # Reports page
│   └── settings/               # Settings page
└── layout.tsx                  # Root layout with Clerk
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

**Environment Variables to Add in Vercel:**
- All variables from `.env.local`
- Make sure to use your production Clerk and Firebase keys

## 📞 Support

For issues or questions:
1. Check that all environment variables are set correctly
2. Ensure Clerk and Firebase projects are properly configured
3. Verify you're using the correct API keys

---

**Built with ❤️ for improving healthcare operations**
