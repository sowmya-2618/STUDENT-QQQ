import { useState } from 'react'
import { Link } from 'react-router-dom'
import { rows } from '../lib/analytics'

type Status = 'Not started' | 'In progress' | 'Done'
type Goal = { id: string; title: string; why: string; week: number; area: string }

const addDays = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export default function ActionPlan() {
  const [id, setId] = useState(rows[0].id)
  // progress: studentId -> goalId -> status (session only)
  const [progress, setProgress] = useState<Record<string, Record<string, Status>>>({})
  const s = rows.find((r) => r.id === id)!
  const skills = s.skillList ?? []
  const verified = skills.filter((k) => k.verified)

  // Goals: risk flags nunchi (reason = why)
  const goals: Goal[] = []
  s.ar.flags.forEach((f, i) =>
    goals.push({ id: `a${i}`, title: f.action, why: `${f.reason} (${f.data})`, week: i + 1, area: 'Academic' }))
  s.pr.flags.forEach((f, i) =>
    goals.push({ id: `p${i}`, title: f.action, why: `${f.reason} (${f.data})`, week: s.ar.flags.length + i + 1, area: 'Placement' }))

  const strengths: string[] = []
  if (s.cgpa >= 8) strengths.push(`Strong academics (CGPA ${s.cgpa})`)
  if (s.attendance >= 90) strengths.push(`Excellent attendance (${s.attendance}%)`)
  if (verified.length) strengths.push(`Verified skills: ${verified.map((k) => k.name).join(', ')}`)
  if (s.skills != null && s.skills >= 80) strengths.push(`Practical skills score ${s.skills}/100`)

  const status = (gid: string): Status => progress[id]?.[gid] ?? 'Not started'
  const setStatus = (gid: string, v: Status) =>
    setProgress({ ...progress, [id]: { ...progress[id], [gid]: v } })
  const done = goals.filter((g) => status(g.id) === 'Done').length
  const pct = goals.length ? Math.round((done / goals.length) * 100) : 0

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-3xl font-bold text-electric">Personalized Action Plan</h1>
      <p className="text-xs text-amber-700">
        Sample data. Goals come from rule-based risk flags. Progress is saved in this browser session only (demo).
      </p>

      <select value={id} onChange={(e) => setId(e.target.value)} className="rounded border bg-white p-2">
        {rows.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.id})</option>)}
      </select>
      <p className="text-sm">
        <Link className="text-electric underline" to={`/students/${s.id}`}>{s.name}</Link> · {s.dept} · CGPA {s.cgpa}
      </p>

      <div className="rounded-lg border bg-white p-4">
        <p className="font-medium">Current strengths</p>
        {strengths.length
          ? <ul className="list-disc pl-5 text-sm">{strengths.map((t) => <li key={t}>{t}</li>)}</ul>
          : <p className="text-sm text-slate-500">Not enough evidence yet to list strengths. Submit project or skill evidence for review.</p>}
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="flex justify-between">
          <p className="font-medium">Goals and weekly milestones</p>
          <p className="text-sm text-slate-600">{done}/{goals.length} done ({pct}%)</p>
        </div>
        <div className="mt-2 h-2 rounded bg-slate-100"><div className="h-2 rounded bg-teal" style={{ width: `${pct}%` }} /></div>

        {goals.length === 0 && (
          <p className="mt-3 text-sm text-slate-500">No risk indicators found. Suggested focus: add a verified project and apply to one opportunity.</p>
        )}

        <ul className="mt-3 space-y-3">
          {goals.map((g) => (
            <li key={g.id} className="rounded border bg-slate-50 p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{g.title}</p>
                  <p className="text-xs text-slate-500">Why: {g.why}</p>
                  <p className="text-xs text-slate-500">{g.area} · Week {g.week} · Target date {addDays(g.week * 7)}</p>
                </div>
                <select value={status(g.id)} onChange={(e) => setStatus(g.id, e.target.value as Status)}
                  className="rounded border bg-white p-1 text-sm">
                  <option>Not started</option><option>In progress</option><option>Done</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
        {s.ar.dataGaps.length + s.pr.dataGaps.length > 0 && (
          <p className="mt-3 text-xs text-amber-700">
            Data not available: {[...s.ar.dataGaps, ...s.pr.dataGaps].join('; ')}. The plan may be less specific.
          </p>
        )}
      </div>
    </div>
  )
}