import { memo, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

type Props = {
  presignedUrl?: string | null;
  rawPath?: string | null;
  type?: "image" | "video";
  alt?: string;
  className?: string;
  /** Extra classes for the foreground (uncropped) image, e.g. a hover zoom. */
  mediaClassName?: string;
};

/**
 * Shows a photo, poster or video frame whole — never cropped — on a blurred,
 * enlarged copy of itself, so posters and portrait shots keep their framing
 * inside a fixed-ratio card. Videos get a real poster frame grabbed from about
 * a quarter of the way in (the first half-second is usually a black intro).
 */
const SmartMedia = memo(({ presignedUrl, rawPath, type = "image", alt = "", className, mediaClassName }: Props) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [poster, setPoster] = useState<string | null>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (presignedUrl) setSrc(presignedUrl);
        else if (rawPath) setSrc(`${API_BASE}/files/view/${rawPath}`);
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [presignedUrl, rawPath]);

  const seek = () => {
    const v = videoRef.current;
    if (!v) return;
    const d = Number.isFinite(v.duration) ? v.duration : 4;
    try {
      v.currentTime = Math.min(Math.max(d * 0.25, 1), 8, d - 0.1);
    } catch {
      /* the frame shown by the video element is the fallback */
    }
  };

  const capture = () => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    try {
      const scale = Math.min(1, 720 / v.videoWidth);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(v.videoWidth * scale);
      canvas.height = Math.round(v.videoHeight * scale);
      canvas.getContext("2d")?.drawImage(v, 0, 0, canvas.width, canvas.height);
      setPoster(canvas.toDataURL("image/jpeg", 0.82));
    } catch {
      // Cross-origin media taints the canvas; keep showing the live frame.
    }
  };

  const still = type === "image" ? src : poster;

  return (
    <div ref={boxRef} className={cn("relative overflow-hidden bg-navy", className)}>
      {!src && <div className="absolute inset-0 animate-pulse bg-muted" />}
      {still && (
        <img
          aria-hidden
          src={still}
          alt=""
          className="absolute inset-0 h-full w-full scale-125 object-cover opacity-70 blur-2xl"
        />
      )}
      {still && (
        <img src={still} alt={alt} loading="lazy" className={cn("relative h-full w-full object-contain", mediaClassName)} />
      )}
      {type === "video" && src && !poster && (
        <video
          ref={videoRef}
          src={src}
          preload="metadata"
          muted
          playsInline
          onLoadedMetadata={seek}
          onSeeked={capture}
          className="relative h-full w-full object-contain"
        />
      )}
    </div>
  );
});

SmartMedia.displayName = "SmartMedia";
export default SmartMedia;
