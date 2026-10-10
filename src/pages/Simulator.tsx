import { useState } from 'react'
import { components, rows } from '../lib/analytics'
import { successScore, WEIGHTS, type Comp } from '../lib/score'

const fields: { key: Comp; label: string; min: number; max: number; step: number }[] = [
  { key: 'academic', label: 'CGPA', min: 0, max: 10, step: 0.1 },
  { key: 'attendance', label: 'Attendance %', min: 0, max: 100, step: 1 },
  { key: 'lms', label: 'LMS / assignments', min: 0, max: 100, step: 1 },
  { key: 'skills', label: 'Skills', min: 0, max: 100, step: 1 },
  { key: 'placement', label: 'Placement readiness', min: 0, max: 100, step: 1 },
  { key: 'engagement', label: 'Engagement', min: 0, max: 100, step: 1 },
]

// Slider shows CGPA on 0-10, others on 0-100
const toSlider = (k: Comp, v: number | null | undefined): number =>
  v == null ? 0 : k === 'academic' ? +(v / 10).toFixed(1) : v

export default function Simulator() {
  const [id, setId] = useState(rows[0].id)
  const [over, setOver] = useState<Partial<Record<Comp, number>>>({})
  const s = rows.find((r) => r.id === id)!
  const base = components(s) as Record<Comp, number | null | undefined>

  const pick = (newId: string) => { setId(newId); setOver({}) }

  const sim: Record<Comp, number | null | undefined> = { ...base }
  fields.forEach((f) => {
    const o = over[f.key]
    if (o !== undefined) sim[f.key] = f.key === 'academic' ? o * 10 : o
  })

  const orig = successScore(base)
  const simd = successScore(sim)
  const diff = (simd.score ?? 0) - (orig.score ?? 0)
  const changed = fields.filter((f) => over[f.key] !== undefined && sim[f.key] !== base[f.key])

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-3xl font-bold text-electric">What-If Simulator</h1>
      <p className="text-xs text-amber-700">Hypothetical values only. Actual student records are never changed.</p>

      <select value={id} onChange={(e) => pick(e.target.value)} className="rounded border bg-white p-2">
        {rows.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.id})</option>)}
      </select>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border bg-white p-4">
          {fields.map((f) => {
            const missing = base[f.key] == null
            const val = over[f.key] ?? toSlider(f.key, base[f.key])
            return (
              <div key={f.key}>
                <div className="flex justify-between text-sm">
                  <span>{f.label} ({WEIGHTS[f.key]}%)</span>
                  <span>{missing && over[f.key] === undefined ? 'missing' : val}</span>
                </div>
                <input
                  type="range" min={f.min} max={f.max} step={f.step} value={val}
                  onChange={(e) => setOver({ ...over, [f.key]: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            )
          })}
          <button onClick={() => setOver({})} className="rounded border px-3 py-1 text-sm hover:bg-slate-50">
            Reset
          </button>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <p className="mb-1 inline-block rounded bg-violet-100 px-2 py-0.5 text-xs text-violet-700">
            SIMULATED RESULT
          </p>
          <div className="flex gap-6">
            <div>
              <p className="text-sm text-slate-500">Original</p>
              <p className="text-4xl font-bold">{orig.score ?? 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Simulated</p>
              <p className="text-4xl font-bold text-electric">{simd.score ?? 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Difference</p>
              <p className={`text-4xl font-bold ${diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {diff > 0 ? '+' : ''}{diff}
              </p>
            </div>
          </div>

          <p className="mt-3 text-sm font-medium">Why it changed</p>
          {changed.length ? (
            <ul className="list-disc pl-5 text-sm">
              {changed.map((f) => (
                <li key={f.key}>
                  {f.label}: {base[f.key] == null ? 'missing' : toSlider(f.key, base[f.key])} → {over[f.key]} (weight {WEIGHTS[f.key]}%)
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-slate-500">Move a slider to see the effect.</p>}

          {orig.incomplete && (
            <p className="mt-2 text-xs text-amber-700">
              Original score is incomplete (missing {orig.missing.join(', ')}); weights were re-normalised.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}