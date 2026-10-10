import { NavLink, Route, Routes, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Profile from './pages/Profile'
import Talent from './pages/Talent'
import Simulator from './pages/Simulator'
import Opportunities from './pages/Opportunities'
import ActionPlan from './pages/ActionPlan'
import Upload from './pages/Upload'

const links: { to: string; label: string; end?: boolean }[] = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/students', label: 'Students' },
  { to: '/talent', label: 'Hidden Talent' },
  { to: '/opportunities', label: 'Opportunities' },
  { to: '/action-plan', label: 'Action Plan' },
  { to: '/simulator', label: 'What-If' },
  { to: '/upload', label: 'Upload CSV' },
]

function NotFound() {
  return (
    <p className="p-6">
      Page not found. <Link className="text-electric underline" to="/">Go to Dashboard</Link>
    </p>
  )
}

export default function App() {
  const cls = ({ isActive }: { isActive: boolean }) =>
    `rounded px-3 py-1 ${isActive ? 'bg-electric' : 'hover:bg-white/10'}`

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="flex flex-wrap items-center gap-2 bg-navy p-3 text-white">
        <span className="mr-4 font-bold text-teal">StudentIQ</span>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={cls}>{l.label}</NavLink>
        ))}
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/:id" element={<Profile />} />
        <Route path="/talent" element={<Talent />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/action-plan" element={<ActionPlan />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}