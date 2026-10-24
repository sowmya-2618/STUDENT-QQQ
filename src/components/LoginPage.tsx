import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { DEMO_USERS, ROLE_HOME } from '../auth/users';
import type { Role } from '../auth/users';
import './LoginPage.css';

const TABS: { role: Role; label: string; hint: string }[] = [
  { role: 'student', label: 'Student', hint: 'View your success score and personal action plan' },
  { role: 'parent', label: 'Parent', hint: "Track your child's progress and risk alerts" },
  { role: 'faculty', label: 'Faculty', hint: 'Predictions, risk trends and interventions' },
];

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  const [role, setRole] = useState<Role>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={from || ROLE_HOME[user.role]} replace />;

  const tab = TABS.find((t) => t.role === role) ?? TABS[0];
  const demos = DEMO_USERS.filter((u) => u.role === role);

  function switchRole(r: Role) {
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
            <span className="lg-logo-mark">◈</span> Student IQ
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
            <li><span>▲</span> Early-warning risk predictions</li>
            <li><span>▲</span> Explainable drivers for every student</li>
            <li><span>▲</span> Targeted, prioritized interventions</li>
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
              {showPw ? 'Hide' : 'Show'}
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