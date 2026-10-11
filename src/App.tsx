import { useEffect, useState } from 'react'
import { NavLink, Route, Routes, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Sparkles,
  Layers,
  Briefcase,
  ListChecks,
  SlidersHorizontal,
  BookOpen,
  FileBarChart,
  Upload as UploadIcon,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
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
import ScoreMethod from './pages/ScoreMethod'

const links: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/talent', label: 'Hidden Talent', icon: Sparkles },
  { to: '/segments', label: 'Segments', icon: Layers },
  { to: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { to: '/action-plan', label: 'Action Plan', icon: ListChecks },
  { to: '/simulator', label: 'What-If', icon: SlidersHorizontal },
  { to: '/score-method', label: 'Score Method', icon: BookOpen },
  { to: '/reports', label: 'Reports', icon: FileBarChart },
  { to: '/upload', label: 'Upload CSV', icon: UploadIcon },
]

function NotFound() {
  return (
    <p className="p-6">
      Page not found. <Link className="text-electric underline" to="/dashboard">Go to Dashboard</Link>
    </p>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const isLanding = pathname === '/'
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const cls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
      isActive
        ? 'bg-gradient-to-r from-electric to-teal font-medium text-white shadow-lg'
        : 'text-slate-300 hover:bg-white/10 hover:text-white'
    }`

  return (
    <div className={isLanding ? 'min-h-screen bg-slate-50' : 'app-shell min-h-screen'}>
      {!isLanding && (
        <>
          {/* Mobile top bar */}
          <header className="header-glass fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between px-4 text-white shadow-lg md:hidden print:hidden">
            <Link to="/" className="flex items-center gap-2 font-bold">
              <GraduationCap size={20} className="text-teal" />
              StudentIQ
            </Link>
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((o) => !o)}
              className="rounded p-1 hover:bg-white/10"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </header>

          {/* Mobile overlay */}
          {open && (
            <div
              className="fixed inset-0 z-30 bg-black/40 md:hidden print:hidden"
              onClick={() => setOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`sidebar-glass fixed inset-y-0 left-0 z-40 flex w-60 flex-col text-white shadow-2xl transition-transform duration-200 md:translate-x-0 print:hidden ${
              open ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <Link to="/" className="flex items-center gap-2 px-4 py-5 text-lg font-bold">
              <GraduationCap size={26} className="text-teal" />
              <span>
                Student<span className="text-teal">IQ</span>
              </span>
            </Link>
            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} className={cls}>
                  <l.icon size={18} />
                  {l.label}
                </NavLink>
              ))}
            </nav>
            <p className="border-t border-white/10 p-3 text-xs text-slate-400">
              Sample data: fictional students
            </p>
          </aside>
        </>
      )}

      <main
        key={pathname}
        className={isLanding ? '' : 'page-fade pt-14 md:pl-60 md:pt-0 print:p-0'}
      >
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
          <Route path="/score-method" element={<ScoreMethod />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}