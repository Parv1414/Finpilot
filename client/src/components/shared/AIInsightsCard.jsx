import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const severityStyles = {
  warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: 'text-amber-400', dot: 'bg-amber-400' },
  success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-400', dot: 'bg-emerald-400' },
  info:    { bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   icon: 'text-blue-400',   dot: 'bg-blue-400'   },
  neutral: { bg: 'bg-white/[0.04]',  border: 'border-white/[0.08]', icon: 'text-slate-400',  dot: 'bg-slate-400'  },
};

export default function AIInsightsCard() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await api.get('/insights');
      setInsights(res.data);
    } catch {
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  useEffect(() => {
    if (insights.length < 2) return;
    const interval = setInterval(() => {
      setActiveIdx((i) => (i + 1) % insights.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [insights]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchInsights().finally(() => setRefreshing(false));
  };

  if (loading) {
    return (
      <div className="glass rounded-2xl p-5 border border-emerald-500/[0.15] pulse-glow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/20">
              <Sparkles size={15} className="text-emerald-400" />
            </div>
            <span className="text-sm font-semibold text-slate-200">FinPilot AI Advisor</span>
          </div>
        </div>
        <div className="text-center py-6 text-xs text-slate-500 shimmer rounded-xl">
          Analysing your spending...
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="glass rounded-2xl p-5 border border-emerald-500/[0.15]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/20">
              <Sparkles size={15} className="text-emerald-400" />
            </div>
            <span className="text-sm font-semibold text-slate-200">FinPilot AI Advisor</span>
            <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-md tracking-wider">LIVE</span>
          </div>
        </div>
        <div className="rounded-xl p-4 bg-white/[0.04] border border-white/[0.08] text-center">
          <p className="text-sm text-slate-500">Add more transactions to receive AI insights.</p>
        </div>
      </div>
    );
  }

  const insight = insights[activeIdx] || insights[0];
  const s = severityStyles[insight.severity] || severityStyles.neutral;

  return (
    <div className="glass rounded-2xl p-5 border border-emerald-500/[0.15] pulse-glow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/20">
            <Sparkles size={15} className="text-emerald-400" />
          </div>
          <span className="text-sm font-semibold text-slate-200">FinPilot AI Advisor</span>
          <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-md tracking-wider">LIVE</span>
        </div>
        <button
          onClick={handleRefresh}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.3 }}
          className={`rounded-xl p-4 ${s.bg} border ${s.border}`}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">{insight.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 mb-1">{insight.title}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{insight.message}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {insights.length > 1 && (
        <div className="flex items-center gap-1.5 mt-4">
          {insights.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeIdx ? 'w-4 h-1.5 bg-emerald-400' : 'w-1.5 h-1.5 bg-slate-600 hover:bg-slate-500'
              }`}
            />
          ))}
          <Link to="/ai" className="ml-auto flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
            View all <ChevronRight size={12} />
          </Link>
        </div>
      )}
    </div>
  );
}
