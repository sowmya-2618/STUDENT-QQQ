import { useRef } from "react";
import type { CSSProperties, ReactNode, KeyboardEvent } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  strength?: number;
};

export default function Tilt({ children, className = "", style, onClick, strength = 14 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - 0.5;
    const y = (e.clientY - b.top) / b.height - 0.5;
    el.style.transform = `rotateY(${x * strength}deg) rotateX(${-y * strength}deg) translateZ(8px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  const key = (e: KeyboardEvent) => {
    if (e.key === "Enter" && onClick) onClick();
  };

  return (
    <div
      ref={ref}
      className={`tilt ${className}`}
      style={style}
      onPointerMove={move}
      onPointerLeave={leave}
      onClick={onClick}
      onKeyDown={key}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}