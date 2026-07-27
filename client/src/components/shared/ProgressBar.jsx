import { formatCurrency } from '../../utils/format';

export default function ProgressBar({
  value,
  max,
  color = '#10b981',
  label,
  showPercent = true,
  showValues = false,
  size = 'md',
}) {
  const pct = Math.min((value / max) * 100, 100);
  const isOver = value > max;

  const heights = { xs: 'h-1', sm: 'h-1.5', md: 'h-2', lg: 'h-3' };

  return (
    <div className="w-full">
      {(label || showValues || showPercent) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs text-slate-400">{label}</span>}
          <div className="flex items-center gap-2 ml-auto">
            {showValues && (
              <span className="text-xs text-slate-500">
                {formatCurrency(value)} / {formatCurrency(max)}
              </span>
            )}
            {showPercent && (
              <span className={`text-xs font-semibold ${isOver ? 'text-rose-400' : 'text-slate-300'}`}>
                {pct.toFixed(0)}%
              </span>
            )}
          </div>
        </div>
      )}
      <div className={`w-full bg-white/[0.06] rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} rounded-full transition-all duration-700 ease-out`}
          style={{
            width: `${pct}%`,
            background: isOver
              ? 'linear-gradient(90deg, #f43f5e, #fb7185)'
              : `linear-gradient(90deg, ${color}, ${color}cc)`,
            boxShadow: `0 0 8px ${color}40`,
          }}
        />
      </div>
    </div>
  );
}
