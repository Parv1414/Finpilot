import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Bell, Lock, CreditCard, Globe, Shield,
  ChevronRight, Camera,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input, { Select } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Toggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-10 h-5.5 rounded-full transition-colors duration-300 ${
        enabled ? 'bg-emerald-500' : 'bg-white/[0.1]'
      }`}
      style={{ minWidth: '40px', height: '22px' }}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
          enabled ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.06]">
      <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
        <Icon size={14} className="text-emerald-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
    </div>
  );
}

export default function Settings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', bio: '' });
  const [notifs, setNotifs] = useState({
    budgetAlerts: true, goalUpdates: true, weeklyReport: true, tips: false, marketing: false,
  });
  const [prefs, setPrefs] = useState({
    currency: 'INR', language: 'English', timezone: 'Asia/Kolkata',
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/users/profile', { name: profile.name, bio: profile.bio });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
        <Card animate={false}>
          <SectionHeader icon={User} title="Profile" />
          <div className="flex items-start gap-6 mb-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-xl font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <button className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg bg-[#161625] border border-white/[0.12] flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <Camera size={11} />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-200">{profile.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{profile.email}</p>
              <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/25 rounded-md text-xs text-emerald-400 font-semibold">
                ✦ Free Plan
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            <Input label="Email Address" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium text-slate-300 block mb-1.5">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={2}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/60 focus:border-emerald-500/40 resize-none transition-all"
            />
          </div>
        </Card>
      </motion.div>

      {/* Preferences */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <Card animate={false}>
          <SectionHeader icon={Globe} title="Preferences" />
          <div className="grid sm:grid-cols-3 gap-4">
            <Select label="Currency" value={prefs.currency} onChange={(e) => setPrefs({ ...prefs, currency: e.target.value })}>
              {['INR', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'].map(c => <option key={c}>{c}</option>)}
            </Select>
            <Select label="Language" value={prefs.language} onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}>
              {['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Kannada', 'Bengali'].map(l => <option key={l}>{l}</option>)}
            </Select>
            <Select label="Timezone" value={prefs.timezone} onChange={(e) => setPrefs({ ...prefs, timezone: e.target.value })}>
              {['Asia/Kolkata', 'Asia/Dubai', 'Asia/Singapore', 'America/New_York', 'Europe/London', 'Asia/Tokyo'].map(t => <option key={t}>{t}</option>)}
            </Select>
          </div>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <Card animate={false}>
          <SectionHeader icon={Bell} title="Notifications" />
          <div className="space-y-4">
            {[
              { key: 'budgetAlerts',  label: 'Budget Alerts',         desc: 'Notify when you approach or exceed budget limits' },
              { key: 'goalUpdates',   label: 'Goal Progress Updates', desc: 'Weekly updates on savings goal progress' },
              { key: 'weeklyReport',  label: 'Weekly Financial Report',desc: 'Summary of your financial activity each week' },
              { key: 'tips',          label: 'Financial Tips',         desc: 'Personalized AI tips and recommendations' },
              { key: 'marketing',     label: 'Product Updates',        desc: 'News about new features and announcements' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <Toggle
                  enabled={notifs[item.key]}
                  onToggle={() => setNotifs({ ...notifs, [item.key]: !notifs[item.key] })}
                />
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
        <Card animate={false}>
          <SectionHeader icon={Lock} title="Security" />
          <div className="space-y-3">
            {[
              { label: 'Change Password', desc: 'Update your account password', action: 'Update' },
              { label: 'Two-Factor Authentication', desc: '2FA is currently disabled', action: 'Enable' },
              { label: 'Connected Devices', desc: '2 active sessions', action: 'Manage' },
              { label: 'Login History', desc: 'View all login activity', action: 'View' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-200">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <button className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors">
                  {item.action} <ChevronRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Billing */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card animate={false}>
          <SectionHeader icon={CreditCard} title="Billing & Plan" />
          <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-200">Free Plan</p>
              <p className="text-xs text-slate-500 mt-0.5">₹0/month · No credit card required</p>
            </div>
            <Button variant="outline" size="sm">Upgrade</Button>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            {[
              { label: 'Transactions', value: 'Up to 50' },
              { label: 'Budgets', value: '2 active' },
              { label: 'Goals', value: 'Up to 5' },
            ].map((s) => (
              <div key={s.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-slate-400">{s.label}</p>
                <p className="text-slate-200 font-semibold mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
        <div className="glass rounded-2xl p-5 border border-rose-500/20 bg-rose-500/[0.03]">
          <SectionHeader icon={Shield} title="Danger Zone" />
          <div className="space-y-3">
            {[
              { label: 'Export All Data', desc: 'Download a copy of all your financial data', action: 'Export', danger: false },
              { label: 'Delete All Transactions', desc: 'Permanently remove all transaction history', action: 'Delete', danger: true },
              { label: 'Delete Account', desc: 'Permanently close your FinPilot account', action: 'Delete Account', danger: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-200">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <button className={`text-xs font-semibold flex items-center gap-1 transition-colors ${item.danger ? 'text-rose-400 hover:text-rose-300' : 'text-slate-400 hover:text-white'}`}>
                  {item.action} <ChevronRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="primary" size="md" onClick={handleSave}>
          {saved ? '✓ Saved!' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
