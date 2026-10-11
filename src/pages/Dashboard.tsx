import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { depts } from '../data/students'
import { rows, isHiddenTalent } from '../lib/analytics'

const colors: Record<string, string> = { High: '#dc2626', Medium: '#f59e0b', Low: '#16a34a' }

type Row = (typeof rows)[number]

const scored = (list: Row[]) => list.filter((r) => r.sc.score !== null)
const avgScore = (list: Row[]): number => {
  const s = scored(list)
  return s.length ? Math.round(s.reduce((a, r) => a + (r.sc.score as number), 0) / s.length) : 0
}
const isReady = (r: Row) => (r.placement ?? 0) >= 70 && r.pr.level === 'Low'

const bucket = (list: Row[], edges: { label: string; test: (v: number) => boolean }[], get: (r: Row) => number | null) =>
  edges.map((e) => ({ name: e.label, count: list.filter((r) => { const v = get(r); return v !== null && e.test(v) }).length }))

export default function Dashboard() {
  const [dept, setDept] = useState('All')
  const [risk, setRisk] = useState('All')
  const [sem, setSem] = useState('All')
  const [range, setRange] = useState('All')
  const [ready, setReady] = useState('All')

  const semesters = useMemo(() => [...new Set(rows.map((r) => String(r.semester)))].sort(), [])

  const f = useMemo(
    () =>
      rows.filter((r) => {
        if (dept !== 'All' && r.dept !== dept) return false
        if (risk !== 'All' && r.ar.level !== risk) return false
        if (sem !== 'All' && String(r.semester) !== sem) return false
        if (range !== 'All') {
          const v = r.sc.score
          if (v === null) return false
          if (range === '0-49' && !(v < 50)) return false
          if (range === '50-69' && !(v >= 50 && v < 70)) return false
          if (range === '70-100' && !(v >= 70)) return false
        }
        if (ready === 'Ready' && !isReady(r)) return false
        if (ready === 'Not ready' && isReady(r)) return false
        return true
      }),
    [dept, risk, sem, range, ready],
  )

  const incomplete = f.filter((r) => r.sc.incomplete).length

  const kpis: [string, number][] = [
    ['Total students', f.length],
    ['Avg Success Score', avgScore(f)],
    ['Need academic support', f.filter((r) => r.ar.level !== 'Low').length],
    ['Attendance concerns (<75%)', f.filter((r) => r.attendance < 75).length],
    ['Placement risk', f.filter((r) => r.pr.level !== 'Low').length],
    ['Placement ready', f.filter(isReady).length],
    ['Strong practical skills (80+)', f.filter((r) => (r.skills ?? 0) >= 80).length],
    ['Hidden talent', f.filter(isHiddenTalent).length],
  ]

  const byDept = depts.map((d: string) => ({ dept: d, score: avgScore(f.filter((r) => r.dept === d)) }))
  const riskData = (['High', 'Medium', 'Low'] as const).map((l) => ({ name: l, value: f.filter((r) => r.ar.level === l).length }))

  const attDist = bucket(
    f,
    [
      { label: '<60', test: (v) => v < 60 },
      { label: '60-74', test: (v) => v >= 60 && v < 75 },
      { label: '75-89', test: (v) => v >= 75 && v < 90 },
      { label: '90+', test: (v) => v >= 90 },
    ],
    (r) => r.attendance,
  )
  const scoreDist = bucket(
    f,
    [
      { label: '0-39', test: (v) => v < 40 },
      { label: '40-59', test: (v) => v >= 40 && v < 60 },
      { label: '60-79', test: (v) => v >= 60 && v < 80 },
      { label: '80-100', test: (v) => v >= 80 },
    ],
    (r) => r.sc.score,
  )

  const maxSem = Math.max(0, ...f.map((r) => r.sgpa.length))
  const semTrend = Array.from({ length: maxSem }, (_, i) => {
    const vals = f.map((r) => r.sgpa[i]).filter((v) => v != null)
    return { sem: `Sem ${i + 1}`, gpa: vals.length ? +(vals.reduce((a, v) => a + v, 0) / vals.length).toFixed(2) : null }
  })

  const sel = 'rounded border bg-white p-1'
  const card = 'rounded-lg border bg-white p-4'

  return (
    <div className="space-y-5 p-6">
      <h1 className="text-3xl font-bold text-electric">StudentIQ Dashboard</h1>
      <p className="text-xs text-amber-700">Sample data: fictional students</p>

      <div className="flex flex-wrap gap-3 text-sm">
        <label>Department{' '}
          <select value={dept} onChange={(e) => setDept(e.target.value)} className={sel}>
            {['All', ...depts].map((d: string) => <option key={d}>{d}</option>)}
          </select>
        </label>
        <label>Semester{' '}
          <select value={sem} onChange={(e) => setSem(e.target.value)} className={sel}>
            {['All', ...semesters].map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
        <label>Academic risk{' '}
          <select value={risk} onChange={(e) => setRisk(e.target.value)} className={sel}>
            {['All', 'High', 'Medium', 'Low'].map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
        <label>Score range{' '}
          <select value={range} onChange={(e) => setRange(e.target.value)} className={sel}>
            {['All', '0-49', '50-69', '70-100'].map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
        <label>Placement{' '}
          <select value={ready} onChange={(e) => setReady(e.target.value)} className={sel}>
            {['All', 'Ready', 'Not ready'].map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
        <button
          onClick={() => { setDept('All'); setRisk('All'); setSem('All'); setRange('All'); setReady('All') }}
          className="rounded border bg-white px-3 py-1 hover:bg-slate-50"
        >
          Reset filters
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map(([label, v]) => (
          <div key={label} className={card}>
            <p className="text-3xl font-bold text-electric">{v}</p>
            <p className="text-sm text-slate-600">{label}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500">
        Placement ready = placement score 70+ and Low placement risk (demo rule). Scores marked incomplete are not counted as zero.
        {incomplete > 0 && ` ${incomplete} student(s) in this view have incomplete scores.`}
      </p>

      {f.length === 0 && <p className="text-slate-500">No students match these filters.</p>}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className={card}>
          <p className="mb-2 font-medium">Average Success Score by department</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byDept}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="dept" /><YAxis domain={[0, 100]} /><Tooltip />
              <Bar dataKey="score" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={card}>
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
        <div className={card}>
          <p className="mb-2 font-medium">Attendance distribution (%)</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={attDist}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip />
              <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={card}>
          <p className="mb-2 font-medium">Success Score distribution</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={scoreDist}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip />
              <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={`${card} lg:col-span-2`}>
          <p className="mb-2 font-medium">Average semester GPA trend</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={semTrend}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="sem" /><YAxis domain={[4, 10]} /><Tooltip />
              <Line dataKey="gpa" stroke="#2563eb" strokeWidth={2} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}