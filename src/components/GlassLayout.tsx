import { Link, Outlet } from "react-router-dom";
import "../glass.css";

export default function GlassLayout() {
  return (
    <div className="siq">
      <div className="aurora"><i /><i /><i /></div>
      <div className="wrap">
        <nav>
          <Link to="/" className="logo" style={{ color: "inherit", textDecoration: "none" }}>
            <b>🎓</b>StudentIQ
          </Link>
          <Link to="/roles"><button className="btn">Get started</button></Link>
        </nav>
        <Outlet />
      </div>
    </div>
  );
}