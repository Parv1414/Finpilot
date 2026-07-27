import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hover = false,
  glow = false,
  onClick,
  padding = true,
  animate = true,
}) {
  const Wrapper = animate ? motion.div : 'div';
  const animProps = animate
    ? {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
      }
    : {};

  return (
    <Wrapper
      {...animProps}
      onClick={onClick}
      className={`
        glass rounded-2xl
        ${padding ? 'p-5' : ''}
        ${hover ? 'cursor-pointer transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] hover:-translate-y-0.5' : ''}
        ${glow ? 'pulse-glow border-emerald-500/20' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </Wrapper>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-between mb-5 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', icon: Icon }) {
  return (
    <h3 className={`flex items-center gap-2 text-base font-semibold text-slate-200 ${className}`}>
      {Icon && <Icon size={16} className="text-emerald-400" />}
      {children}
    </h3>
  );
}
