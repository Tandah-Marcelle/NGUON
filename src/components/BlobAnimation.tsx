import { useEffect, useRef } from "react";
import paper from "paper";

interface BlobAnimationProps {
  numBalls?: number;
  className?: string;
}

const BlobAnimation = ({ numBalls = 18, className = "" }: BlobAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    paper.setup(canvas);

    class Ball {
      radius: number;
      point: paper.Point;
      vector: paper.Point;
      maxVec: number;
      numSegment: number;
      boundOffset: number[];
      boundOffsetBuff: number[];
      sidePoints: paper.Point[];
      path: paper.Path;

      constructor(r: number, p: paper.Point, v: paper.Point) {
        this.radius = r;
        this.point = p;
        this.vector = v;
        this.maxVec = 15;
        this.numSegment = Math.floor(r / 3 + 2);
        this.boundOffset = [];
        this.boundOffsetBuff = [];
        this.sidePoints = [];

        // Use site colors: light blue, dark blue, and yellow
        const colors = [
          { hue: 201, saturation: 1, brightness: 0.7 },  // Light Blue #006cb2
          { hue: 201, saturation: 1, brightness: 0.56 }, // Dark Blue #005590
          { hue: 48, saturation: 1, brightness: 1 },     // Yellow #ffcc00
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        this.path = new paper.Path({
          fillColor: new paper.Color(color),
          blendMode: "lighter",
        });

        for (let i = 0; i < this.numSegment; i++) {
          this.boundOffset.push(this.radius);
          this.boundOffsetBuff.push(this.radius);
          this.path.add(new paper.Point(0, 0));
          this.sidePoints.push(
            new paper.Point({
              angle: (360 / this.numSegment) * i,
              length: 1,
            })
          );
        }
      }

      iterate() {
        this.checkBorders();
        if (this.vector.length > this.maxVec) this.vector.length = this.maxVec;
        this.point = this.point.add(this.vector);
        this.updateShape();
      }

      checkBorders() {
        const size = paper.view.size;
        if (this.point.x < -this.radius) this.point.x = size.width + this.radius;
        if (this.point.x > size.width + this.radius) this.point.x = -this.radius;
        if (this.point.y < -this.radius) this.point.y = size.height + this.radius;
        if (this.point.y > size.height + this.radius) this.point.y = -this.radius;
      }

      updateShape() {
        const segments = this.path.segments;
        for (let i = 0; i < this.numSegment; i++) {
          segments[i].point = this.getSidePoint(i);
        }
        this.path.smooth();

        for (let i = 0; i < this.numSegment; i++) {
          if (this.boundOffset[i] < this.radius / 4) this.boundOffset[i] = this.radius / 4;
          const next = (i + 1) % this.numSegment;
          const prev = i > 0 ? i - 1 : this.numSegment - 1;
          let offset = this.boundOffset[i];
          offset += (this.radius - offset) / 15;
          offset += ((this.boundOffset[next] + this.boundOffset[prev]) / 2 - offset) / 3;
          this.boundOffsetBuff[i] = this.boundOffset[i] = offset;
        }
      }

      react(b: Ball) {
        const dist = this.point.getDistance(b.point);
        if (dist < this.radius + b.radius && dist !== 0) {
          const overlap = this.radius + b.radius - dist;
          const direc = this.point.subtract(b.point).normalize(overlap * 0.015);
          this.vector = this.vector.add(direc);
          b.vector = b.vector.subtract(direc);
          this.calcBounds(b);
          b.calcBounds(this);
          this.updateBounds();
          b.updateBounds();
        }
      }

      getBoundOffset(b: paper.Point) {
        const diff = this.point.subtract(b);
        const angle = (diff.angle + 180) % 360;
        return this.boundOffset[Math.floor((angle / 360) * this.boundOffset.length)];
      }

      calcBounds(b: Ball) {
        for (let i = 0; i < this.numSegment; i++) {
          const tp = this.getSidePoint(i);
          const bLen = b.getBoundOffset(tp);
          const td = tp.getDistance(b.point);
          if (td < bLen) {
            this.boundOffsetBuff[i] -= (bLen - td) / 2;
          }
        }
      }

      getSidePoint(index: number) {
        return this.point.add(this.sidePoints[index].multiply(this.boundOffset[index]));
      }

      updateBounds() {
        for (let i = 0; i < this.numSegment; i++) {
          this.boundOffset[i] = this.boundOffsetBuff[i];
        }
      }
    }

    // Create balls
    const balls: Ball[] = [];
    for (let i = 0; i < numBalls; i++) {
      const position = new paper.Point(
        Math.random() * paper.view.size.width,
        Math.random() * paper.view.size.height
      );
      const vector = new paper.Point({
        angle: 360 * Math.random(),
        length: Math.random() * 10,
      });
      const radius = Math.random() * 60 + 60;
      balls.push(new Ball(radius, position, vector));
    }

    // Animation loop
    paper.view.onFrame = () => {
      for (let i = 0; i < balls.length - 1; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          balls[i].react(balls[j]);
        }
      }
      for (let i = 0; i < balls.length; i++) {
        balls[i].iterate();
      }
    };

    // Handle resize
    const handleResize = () => {
      paper.view.viewSize = new paper.Size(canvas.width, canvas.height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      paper.project.clear();
    };
  }, [numBalls]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      if (paper.project) {
        paper.view.viewSize = new paper.Size(canvas.width, canvas.height);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ background: "transparent" }}
    />
  );
};

export default BlobAnimation;
