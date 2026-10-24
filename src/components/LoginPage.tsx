import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  BriefcaseBusiness,
  CircleCheck,
  Eye,
  EyeOff,
  GraduationCap,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { DEMO_USERS, ROLE_HOME } from '../auth/users';
import type { Role } from '../auth/users';
import './LoginPage.css';

type LoginRole = Exclude<Role, 'parent'>;

const TABS: { role: LoginRole; label: string; hint: string; icon: LucideIcon }[] = [
  {
    role: 'student',
    label: 'Student',
    hint: 'View your success score and personal action plan',
    icon: GraduationCap,
  },
  {
    role: 'faculty',
    label: 'Faculty',
    hint: 'Predictions, risk trends and interventions',
    icon: BriefcaseBusiness,
  },
];

const LOGIN_FEATURES: { text: string; icon: LucideIcon }[] = [
  { text: 'Early-warning risk predictions', icon: TrendingUp },
  { text: 'Explainable drivers for every student', icon: CircleCheck },
  { text: 'Targeted, prioritized interventions', icon: UsersRound },
];

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { roleParam } = useParams<{ roleParam?: string }>();
  const from = (location.state as { from?: string } | null)?.from;

  const [role, setRole] = useState<LoginRole>(() => {
    if (roleParam === 'faculty' || roleParam === 'student') {
      return roleParam;
    }
    return 'student';
  });

  useEffect(() => {
    if (roleParam === 'faculty' || roleParam === 'student') {
      setRole(roleParam);
    }
  }, [roleParam]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={from || ROLE_HOME[user.role]} replace />;

  const tab = TABS.find((t) => t.role === role) ?? TABS[0];
  const demos = DEMO_USERS.filter((u) => u.role === role);

  function switchRole(r: LoginRole) {
    setRole(r);
    setEmail('');
    setPassword('');
    setError('');
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(email, password, role);
    setLoading(false);
    if (res.ok && res.user) {
      navigate(from || ROLE_HOME[res.user.role], { replace: true });
    } else {
      setError(res.error || 'Login failed.');
    }
  }

  return (
    <div className="lg-page">
      <aside className="lg-brand">
        <div className="lg-brand-inner">
          <div className="lg-logo">
            <GraduationCap className="lg-logo-mark" size={24} aria-hidden="true" />
            <span>Student IQ</span>
          </div>
          <h1>
            Predict early.
            <br />
            Intervene in time.
          </h1>
          <p className="lg-tagline">
            AI-powered student success analytics. Know who is likely to struggle next, why, and what
            to do about it.
          </p>
          <ul className="lg-points">
            {LOGIN_FEATURES.map(({ text, icon: Icon }) => (
              <li key={text}>
                <span className="lg-point-icon"><Icon size={16} aria-hidden="true" /></span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg-orb lg-orb-a" />
        <div className="lg-orb lg-orb-b" />
      </aside>

      <main className="lg-form-side">
        <form className="lg-card" onSubmit={handleSubmit} noValidate>
          <h2>Welcome back</h2>
          <p className="lg-sub">{tab.hint}</p>

          <div className="lg-tabs" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.role}
                type="button"
                role="tab"
                aria-selected={role === t.role}
                className={`lg-tab ${role === t.role ? 'active' : ''}`}
                onClick={() => switchRole(t.role)}
              >
                <t.icon size={16} aria-hidden="true" />
                {t.label}
              </button>
            ))}
          </div>

          <label htmlFor="lg-email">Email</label>
          <input
            id="lg-email"
            type="email"
            autoComplete="username"
            placeholder="you@campus.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="lg-password">Password</label>
          <div className="lg-pw">
            <input
              id="lg-password"
              type={showPw ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="lg-eye"
              onClick={() => setShowPw((s) => !s)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>

          {error && (
            <div className="lg-error" role="alert">
              {error}
            </div>
          )}

          <button className="lg-submit" type="submit" disabled={loading || !email || !password}>
            {loading ? <span className="lg-spinner" /> : `Sign in as ${tab.label}`}
          </button>

          <div className="lg-divider">
            <span>Demo accounts (click to fill)</span>
          </div>
          <div className="lg-demo">
            {demos.map((u) => (
              <button
                type="button"
                key={u.id}
                className="lg-demo-btn"
                onClick={() => {
                  setEmail(u.email);
                  setPassword(u.password);
                  setError('');
                }}
              >
                <strong>{u.title}</strong>
                <small>{u.name}</small>
              </button>
            ))}
          </div>
        </form>
      </main>
    </div>
  );
}