
import { useState } from "react";
import type { FormEvent } from "react";
import "./Login.css";

type Role = "Student" | "Parent" | "Faculty";

export default function Login() {
  const [role, setRole] = useState<Role>("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError(
      "Login interface ready! Authentication backend needs to be connected."
    );
  }

  return (
    <main className="siq-login">
      <section className="siq-brand-panel">
        <a className="siq-brand" href="/">
          <span className="siq-brand-icon">S<span>Q</span></span>
          <span>
            <strong>Student<span>IQ</span></strong>
            <small>Smarter Insights. Brighter Futures.</small>
          </span>
        </a>

        <div className="siq-hero">
          <div className="siq-eyebrow">
            <span className="siq-live-dot" />
            INTELLIGENCE THAT EMPOWERS
          </div>

          <h1>
            Beyond marks.
            <br />
            Discover <span>potential.</span>
          </h1>

          <p className="siq-description">
            Turn student data into meaningful insights, discover hidden
            talents, and help every learner move towards a brighter future.
          </p>

          <div className="siq-features">
            <div className="siq-feature">
              <span className="siq-feature-icon">↗</span>
              <div>
                <strong>Track progress</strong>
                <small>Understand every improvement</small>
              </div>
            </div>

            <div className="siq-feature">
              <span className="siq-feature-icon">✳</span>
              <div>
                <strong>Discover potential</strong>
                <small>Identify strengths and skill gaps</small>
              </div>
            </div>

            <div className="siq-feature">
              <span className="siq-feature-icon">◎</span>
              <div>
                <strong>Build the future</strong>
                <small>Turn insights into action</small>
              </div>
            </div>
          </div>
        </div>

        <div className="siq-brand-footer">
          ✳ Every student has a story. Help yours thrive.
        </div>
      </section>

      <section className="siq-form-panel">
        <div className="siq-login-card">
          <div className="siq-card-label">YOUR LEARNING SPACE</div>

          <div className="siq-welcome-icon">✦</div>
          <h2>Welcome back<span>.</span></h2>
          <p className="siq-card-description">
            Sign in to continue your success journey.
          </p>

          <p className="siq-role-label">CONTINUE AS</p>

          <div className="siq-role-picker">
            {(["Student", "Parent", "Faculty"] as Role[]).map((item) => (
              <button
                key={item}
                type="button"
                className={`siq-role ${role === item ? "active" : ""}`}
                onClick={() => setRole(item)}
                aria-pressed={role === item}
              >
                <span>
                  {item === "Student" ? "🎓" :
                   item === "Parent" ? "👥" : "🏛"}
                </span>
                {item}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <label className="siq-input-label" htmlFor="siq-email">
              Email address / College ID
            </label>

            <div className="siq-input-wrap">
              <span className="siq-input-icon">✉</span>
              <input
                id="siq-email"
                type="text"
                autoComplete="username"
                placeholder="you@college.edu"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="siq-password-heading">
              <label className="siq-input-label" htmlFor="siq-password">
                Password
              </label>
              <button
                type="button"
                className="siq-text-button"
                onClick={() =>
                  setError("Password recovery will be available after backend integration.")
                }
              >
                Forgot password?
              </button>
            </div>

            <div className="siq-input-wrap">
              <span className="siq-input-icon">◇</span>
              <input
                id="siq-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="siq-eye-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <label className="siq-remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            {error && (
              <p className="siq-error" role="status">{error}</p>
            )}

            <button className="siq-submit" type="submit">
              Sign in to StudentIQ <span>→</span>
            </button>
          </form>

          <div className="siq-privacy">
            ◇ Your learning journey, thoughtfully supported.
          </div>
        </div>

        <p className="siq-help">
          Need access? Contact your college administrator.
        </p>
      </section>
    </main>
  );
}
