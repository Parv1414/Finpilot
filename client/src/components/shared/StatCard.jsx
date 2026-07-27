import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

import { formatCurrency } from '../../utils/format';

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color = 'emerald',
  isCurrency = true,
  prefix = '',
  suffix = '',
  delay = 0,
}) {
  const colorMap = {
    emerald: {
      icon: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/15',
      glow: 'shadow-emerald-500/10',
    },
    blue: {
      icon: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/15',
      glow: 'shadow-blue-500/10',
    },
    rose: {
      icon: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/15',
      glow: 'shadow-rose-500/10',
    },
    violet: {
      icon: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/15',
      glow: 'shadow-violet-500/10',
    },
    amber: {
      icon: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/15',
      glow: 'shadow-amber-500/10',
    },
  };

  const c = colorMap[color] || colorMap.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`
        glass rounded-2xl p-5 border
        hover:border-white/[0.12] hover:-translate-y-0.5
        transition-all duration-300 group
        shadow-lg ${c.glow}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${c.bg} border ${c.border}`}>
          <Icon size={20} className={c.icon} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
            trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
          }`}>
            {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">{title}</p>
        <p className="text-2xl font-bold font-display text-slate-100">
          {isCurrency ? formatCurrency(value) : `${prefix}${value}${suffix}`}
        </p>
        {trendLabel && (
          <p className="text-xs text-slate-500 mt-1.5">{trendLabel}</p>
        )}
      </div>
    </motion.div>
  );
}
