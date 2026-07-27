import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Mail, Lock, Eye, EyeOff, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

const perks = [
  'Free forever plan available',
  'AI-powered spending insights',
  'Unlimited goal tracking',
  'Bank-level 256-bit encryption',
];

export default function Register() {
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form.name, form.email, form.password);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080f] flex items-center justify-center p-6 hero-gradient">
      <div className="fixed top-1/3 right-1/4 w-64 h-64 bg-emerald-500/[0.06] rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 left-1/4 w-48 h-48 bg-violet-500/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[900px] grid md:grid-cols-2 gap-6 items-center">
        {/* Left: Perks */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:block"
        >
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">
              Fin<span className="text-emerald-400">Pilot</span>
            </span>
          </div>
          <h2 className="font-display text-4xl font-bold text-white leading-tight mb-4">
            Your financial<br />
            <span className="gradient-text">co-pilot awaits.</span>
          </h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            Join 150,000+ people who use FinPilot to take control of their money, hit their goals, and build real wealth.
          </p>
          <ul className="space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Mobile logo */}
          <div className="flex justify-center mb-6 md:hidden">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <TrendingUp size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Fin<span className="text-emerald-400">Pilot</span>
              </span>
            </Link>
          </div>

          <div className="glass-strong rounded-3xl p-8 border border-white/[0.08]">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold font-display text-white mb-1.5">Create your account</h1>
              <p className="text-sm text-slate-500">Start your free 14-day Pro trial</p>
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {['Google', 'Apple'].map((p) => (
                <button
                  key={p}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-slate-300 hover:bg-white/[0.08] transition-all"
                >
                  {p === 'Google' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  ) : (
                    <svg width="13" height="16" viewBox="0 0 814 1000" fill="currentColor" className="text-slate-300">
                      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-194.3 127.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
                    </svg>
                  )}
                  {p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/[0.07]" />
              <span className="text-xs text-slate-600">or</span>
              <div className="flex-1 h-px bg-white/[0.07]" />
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="Rahul Sharma"
                icon={User}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Email address"
                type="email"
                placeholder="rahul@example.com"
                icon={Mail}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                label="Password"
                type={show ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                icon={Lock}
                iconRight={() => (
                  <button type="button" onClick={() => setShow(!show)} className="text-slate-400 hover:text-white transition-colors">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                hint="Use 8+ characters with letters, numbers & symbols"
                required
              />

              <p className="text-xs text-slate-600 leading-relaxed">
                By creating an account you agree to our{' '}
                <a href="#" className="text-emerald-400 hover:underline">Terms of Service</a> and{' '}
                <a href="#" className="text-emerald-400 hover:underline">Privacy Policy</a>.
              </p>

              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} iconRight={ArrowRight}>
                Create Account
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
