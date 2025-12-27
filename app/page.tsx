'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/logo';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Brain,
  TrendingUp,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Hospital,
  BarChart3,
  Activity,
  Sparkles
} from 'lucide-react';

const showcases = [
  {
    title: 'Command center playbooks',
    description: 'Human + AI loops drafting schedules, supplies and advisories with one tap approvals.',
    stat: '14 live workflows',
    badge: 'Operations',
    image: '/dashboard.png',
  },
  {
    title: 'Respiratory surge triage',
    description: 'Air-quality plus prescription streams triggered resource pivots ahead of the spike.',
    stat: '42% faster response',
    badge: 'Care teams',
    image: '/predction.png',
  },
  {
    title: 'Integrated field response',
    description: 'City ops, hospital leadership and supply vendors view the same situational board.',
    stat: '9 agencies synced',
    badge: 'Coordination',
    image: '/report.png',
  },
];

export default function RootPage() {
  const { isSignedIn, isLoaded } = useAuth(); // Changed from useUser to useAuth as per instruction's import block
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const [activeExperience, setActiveExperience] = useState(0);
  const heroFloat = useSpring(useTransform(scrollYProgress, [0, 0.4], [0, -160]), {
    stiffness: 120,
    damping: 30,
  });
  const revealMask = useTransform(scrollYProgress, [0, 0.3], [90, 0]);
  const revealClip = useTransform(revealMask, (v) => `inset(${v}% ${v / 2}% 0% ${v / 2}%)`);
  const sliderShift = `${-activeExperience * 100}%`;
  const progressWidth = `${((activeExperience + 1) / showcases.length) * 100}%`;

  const stats = [
    { label: 'Avg. Forecast Confidence', value: '94%', detail: 'Rolling 21-day horizon' },
    { label: 'Beds Optimised', value: '38K+', detail: 'Across metro + tier-2' },
    { label: 'Operational Savings', value: '₹62Cr', detail: 'in the last 12 months' },
    { label: 'Response Time', value: '→ 6 hrs', detail: 'from alert to action' },
  ];

  const capabilities = [
    {
      icon: Brain,
      title: 'Signal Perception',
      copy: 'Multi-source ingestion for AQI, climate volatility, mobility, social chatter & festival calendars.',
      chip: 'Real-time streams',
    },
    {
      icon: TrendingUp,
      title: 'Demand Forecasts',
      copy: 'Probabilistic models produce 7/14/21 day volume curves per department with custom guardrails.',
      chip: 'Confidence bands',
    },
    {
      icon: Zap,
      title: 'Reason & Recommend',
      copy: 'Agentic planner stress-tests resources and drafts playbooks for staffing, supplies, advisories.',
      chip: 'Auto playbooks',
    },
    {
      icon: CheckCircle2,
      title: 'Act & Close Loop',
      copy: 'Push notifications, CSV drops, email summaries and command-center checklists with owners.',
      chip: 'Action loops',
    },
  ];

  const automations = [
    {
      title: 'Festival Surge Pack',
      desc: 'Adaptive ER rosters + pollution-care kits ready 10 days out.',
      impact: '↓ 42% wait times',
    },
    {
      title: 'Heatwave Condition Watch',
      desc: 'Blends IMD triggers with internal past spikes, drafts hydration SOPs.',
      impact: '↓ 28% ICU load swings',
    },
    {
      title: 'Outbreak Early Warning',
      desc: 'Detections from prescription anomaly + social signals escalate to admin + city ops.',
      impact: '+3 day lead',
    },
  ];

  const timeline = [
    { title: 'Sense signals', detail: 'AQI + NDVI + syndromic feeds fused hourly', metric: '112 data taps' },
    { title: 'Predict surge', detail: 'Hierarchical models at department level', metric: '±6% MAPE' },
    { title: 'Plan resources', detail: 'Agent drafts shift, beds, supplies, advisories', metric: '14 workflows' },
    { title: 'Close loop', detail: 'Smart nudges, dashboards, CSV exports', metric: 'Auto follow-ups' },
  ];

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading while checking auth
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-gray-200 dark:border-gray-800 rounded-full animate-ping"></div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 bg-black dark:bg-white rounded-full flex items-center justify-center animate-pulse">
                <Activity className="h-10 w-10 text-white dark:text-black animate-heartbeat" />
              </div>
            </div>
          </div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400 animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Don't show landing page if signed in (will redirect)
  if (isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-transparent overflow-hidden relative">
      {/* Ambient Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-32 left-1/2 -translate-x-1/2 h-[480px] w-[480px] rounded-full bg-black/4 dark:bg-white/5 blur-[140px]"
          style={{ y: heroFloat }}
          transition={{ type: 'spring', stiffness: 80, damping: 25 }}
        />
        <div className="absolute bottom-16 right-16 h-40 w-40 rounded-full border border-black/10 dark:border-white/10" style={{ animation: 'orbital-glow 16s linear infinite' }} />
        <div className="absolute top-24 left-10 h-32 w-32 rounded-full border border-black/5 dark:border-white/15" style={{ animation: 'orbital-glow 20s linear infinite reverse' }} />
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/50 dark:from-transparent dark:via-transparent dark:to-transparent"
          style={{ clipPath: revealClip }}
        />
      </div>

      {/* Header */}
      <header className="border-b border-black/5 dark:border-white/10 bg-white/85 dark:bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-8">
          <Link href="/" className="flex-1">
            <Logo size="default" />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            <a href="#capabilities" className="hover:text-black dark:hover:text-white transition">Capabilities</a>
            <a href="#automations" className="hover:text-black dark:hover:text-white transition">Automations</a>
            <a href="#process" className="hover:text-black dark:hover:text-white transition">Process</a>
          </nav>
          <div className="flex items-center gap-3">
            {/* <Link href="/admin/login">
              <Button variant="ghost" size="lg" className="text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-full gap-2">
                <div className="p-1 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                </div>
                Admin
              </Button>
            </Link> */}
            <Link href="/login">
              <Button variant="ghost" size="lg" className="text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-full">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" className="rounded-full bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-24 relative">
        {/* Hero */}
        <motion.section
          className="py-16 lg:py-24 grid lg:grid-cols-2 gap-16 items-center"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="space-y-8 max-w-2xl">
            <Badge className="bg-white/70 text-black border border-black/10 shadow-sm w-fit px-4 py-1">
              Agentic hospital weather intelligence
            </Badge>
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-semibold text-black dark:text-white leading-tight">
                Predict surges. <span className="underline decoration-4 decoration-black/30 dark:decoration-white/40 underline-offset-8">Plan ahead.</span> Win the golden hour.
              </h1>
              <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-200">
                SwasthyaSense senses climate, festival and outbreak signals, predicts load and drafts ready-to-run playbooks for every department.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100 px-8 py-6 rounded-full text-lg">
                  Launch command center
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#process">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-2 border-black/20 dark:border-white/30 px-8 py-6 text-lg text-black dark:text-white"
                >
                  Explore workflow
                </Button>
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map(stat => (
                <Card key={stat.label} className="glass-panel border-0 animate-fade-in-up">
                  <CardContent className="p-5 space-y-1">
                    <p className="text-3xl font-semibold text-black dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{stat.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-8 bg-white/50 dark:bg-black/40 blur-2xl rounded-[32px]" />
            <motion.div
              className="relative rounded-[32px] glass-panel p-8 overflow-hidden"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff55,transparent_55%)] pointer-events-none" />
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.4em] text-gray-500">Live stack</p>
                  <Sparkles className="h-5 w-5 text-gray-500" />
                </div>
                <div className="space-y-4">
                  {automations.map((item, index) => (
                    <div
                      key={item.title}
                      className={`rounded-3xl border border-black/5 dark:border-white/10 p-6 transition duration-300 cursor-pointer ${hoveredCard === index ? 'translate-y-[-6px] shadow-xl shadow-black/10 dark:shadow-white/20 bg-white/80 dark:bg-white/10' : 'bg-white/40 dark:bg-white/5'}`}
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-black dark:text-white">{item.title}</h3>
                        <Badge className="bg-black text-white dark:bg-white dark:text-black border-none">{item.impact}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="relative mt-8">
                  <div className="rounded-2xl border border-black/5 dark:border-white/10 p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-black text-white dark:bg-white dark:text-black grid place-items-center font-semibold text-lg">
                        AI
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 uppercase tracking-[0.4em]">SwasthyaLens</p>
                        <p className="text-xl font-semibold text-black dark:text-white">Command feed online</p>
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <p className="text-2xl font-semibold text-black dark:text-white">12</p>
                        <p className="text-gray-500">signals</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-black dark:text-white">08</p>
                        <p className="text-gray-500">playbooks</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-black dark:text-white">03</p>
                        <p className="text-gray-500">alerts</p>
                      </div>
                    </div>
                  </div>
                  <Image
                    src="/globe.svg"
                    alt="Global network"
                    width={260}
                    height={260}
                    className="absolute -right-6 -bottom-10 w-40 opacity-30"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Capabilities */}
        <motion.section
          id="capabilities"
          className="py-16 space-y-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <p className="text-sm uppercase tracking-[0.7em] text-gray-500">End-to-end autonomy</p>
            <h2 className="text-4xl font-semibold text-black dark:text-white">The agentic stack for hospital readiness</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Designed with award-winning micro-interactions; engineered for command-center rigor.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map(item => (
              <Card key={item.title} className="glass-panel border-0 hover:-translate-y-1 transition duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-black text-white dark:bg-white dark:text-black grid place-items-center">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black dark:text-white">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{item.copy}</p>
                  </div>
                  <Badge className="w-fit bg-black text-white dark:bg-white dark:text-black border-none">{item.chip}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Automation stories */}
        <motion.section
          id="automations"
          className="py-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="rounded-[32px] bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 p-10 space-y-10 beam-border">
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.5em] text-gray-500">Playbooks</p>
                <h2 className="text-3xl font-semibold text-black dark:text-white mt-2">Autonomous command modules</h2>
              </div>
              <Badge className="bg-black text-white dark:bg-white dark:text-black border-none">Trusted by 40+ networks</Badge>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[AlertTriangle, Hospital, BarChart3].map((Icon, index) => (
                <div key={automations[index].title} className="rounded-3xl p-6 border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur">
                  <Icon className="h-6 w-6 mb-5 text-black dark:text-white" />
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-3">{automations[index].title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{automations[index].desc}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{automations[index].impact}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Experience Showcase - Card Swapping */}
        <section className="py-16 space-y-8">
          <div className="text-center space-y-3">
            <Badge className="bg-black text-white dark:bg-white dark:text-black border-none px-4 py-1">Inside the command center</Badge>
            <h2 className="text-4xl font-semibold text-black dark:text-white">What the experience looks like</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Cinematic dashboards, clinical signal overlays, and explainable recommendations.
            </p>
          </div>

          {/* Card Swapping Container */}
          <div className="relative max-w-2xl mx-auto" style={{ perspective: '1500px' }}>
            {/* Navigation Controls */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm uppercase tracking-[0.4em] text-gray-500">Experience cards</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-full border border-black/10 dark:border-white/10 px-4 py-2 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition"
                  onClick={() =>
                    setActiveExperience((prev) =>
                      prev === 0 ? showcases.length - 1 : prev - 1
                    )
                  }
                >
                  Prev
                </button>
                <button
                  type="button"
                  className="rounded-full border border-black/10 dark:border-white/10 bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition"
                  onClick={() =>
                    setActiveExperience((prev) =>
                      prev === showcases.length - 1 ? 0 : prev + 1
                    )
                  }
                >
                  Next
                </button>
              </div>
            </div>

            {/* Card Stack */}
            <div className="relative h-[600px]">
              {showcases.map((story, index) => {
                const offset = index - activeExperience;
                const isActive = index === activeExperience;
                const isPrev = offset < 0;
                const isNext = offset > 0;

                return (
                  <motion.div
                    key={story.title}
                    className="absolute inset-0"
                    initial={false}
                    animate={{
                      x: isActive ? 0 : isPrev ? -100 : 100,
                      y: isActive ? 0 : Math.abs(offset) * 20,
                      scale: isActive ? 1 : 1 - Math.abs(offset) * 0.1,
                      opacity: isActive ? 1 : Math.abs(offset) === 1 ? 0.4 : 0,
                      rotateY: isActive ? 0 : isPrev ? 25 : -25,
                      zIndex: isActive ? 10 : 10 - Math.abs(offset),
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                      pointerEvents: isActive ? 'auto' : 'none',
                    }}
                  >
                    <div className="h-full rounded-[32px] border border-black/10 bg-white shadow-[0_25px_60px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-black/40 backdrop-blur-xl overflow-hidden">
                      <div className="p-8 h-full flex flex-col">
                        {/* Card Header */}
                        <div className="space-y-4 mb-6">
                          <div className="flex items-center justify-between">
                            <Badge className="bg-black text-white dark:bg-white dark:text-black border-none">{story.badge}</Badge>
                            <span className="text-xs uppercase tracking-[0.6em] text-gray-400">Card {index + 1}</span>
                          </div>
                          <h3 className="text-3xl font-semibold text-black dark:text-white leading-tight">{story.title}</h3>
                          <p className="text-base text-gray-600 dark:text-gray-300">{story.description}</p>
                        </div>

                        {/* Card Image */}
                        <div className="relative flex-1 overflow-hidden rounded-2xl bg-gray-900/10 mb-6">
                          <Image
                            src={story.image}
                            alt={story.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 700px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-2xl font-bold text-white">{story.stat}</p>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Swipe to explore more</span>
                          <div className="flex gap-1">
                            {showcases.map((_, i) => (
                              <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === activeExperience
                                  ? 'w-8 bg-emerald-500'
                                  : 'w-1.5 bg-gray-300 dark:bg-gray-600'
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Progress Indicator */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <span className="text-sm text-gray-500">Card {activeExperience + 1} of {showcases.length}</span>
            </div>
          </div>
        </section>

        {/* Process */}
        <motion.section
          id="process"
          className="py-16 space-y-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.5em] text-gray-500">How it flows</p>
              <h2 className="text-3xl font-semibold text-black dark:text-white">From first signal to action in hours</h2>
            </div>
            <Button
              asChild
              className="rounded-full bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100"
            >
              <Link href="/signup">Book a live walkthrough</Link>
            </Button>
          </div>
          <div className="grid lg:grid-cols-4 gap-6">
            {timeline.map((step, index) => (
              <div key={step.title} className="relative p-6 rounded-3xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-white/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Step {index + 1}</span>
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-400">{step.metric}</span>
                </div>
                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{step.detail}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          className="py-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Card className="rounded-[32px] border border-black/5 dark:border-white/10 bg-black text-white dark:bg-white dark:text-black overflow-hidden">
            <CardContent className="p-12 relative">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,white,transparent_60%)]" />
              <div className="relative space-y-6">
                <Badge className="bg-white/20 text-white border-white/30 dark:bg-black/10 dark:text-black">Priority beta access</Badge>
                <h2 className="text-4xl font-semibold max-w-3xl leading-tight">
                  Deploy a hospital-grade command experience with cinematic polish in under 30 days.
                </h2>
                <p className="text-lg text-white/80 dark:text-black/70 max-w-3xl">
                  Smooth micro-interactions, responsive hero experiences, atmospheric backgrounds and precision data viz
                  — tuned for awwwards-level craft yet production ready.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/signup">
                    <Button size="lg" className="rounded-full bg-white text-black hover:bg-gray-100">
                      Start pilot
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  {/* <Link href="/login">
                    <Button size="lg" variant="outline" className="rounded-full border-white/40 text-white dark:text-white dark:border-black/20">
                      Already onboard?
                    </Button>
                  </Link> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>

      <footer className="border-t border-black/5 dark:border-white/10 py-10">
        <div className="container mx-auto px-4 text-sm text-gray-600 dark:text-gray-300 flex flex-wrap items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SwasthyaSense. Crafted for the hackathon — production ready.</p>
          <div className="flex gap-4">
            <a href="#capabilities" className="hover:text-black dark:hover:text-white">Capabilities</a>
            <a href="#automations" className="hover:text-black dark:hover:text-white">Automations</a>
            <a href="#process" className="hover:text-black dark:hover:text-white">Workflow</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
