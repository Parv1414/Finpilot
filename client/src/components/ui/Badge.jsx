const variants = {
  success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
  danger: 'bg-rose-500/15 text-rose-400 border border-rose-500/25',
  warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
  info: 'bg-blue-500/15 text-blue-400 border border-blue-500/25',
  purple: 'bg-violet-500/15 text-violet-400 border border-violet-500/25',
  neutral: 'bg-white/5 text-slate-400 border border-white/10',
  income: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
  expense: 'bg-rose-500/15 text-rose-400 border border-rose-500/25',
};

const sizes = {
  xs: 'text-[10px] px-1.5 py-0.5 rounded-md',
  sm: 'text-xs px-2 py-0.5 rounded-md',
  md: 'text-xs px-2.5 py-1 rounded-lg',
};

export default function Badge({ children, variant = 'neutral', size = 'md', dot = false }) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium ${variants[variant]} ${sizes[size]}`}>
      {dot && (
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full ${
            variant === 'success' || variant === 'income' ? 'bg-emerald-400' :
            variant === 'danger' || variant === 'expense' ? 'bg-rose-400' :
            variant === 'warning' ? 'bg-amber-400' :
            variant === 'info' ? 'bg-blue-400' :
            variant === 'purple' ? 'bg-violet-400' :
            'bg-slate-400'
          }`}
        />
      )}
      {children}
    </span>
  );
}
