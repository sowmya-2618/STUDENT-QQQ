import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../components/Badge'
import { rows } from '../lib/analytics'

export default function Students() {
  const [q, setQ] = useState('')
  const [desc, setDesc] = useState(true)
  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return rows
      .filter((r) => !s || r.name.toLowerCase().includes(s) || r.id.toLowerCase().includes(s))
      .sort((a, b) => (desc ? b.sc.score - a.sc.score : a.sc.score - b.sc.score))
  }, [q, desc])

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-3xl font-bold text-electric">Students</h1>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or ID"
        className="w-full max-w-sm rounded border bg-white p-2" />
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2">ID</th><th className="p-2">Name</th><th className="p-2">Dept</th>
              <th className="p-2">CGPA</th><th className="p-2">Att %</th>
              <th className="cursor-pointer p-2" onClick={() => setDesc(!desc)}>Score {desc ? '▼' : '▲'}</th>
              <th className="p-2">Risk</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} className="border-t hover:bg-slate-50">
                <td className="p-2">{r.id}</td>
                <td className="p-2"><Link className="text-electric underline" to={`/students/${r.id}`}>{r.name}</Link></td>
                <td className="p-2">{r.dept}</td><td className="p-2">{r.cgpa}</td><td className="p-2">{r.attendance}</td>
                <td className="p-2">{r.sc.score}{r.sc.incomplete ? '*' : ''}</td>
                <td className="p-2"><Badge level={r.ar.level} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500">* Incomplete score: some data is missing and was not counted as zero.</p>
    </div>
  )
}