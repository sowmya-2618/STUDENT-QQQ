import { useMemo, useState } from 'react'
import Papa from 'papaparse'
import { depts } from '../data/students'
import { rows } from '../lib/analytics'

const download = (name: string, data: object[]) => {
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

export default function Reports() {
  const [dept, setDept] = useState('All')
  const [risk, setRisk] = useState('All')

  const f = useMemo(
    () => rows.filter((r) => (dept === 'All' || r.dept === dept) && (risk === 'All' || r.ar.level === risk)),
    [dept, risk],
  )

  const base = (r: (typeof rows)[number]) => ({
    ID: r.id,
    Name: r.name,
    Department: r.dept,
    Semester: r.semester,
  })

  const reports: { title: string; file: string; build: () => object[] }[] = [
    {
      title: 'Overall student success',
      file: 'student-success.csv',
      build: () =>
        f.map((r) => ({
          ...base(r),
          CGPA: r.cgpa,
          'Attendance %': r.attendance,
          'Success Score': r.sc.score ?? 'N/A',
          Complete: r.sc.incomplete ? 'No (missing: ' + r.sc.missing.join('/') + ')' : 'Yes',
        })),
    },
    {
      title: 'Academic and placement risks',
      file: 'risk-report.csv',
      build: () =>
        f.map((r) => ({
          ...base(r),
          'Academic risk': r.ar.level,
          'Academic reasons': r.ar.reasons.join('; '),
          'Placement risk': r.pr.level,
          'Placement reasons': r.pr.reasons.join('; '),
        })),
    },
    {
      title: 'Attendance report',
      file: 'attendance.csv',
      build: () =>
        f.map((r) => ({
          ...base(r),
          'Attendance %': r.attendance,
          Concern: r.attendance < 75 ? 'Yes (<75%)' : 'No',
        })),
    },
    {
      title: 'Department comparison',
      file: 'departments.csv',
      build: () =>
        depts.map((d: string) => {
          const g = f.filter((r) => r.dept === d)
          const scored = g.filter((r) => r.sc.score !== null)
          return {
            Department: d,
            Students: g.length,
            'Avg Success Score': scored.length
              ? Math.round(scored.reduce((a, r) => a + (r.sc.score as number), 0) / scored.length)
              : 'N/A',
            'High academic risk': g.filter((r) => r.ar.level === 'High').length,
          }
        }),
    },
  ]

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-3xl font-bold text-electric">Reports</h1>
      <p className="text-xs text-amber-700">Sample data: fictional students. Exports use the filters below.</p>

      <div className="flex flex-wrap gap-3 print:hidden">
        <label className="text-sm">Department{' '}
          <select value={dept} onChange={(e) => setDept(e.target.value)} className="rounded border p-1">
            {['All', ...depts].map((d: string) => <option key={d}>{d}</option>)}
          </select>
        </label>
        <label className="text-sm">Academic risk{' '}
          <select value={risk} onChange={(e) => setRisk(e.target.value)} className="rounded border p-1">
            {['All', 'High', 'Medium', 'Low'].map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
        <button onClick={() => window.print()} className="rounded border bg-white px-3 py-1 text-sm hover:bg-slate-50">
          Print report
        </button>
      </div>

      <p className="text-sm text-slate-600">{f.length} student(s) in current selection.</p>

      <div className="grid gap-3 lg:grid-cols-2">
        {reports.map((r) => (
          <div key={r.title} className="flex items-center justify-between rounded-lg border bg-white p-4">
            <span className="font-medium">{r.title}</span>
            <button
              onClick={() => download(r.file, r.build())}
              className="rounded bg-electric px-3 py-1 text-sm text-white print:hidden"
            >
              Download CSV
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}