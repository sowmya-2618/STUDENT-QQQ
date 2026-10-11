import { Link } from 'react-router-dom'

const features = [
  { t: 'Student Success Score', d: 'Transparent 0-100 score from academics, attendance, LMS, skills and placement readiness.' },
  { t: 'Early Risk Detection', d: 'Explainable academic and placement risk flags with reasons, not black-box predictions.' },
  { t: 'Hidden Talent Finder', d: 'Finds students with strong practical skills beyond CGPA, using verified evidence.' },
  { t: 'What-If Simulator', d: 'Test how changes in marks or attendance would affect a score. Never changes real records.' },
  { t: 'Personalized Action Plans', d: "Goals, milestones and career paths linked to each student's real data." },
  { t: 'Reports and CSV Import', d: 'Upload data with validation and export reports from the current filters.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-slate-900 to-violet-900 text-white">
      <header className="flex items-center justify-between p-6">
        <span className="text-xl font-bold text-teal">StudentIQ</span>
        <Link to="/dashboard" className="rounded border border-white/30 px-4 py-1 text-sm hover:bg-white/10">
          Demo Access
        </Link>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          BEYOND MARKS.<br /><span className="text-teal">DISCOVER POTENTIAL.</span>
        </h1>
        <p className="mt-4 text-slate-300">
          AI-Powered Student Intelligence, Success Analytics &amp; Talent Discovery Platform
        </p>
        <Link to="/dashboard" className="mt-8 inline-block rounded bg-electric px-6 py-3 font-semibold hover:opacity-90">
          Get Started
        </Link>
        <p className="mt-3 text-xs text-amber-300">Demo uses sample data: fictional students.</p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-8">
        <h2 className="mb-2 text-2xl font-semibold">The problem</h2>
        <p className="text-slate-300">
          Campus data sits in separate places: marks, attendance, LMS, skills and placements. Students who need
          support are noticed late, and students with real practical talent are overlooked because of CGPA alone.
          StudentIQ brings this data together so faculty can act early.
        </p>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-6 py-8 md:grid-cols-3">
        {features.map((f) => (
          <div key={f.t} className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur">
            <p className="font-semibold text-teal">{f.t}</p>
            <p className="mt-1 text-sm text-slate-300">{f.d}</p>
          </div>
        ))}
      </section>

      <footer className="p-6 text-center text-xs text-slate-400">
        StudentIQ · Hackathon demo · Sample data only · Risk indicators are rule-based, not guarantees
      </footer>
    </div>
  )
}