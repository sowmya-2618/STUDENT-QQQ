import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Tilt from "../components/Tilt";

const features = [
  { icon: "📈", title: "Student success intelligence", text: "Predict and support at-risk students." },
  { icon: "🛡️", title: "Early risk detection", text: "Spot issues before they grow." },
  { icon: "💡", title: "Hidden talent discovery", text: "Find potential beyond grades." },
  { icon: "🤝", title: "Smart placement matching", text: "Connect students with the right opportunities." },
];

export default function Home() {
  const nav = useNavigate();
  const stage = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent) => {
    const s = stage.current, c = scene.current;
    if (!s || !c) return;
    const b = s.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - 0.5;
    const y = (e.clientY - b.top) / b.height - 0.5;
    c.style.transform = `rotateY(${x * 30}deg) rotateX(${-y * 30}deg)`;
  };

  return (
    <section className="view">
      <div className="hero">
        <div>
          <h1>Beyond marks.<br /><span>Discover potential.</span></h1>
          <p className="lead">
            StudentIQ is an AI-powered platform that helps colleges predict, support and unlock every
            student’s true potential, beyond just grades.
          </p>
          <div className="row">
            <button className="btn" onClick={() => nav("/roles")}>Get started</button>
            <button className="btn ghost">▶ Watch demo</button>
          </div>
        </div>
        <div
          className="stage"
          ref={stage}
          onPointerMove={move}
          onPointerLeave={() => scene.current && (scene.current.style.transform = "")}
        >
          <div className="scene" ref={scene}>
            <div className="ring" /><div className="ring" /><div className="ring" />
            <div className="core" />
            <div className="chip">✨ Better decisions</div>
            <div className="chip">🏆 Student success</div>
            <div className="chip">💎 Hidden talent</div>
            <div className="chip">🎯 Smart placements</div>
          </div>
        </div>
      </div>

      <div className="feats">
        {features.map((f) => (
          <Tilt key={f.title} className="glass feat">
            <div className="ic">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </Tilt>
        ))}
      </div>
    </section>
  );
}