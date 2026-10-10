import { Link, useParams } from 'react-router-dom'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Badge from '../components/Badge'
import { components, rows } from '../lib/analytics'
import { WEIGHTS, type Comp } from '../lib/score'

export default function Profile() {
  const { id } = useParams()
  const s = rows.find((r) => r.id === id)
  if (!s) {
    return (
      <p className="p-6">
        Student not found. <Link className="text-electric underline" to="/students">Back</Link>
      </p>
    )
  }
  const comp = components(s)
  const trend = (s.sgpa ?? []).map((g, i) => ({ sem: `Sem ${i + 1}`, gpa: g }))
  const risks = [
    { label: 'Academic risk', r: s.ar },
    { label: 'Placement risk', r: s.pr },
  ]

  return (
    <div className="space-y-5 p-6">
      <Link className="text-sm text-electric underline" to="/students">← Students</Link>
      <h1 className="text-3xl font-bold">
        {s.name}{' '}
        <span className="text-base font-normal text-slate-500">({s.id}, {s.dept}, Sem {s.semester})</span>
      </h1>
      <p className="text-xs text-amber-700">Sample data: fictional student</p>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-4xl font-bold text-electric">
            {s.sc.score ?? 'N/A'}<span className="text-lg text-slate-500">/100</span>
          </p>
          {s.sc.incomplete && (
            <p className="text-sm text-amber-700">
              Incomplete: missing {s.sc.missing.join(', ')}. Weights re-normalised.
            </p>
          )}
          <div className="mt-3 space-y-2">
            {(Object.keys(WEIGHTS) as Comp[]).map((k) => {
              const v = comp[k]
              return (
                <div key={k}>
                  <div className="flex justify-between text-sm">
                    <span>{k} ({WEIGHTS[k]}%)</span>
                    <span>{v == null ? 'missing' : Math.round(v)}</span>
                  </div>
                  <div className="h-2 rounded bg-slate-100">
                    <div className="h-2 rounded bg-teal" style={{ width: `${v ?? 0}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Score = weighted average of available components (academic = CGPA × 10).
          </p>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <p className="mb-2 font-medium">Semester GPA trend</p>
          {trend.length ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sem" />
                <YAxis domain={[4, 10]} />
                <Tooltip />
                <Line dataKey="gpa" stroke="#7c3aed" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-slate-500">No semester data available.</p>}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {risks.map(({ label, r }) => (
          <div key={label} className="rounded-lg border bg-white p-4">
            <p className="mb-2 font-medium">{label} <Badge level={r.level} /></p>
            {r.flags.length ? (
              <ul className="space-y-2 text-sm">
                {r.flags.map((f) => (
                  <li key={f.reason} className="rounded border bg-slate-50 p-2">
                    <p className="font-medium">{f.reason}</p>
                    <p className="text-xs text-slate-500">Data: {f.data}</p>
                    <p className="text-xs text-teal-700">Suggested action: {f.action}</p>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-slate-500">No risk indicators found.</p>}
            {r.dataGaps.length > 0 && (
              <p className="mt-2 text-xs text-amber-700">Data not available: {r.dataGaps.join('; ')}</p>
            )}
            <p className="mt-2 text-xs text-slate-500">{r.note}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-white p-4">
        <p className="mb-2 font-medium">Skills</p>
        {(s.skillList ?? []).length === 0 && <p className="text-sm text-slate-500">No skills listed yet.</p>}
        {(s.skillList ?? []).map((k) => (
          <span
            key={k.name}
            className={`mb-2 mr-2 inline-block rounded px-2 py-1 text-sm ${k.verified ? 'bg-teal/20' : 'bg-slate-100'}`}
          >
            {k.name} {k.verified ? '(verified)' : '(self-reported)'}
          </span>
        ))}
      </div>
    </div>
  )
}