import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

// Authored after Ndop, the indigo royal cloth of the Bamoun and Grassfields
// courts: nested lozenges on a dotted lattice, and woven bands of triangles.
// Drawn as SVG tiles so they stay crisp and can be recoloured per surface.

export const GOLD = "#FFCC00";
export const IVORY = "#F7F1E3";
export const NAVY = "#003B5C";

const tile = (w: number, h: number, body: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>${body}</svg>`,
  )}")`;

const lattice = (c: string) =>
  tile(
    56,
    56,
    `<g fill='none' stroke='${c}' stroke-width='1.3' stroke-linejoin='round'>` +
      `<path d='M28 7L49 28L28 49L7 28Z'/><path d='M28 17L39 28L28 39L17 28Z'/>` +
      `<path d='M0 21L7 28L0 35M56 21L49 28L56 35M21 0L28 7L35 0M21 56L28 49L35 56'/></g>` +
      `<g fill='${c}'><path d='M28 24.5L31.5 28L28 31.5L24.5 28Z'/>` +
      `<circle cx='0' cy='0' r='2.2'/><circle cx='56' cy='0' r='2.2'/><circle cx='0' cy='56' r='2.2'/><circle cx='56' cy='56' r='2.2'/></g>`,
  );

const band = (c: string) =>
  tile(
    24,
    20,
    `<g fill='${c}'>` +
      `<path d='M0 0H12L6 5.5Z'/><path d='M12 0H24L18 5.5Z'/>` +
      `<path d='M12 6.5L15.5 10L12 13.5L8.5 10Z'/><circle cx='0' cy='10' r='1.6'/><circle cx='24' cy='10' r='1.6'/>` +
      `<path d='M6 14.5L12 20H0Z'/><path d='M18 14.5L24 20H12Z'/></g>`,
  );

const FADES: Record<string, string> = {
  none: "none",
  bottom: "linear-gradient(to bottom, black 30%, transparent)",
  top: "linear-gradient(to top, black 30%, transparent)",
  right: "linear-gradient(to left, black 25%, transparent 85%)",
  left: "linear-gradient(to right, black 25%, transparent 85%)",
  edges: "radial-gradient(ellipse at center, transparent 35%, black 85%)",
};

type TextureProps = {
  color?: string;
  opacity?: number;
  size?: number;
  fade?: keyof typeof FADES;
  className?: string;
};

/** Ndop lozenge lattice laid over a surface. Decorative only. */
export function NdopTexture({ color = IVORY, opacity = 0.08, size = 56, fade = "none", className }: TextureProps) {
  const mask = FADES[fade];
  const style: CSSProperties = {
    backgroundImage: lattice(color),
    backgroundSize: `${size}px ${size}px`,
    opacity,
    maskImage: mask,
    WebkitMaskImage: mask,
  };
  return <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)} style={style} />;
}

/** Woven border strip, used where two sections meet or to frame a block. */
export function WovenBand({ color = GOLD, className, opacity = 1 }: { color?: string; className?: string; opacity?: number }) {
  return (
    <div
      aria-hidden
      className={cn("h-5 w-full", className)}
      style={{ backgroundImage: band(color), backgroundRepeat: "repeat-x", backgroundSize: "24px 20px", backgroundPosition: "center", opacity }}
    />
  );
}

/** Photo sitting on an offset navy panel woven with the gold lattice. */
export function TextileFrame({
  children,
  side = "left",
  className,
}: {
  children: ReactNode;
  side?: "left" | "right";
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        aria-hidden
        className={cn(
          "absolute -bottom-3 sm:-bottom-4 h-2/3 w-2/3 overflow-hidden rounded-2xl bg-navy",
          side === "left" ? "-left-3 sm:-left-4" : "-right-3 sm:-right-4",
        )}
      >
        <NdopTexture color={GOLD} opacity={0.4} size={40} />
      </div>
      <div className="relative overflow-hidden rounded-2xl shadow-[0_22px_45px_-20px_rgba(0,30,50,0.5)]">{children}</div>
    </div>
  );
}
