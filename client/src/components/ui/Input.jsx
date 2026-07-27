import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  hint,
  icon: Icon,
  iconRight: IconRight,
  className = '',
  containerClassName = '',
  type = 'text',
  required,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-rose-400 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          required={required}
          className={`
            w-full bg-white/[0.04] border border-white/[0.08] rounded-xl
            px-4 py-2.5 text-sm text-slate-100
            placeholder:text-slate-500
            focus:outline-none focus:ring-1 focus:ring-emerald-500/60 focus:border-emerald-500/40
            hover:border-white/[0.12]
            transition-all duration-200
            ${Icon ? 'pl-10' : ''}
            ${IconRight ? 'pr-10' : ''}
            ${error ? 'border-rose-500/50 focus:ring-rose-500/30' : ''}
            ${className}
          `}
          {...props}
        />
        {IconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <IconRight size={16} />
          </div>
        )}
      </div>
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

export function Select({ label, error, children, className = '', containerClassName = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <select
        className={`
          w-full bg-[#0f0f1a] border border-white/[0.08] rounded-xl
          px-4 py-2.5 text-sm text-slate-100
          focus:outline-none focus:ring-1 focus:ring-emerald-500/60 focus:border-emerald-500/40
          hover:border-white/[0.12] transition-all duration-200
          ${error ? 'border-rose-500/50' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}
