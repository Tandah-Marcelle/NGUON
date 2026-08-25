import { useEffect, useRef } from "react";

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reduced counts to avoid frame drops
    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 15 : 30; // was 20/50
    const LINK_DIST = 100; // was 150 — fewer connections

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.4 + 0.15,
    }));

    const colors = ["rgba(255,204,0,", "rgba(255,217,51,", "rgba(255,229,102,"];

    let rafId: number;
    let lastTime = 0;
    const FPS_CAP = 30; // cap at 30fps — was uncapped
    const INTERVAL = 1000 / FPS_CAP;

    const animate = (timestamp: number) => {
      rafId = requestAnimationFrame(animate);
      const delta = timestamp - lastTime;
      if (delta < INTERVAL) return; // skip frame
      lastTime = timestamp - (delta % INTERVAL);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > canvas.width)  p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = colors[i % colors.length] + p.opacity + ")";
        ctx.fill();

        // Only draw connecting lines on desktop
        if (!isMobile) {
          for (let j = i + 1; j < COUNT; j++) { // j = i+1 avoids duplicate pairs
            const o = particles[j];
            const dx = p.x - o.x;
            const dy = p.y - o.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < LINK_DIST) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(255,204,0,${0.08 * (1 - dist / LINK_DIST)})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(o.x, o.y);
              ctx.stroke();
            }
          }
        }
      }
    };

    rafId = requestAnimationFrame(animate);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-25"
      style={{ zIndex: 1 }}
    />
  );
};

export default ParticleBackground;
