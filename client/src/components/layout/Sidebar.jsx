import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CreditCard, PieChart, Target, BarChart3,
  Settings, ChevronLeft, ChevronRight, LogOut, TrendingUp, Bot,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { path: '/expenses',   label: 'Transactions',   icon: CreditCard },
  { path: '/budgets',    label: 'Budgets',    icon: PieChart },
  { path: '/goals',      label: 'Goals',      icon: Target },
  { path: '/reports',    label: 'Reports',    icon: BarChart3 },
  { path: '/ai',         label: 'AI Advisor', icon: Bot },
];

const bottomItems = [
  { path: '/settings',   label: 'Settings',   icon: Settings },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col h-full glass border-r border-white/[0.07] overflow-hidden shrink-0"
    >
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-white/[0.07] px-4 gap-3`}>
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25 shrink-0">
          <TrendingUp size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <span className="font-display font-bold text-lg text-white tracking-tight">
                Fin<span className="text-emerald-400">Pilot</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium -mt-0.5">AI Finance Co-pilot</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-0.5">
        {navItems.map((item) => (
          <SidebarLink key={item.path} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="px-2 pb-3 flex flex-col gap-0.5 border-t border-white/[0.07] pt-3">
        {bottomItems.map((item) => (
          <SidebarLink key={item.path} item={item} collapsed={collapsed} />
        ))}
        <SidebarLogout collapsed={collapsed} />
      </div>

      {/* Collapse Toggle */}
      <div className="px-2 pb-4">
        <button
          onClick={onToggle}
          className={`
            flex items-center gap-2 w-full px-3 py-2 rounded-xl
            text-slate-400 hover:text-white hover:bg-white/[0.06]
            transition-all duration-200 text-sm
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}

function SidebarLink({ item, collapsed }) {
  const { path, label, icon: Icon } = item;

  return (
    <NavLink
      to={path}
      title={collapsed ? label : undefined}
      className={({ isActive }) => `
        group flex items-center gap-3 px-3 py-2.5 rounded-xl
        transition-all duration-200 relative
        ${isActive
          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
          : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
        }
        ${collapsed ? 'justify-center' : ''}
      `}
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            className={`shrink-0 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`}
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
          {isActive && (
            <motion.div
              layoutId="active-indicator"
              className="absolute right-2 w-1.5 h-1.5 rounded-full bg-emerald-400"
            />
          )}
        </>
      )}
    </NavLink>
  );
}

function SidebarLogout({ collapsed }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <button
      onClick={() => { logout(); navigate('/login'); }}
      title={collapsed ? 'Log out' : undefined}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl
        text-slate-400 hover:text-rose-400 hover:bg-rose-500/[0.07]
        transition-all duration-200 w-full text-left
        ${collapsed ? 'justify-center' : ''}
      `}
    >
      <LogOut size={18} className="shrink-0" />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.15 }}
            className="text-sm font-medium"
          >
            Log out
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
