'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const DATA = [
  { month: 'Nov', revenue: 4200 },
  { month: 'Déc', revenue: 5800 },
  { month: 'Jan', revenue: 6100 },
  { month: 'Fév', revenue: 7400 },
  { month: 'Mar', revenue: 8200 },
  { month: 'Avr', revenue: 9600 },
  { month: 'Mai', revenue: 11200 },
]

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF4500" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#FF4500" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2028" />
        <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k€`} />
        <Tooltip
          contentStyle={{ backgroundColor: '#0F1117', border: '1px solid #1E2028', borderRadius: 8, color: '#fff', fontSize: 12 }}
          formatter={(v) => [`${Number(v).toFixed(0)}€`, 'Revenus']}
        />
        <Area type="monotone" dataKey="revenue" stroke="#FF4500" strokeWidth={2} fill="url(#revGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
