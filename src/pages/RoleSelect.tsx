import type { CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import Tilt from "../components/Tilt";

const roles = [
  { key: "student", color: "#0ea5e9", emoji: "🧑‍🎓", title: "Student",
    text: "Track academic progress, discover strengths and explore career opportunities." },
  { key: "faculty", color: "#7c5cff", emoji: "👨‍🏫", title: "Faculty",
    text: "Analyze student performance, identify students needing support and manage placements." },
  { key: "parent", color: "#10b981", emoji: "👨‍👧", title: "Parent",
    text: "View authorized student progress, attendance and academic updates." },
];

export default function RoleSelect() {
  const nav = useNavigate();
  return (
    <section className="view">
      <Link to="/" className="back" style={{ textDecoration: "none" }}>← Back to home</Link>
      <div className="center">
        <h2>Welcome to StudentIQ</h2>
        <p>Choose your role to get started</p>
      </div>
      <div className="roles">
        {roles.map((r) => (
          <Tilt
            key={r.key}
            className="glass role"
            style={{ "--c": r.color } as CSSProperties}
            onClick={() => nav(`/login/${r.key}`)}
          >
            <div className="av">{r.emoji}</div>
            <h3>{r.title}</h3>
            <p>{r.text}</p>
            <button className="btn">Continue</button>
          </Tilt>
        ))}
      </div>
    </section>
  );
}