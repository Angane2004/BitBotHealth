# SwasthyaSense - AI Hospital Demand Forecasting

![SwasthyaSense](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8) ![License](https://img.shields.io/badge/license-MIT-green)

**SwasthyaSense** is an agentic AI "hospital weather forecast" that predicts demand surges and autonomously produces operational plans (staffing, supplies, advisories) so hospitals can prepare ahead of festivals, pollution events, and outbreaks.

## 🚀 Features

- **🔮 Predictive Analytics**: 7-21 day patient volume forecasts per department
- **🤖 AI-Powered Recommendations**: Automated action items for staffing, supplies, and advisories
- **📊 Real-time Monitoring**: Live AQI tracking, weather data, and festival calendar
- **🏥 Hospital Management**: Multi-hospital resource tracking and capacity monitoring
- **📈 Interactive Dashboards**: Beautiful, responsive charts and visualizations
- **🌓 Dark/Light Mode**: Seamless theme switching
- **📱 Mobile Responsive**: Optimized for all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: Clerk
- **LLM**: Ollama
- **Database**: Firebase Firestore
- **Charts**: Recharts

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy `env.template` to `.env.local` and add your API keys:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... (see env.template for all variables)
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### 4. Build for Production

```bash
npm run build
npm start
```

## 📁 Key Features

### Dashboard
- Real-time stats with trend indicators
- 7-day prediction charts with confidence intervals
- AQI monitoring with health impact
- Festival calendar

### AI Recommendations
- Prioritized action items (high/medium/low)
- AI-generated rationale for each recommendation
- Approval workflow with notifications

### Hospital Management
- Bed occupancy tracking
- Staff and inventory monitoring
- Multi-hospital coordination

## 🔐 Setup Instructions

1. **Clerk**: Sign up at [clerk.com](https://clerk.com) and create an application
2. **Firebase**: Create a project at [firebase.google.com](https://firebase.google.com) and enable Firestore
3. Add credentials to `.env.local`

## 🚀 Deployment

Deploy to Vercel:

```bash
npm i -g vercel
vercel
```

Add environment variables in Vercel dashboard.

## 📄 License

MIT License

---

**Built with ❤️ for improving healthcare operations**

