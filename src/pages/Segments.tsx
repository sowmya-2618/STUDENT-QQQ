import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Papa from 'papaparse'
import Badge from '../components/Badge'
import { rows } from '../lib/analytics'
import { segments, type Segment } from '../lib/segments'

export default function Segments() {
  const [key, setKey] = useState(segments[0].key)
  const [q, setQ] = useState('')

  const counts = useMemo(
    () => Object.fromEntries(segments.map((s: Segment) => [s.key, rows.filter(s.test).length])),
    [],
  )
  const seg = segments.find((s: Segment) => s.key === key)!
  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return rows
      .filter(seg.test)
      .filter((r) => !s || r.name.toLowerCase().includes(s) || r.id.toLowerCase().includes(s))
  }, [seg, q])

  const exportCsv = () => {
    const csv = Papa.unparse(
      list.map((r) => ({
        ID: r.id, Name: r.name, Department: r.dept, CGPA: r.cgpa,
        'Attendance %': r.attendance, 'Success Score': r.sc.score ?? 'N/A',
        'Academic risk': r.ar.level, 'Placement risk': r.pr.level,
      })),
    )
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `segment-${seg.key}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-3xl font-bold text-electric">Student Segments</h1>
      <p className="text-xs text-amber-700">Sample data: fictional students. Segments are recalculated from current data, not permanent labels. A student can be in more than one segment.</p>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {segments.map((s: Segment) => (
          <button
            key={s.key}
            onClick={() => setKey(s.key)}
            className={`rounded-lg border p-3 text-left ${key === s.key ? 'border-electric bg-blue-50' : 'bg-white hover:bg-slate-50'}`}
          >
            <p className="text-2xl font-bold text-electric">{counts[s.key]}</p>
            <p className="font-medium">{s.name}</p>
            <p className="text-xs text-slate-500">Criteria: {s.criteria}</p>
          </button>
        ))}
      </div>

      <div className="space-y-3 rounded-lg border bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-semibold">{seg.name} ({list.length})</p>
            <p className="text-xs text-slate-500">Criteria: {seg.criteria}</p>
          </div>
          <div className="flex gap-2">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search in segment"
              className="rounded border p-1 text-sm" />
            <button onClick={exportCsv} disabled={!list.length}
              className="rounded bg-electric px-3 py-1 text-sm text-white disabled:opacity-40">
              Export CSV
            </button>
          </div>
        </div>

        {list.length === 0 ? (
          <p className="text-sm text-slate-500">No students in this segment right now.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-2">ID</th><th className="p-2">Name</th><th className="p-2">Dept</th>
                  <th className="p-2">CGPA</th><th className="p-2">Att %</th><th className="p-2">Score</th>
                  <th className="p-2">Academic</th><th className="p-2">Placement</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-slate-50">
                    <td className="p-2">{r.id}</td>
                    <td className="p-2"><Link className="text-electric underline" to={`/students/${r.id}`}>{r.name}</Link></td>
                    <td className="p-2">{r.dept}</td><td className="p-2">{r.cgpa}</td><td className="p-2">{r.attendance}</td>
                    <td className="p-2">{r.sc.score ?? 'N/A'}{r.sc.incomplete ? '*' : ''}</td>
                    <td className="p-2"><Badge level={r.ar.level} /></td>
                    <td className="p-2"><Badge level={r.pr.level} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs text-slate-500">* Incomplete score: some data is missing and was not counted as zero.</p>
      </div>
    </div>
  )
}