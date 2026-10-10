import { Link } from 'react-router-dom'
import Badge from '../components/Badge'
import { isHiddenTalent, rows } from '../lib/analytics'

// Demo pathway rules (rule-based, not real job openings)
const pathways: Record<string, string> = {
  python: 'Data / Backend Developer',
  react: 'Frontend Developer',
  java: 'Software Engineer',
  design: 'UI/UX Designer',
  robotics: 'Embedded / Robotics Engineer',
  communication: 'Technical Presenter / Client Roles',
  sql: 'Data Analyst',
}

const pathFor = (name: string): string | null => {
  const key = Object.keys(pathways).find((k) => name.toLowerCase().includes(k))
  return key ? pathways[key] : null
}

export default function Talent() {
  const list = rows.filter(isHiddenTalent)

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-3xl font-bold text-electric">Hidden Talent Finder</h1>
      <p className="text-xs text-amber-700">
        Sample data: fictional students. Pathways are demo suggestions, not job openings.
      </p>
      <p className="text-sm text-slate-600">
        Criteria: CGPA below 6.5 and practical skills score of 80 or more. Marks alone don't decide potential.
      </p>

      {list.length === 0 && <p className="text-slate-500">No students match the criteria.</p>}

      <div className="grid gap-4 lg:grid-cols-2">
        {list.map((s) => {
          const all = s.skillList ?? []
          const verified = all.filter((k) => k.verified)
          const self = all.filter((k) => !k.verified)
          const completeness = all.length ? Math.round((verified.length / all.length) * 100) : 0
          const paths = Array.from(
            new Set(verified.map((k) => pathFor(k.name)).filter((p): p is string => p !== null)),
          )

          return (
            <div key={s.id} className="rounded-lg border bg-white p-4">
              <div className="flex items-start justify-between">
                <div>
                  <Link className="text-lg font-semibold text-electric underline" to={`/students/${s.id}`}>
                    {s.name}
                  </Link>
                  <p className="text-sm text-slate-500">{s.id} · {s.dept} · CGPA {s.cgpa}</p>
                </div>
                <Badge level={s.ar.level} />
              </div>

              <p className="mt-3 text-sm font-medium">Practical skills score: {s.skills}/100</p>

              <p className="mt-2 text-sm font-medium">Verified skills</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {verified.length
                  ? verified.map((k) => <span key={k.name} className="rounded bg-teal/20 px-2 py-1 text-sm">{k.name}</span>)
                  : <span className="text-sm text-slate-500">None verified yet</span>}
              </div>

              <p className="mt-2 text-sm font-medium">Self-reported (needs review)</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {self.length
                  ? self.map((k) => <span key={k.name} className="rounded bg-slate-100 px-2 py-1 text-sm">{k.name}</span>)
                  : <span className="text-sm text-slate-500">None</span>}
              </div>

              <p className="mt-3 text-sm">
                Evidence completeness: {completeness}% ({verified.length} of {all.length} verified)
              </p>

              <p className="mt-2 text-sm font-medium">Possible pathways (based on verified skills)</p>
              {paths.length
                ? <ul className="list-disc pl-5 text-sm">{paths.map((p) => <li key={p}>{p}</li>)}</ul>
                : <p className="text-sm text-slate-500">Verify skills to unlock pathway suggestions.</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}