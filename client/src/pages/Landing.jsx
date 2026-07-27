import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, Sparkles, Target, PieChart, BarChart3, Shield, Zap,
  ArrowRight, CheckCircle2
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
  return (
    <div className="min-h-screen bg-[#08080f] font-sans overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-6 md:px-12 border-b border-white/[0.06] bg-[#08080f]/80 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <TrendingUp size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white">
            Fin<span className="text-emerald-400">Pilot</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          {['Features', 'Pricing', 'About'].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-white transition-colors">{l}</a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 hero-gradient">
        {/* Orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/[0.06] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-blue-500/[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 font-medium"
          >
            <Sparkles size={14} />
            India's Smart AI Personal Finance Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
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
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            FinPilot uses AI to analyze your UPI spending, track Mutual Funds & SIPs, manage EMIs, and guide you toward your financial goals — all in one beautiful dashboard connected to Indian Banks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register">
              <Button variant="primary" size="lg" iconRight={ArrowRight}>
                Start for Free
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="lg">
                View Demo →
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-slate-600 mt-4"
          >
            No credit card required · Free forever plan available
          </motion.p>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 max-w-5xl mx-auto relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080f] via-transparent to-transparent z-10 pointer-events-none" style={{ top: '60%' }} />
          <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/50">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.07] bg-white/[0.02]">
              <div className="w-3 h-3 rounded-full bg-rose-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <div className="flex-1 ml-4 bg-white/[0.04] rounded-lg py-1 px-3 text-xs text-slate-500 max-w-xs">
                app.finpilot.io/dashboard
              </div>
            </div>
            {/* Preview Content */}
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Balance', val: '₹9,80,000', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { label: 'Income', val: '₹80,000', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { label: 'Expenses', val: '₹32,000', color: 'text-rose-400', bg: 'bg-rose-500/10' },
                { label: 'Savings Rate', val: '60.0%', color: 'text-violet-400', bg: 'bg-violet-500/10' },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-white/[0.06]`}>
                  <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                  <p className={`text-xl font-bold font-display ${s.color}`}>{s.val}</p>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6">
              <div className="h-24 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-violet-500/10 rounded-xl flex items-end px-4 pb-3 gap-2">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="flex-1 bg-emerald-400/40 rounded-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-bold font-display gradient-text">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3"
            >
              Everything You Need
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl font-bold text-white"
            >
              Built for Modern Indian Finance
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`glass rounded-2xl p-6 border ${f.border} bg-gradient-to-br ${f.gradient} hover:-translate-y-1 transition-transform duration-300`}
              >
                <div className={`w-10 h-10 rounded-xl bg-white/[0.05] border ${f.border} flex items-center justify-center mb-4`}>
                  <f.icon size={20} style={{ color: f.color }} />
                </div>
                <h3 className="font-semibold text-slate-200 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Simple, Transparent Pricing
            </motion.h2>
            <p className="text-slate-400">Start free, upgrade anytime</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-6 border transition-all ${
                  plan.highlight
                    ? 'glass border-emerald-500/30 bg-emerald-500/[0.04] shadow-lg shadow-emerald-500/10'
                    : 'glass border-white/[0.07]'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 rounded-full text-xs font-bold text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="font-semibold text-slate-200 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-3xl font-bold font-display text-white">{plan.price}</span>
                  <span className="text-slate-500 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-400">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
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
      <section className="py-24 px-6 border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 border border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.08] to-transparent"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to take flight?
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
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
      <footer className="py-8 px-6 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <TrendingUp size={12} className="text-white" />
            </div>
            <span className="font-display font-bold text-sm text-white">
              Fin<span className="text-emerald-400">Pilot</span>
            </span>
          </div>
          <p className="text-xs text-slate-600">© 2025 FinPilot India. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs text-slate-600">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
