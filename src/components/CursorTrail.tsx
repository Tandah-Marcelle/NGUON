import { useEffect, useRef, useState } from "react";

// Lazy-load paper.js only on desktop to avoid blocking startup
const CursorTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let paper: typeof import("paper") | null = null;
    let cleanup: (() => void) | null = null;
    let mounted = true;

    // Dynamic import so paper.js doesn't block the main bundle
    import("paper").then((mod) => {
      if (!mounted) return;
      paper = mod;
      paper.setup(canvas);

      const points = 10;
      const length = 18;

      const path = new paper.Path({
        strokeColor: "#3aa8e7",
        strokeWidth: 2.5,
        strokeCap: "round",
        opacity: 0,
      });

      const start = new paper.Point(paper.view.center.x / 10, paper.view.center.y);
      for (let i = 0; i < points; i++) {
        path.add(start.add(new paper.Point(i * length, 0)));
      }

      let isMoving = false;
      let fadeTimeout: ReturnType<typeof setTimeout>;
      let fadeRafId: number;

      const handleMouseMove = (event: MouseEvent) => {
        if (!paper) return;
        const point = new paper.Point(event.clientX, event.clientY);
        path.firstSegment.point = point;
        for (let i = 0; i < points - 1; i++) {
          const seg = path.segments[i];
          const next = seg.next;
          if (next) {
            const vec = seg.point.subtract(next.point);
            vec.length = length;
            next.point = seg.point.subtract(vec);
          }
        }
        path.smooth({ type: "continuous" });
        path.opacity = 1;
        isMoving = true;
        clearTimeout(fadeTimeout);
        cancelAnimationFrame(fadeRafId);
        fadeTimeout = setTimeout(() => { isMoving = false; fadeOut(); }, 100);
      };

      const fadeOut = () => {
        if (!isMoving && path.opacity > 0) {
          path.opacity -= 0.05;
          if (path.opacity > 0) fadeRafId = requestAnimationFrame(fadeOut);
          else path.opacity = 0;
        }
      };

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (paper) paper.view.viewSize = new paper.Size(canvas.width, canvas.height);
      };

      handleResize();
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("resize", handleResize);

      cleanup = () => {
        clearTimeout(fadeTimeout);
        cancelAnimationFrame(fadeRafId);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", handleResize);
        try {
          if (paper) {
            paper.view.pause();
            paper.project.clear();
            // Don't call paper.view.remove() — it causes issues on remount
          }
        } catch { /* ignore */ }
        paper = null;
      };
    });

    return () => {
      mounted = false;
      cleanup?.();
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};

export default CursorTrail;
