import { students } from './data/students'
import { successScore } from './lib/score'
import { academicRisk, placementRisk } from './lib/risk'

export default function App() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-electric">StudentIQ</h1>
      <p className="mb-4 text-xs text-amber-700">Sample data: fictional students</p>
      <p>Total students: {students.length}</p>
      {students.slice(0, 5).map((s) => {
        const sc = successScore({
          academic: s.cgpa * 10, attendance: s.attendance, lms: s.lms,
          skills: s.skills, placement: s.placement, engagement: s.engagement,
        })
        const ar = academicRisk(s)
        const pr = placementRisk(s)
        return (
          <div key={s.id} className="mt-3 rounded border p-3">
            <b>{s.name}</b> ({s.dept}): Score {sc.score}{sc.incomplete ? '*' : ''}
            <p className="text-sm">Academic risk: {ar.level} | Placement risk: {pr.level}</p>
            <ul className="list-disc pl-5 text-sm text-slate-600">
              {ar.reasons.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </div>
        )
      })}
    </div>
  )
}