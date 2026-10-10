import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { depts } from '../data/students'
import { rows, isHiddenTalent } from '../lib/analytics'

const colors: Record<string, string> = { High: '#dc2626', Medium: '#f59e0b', Low: '#16a34a' }

export default function Dashboard() {
  const [dept, setDept] = useState('All')
  const [risk, setRisk] = useState('All')

  const f = useMemo(
    () => rows.filter((r) => (dept === 'All' || r.dept === dept) && (risk === 'All' || r.ar.level === risk)),
    [dept, risk],
  )
  const avg = f.length ? Math.round(f.reduce((a, r) => a + r.sc.score, 0) / f.length) : 0
  const kpis: [string, number][] = [
    ['Total students', f.length],
    ['Avg Success Score', avg],
    ['Need academic support', f.filter((r) => r.ar.level !== 'Low').length],
    ['Attendance concerns (<75%)', f.filter((r) => r.attendance < 75).length],
    ['Placement risk', f.filter((r) => r.pr.level !== 'Low').length],
    ['Hidden talent', f.filter(isHiddenTalent).length],
  ]
  const byDept = depts.map((d) => {
    const g = f.filter((r) => r.dept === d)
    return { dept: d, score: g.length ? Math.round(g.reduce((a, r) => a + r.sc.score, 0) / g.length) : 0 }
  })
  const riskData = ['High', 'Medium', 'Low'].map((l) => ({ name: l, value: f.filter((r) => r.ar.level === l).length }))

  return (
    <div className="space-y-5 p-6">
      <h1 className="text-3xl font-bold text-electric">StudentIQ Dashboard</h1>
      <p className="text-xs text-amber-700">Sample data: fictional students</p>
      <div className="flex flex-wrap gap-3">
        <label className="text-sm">Department{' '}
          <select value={dept} onChange={(e) => setDept(e.target.value)} className="rounded border p-1">
            {['All', ...depts].map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
        <label className="text-sm">Academic risk{' '}
          <select value={risk} onChange={(e) => setRisk(e.target.value)} className="rounded border p-1">
            {['All', 'High', 'Medium', 'Low'].map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {kpis.map(([label, v]) => (
          <div key={label} className="rounded-lg border bg-white p-4">
            <p className="text-3xl font-bold text-electric">{v}</p>
            <p className="text-sm text-slate-600">{label}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-4">
          <p className="mb-2 font-medium">Average Success Score by department</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byDept}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dept" /><YAxis domain={[0, 100]} /><Tooltip />
              <Bar dataKey="score" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="mb-2 font-medium">Academic risk breakdown</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={riskData} dataKey="value" nameKey="name" label>
                {riskData.map((d) => <Cell key={d.name} fill={colors[d.name]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}