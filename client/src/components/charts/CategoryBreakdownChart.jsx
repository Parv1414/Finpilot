import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { formatCurrency } from '../../utils/format';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl p-3 border border-white/10 shadow-xl text-xs">
      <p className="font-semibold text-slate-200 mb-1">{payload[0].payload.name}</p>
      <p className="text-slate-400">Spent: <span className="text-slate-200 font-bold">{formatCurrency(payload[0].value)}</span></p>
    </div>
  );
};

export default function CategoryBreakdownChart({ data = [] }) {
  const sorted = [...data].sort((a, b) => b.value - a.value);

  return (
    <ResponsiveContainer width="100%" height={Math.max(280, sorted.length * 36)}>
      <BarChart
        layout="vertical"
        data={sorted}
        margin={{ top: 0, right: 12, left: 80, bottom: 0 }}
        barSize={10}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => formatCurrency(v)}
        />
        <YAxis
          dataKey="name"
          type="category"
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={75}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]}>
          {sorted.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
