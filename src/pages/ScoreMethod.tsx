import { WEIGHTS } from '../lib/score'

const INDICATORS = [
  { key: 'academic', label: 'Academic', source: 'CGPA x 10 (0 to 100)', why: 'Overall academic performance' },
  { key: 'attendance', label: 'Attendance', source: 'Overall attendance % (0 to 100)', why: 'Regularity in classes' },
  { key: 'lms', label: 'LMS activity', source: 'Login and assignment activity (0 to 100)', why: 'Digital learning engagement' },
  { key: 'skills', label: 'Skills', source: 'Technical and soft-skill assessment (0 to 100)', why: 'Skill level beyond marks' },
  { key: 'placement', label: 'Placement readiness', source: 'Aptitude, coding, mock interview (0 to 100)', why: 'Readiness for jobs' },
  { key: 'engagement', label: 'Engagement', source: 'Events, clubs, hackathons, certifications (0 to 100)', why: 'Participation outside class' },
] as const

// Worked example (sample values, fictional student)
const EXAMPLE: Record<string, number | null> = {
  academic: 72, attendance: 80, lms: 60, skills: 90, placement: null, engagement: 50,
}

export default function ScoreMethod() {
  const w = WEIGHTS as Record<string, number>

  const available = INDICATORS.filter((i) => EXAMPLE[i.key] !== null)
  const totalW = available.reduce((s, i) => s + w[i.key], 0)
  const points = available.map((i) => ({
    ...i,
    value: EXAMPLE[i.key] as number,
    weight: w[i.key],
    newWeight: (w[i.key] / totalW) * 100,
    pts: ((EXAMPLE[i.key] as number) * w[i.key]) / totalW,
  }))
  const score = points.reduce((s, p) => s + p.pts, 0)

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold text-navy">Student Success Score: Method</h1>
        <p className="text-sm text-slate-600">
          A simple, transparent, rule-based score from 0 to 100. It is not a prediction or a guarantee.
        </p>
      </div>

      <section className="rounded-xl bg-white p-4 shadow">
        <h2 className="mb-3 font-semibold text-navy">1. Indicators and weights</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-2">Indicator</th>
                <th>Weight</th>
                <th>Data used</th>
                <th>Why it matters</th>
              </tr>
            </thead>
            <tbody>
              {INDICATORS.map((i) => (
                <tr key={i.key} className="border-b last:border-0">
                  <td className="py-2 font-medium">{i.label}</td>
                  <td>{w[i.key]}%</td>
                  <td>{i.source}</td>
                  <td>{i.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl bg-white p-4 shadow">
        <h2 className="mb-2 font-semibold text-navy">2. Formula</h2>
        <p className="rounded bg-slate-100 p-3 font-mono text-sm">
          Score = sum(indicator value x weight) / sum(weights of available indicators)
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Each indicator is on a 0 to 100 scale. Weights add up to 100, so the final score is also 0 to 100.
        </p>
      </section>

      <section className="rounded-xl bg-white p-4 shadow">
        <h2 className="mb-2 font-semibold text-navy">3. Missing data rule</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>Missing data is never treated as zero.</li>
          <li>Missing indicators are skipped and the remaining weights are re-normalised to 100.</li>
          <li>Such students are flagged as "Incomplete score" and the missing items are listed.</li>
        </ul>
      </section>

      <section className="rounded-xl bg-white p-4 shadow">
        <h2 className="mb-1 font-semibold text-navy">4. Worked example (sample data: fictional student)</h2>
        <p className="mb-3 text-sm text-slate-600">Placement data is missing here, so its 15% is redistributed.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-2">Indicator</th>
                <th>Value</th>
                <th>Original weight</th>
                <th>New weight</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.key} className="border-b">
                  <td className="py-2">{p.label}</td>
                  <td>{p.value}</td>
                  <td>{p.weight}%</td>
                  <td>{p.newWeight.toFixed(1)}%</td>
                  <td>{p.pts.toFixed(1)}</td>
                </tr>
              ))}
              <tr>
                <td className="py-2 font-semibold" colSpan={4}>Final Success Score (incomplete)</td>
                <td className="font-semibold">{score.toFixed(1)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl bg-white p-4 shadow">
        <h2 className="mb-2 font-semibold text-navy">5. Risk flags (separate from score)</h2>
        <p className="text-sm text-slate-700">
          Academic risk and placement risk are rule-based checks (for example low attendance, backlogs, low aptitude).
          Every flag shows the reason, the data behind it and a suggested action.
        </p>
      </section>
    </div>
  )
}