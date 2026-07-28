import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Sparkles, Target, PieChart, BarChart3, Shield, Zap,
  ArrowRight, CheckCircle2, Menu, X
} from 'lucide-react';
import Button from '../components/ui/Button';

const features = [
  {
    icon: Sparkles,
    title: 'FinPilot AI Advisor',
    description: 'Get personalized financial recommendations, SIP advice, and UPI spending analytics powered by AI.',
    color: '#10b981',
    gradient: 'from-emerald-500/20 to-emerald-600/5',
    border: 'border-emerald-500/15',
  },
  {
    icon: Target,
    title: 'Investment Tracking',
    description: 'Track your Mutual Funds, SIPs, Stocks, FDs, PPF, and EPF. Set savings goals and watch your wealth grow.',
    color: '#3b82f6',
    gradient: 'from-blue-500/20 to-blue-600/5',
    border: 'border-blue-500/15',
  },
  {
    icon: PieChart,
    title: 'Budget & EMI Management',
    description: 'Manage budgets per category and stay on top of your EMIs, credit card bills, and recurring expenses.',
    color: '#8b5cf6',
    gradient: 'from-violet-500/20 to-violet-600/5',
    border: 'border-violet-500/15',
  },
  {
    icon: BarChart3,
    title: 'Advanced Reports',
    description: 'Visualize your spending trends with interactive charts, monthly analytics, and GST reports for businesses.',
    color: '#f59e0b',
    gradient: 'from-amber-500/20 to-amber-600/5',
    border: 'border-amber-500/15',
  },
  {
    icon: Shield,
    title: 'Bank-Level Security',
    description: '256-bit encryption and two-factor authentication keeps your Indian Bank data safe.',
    color: '#f43f5e',
    gradient: 'from-rose-500/20 to-rose-600/5',
    border: 'border-rose-500/15',
  },
  {
    icon: Zap,
    title: 'Real-Time UPI Sync',
    description: 'Connect your bank accounts and get instant UPI transaction updates from PhonePe, GPay, and Paytm.',
    color: '#06b6d4',
    gradient: 'from-cyan-500/20 to-cyan-600/5',
    border: 'border-cyan-500/15',
  },
];

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: '/month',
    features: ['Up to 50 transactions/month', '2 budget categories', 'Basic reports', 'Mobile app access'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '₹299',
    period: '/month',
    features: ['Unlimited transactions', 'Unlimited budgets', 'AI insights', 'Advanced reports', 'Goal tracking', 'Priority support'],
    cta: 'Start Free Trial',
    highlight: true,
  },
  {
    name: 'Business',
    price: '₹999',
    period: '/month',
    features: ['Everything in Pro', 'GST invoicing', 'Team collaboration', 'API access', 'Dedicated manager', 'SLA guarantee'],
    cta: 'Contact Sales',
    highlight: false,
  },
];

const stats = [
  { label: 'Active Users', value: '150K+' },
  { label: 'Transactions Tracked', value: '₹24,000 Cr+' },
  { label: 'Money Saved', value: '₹1,500 Cr+' },
  { label: 'App Rating', value: '4.9 ⭐' },
];

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = ['Features', 'Pricing', 'About'];

  return (
    <div className="min-h-screen bg-[#08080f] font-sans">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-12 h-14 sm:h-16 border-b border-white/[0.06] bg-[#08080f]/80 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <TrendingUp size={14} className="text-white sm:size-4" />
          </div>
          <span className="font-display font-bold text-base sm:text-lg text-white whitespace-nowrap">
            Fin<span className="text-emerald-400">Pilot</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm text-slate-400">
          {navLinks.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="hover:text-white transition-colors"
            >
              {l}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/login" className="hidden sm:block">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-14 sm:top-16 inset-x-0 z-40 md:hidden bg-[#08080f]/95 backdrop-blur-xl border-b border-white/[0.06] px-4 py-4"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-slate-400 hover:text-white transition-colors py-2"
                >
                  {l}
                </a>
              ))}
              <div className="pt-2 border-t border-white/[0.06]">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" fullWidth className="mb-2">Log in</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" fullWidth>Get Started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative min-h-screen pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-20 lg:pb-0 px-4 sm:px-6 lg:px-8 hero-gradient flex flex-col">
        {/* Orbs */}
        <div className="absolute top-20 left-1/4 w-72 sm:w-80 md:w-96 h-72 sm:h-80 md:h-96 bg-emerald-500/[0.06] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-64 sm:w-72 md:w-80 h-64 sm:h-72 md:h-80 bg-blue-500/[0.05] rounded-full blur-3xl pointer-events-none" />

        <div className="flex-1 flex items-center w-full max-w-7xl mx-auto">
          <div className="w-full grid lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center">

            {/* Left: Text Content */}
            <div className="text-center lg:text-left pt-8 lg:pt-0">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-emerald-400 font-medium whitespace-nowrap"
              >
                <Sparkles size={12} className="sm:size-[14px]" />
                <span className="hidden sm:inline">India's Smart</span> AI Personal Finance Platform
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight mb-4 sm:mb-6"
              >
                Take Control of{' '}
                <span className="gradient-text">Your Finances</span>
                <br />
                Like a Pro
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg md:text-xl text-slate-400 max-w-lg mb-8 sm:mb-10 leading-relaxed mx-auto lg:mx-0"
              >
                FinPilot uses AI to analyze your UPI spending, track Mutual Funds & SIPs, manage EMIs, and guide you toward your financial goals — all in one beautiful dashboard connected to Indian Banks.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center lg:justify-start gap-3 sm:gap-4"
              >
                <Link to="/register" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" iconRight={ArrowRight} fullWidth>
                    Start for Free
                  </Button>
                </Link>
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" fullWidth>
                    View Demo →
                  </Button>
                </Link>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs text-slate-600 mt-3 sm:mt-4"
              >
                No credit card required · Free forever plan available
              </motion.p>
            </div>

            {/* Right: Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative pb-8 sm:pb-12 lg:pb-0"
            >
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080f] via-transparent to-transparent z-10 pointer-events-none lg:hidden" style={{ top: '55%' }} />
                <div className="glass rounded-xl sm:rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/50 lg:shadow-[0_0_80px_rgba(16,185,129,0.12)]">
                  {/* Fake browser bar */}
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3.5 border-b border-white/[0.07] bg-white/[0.02]">
                    <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-rose-500/60" />
                    <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-amber-500/60" />
                    <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-emerald-500/60" />
                    <div className="flex-1 ml-2 sm:ml-4 bg-white/[0.04] rounded-lg py-1 px-2 sm:px-3 text-[10px] sm:text-xs text-slate-500 max-w-[160px] sm:max-w-xs truncate">
                      app.finpilot.io/dashboard
                    </div>
                  </div>
                  {/* Preview Content */}
                  <div className="p-4 sm:p-5 md:p-7 grid grid-cols-2 gap-3 sm:gap-4">
                    {[
                      { label: 'Total Balance', val: '₹9,80,000', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                      { label: 'Income', val: '₹80,000', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                      { label: 'Expenses', val: '₹32,000', color: 'text-rose-400', bg: 'bg-rose-500/10' },
                      { label: 'Savings Rate', val: '60.0%', color: 'text-violet-400', bg: 'bg-violet-500/10' },
                    ].map((s) => (
                      <div key={s.label} className={`${s.bg} rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border border-white/[0.06]`}>
                        <p className="text-[10px] sm:text-xs text-slate-500 mb-1 sm:mb-1.5 truncate">{s.label}</p>
                        <p className={`text-base sm:text-lg md:text-2xl font-bold font-display ${s.color} truncate`}>{s.val}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 sm:px-5 md:px-7 pb-4 sm:pb-5 md:pb-7">
                    <div className="h-20 sm:h-24 md:h-32 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-violet-500/10 rounded-lg sm:rounded-xl flex items-end px-3 sm:px-4 md:px-5 pb-2 sm:pb-3 md:pb-4 gap-2 sm:gap-3">
                      {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                        <div key={i} className="flex-1 bg-emerald-400/40 rounded-sm min-h-[4px]" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-y border-white/[0.05]">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold font-display gradient-text">{s.value}</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-emerald-400 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-2 sm:mb-3"
            >
              Everything You Need
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white"
            >
              Built for Modern Indian Finance
            </motion.h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`glass rounded-xl sm:rounded-2xl p-5 sm:p-6 border ${f.border} bg-gradient-to-br ${f.gradient} hover:-translate-y-1 transition-transform duration-300`}
              >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.05] border ${f.border} flex items-center justify-center mb-3 sm:mb-4`}>
                  <f.icon size={18} className="sm:size-[20px]" style={{ color: f.color }} />
                </div>
                <h3 className="font-semibold text-slate-200 mb-1.5 sm:mb-2 text-sm sm:text-base">{f.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.05]">
        <div className="w-full max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4"
            >
              Simple, Transparent Pricing
            </motion.h2>
            <p className="text-sm sm:text-base text-slate-400">Start free, upgrade anytime</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-xl sm:rounded-2xl p-5 sm:p-6 border transition-all ${
                  plan.highlight
                    ? 'glass border-emerald-500/30 bg-emerald-500/[0.04] shadow-lg shadow-emerald-500/10'
                    : 'glass border-white/[0.07]'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 rounded-full text-[10px] sm:text-xs font-bold text-white whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <h3 className="font-semibold text-slate-200 mb-2 text-sm sm:text-base">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4 sm:mb-5">
                  <span className="text-2xl sm:text-3xl font-bold font-display text-white">{plan.price}</span>
                  <span className="text-slate-500 text-xs sm:text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2 sm:space-y-3 mb-5 sm:mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                      <CheckCircle2 size={12} className="sm:size-[14px] text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button
                    variant={plan.highlight ? 'primary' : 'secondary'}
                    size="md"
                    fullWidth
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.05]">
        <div className="w-full max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 border border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.08] to-transparent text-center"
          >
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Ready to take flight?
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mb-6 sm:mb-8 max-w-md mx-auto px-2">
              Join 150,000+ users who trust FinPilot to manage their financial future.
            </p>
            <Link to="/register">
              <Button variant="primary" size="lg" iconRight={ArrowRight}>
                Get Started Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 border-t border-white/[0.05]">
        <div className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <TrendingUp size={10} className="text-white sm:size-3" />
            </div>
            <span className="font-display font-bold text-xs sm:text-sm text-white">
              Fin<span className="text-emerald-400">Pilot</span>
            </span>
          </Link>
          <p className="text-[10px] sm:text-xs text-slate-600 order-last sm:order-none">© 2025 FinPilot India. All rights reserved.</p>
          <div className="flex items-center gap-4 sm:gap-6 text-[10px] sm:text-xs text-slate-600">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
