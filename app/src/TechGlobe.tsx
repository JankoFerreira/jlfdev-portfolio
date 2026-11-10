import { useEffect, useRef } from "react";

const skills = [
  ["HTML", "html5.svg"], ["CSS", "css3.svg"], ["JavaScript", "javascript.svg"],
  ["Python", "python.svg"], ["C#", "csharp.svg"], ["Git", "git.svg"],
  ["GitHub", "github-brands-solid-full.svg"], ["FastAPI", "fastapi.svg"],
  ["PostgreSQL", "postgresql.svg"], ["SQLite", "sqlite.svg"]
] as const;

export function TechGlobe() {
  const sphere = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = sphere.current!;
    const nodes = [...element.querySelectorAll<HTMLElement>(".sg-skill-node")];
    const rings = [...element.querySelectorAll<HTMLElement>(".sg-globe-ring")];
    const points = nodes.map((_, index) => {
      const y = index * 2 / nodes.length - 1 + 1 / nodes.length;
      const radius = Math.sqrt(1 - y * y);
      const phi = index * Math.PI * (3 - Math.sqrt(5));
      return { x: Math.cos(phi) * radius, y, z: Math.sin(phi) * radius };
    });
    let rotationX = -0.35, rotationY = 0.55, radius = 0;
    let pointer: number | null = null;
    let previousX = 0, previousY = 0, frame = 0;
    let visible = false, idleTimer = 0; const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const clampX = () => { rotationX = Math.max(-1.05, Math.min(1.05, rotationX)); };

    function draw() {
      frame = 0;
      clearTimeout(idleTimer); if (pointer === null && !reduced.matches) rotationY += 0.002;
      const cy = Math.cos(rotationY), sy = Math.sin(rotationY);
      const cx = Math.cos(rotationX), sx = Math.sin(rotationX);
      points.forEach((point, index) => {
        const x = point.x * cy - point.z * sy;
        const z = point.x * sy + point.z * cy;
        const y = point.y * cx - z * sx;
        const depth = (point.y * sx + z * cx + 1) / 2;
        nodes[index].style.transform = `translate3d(${x * radius}px,${y * radius}px,0) scale(${0.48 + depth * 0.78})`;
        nodes[index].style.opacity = String(Math.min(1, 0.18 + depth * 0.95));
        nodes[index].style.zIndex = String(Math.floor(depth * 1000));
      });
      rings.forEach((ring, index) => {
        ring.style.transform = index < 3
          ? `rotateX(${[75, 45, 15][index] + rotationX * 45}deg)`
          : `rotateY(${(index - 3) * 35 + rotationY * 45}deg)`;
      });
      if (visible && !document.hidden && !reduced.matches) idleTimer = window.setTimeout(schedule, 33);
    }
    function schedule() {
      clearTimeout(idleTimer);
      if (visible && !document.hidden && !frame) frame = requestAnimationFrame(draw);
    }
    const resize = new ResizeObserver(() => {
      radius = element.clientWidth * 0.33 * 1.45;
      schedule();
    });
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
      else { cancelAnimationFrame(frame); clearTimeout(idleTimer); frame = 0; }
    });
    function down(event: PointerEvent) {
      if (!event.isPrimary || event.button !== 0) return;
      pointer = event.pointerId;
      previousX = event.clientX;
      previousY = event.clientY;
      element.setPointerCapture(pointer);
      element.classList.add("is-dragging");
    }
    function move(event: PointerEvent) {
      if (event.pointerId !== pointer) return;
      rotationY -= (event.clientX - previousX) * 0.008;
      rotationX -= (event.clientY - previousY) * 0.008;
      previousX = event.clientX;
      previousY = event.clientY;
      clampX();
      schedule();
    }
    function up() {
      if (pointer !== null && element.hasPointerCapture(pointer)) element.releasePointerCapture(pointer);
      pointer = null;
      element.classList.remove("is-dragging");
    }
    function key(event: KeyboardEvent) {
      const changes: Record<string, [number, number]> = {
        ArrowLeft: [0, 0.18], ArrowRight: [0, -0.18], ArrowUp: [0.18, 0], ArrowDown: [-0.18, 0]
      };
      const change = changes[event.key];
      if (!change) return;
      event.preventDefault();
      rotationX += change[0]; rotationY += change[1]; clampX(); schedule();
    }
    resize.observe(element); observer.observe(element);
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", up);
    element.addEventListener("lostpointercapture", up);
    element.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", schedule);
    return () => {
      clearTimeout(idleTimer); cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect();
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", up);
      element.removeEventListener("pointercancel", up);
      element.removeEventListener("lostpointercapture", up);
      element.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, []);
  return <div className="skills-globe-host"><div className="skills-globe-mount"><div className="skills-globe-component">
    <div className="sg-globe-wrap">
      <p className="sg-globe-hint">Drag or use arrow keys to explore</p>
      <div ref={sphere} className="sg-globe" tabIndex={0} role="group" aria-label="Tech Globe. Drag or use arrow keys to rotate.">
        <div className="sg-globe-shadow" /><div className="sg-globe-core" />
        {[1, 2, 3].map(i => <div key={i} className={`sg-globe-ring sg-horizontal sg-ring-${i}`} />)}
        {[1, 2, 3, 4].map(i => <div key={i} className={`sg-globe-ring sg-vertical sg-ring-v${i}`} />)}
        {[1, 2, 3].map(i => <div key={i} className={`sg-globe-lat sg-lat-${i}`} />)}
        <div className="sg-globe-overlay" /><div className="sg-globe-dots" />
        {skills.map(([name, icon]) => <div className="sg-skill-node" key={name}>
          <div className="sg-skill-node-inner"><img src={`media/${icon}`} alt={name} draggable={false} loading="lazy" decoding="async" /><span>{name}</span></div>
        </div>)}
      </div>
    </div>
  </div></div></div>;
}
