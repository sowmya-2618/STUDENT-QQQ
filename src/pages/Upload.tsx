import { useState } from 'react'
import Papa from 'papaparse'
import { rows } from '../lib/analytics'

type Rec = Record<string, string>

const FIELDS = [
  { key: 'id', label: 'Student ID', required: true },
  { key: 'name', label: 'Name', required: true },
  { key: 'dept', label: 'Department', required: true },
  { key: 'semester', label: 'Semester', required: true },
  { key: 'cgpa', label: 'CGPA (0-10)', required: true },
  { key: 'attendance', label: 'Attendance % (0-100)', required: true },
  { key: 'backlogs', label: 'Backlogs', required: true },
  { key: 'lms', label: 'LMS score (0-100)', required: false },
  { key: 'skills', label: 'Skills score (0-100)', required: false },
  { key: 'placement', label: 'Placement readiness (0-100)', required: false },
  { key: 'engagement', label: 'Engagement (0-100)', required: false },
] as const

type Key = (typeof FIELDS)[number]['key']
type Mapping = Record<Key, string>

const SAMPLE =
  'id,name,dept,semester,cgpa,attendance,backlogs,lms,skills,placement,engagement\n' +
  'S901,Sample Student One,CSE,5,7.8,88,0,72,65,60,55\n' +
  'S902,Sample Student Two,ECE,3,5.9,70,2,,82,,40\n'

const download = () => {
  const blob = new Blob([SAMPLE], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'studentiq_sample_template.csv'
  a.click()
  URL.revokeObjectURL(url)
}

const autoMap = (headers: string[]): Mapping => {
  const m = {} as Mapping
  FIELDS.forEach((f) => {
    m[f.key] = headers.find((h) => h.trim().toLowerCase() === f.key) ?? ''
  })
  return m
}

type Rejected = { line: number; id: string; errors: string[] }
type Result = {
  valid: Rec[]
  rejected: Rejected[]
  skippedExisting: string[]
  missingOptional: number
}

const num = (v: string) => (v.trim() === '' ? null : Number(v))

function validate(data: Rec[], map: Mapping): Result {
  const existing = new Set(rows.map((r) => r.id.toLowerCase()))
  const seen = new Set<string>()
  const valid: Rec[] = []
  const rejected: Rejected[] = []
  const skippedExisting: string[] = []
  let missingOptional = 0

  data.forEach((row, i) => {
    const get = (k: Key) => (map[k] ? (row[map[k]] ?? '').trim() : '')
    const errors: string[] = []
    const id = get('id')

    FIELDS.filter((f) => f.required).forEach((f) => {
      if (get(f.key) === '') errors.push(`${f.label} is missing`)
    })

    const range = (k: Key, label: string, min: number, max: number) => {
      const raw = get(k)
      if (raw === '') return
      const n = num(raw)
      if (n === null || Number.isNaN(n) || n < min || n > max) errors.push(`${label} must be ${min}-${max} (got "${raw}")`)
    }
    range('cgpa', 'CGPA', 0, 10)
    range('attendance', 'Attendance', 0, 100)
    range('semester', 'Semester', 1, 12)
    range('lms', 'LMS', 0, 100)
    range('skills', 'Skills', 0, 100)
    range('placement', 'Placement', 0, 100)
    range('engagement', 'Engagement', 0, 100)

    const b = get('backlogs')
    if (b !== '' && (!Number.isInteger(Number(b)) || Number(b) < 0)) errors.push(`Backlogs must be a whole number >= 0 (got "${b}")`)

    if (id) {
      const key = id.toLowerCase()
      if (seen.has(key)) errors.push('Duplicate ID inside this file')
      seen.add(key)
      if (existing.has(key) && errors.length === 0) {
        skippedExisting.push(id)
        return
      }
    }

    if (errors.length) {
      rejected.push({ line: i + 2, id: id || '(blank)', errors })
      return
    }

    FIELDS.filter((f) => !f.required).forEach((f) => {
      if (get(f.key) === '') missingOptional++
    })
    valid.push(row)
  })

  return { valid, rejected, skippedExisting, missingOptional }
}

export default function Upload() {
  const [fileName, setFileName] = useState('')
  const [headers, setHeaders] = useState<string[]>([])
  const [data, setData] = useState<Rec[]>([])
  const [map, setMap] = useState<Mapping | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')

  const onFile = (file: File | undefined) => {
    setError(''); setResult(null)
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.csv')) { setError('Please choose a .csv file.'); return }
    Papa.parse<Rec>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const h = res.meta.fields ?? []
        if (!h.length || res.data.length === 0) { setError('The file is empty or has no header row.'); return }
        setFileName(file.name)
        setHeaders(h)
        setData(res.data)
        setMap(autoMap(h))
      },
      error: (e) => setError(`Could not read file: ${e.message}`),
    })
  }

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-3xl font-bold text-electric">CSV Upload and Validation</h1>
      <p className="text-xs text-amber-700">
        Demo: files are checked in your browser only. Nothing is saved to a database and existing records are never overwritten.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <input type="file" accept=".csv" onChange={(e) => onFile(e.target.files?.[0])} className="rounded border bg-white p-2 text-sm" />
        <button onClick={download} className="rounded border bg-white px-3 py-2 text-sm hover:bg-slate-50">
          Download sample template
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}

      {map && (
        <>
          <div className="rounded-lg border bg-white p-4">
            <p className="font-medium">1. Preview: {fileName} ({data.length} rows)</p>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100">
                  <tr>{headers.map((h) => <th key={h} className="p-1">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {data.slice(0, 5).map((r, i) => (
                    <tr key={i} className="border-t">
                      {headers.map((h) => <td key={h} className="p-1">{r[h]}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-4">
            <p className="font-medium">2. Map columns</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {FIELDS.map((f) => (
                <label key={f.key} className="text-sm">
                  {f.label}{f.required && <span className="text-red-600"> *</span>}
                  <select
                    value={map[f.key]}
                    onChange={(e) => setMap({ ...map, [f.key]: e.target.value })}
                    className="mt-1 w-full rounded border bg-white p-1"
                  >
                    <option value="">(not mapped)</option>
                    {headers.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </label>
              ))}
            </div>
            <button
              onClick={() => setResult(validate(data, map))}
              className="mt-3 rounded bg-electric px-4 py-2 text-sm text-white hover:opacity-90"
            >
              Validate
            </button>
          </div>
        </>
      )}

      {result && (
        <div className="space-y-3 rounded-lg border bg-white p-4">
          <p className="font-medium">3. Import review</p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded border p-3"><p className="text-2xl font-bold text-green-600">{result.valid.length}</p><p className="text-xs">Valid rows</p></div>
            <div className="rounded border p-3"><p className="text-2xl font-bold text-red-600">{result.rejected.length}</p><p className="text-xs">Rejected rows</p></div>
            <div className="rounded border p-3"><p className="text-2xl font-bold text-amber-600">{result.skippedExisting.length}</p><p className="text-xs">Skipped (ID already exists)</p></div>
            <div className="rounded border p-3"><p className="text-2xl font-bold">{result.missingOptional}</p><p className="text-xs">Missing optional values</p></div>
          </div>

          {result.rejected.length > 0 && (
            <ul className="space-y-1 text-sm">
              {result.rejected.map((r) => (
                <li key={r.line} className="rounded bg-red-50 p-2">
                  Line {r.line} ({r.id}): {r.errors.join('; ')}
                </li>
              ))}
            </ul>
          )}
          {result.skippedExisting.length > 0 && (
            <p className="text-sm text-amber-700">
              Not overwritten (already in the system): {result.skippedExisting.join(', ')}
            </p>
          )}
          {result.missingOptional > 0 && (
            <p className="text-xs text-slate-500">
              Missing optional values stay blank. They are not treated as zero, so those scores will show as incomplete.
            </p>
          )}
          <p className="text-xs text-slate-500">
            Demo limit: valid rows are validated here but not saved. Persisting them needs a backend (for example Supabase).
          </p>
        </div>
      )}
    </div>
  )
}