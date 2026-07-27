import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

const pageTitles = {
  '/dashboard': { title: 'Dashboard', dynamicSub: true },
  '/expenses':  { title: 'Transactions',  sub: 'Track and manage your spending' },
  '/budgets':   { title: 'Budgets',   sub: 'Manage your monthly budgets' },
  '/goals':     { title: 'Goals',     sub: 'Your savings goals at a glance' },
  '/reports':   { title: 'Reports',   sub: 'Monthly financial analytics' },
  '/settings':  { title: 'Settings',  sub: 'Manage your account preferences' },
};

export default function Navbar({ onMobileMenuToggle }) {
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const page = pageTitles[location.pathname] || { title: 'FinPilot', sub: '' };

  const greeting = useMemo(() => {
    if (page.dynamicSub) return `${getGreeting()}, ${user?.name?.split(' ')[0] || 'there'} 👋`;
    return page.sub;
  }, [location.pathname, page, user]);

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.07] bg-[#08080f]/80 backdrop-blur-xl shrink-0 z-10">
      {/* Left: Page Title */}
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden text-slate-400 hover:text-white transition-colors"
          onClick={onMobileMenuToggle}
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-base font-semibold text-slate-100">{page.title}</h1>
          <p className="text-xs text-slate-500 hidden sm:block">{greeting}</p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <AnimatePresence>
            {searchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 220, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <input
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                  placeholder="Search transactions..."
                  className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/40"
                />
              </motion.div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                <Search size={18} />
              </button>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            id="notif-btn"
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <Bell size={18} />
          </button>
          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-80 glass-strong rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-white/[0.07]">
                    <p className="text-sm font-semibold text-slate-100">Notifications</p>
                  </div>
                  <div className="py-8 text-center text-xs text-slate-500">
                    No new notifications
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <button className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-white/[0.06] transition-all">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-slate-200 leading-none">{user?.name || 'User'}</p>
            <p className="text-[10px] text-emerald-400 mt-0.5 font-medium">Free Plan</p>
          </div>
        </button>
      </div>
    </header>
  );
}
