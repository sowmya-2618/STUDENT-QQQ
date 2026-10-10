import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../components/Badge'
import { depts } from '../data/students'
import { rows } from '../lib/analytics'

export default function Students() {
  const [q, setQ] = useState('')
  const [desc, setDesc] = useState(true)
  const [dept, setDept] = useState('All')
  const [risk, setRisk] = useState('All')

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return rows
      .filter((r) => !s || r.name.toLowerCase().includes(s) || r.id.toLowerCase().includes(s))
      .filter((r) => dept === 'All' || r.dept === dept)
      .filter((r) => risk === 'All' || r.ar.level === risk)
      .sort((a, b) => {
        const x = a.sc.score
        const y = b.sc.score
        // score lekapothe (null) ellappudu chivarlo
        if (x === null && y === null) return 0
        if (x === null) return 1
        if (y === null) return -1
        return desc ? y - x : x - y
      })
  }, [q, desc, dept, risk])

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-3xl font-bold text-electric">Students</h1>
      <p className="text-xs text-amber-700">Sample data: fictional students</p>

      <div className="flex flex-wrap items-end gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or ID"
          className="w-full max-w-xs rounded border bg-white p-2"
        />
        <label className="text-sm">Department{' '}
          <select value={dept} onChange={(e) => setDept(e.target.value)} className="rounded border bg-white p-2">
            {['All', ...depts].map((d: string) => <option key={d}>{d}</option>)}
          </select>
        </label>
        <label className="text-sm">Academic risk{' '}
          <select value={risk} onChange={(e) => setRisk(e.target.value)} className="rounded border bg-white p-2">
            {['All', 'High', 'Medium', 'Low'].map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
      </div>

      <p className="text-sm text-slate-600">{list.length} student(s) found</p>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Dept</th>
              <th className="p-2">CGPA</th>
              <th className="p-2">Att %</th>
              <th className="cursor-pointer select-none p-2" onClick={() => setDesc(!desc)}>
                Score {desc ? '▼' : '▲'}
              </th>
              <th className="p-2">Academic risk</th>
              <th className="p-2">Placement risk</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} className="border-t hover:bg-slate-50">
                <td className="p-2">{r.id}</td>
                <td className="p-2">
                  <Link className="text-electric underline" to={`/students/${r.id}`}>{r.name}</Link>
                </td>
                <td className="p-2">{r.dept}</td>
                <td className="p-2">{r.cgpa}</td>
                <td className="p-2">{r.attendance}</td>
                <td className="p-2">
                  {r.sc.score === null ? 'N/A' : r.sc.score}
                  {r.sc.incomplete && (
                    <span className="cursor-help" title={`Missing: ${r.sc.missing.join(', ')}`}>*</span>
                  )}
                </td>
                <td className="p-2"><Badge level={r.ar.level} /></td>
                <td className="p-2"><Badge level={r.pr.level} /></td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={8} className="p-4 text-center text-slate-500">
                  No students match the current search and filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500">
        * Incomplete score: some data is missing and was not counted as zero. Hover the * to see what is missing.
      </p>
    </div>
  )
}