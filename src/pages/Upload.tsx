import { useMemo, useState } from 'react'
import Papa from 'papaparse'
import { rows } from '../lib/analytics'

type Rec = Record<string, string>
type Key = 'name' | 'dept' | 'semester' | 'cgpa' | 'attendance' | 'backlogs' | 'lms' | 'skills' | 'placement' | 'engagement'
type Field = { key: Key; label: string; required: boolean; text?: boolean; min?: number; max?: number; int?: boolean }

const FIELDS: Field[] = [
  { key: 'name', label: 'Name', required: true, text: true },
  { key: 'dept', label: 'Department', required: true, text: true },
  { key: 'semester', label: 'Semester', required: true, min: 1, max: 12, int: true },
  { key: 'cgpa', label: 'CGPA', required: true, min: 0, max: 10 },
  { key: 'attendance', label: 'Attendance %', required: true, min: 0, max: 100 },
  { key: 'backlogs', label: 'Backlogs', required: true, min: 0, max: 50, int: true },
  { key: 'lms', label: 'LMS score', required: false, min: 0, max: 100 },
  { key: 'skills', label: 'Skills score', required: false, min: 0, max: 100 },
  { key: 'placement', label: 'Placement readiness', required: false, min: 0, max: 100 },
  { key: 'engagement', label: 'Engagement', required: false, min: 0, max: 100 },
]

const ALIASES: Record<string, string> = {
  student_id: 'id', studentid: 'id', 'student id': 'id', roll: 'id',
  department: 'dept', branch: 'dept', sem: 'semester',
  attendance_percent: 'attendance', 'attendance %': 'attendance',
}
const norm = (h: string) => {
  const k = h.trim().toLowerCase()
  return ALIASES[k] ?? k
}

const SAMPLES: { file: string; text: string }[] = [
  {
    file: 'sample_marks.csv',
    text: 'id,name,dept,semester,cgpa,backlogs\nS901,Sample Student One,CSE,5,7.8,0\nS902,Sample Student Two,ECE,3,5.9,2\nS903,Sample Student Three,IT,4,8.2,0\n',
  },
  {
    file: 'sample_attendance.csv',
    text: 'id,attendance\nS901,88\nS902,70\nS903,91\nS904,66\n',
  },
  {
    file: 'sample_lms_skills.csv',
    text: 'id,attendance,lms,skills,placement,engagement\nS901,86,72,65,60,55\nS902,,,82,,40\nS903,,80,70,75,60\n',
  },
]

const downloadText = (file: string, text: string) => {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8;' }))
  const a = document.createElement('a')
  a.href = url
  a.download = file
  a.click()
  URL.revokeObjectURL(url)
}

type Src = { name: string; data: Rec[]; idCol: string | null; cols: { key: Key; header: string }[]; ignored: string[] }

const readFile = (file: File) =>
  new Promise<Src>((resolve, reject) => {
    Papa.parse<Rec>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const headers = res.meta.fields ?? []
        if (!headers.length || res.data.length === 0) {
          reject(new Error('empty'))
          return
        }
        const idCol = headers.find((h) => norm(h) === 'id') ?? null
        const cols: Src['cols'] = []
        const ignored: string[] = []
        headers.forEach((h) => {
          if (h === idCol) return
          const f = FIELDS.find((x) => x.key === norm(h))
          if (f) cols.push({ key: f.key, header: h })
          else ignored.push(h)
        })
        resolve({ name: file.name, data: res.data, idCol, cols, ignored })
      },
      error: (e: Error) => reject(e),
    })
  })

type Merged = { id: string; vals: Partial<Record<Key, string>>; from: string[]; conflicts: string[] }

function merge(sources: Src[]): Merged[] {
  const map = new Map<string, Merged>()
  sources.forEach((s) => {
    const idCol = s.idCol
    if (!idCol) return
    s.data.forEach((r) => {
      const id = (r[idCol] ?? '').trim()
      if (!id) return
      const k = id.toLowerCase()
      const m = map.get(k) ?? { id, vals: {}, from: [], conflicts: [] }
      if (!m.from.includes(s.name)) m.from.push(s.name)
      s.cols.forEach((c) => {
        const v = (r[c.header] ?? '').trim()
        if (v === '') return
        const old = m.vals[c.key]
        if (old === undefined) m.vals[c.key] = v
        else if (old !== v) m.conflicts.push(`${c.key}: "${old}" vs "${v}" (${s.name})`)
      })
      map.set(k, m)
    })
  })
  return [...map.values()]
}

type Status = 'ready' | 'incomplete' | 'rejected' | 'exists'
type Out = Merged & { status: Status; errors: string[]; missingReq: string[]; missingOpt: string[] }

function evaluate(list: Merged[]): Out[] {
  const existing = new Set(rows.map((r) => r.id.toLowerCase()))
  return list.map((m) => {
    const errors: string[] = []
    FIELDS.forEach((f) => {
      const v = m.vals[f.key]
      if (v === undefined || f.text) return
      const n = Number(v)
      if (Number.isNaN(n)) {
        errors.push(`${f.label} is not a number ("${v}")`)
        return
      }
      if (f.int && !Number.isInteger(n)) errors.push(`${f.label} must be a whole number ("${v}")`)
      if (f.min !== undefined && f.max !== undefined && (n < f.min || n > f.max))
        errors.push(`${f.label} must be ${f.min}-${f.max} ("${v}")`)
    })
    const missingReq = FIELDS.filter((f) => f.required && m.vals[f.key] === undefined).map((f) => f.label)
    const missingOpt = FIELDS.filter((f) => !f.required && m.vals[f.key] === undefined).map((f) => f.label)
    const status: Status = existing.has(m.id.toLowerCase())
      ? 'exists'
      : errors.length
        ? 'rejected'
        : missingReq.length
          ? 'incomplete'
          : 'ready'
    return { ...m, status, errors, missingReq, missingOpt }
  })
}

const badge: Record<Status, string> = {
  ready: 'bg-green-100 text-green-700',
  incomplete: 'bg-amber-100 text-amber-700',
  rejected: 'bg-red-100 text-red-700',
  exists: 'bg-slate-200 text-slate-700',
}
const statusText: Record<Status, string> = {
  ready: 'Ready',
  incomplete: 'Incomplete',
  rejected: 'Rejected',
  exists: 'Already exists (not overwritten)',
}

export default function Upload() {
  const [sources, setSources] = useState<Src[]>([])
  const [error, setError] = useState('')

  const out = useMemo(() => evaluate(merge(sources)), [sources])
  const fresh = out.filter((o) => o.status !== 'exists')
  const count = (s: Status) => out.filter((o) => o.status === s).length
  const conflicts = out.filter((o) => o.conflicts.length > 0)
  const missingByCol = FIELDS.map((f) => ({
    label: f.label,
    required: f.required,
    missing: fresh.filter((o) => o.vals[f.key] === undefined).length,
  }))

  const onFiles = async (list: FileList | null) => {
    setError('')
    if (!list) return
    const files = Array.from(list)
    const added: Src[] = []
    for (const f of files) {
      if (!f.name.toLowerCase().endsWith('.csv')) {
        setError(`${f.name}: only .csv files are allowed.`)
        continue
      }
      try {
        added.push(await readFile(f))
      } catch {
        setError(`${f.name}: file is empty or could not be read.`)
      }
    }
    setSources((prev) => [...prev.filter((p) => !added.some((a) => a.name === p.name)), ...added])
  }

  const report = () => {
    const csv = Papa.unparse(
      out.map((o) => ({
        ID: o.id,
        Status: statusText[o.status],
        Sources: o.from.join(' + '),
        Errors: o.errors.join('; '),
        'Missing required': o.missingReq.join('; '),
        'Missing optional': o.missingOpt.join('; '),
        Conflicts: o.conflicts.join('; '),
      })),
    )
    downloadText('studentiq_import_report.csv', csv)
  }

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-3xl font-bold text-electric">Multi-source CSV Upload and Merge</h1>
      <p className="text-xs text-amber-700">
        Demo: files are processed in your browser only. Nothing is saved, and existing records are never overwritten.
        Saving needs a backend (for example Supabase).
      </p>

      <div className="rounded-lg border bg-white p-4 space-y-3">
        <p className="font-medium">1. Upload one or more CSV files (marks, attendance, LMS and so on)</p>
        <p className="text-sm text-slate-600">
          Every file needs an ID column (id or student_id). Files are merged by Student ID into one unified view.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            accept=".csv"
            multiple
            onChange={(e) => {
              const el = e.target
              onFiles(el.files).then(() => { el.value = '' })
            }}
            className="rounded border bg-white p-2 text-sm"
          />
          {sources.length > 0 && (
            <button onClick={() => setSources([])} className="rounded border bg-white px-3 py-2 text-sm hover:bg-slate-50">
              Clear all
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-slate-600">Sample templates:</span>
          {SAMPLES.map((s) => (
            <button key={s.file} onClick={() => downloadText(s.file, s.text)}
              className="rounded border bg-white px-2 py-1 text-xs hover:bg-slate-50">
              {s.file}
            </button>
          ))}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      {sources.length > 0 && (
        <div className="rounded-lg border bg-white p-4">
          <p className="mb-2 font-medium">2. Files loaded</p>
          <ul className="space-y-2 text-sm">
            {sources.map((s) => (
              <li key={s.name} className="rounded border bg-slate-50 p-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{s.name} ({s.data.length} rows)</span>
                  <button onClick={() => setSources(sources.filter((x) => x.name !== s.name))}
                    className="text-xs text-red-600 underline">Remove</button>
                </div>
                {s.idCol
                  ? <p className="text-xs text-slate-600">ID column: {s.idCol}. Fields: {s.cols.map((c) => c.key).join(', ') || 'none'}</p>
                  : <p className="text-xs text-red-600">No ID column found, this file is ignored.</p>}
                {s.ignored.length > 0 && <p className="text-xs text-slate-500">Unrecognised columns ignored: {s.ignored.join(', ')}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {out.length > 0 && (
        <>
          <div className="rounded-lg border bg-white p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">3. Unified student view and validation</p>
              <button onClick={report} className="rounded bg-electric px-3 py-1 text-sm text-white">Download validation report</button>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
              <div className="rounded border p-3"><p className="text-2xl font-bold">{out.length}</p><p className="text-xs">Unique students</p></div>
              <div className="rounded border p-3"><p className="text-2xl font-bold text-green-600">{count('ready')}</p><p className="text-xs">Ready</p></div>
              <div className="rounded border p-3"><p className="text-2xl font-bold text-amber-600">{count('incomplete')}</p><p className="text-xs">Incomplete (missing required)</p></div>
              <div className="rounded border p-3"><p className="text-2xl font-bold text-red-600">{count('rejected')}</p><p className="text-xs">Rejected (invalid values)</p></div>
              <div className="rounded border p-3"><p className="text-2xl font-bold text-slate-600">{count('exists')}</p><p className="text-xs">Already exist (skipped)</p></div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-1">ID</th>
                    {FIELDS.map((f) => <th key={f.key} className="p-1">{f.label}</th>)}
                    <th className="p-1">Sources</th>
                    <th className="p-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {out.slice(0, 100).map((o) => (
                    <tr key={o.id} className="border-t align-top">
                      <td className="p-1 font-medium">{o.id}</td>
                      {FIELDS.map((f) => (
                        <td key={f.key} className="p-1">{o.vals[f.key] ?? <span className="text-amber-600">missing</span>}</td>
                      ))}
                      <td className="p-1">{o.from.length}</td>
                      <td className="p-1">
                        <span className={`rounded px-2 py-0.5 ${badge[o.status]}`}>{statusText[o.status]}</span>
                        {o.errors.length > 0 && <p className="mt-1 text-red-600">{o.errors.join('; ')}</p>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {out.length > 100 && <p className="text-xs text-slate-500">Showing first 100 of {out.length}. The report has all rows.</p>}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border bg-white p-4">
              <p className="mb-2 font-medium">Missing values per column (new students)</p>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100"><tr><th className="p-1">Column</th><th className="p-1">Missing</th></tr></thead>
                <tbody>
                  {missingByCol.map((c) => (
                    <tr key={c.label} className="border-t">
                      <td className="p-1">{c.label}{c.required && <span className="text-red-600"> *</span>}</td>
                      <td className="p-1">{c.missing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-xs text-slate-500">
                * required. Missing optional values are not treated as zero, so those scores will show as incomplete.
              </p>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <p className="mb-2 font-medium">Conflicts between files ({conflicts.length})</p>
              {conflicts.length === 0
                ? <p className="text-sm text-slate-500">No conflicting values found.</p>
                : (
                  <ul className="space-y-1 text-sm">
                    {conflicts.map((c) => (
                      <li key={c.id} className="rounded bg-amber-50 p-2">
                        <b>{c.id}</b>: {c.conflicts.join('; ')}
                        <p className="text-xs text-slate-500">First file's value is kept. Please review the source data.</p>
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}