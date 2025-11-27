'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  TrendingUp,
  Brain,
  Shield,
  Zap,
  BarChart3,
  Hospital,
  AlertTriangle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

// Import the actual dashboard page and layout
import DashboardContent from './(dashboard)/page';
import DashboardLayout from './(dashboard)/layout';

export default function RootPage() {
  const { isSignedIn, isLoaded } = useUser();

  // Show loading while checking auth
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-ping"></div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                <Activity className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
          <p className="text-lg font-medium text-muted-foreground animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // If signed in, show the dashboard with layout
  if (isSignedIn) {
    return (
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SwasthyaSense
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="lg">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-0">
          AI-Powered Healthcare Intelligence
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Hospital Weather Forecast
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Predict demand surges and autonomously produce operational plans for staffing, supplies, and advisories.
          Prepare ahead of festivals, pollution events, and outbreaks.
        </p>
        <div className="flex items-center justify-center gap-4 mb-12">
          <Link href="/signup">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { label: 'Prediction Accuracy', value: '92%' },
            { label: 'Hospitals Served', value: '500+' },
            { label: 'Lives Impacted', value: '2M+' },
            { label: 'Cost Savings', value: '₹50Cr+' },
          ].map((stat, i) => (
            <Card key={i} className="border-2">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Agentic AI for Healthcare</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI doesn't just predict—it perceives, reasons, and acts to optimize hospital operations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Brain,
              title: 'Perceive',
              description: 'Continuous ingestion of AQI, weather, festivals, and outbreak signals',
              color: 'text-blue-600',
            },
            {
              icon: TrendingUp,
              title: 'Predict',
              description: '7-21 day patient volume forecasts with confidence intervals',
              color: 'text-purple-600',
            },
            {
              icon: Zap,
              title: 'Reason',
              description: 'LLM-based planner creates prioritized, resource-aware action plans',
              color: 'text-pink-600',
            },
            {
              icon: CheckCircle2,
              title: 'Act',
              description: 'Automated alerts, CSV exports, and recommendation workflows',
              color: 'text-green-600',
            },
          ].map((feature, i) => (
            <Card key={i} className="hover:shadow-xl transition-all border-2 hover:border-blue-200 dark:hover:border-blue-800">
              <CardContent className="p-6">
                <feature.icon className={`h-12 w-12 mb-4 ${feature.color}`} />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Real-World Impact</h2>
            <p className="text-xl text-muted-foreground">
              Preventing healthcare crises before they happen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: AlertTriangle,
                title: 'Festival Surge Management',
                description: 'Predict and prepare for Diwali pollution spikes, reducing ER wait times by 40%',
                impact: '40% faster response',
              },
              {
                icon: Hospital,
                title: 'Resource Optimization',
                description: 'AI-driven staffing and inventory recommendations save ₹10L+ per hospital monthly',
                impact: '₹10L+ saved/month',
              },
              {
                icon: BarChart3,
                title: 'Outbreak Detection',
                description: 'Early warning system for disease outbreaks enables proactive measures',
                impact: '3-5 days advance notice',
              },
            ].map((useCase, i) => (
              <Card key={i} className="border-2">
                <CardContent className="p-8">
                  <useCase.icon className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-3">{useCase.title}</h3>
                  <p className="text-muted-foreground mb-4">{useCase.description}</p>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-0">
                    {useCase.impact}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardContent className="p-12">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Hospital?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join 500+ hospitals using SwasthyaSense to predict demand surges and optimize operations
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2">© 2024 SwasthyaSense. Built with ❤️ for improving healthcare operations.</p>
          <p className="text-sm">AI-Powered Hospital Demand Forecasting System</p>
        </div>
      </footer>
    </div>
  );
}
