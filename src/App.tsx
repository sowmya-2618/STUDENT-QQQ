import { useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import {
  Briefcase, FileText, Layers, LayoutDashboard, ListChecks, Menu, SlidersHorizontal,
  Sparkles, Upload as UploadIcon, Users, X, type LucideIcon,
} from 'lucide-react'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Profile from './pages/Profile'
import Talent from './pages/Talent'
import Simulator from './pages/Simulator'
import Opportunities from './pages/Opportunities'
import ActionPlan from './pages/ActionPlan'
import Upload from './pages/Upload'
import Segments from './pages/Segments'
import Reports from './pages/Reports'

const links: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/talent', label: 'Hidden Talent', icon: Sparkles },
  { to: '/segments', label: 'Segments', icon: Layers },
  { to: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { to: '/action-plan', label: 'Action Plan', icon: ListChecks },
  { to: '/simulator', label: 'What-If', icon: SlidersHorizontal },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/upload', label: 'Upload CSV', icon: UploadIcon },
]

function NotFound() {
  return (
    <div className="p-6">
      Page not found. <Link className="text-electric underline" to="/dashboard">Go to Dashboard</Link>
    </div>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const isLanding = pathname === '/'

  const routes = (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/students" element={<Students />} />
      <Route path="/students/:id" element={<Profile />} />
      <Route path="/talent" element={<Talent />} />
      <Route path="/segments" element={<Segments />} />
      <Route path="/opportunities" element={<Opportunities />} />
      <Route path="/action-plan" element={<ActionPlan />} />
      <Route path="/simulator" element={<Simulator />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )

  if (isLanding) return routes

  const cls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
      isActive
        ? 'bg-gradient-to-r from-electric to-teal font-medium text-white shadow'
        : 'text-slate-300 hover:bg-white/10 hover:text-white'
    }`

  return (
    <div className="min-h-screen">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-navy p-3 text-white md:hidden print:hidden">
        <Link to="/" className="font-bold text-teal">StudentIQ</Link>
        <button aria-label="Toggle menu" onClick={() => setOpen(!open)} className="rounded p-1 hover:bg-white/10">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {open && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-gradient-to-b from-navy via-slate-900 to-violet-950 p-4 text-white transition-transform print:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <Link to="/" className="mb-1 text-2xl font-bold text-teal">StudentIQ</Link>
        <p className="mb-6 text-[11px] uppercase tracking-widest text-slate-400">Beyond marks. Discover potential.</p>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={cls} onClick={() => setOpen(false)}>
              <l.icon size={18} />
              {l.label}
            </NavLink>
          ))}
        </nav>
        <p className="mt-4 rounded-lg bg-white/5 p-2 text-[11px] text-amber-300">
          Demo mode: sample data, fictional students. Risk flags are rule-based, not predictions.
        </p>
      </aside>

      <main className="md:ml-64">{routes}</main>
    </div>
  )
}