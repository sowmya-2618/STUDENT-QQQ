import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  NavLink,
  Navigate,
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
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
  LogOut,
  User as UserIcon,
  Bot,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Landing from './pages/Landing'
import Home from './pages/Home'
import RoleSelect from './pages/RoleSelect'
import GlassLayout from './components/GlassLayout'
import './glass.css'
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
import LoginPage from './components/LoginPage'
import { AuthProvider, useAuth } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import Assistant from './pages/Assistant'
import ChatWidget from './chat/ChatWidget'

type NavItem = { to: string; label: string; icon: LucideIcon }

const facultyLinks: NavItem[] = [
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
      Page not found. <Link className="text-electric underline" to="/">Go Home</Link>
    </p>
  )
}

// Faculty-only wrapper
function FacultyOnly({ children }: { children: ReactNode }) {
  return <ProtectedRoute allowedRoles={['faculty']}>{children}</ProtectedRoute>
}

// Student / Parent: jump to their own student profile
function MyProfileRedirect() {
  const { user } = useAuth()
  if (!user?.studentId) return <NotFound />
  return <Navigate to={`/students/${user.studentId}`} replace />
}

// Faculty can open any profile. Student/Parent only their own.
function ProfileRoute() {
  const { user } = useAuth()
  const { id } = useParams()
  if (user && user.role !== 'faculty' && user.studentId !== id) {
    return <MyProfileRedirect />
  }
  return <Profile />
}

function AppShell() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const isPublic =
    pathname === '/' ||
    pathname === '/roles' ||
    pathname === '/landing' ||
    pathname.startsWith('/login')
  const showShell = !isPublic && !!user

  // menu closes automatically when the page changes
  const [openPath, setOpenPath] = useState<string | null>(null)
  const open = openPath === pathname

  const cls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
      isActive
        ? 'bg-gradient-to-r from-electric to-teal font-medium text-white shadow-lg'
        : 'text-slate-300 hover:bg-white/10 hover:text-white'
    }`

  const baseLinks: NavItem[] =
    user?.role === 'faculty'
      ? facultyLinks
      : [
          {
            to: user?.role === 'parent' ? '/parent' : '/student',
            label: 'My Profile',
            icon: UserIcon,
          },
        ]

  const links: NavItem[] = [
    ...baseLinks,
    { to: '/assistant', label: 'AI Assistant', icon: Bot },
  ]

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const rootClass = isPublic
    ? 'min-h-screen'
    : 'app-shell min-h-screen'

  return (
    <div className={rootClass}>
      {showShell && (
        <>
          {/* Mobile top bar */}
          <header className="header-glass fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between px-4 text-white shadow-lg md:hidden print:hidden">
            <Link to="/" className="flex items-center gap-2 font-bold">
              <GraduationCap size={20} className="text-teal" />
              StudentIQ
            </Link>
            <button
              aria-label="Toggle menu"
              onClick={() => setOpenPath(open ? null : pathname)}
              className="rounded p-1 hover:bg-white/10"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </header>

          {/* Mobile overlay */}
          {open && (
            <div
              className="fixed inset-0 z-30 bg-black/40 md:hidden print:hidden"
              onClick={() => setOpenPath(null)}
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
            <div className="border-t border-white/10 p-3">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="mb-2 truncate text-xs text-slate-400">{user?.title}</p>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <LogOut size={16} />
                Logout
              </button>
              <p className="mt-2 text-xs text-slate-500">Sample data: fictional students</p>
            </div>
          </aside>
        </>
      )}

      <main
        key={pathname}
        className={isPublic || !showShell ? '' : 'page-fade pt-14 md:pl-60 md:pt-0 print:p-0'}
      >
        <Routes>
          <Route element={<GlassLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/roles" element={<RoleSelect />} />
          </Route>
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/:roleParam" element={<LoginPage />} />

          {/* Student / Parent entry points */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyProfileRedirect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent"
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <MyProfileRedirect />
              </ProtectedRoute>
            }
          />

          {/* Profile: faculty (any) + student/parent (own only) */}
          <Route
            path="/students/:id"
            element={
              <ProtectedRoute>
                <ProfileRoute />
              </ProtectedRoute>
            }
          />

          {/* AI Assistant: all logged-in roles */}
          <Route
            path="/assistant"
            element={
              <ProtectedRoute>
                <Assistant />
              </ProtectedRoute>
            }
          />

          {/* Faculty only */}
          <Route path="/dashboard" element={<FacultyOnly><Dashboard /></FacultyOnly>} />
          <Route path="/students" element={<FacultyOnly><Students /></FacultyOnly>} />
          <Route path="/talent" element={<FacultyOnly><Talent /></FacultyOnly>} />
          <Route path="/segments" element={<FacultyOnly><Segments /></FacultyOnly>} />
          <Route path="/opportunities" element={<FacultyOnly><Opportunities /></FacultyOnly>} />
          <Route path="/action-plan" element={<FacultyOnly><ActionPlan /></FacultyOnly>} />
          <Route path="/simulator" element={<FacultyOnly><Simulator /></FacultyOnly>} />
          <Route path="/score-method" element={<FacultyOnly><ScoreMethod /></FacultyOnly>} />
          <Route path="/reports" element={<FacultyOnly><Reports /></FacultyOnly>} />
          <Route path="/upload" element={<FacultyOnly><Upload /></FacultyOnly>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {showShell && pathname !== '/assistant' && <ChatWidget />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}