import { useEffect, useRef } from "react";
import paper from "paper";

const CursorTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    paper.setup(canvas);

    // The amount of points in the path (reduced for shorter trail)
    const points = 12;
    // The distance between the points (reduced for shorter trail)
    const length = 20;

    const path = new paper.Path({
      strokeColor: "#ffcc00", // Yellow color
      strokeWidth: 3, // Thin stroke
      strokeCap: "round",
    });

    const start = new paper.Point(paper.view.center.x / 10, paper.view.center.y);
    for (let i = 0; i < points; i++) {
      path.add(start.add(new paper.Point(i * length, 0)));
    }

    let isMoving = false;
    let fadeTimeout: NodeJS.Timeout;

    const handleMouseMove = (event: MouseEvent) => {
      const point = new paper.Point(event.clientX, event.clientY);
      path.firstSegment.point = point;

      for (let i = 0; i < points - 1; i++) {
        const segment = path.segments[i];
        const nextSegment = segment.next;
        if (nextSegment) {
          const vector = segment.point.subtract(nextSegment.point);
          vector.length = length;
          nextSegment.point = segment.point.subtract(vector);
        }
      }

      path.smooth({ type: "continuous" });

      // Show the path when moving
      path.opacity = 1;
      isMoving = true;

      // Clear previous timeout
      clearTimeout(fadeTimeout);

      // Set timeout to fade out after mouse stops
      fadeTimeout = setTimeout(() => {
        isMoving = false;
        fadeOut();
      }, 100); // Fade out after 100ms of no movement
    };

    const fadeOut = () => {
      if (!isMoving && path.opacity > 0) {
        path.opacity -= 0.05;
        if (path.opacity > 0) {
          requestAnimationFrame(fadeOut);
        } else {
          path.opacity = 0;
        }
      }
    };

    const handleMouseDown = () => {
      path.fullySelected = true;
      path.strokeColor = new paper.Color("#ffe066"); // Lighter yellow on click
    };

    const handleMouseUp = () => {
      path.fullySelected = false;
      path.strokeColor = new paper.Color("#ffcc00"); // Back to yellow
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      paper.view.viewSize = new paper.Size(canvas.width, canvas.height);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(fadeTimeout);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
      paper.project.clear();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};

export default CursorTrail;
