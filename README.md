# SwasthyaSense 🏥

[![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-black?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-black?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-black?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-black)](#license)

**SwasthyaSense** is an AI-powered hospital resource management and prediction platform designed for modern healthcare institutions. It combines real-time environmental data, predictive analytics, and intelligent automation to optimize hospital operations and resource allocation.

---

## ✨ Features

### 🎯 Core Capabilities

- **Google Gemini AI Analytics** - Powered by Google's Gemini AI for healthcare insights:
  - Real-time data analysis and interpretation
  - AI-generated healthcare recommendations
  - Predictive capacity planning with confidence scores
  - Environmental health impact assessment (AQI analysis)
  - Automated staffing and resource optimization
  - Pattern detection and surge prediction
  - Natural language insights and explanations

  
- **Real-time Environmental Monitoring**
  - Air Quality Index (AQI) tracking with health impact analysis
  - Location-based environmental data integration
  - Respiratory health risk alerts and recommendations

- **Predictive Analytics Dashboard**
  - 7/14/21-day patient volume forecasts
  - Department-level demand predictions
  - Trend analysis and pattern recognition
  - Confidence intervals and probability bands

- **Hospital Resource Management**
  - Multi-hospital network management
  - Real-time bed occupancy tracking
  - Department-wise capacity monitoring
  - Geographic distribution and filtering

- **Admin Panel**
  - Comprehensive analytics dashboard
  - Hospital management interface
  - System settings and configuration
  - Activity logs and audit trails

- **Automated Reporting**
  - PDF report generation
  - Custom date range exports
  - Department-specific analytics
  - Downloadable insights

### 🎨 Design Excellence

- **Black & White Theme** - Professional, accessible design with:
  - High contrast for optimal readability
  - Seamless dark/light mode switching
  - Production-grade UI/UX
  - WCAG 2.1 AAA compliant

- **Premium Animations**
  - Framer Motion powered micro-interactions
  - GPU-accelerated smooth transitions
  - 120fps performance optimizations
  - Responsive and fluid user experience

### 🔐 Security & Authentication

- **Clerk Authentication**
  - Secure user management
  - Role-based access control (RBAC)
  - Admin-specific routes and permissions
  - Session management

- **Firebase Integration**
  - Real-time database for hospital data
  - Secure data storage and retrieval
  - Cloud-based scalability

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Firebase** project (for data storage)
- **Clerk** account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/swasthyasense.git
   cd swasthyasense
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp env.template .env.local
   ```
   
   Update the `.env.local` file with your credentials:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   
   # Google Gemini AI (Powers all healthcare analytics)
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Admin Configuration
   ADMIN_EMAIL=admin@yourdomain.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📱 Usage Guide

### For Hospital Staff

1. **Sign Up / Login**
   - Create an account or login at `/login`
   - Use your hospital email address

2. **Dashboard Overview**
   - View real-time hospital statistics
   - Monitor bed occupancy and capacity
   - Check AQI levels and health alerts

3. **Predictions**
   - Access department-wise predictions
   - View 7/14/21-day forecasts
   - Analyze trend patterns

4. **Healthcare AI Insights**
   - Review AI-generated recommendations
   - Get staffing and supply alerts
   - Monitor capacity warnings

5. **Reports**
   - Generate PDF reports
   - Export data for specific date ranges
   - Download analytics summaries

### For Administrators

1. **Access Admin Panel**
   - Login with admin credentials
   - Navigate to `/admin/dashboard`

2. **Manage Hospitals**
   - Add/edit hospital information
   - Monitor network-wide statistics
   - Filter by location

3. **Analytics**
   - View comprehensive system analytics
   - Track performance metrics
   - Monitor user activity

4. **Settings**
   - Configure system parameters
   - Manage user permissions
   - Update hospital data

---

## 🏗️ Project Structure

```
swasthyasense/
├── app/                          # Next.js app directory
│   ├── (dashboard)/             # Dashboard routes (protected)
│   │   ├── page.tsx            # Main dashboard
│   │   ├── predictions/        # Predictions page
│   │   ├── hospitals/          # Hospitals management
│   │   ├── reports/            # Reports generation
│   │   └── settings/           # User settings
│   ├── admin/                   # Admin panel (admin-only)
│   │   ├── dashboard/          # Admin dashboard
│   │   ├── hospitals/          # Hospital management
│   │   ├── analytics/          # System analytics
│   │   └── settings/           # System settings
│   ├── api/                     # API routes
│   │   └── healthcare/         # Healthcare AI endpoints
│   │       ├── insights/       # AI insights generation
│   │       └── staffing/       # Staffing recommendations
│   ├── login/                   # Authentication pages
│   ├── signup/                  
│   ├── globals.css             # Global styles
│   └── layout.tsx              # Root layout
├── components/                  # React components
│   ├── ui/                     # Reusable UI components
│   ├── dashboard/              # Dashboard-specific components
│   │   ├── healthcare-insights.tsx  # AI insights display
│   │   └── ...
│   └── layout/                 # Layout components
├── lib/                        # Utility libraries
│   ├── services/               # Service layer
│   │   └── healthcare-analytics.ts  # Healthcare AI service
│   ├── hooks/                  # Custom React hooks
│   └── utils.ts                # Utility functions
├── public/                     # Static assets
├── .env.local                  # Environment variables (not tracked)
├── env.template                # Environment template
├── package.json                # Dependencies
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

---

## 🛠️ Tech Stack

See [TECH_STACK.md](./TECH_STACK.md) for detailed technology information suitable for presentations.

**Quick Overview:**

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS 4
- **Authentication:** Clerk
- **Database:** Firebase Firestore
- **AI/ML:** Healthcare Analytics Service (extensible with Google Cloud Healthcare API)
- **Charts:** Recharts
- **Animations:** Framer Motion
- **UI Components:** Radix UI, shadcn/ui
- **Deployment:** Vercel, Netlify compatible

---

## 🌐 API Documentation

### Healthcare Insights API

**Endpoint:** `POST /api/healthcare/insights`

Generate AI-powered healthcare insights and recommendations.

**Request Body:**
```json
{
  "hospitalData": {
    "totalBeds": 500,
    "occupancyRate": 85,
    "trend": "increasing"
  },
  "aqiData": {
    "value": 180,
    "category": "Poor"
  },
  "predictionData": {
    "predictions": [...]
  },
  "timeframe": "7days"
}
```

**Response:**
```json
{
  "success": true,
  "insights": [
    {
      "id": "insight-123",
      "type": "alert",
      "title": "Critical Air Quality Alert",
      "description": "AQI level of 180 indicates severe respiratory health risks...",
      "confidence": 0.92,
      "priority": "critical",
      "category": "environmental",
      "timestamp": "2025-12-28T10:30:00.000Z",
      "data": {...}
    }
  ],
  "timestamp": "2025-12-28T10:30:00.000Z"
}
```

### Staffing Recommendations API

**Endpoint:** `POST /api/healthcare/staffing`

Get AI-powered staffing recommendations based on predicted patient load.

**Request Body:**
```json
{
  "predictedLoad": 120,
  "currentStaff": 15
}
```

**Response:**
```json
{
  "success": true,
  "recommendation": {
    "id": "staffing-456",
    "type": "recommendation",
    "title": "Additional Staffing Needed",
    "description": "Based on predicted patient load of 120...",
    "confidence": 0.85,
    "priority": "high",
    "category": "staffing"
  }
}
```

For complete API documentation, see [API_DOCS.md](./API_DOCS.md).

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Add environment variables from `.env.local`
   - Deploy

3. **Configure Domain** (Optional)
   - Add custom domain in Vercel dashboard
   - Update Clerk URLs to match production domain

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Quality

- **TypeScript** - Full type safety
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting (configured in ESLint)

### Performance Optimizations

- Server-side rendering (SSR)
- Static site generation (SSG)  
- Image optimization with Next.js Image
- Code splitting and lazy loading
- GPU-accelerated animations

---

## 🔧 Configuration

### Tailwind CSS

Black and white theme configuration in `tailwind.config.ts`:
- Grayscale color palette
- Custom animations
- Responsive breakpoints

### Environment Variables

Required variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk authentication
- `CLERK_SECRET_KEY` - Clerk server-side
- `NEXT_PUBLIC_FIREBASE_*` - Firebase configuration
- `ADMIN_EMAIL` - Admin user email

Optional variables:
- `GOOGLE_CLOUD_PROJECT_ID` - For Google Cloud Healthcare API
- `GOOGLE_APPLICATION_CREDENTIALS` - Service account credentials

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Follow TypeScript best practices
- Use functional components and hooks
- Write meaningful commit messages
- Add comments for complex logic
- Maintain the black/white theme

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**SwasthyaSense Development Team**

- Project Lead: [Your Name]
- Frontend Developer: [Name]
- Backend Developer: [Name]
- UI/UX Designer: [Name]

---

## 📞 Support

For support and questions:

- **Email:** support@swasthyasense.com
- **Documentation:** [docs.swasthyasense.com](https://docs.swasthyasense.com)
- **Issues:** [GitHub Issues](https://github.com/yourusername/swasthyasense/issues)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Clerk](https://clerk.com/) - Authentication
- [Firebase](https://firebase.google.com/) - Backend services
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Recharts](https://recharts.org/) - Data visualization

---

## 📊 Project Status

✅ **Production Ready**

- All core features implemented
- Black & white theme applied consistently
- Healthcare AI analytics integrated
- Comprehensive documentation complete
- Performance optimized
- Security hardened

---

<p align="center">
  Made with ❤️ for better healthcare management
</p>

<p align="center">
  <strong>SwasthyaSense</strong> - Predict surges. Plan ahead. Win the golden hour.
</p>
