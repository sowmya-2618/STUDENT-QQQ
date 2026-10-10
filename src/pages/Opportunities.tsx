import { useState } from 'react'
import { rows } from '../lib/analytics'

type Opp = { title: string; type: string; tags: string[]; minSkills: number; minCgpa?: number }

const opps: Opp[] = [
  { title: 'Web Development Internship (demo)', type: 'Internship', tags: ['react', 'html', 'css', 'javascript', 'web'], minSkills: 60 },
  { title: 'AI/ML Beginner Project Track (demo)', type: 'Project', tags: ['python', 'ml', 'opencv', 'ai', 'data'], minSkills: 50 },
  { title: 'College Hackathon (demo)', type: 'Hackathon', tags: ['python', 'react', 'java', 'iot', 'web', 'ai'], minSkills: 40 },
  { title: 'Python Certification Course (demo)', type: 'Course', tags: ['python'], minSkills: 0 },
  { title: 'Embedded / IoT Competition (demo)', type: 'Competition', tags: ['iot', 'embedded', 'arduino', 'electronics', 'robotics'], minSkills: 50 },
  { title: 'Core Placement Aptitude Program (demo)', type: 'Skill programme', tags: [], minSkills: 0, minCgpa: 6 },
]

export default function Opportunities() {
  const [id, setId] = useState(rows[0].id)
  const s = rows.find((r) => r.id === id)!
  const names = s.skillList.map((k) => k.name.toLowerCase())

  const matches = opps.map((o) => {
    const hit = s.skillList.filter((k) => o.tags.some((t) => k.name.toLowerCase().includes(t)))
    const missing: string[] = []
    if ((s.skills ?? 0) < o.minSkills) missing.push(`Skills score ${s.skills ?? 'missing'} (needs ${o.minSkills}+)`)
    if (o.minCgpa && s.cgpa < o.minCgpa) missing.push(`CGPA ${s.cgpa} (needs ${o.minCgpa}+)`)
    const general = o.tags.length === 0
    const fit = general || hit.length > 0
    return { o, hit, missing, fit }
  }).filter((m) => m.fit)

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-3xl font-bold text-electric">Opportunity Matching</h1>
      <p className="rounded bg-amber-100 p-2 text-xs text-amber-800">
        Demo opportunities only. These are not real job openings and there are no deadlines or placement guarantees. Live sources need backend setup.
      </p>
      <select value={id} onChange={(e) => setId(e.target.value)} className="rounded border bg-white p-2">
        {rows.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.id})</option>)}
      </select>
      <p className="text-sm text-slate-600">Skills on record: {names.join(', ') || 'none'}</p>
      <div className="grid gap-4 lg:grid-cols-2">
        {matches.length === 0 && <p className="text-sm text-slate-500">No matches yet. Add skills or certifications as evidence.</p>}
        {matches.map(({ o, hit, missing }) => (
          <div key={o.title} className="rounded-lg border bg-white p-4">
            <p className="font-medium">{o.title} <span className="rounded bg-slate-100 px-2 py-0.5 text-xs">{o.type}</span></p>
            <p className="mt-1 text-sm text-slate-600">
              Why it matches: {hit.length ? hit.map((k) => `${k.name} (${k.verified ? 'verified' : 'self-reported'})`).join(', ') : 'general programme open to all students'}
            </p>
            <p className={`mt-1 text-sm ${missing.length ? 'text-amber-700' : 'text-green-700'}`}>
              {missing.length ? `Missing: ${missing.join('; ')}` : 'Meets the demo requirements.'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Next step: {missing.length ? 'build a small project or certificate to close the gap.' : 'prepare a short portfolio and apply when a real listing is available.'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}