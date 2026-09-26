import { memo, useRef, useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

interface LazyMediaProps {
  presignedUrl?: string | null;
  rawPath?: string | null;
  fallback?: string;
  alt?: string;
  className?: string;
  type?: 'image' | 'video';
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
}

const LazyMedia = memo(({
  presignedUrl,
  rawPath,
  fallback,
  alt = '',
  className = '',
  type = 'image',
  imgProps = {},
  videoProps = {},
}: LazyMediaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);

  // Videos render pitch black until a frame is actually decoded — with only
  // `preload="metadata"` (fast: just duration/dimensions, no video data) the
  // browser never paints one. Nudging currentTime once metadata is known
  // forces it to decode and display a real frame as a de facto poster,
  // without downloading the whole file or autoplaying.
  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    try { v.currentTime = Math.min(0.5, (v.duration || 1) / 2); } catch { /* ignore */ }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (presignedUrl) { setSrc(presignedUrl); return; }
        if (rawPath)      { setSrc(`${API_BASE}/files/view/${rawPath}`); return; }
        if (fallback)     { setSrc(fallback); }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [presignedUrl, rawPath, fallback]);

  return (
    <div ref={containerRef} className={className}>
      {!src ? (
        <div className="w-full h-full animate-pulse bg-muted rounded" />
      ) : type === 'video' ? (
        <video
          ref={videoRef}
          src={src}
          preload="metadata"
          muted
          playsInline
          onLoadedMetadata={handleLoadedMetadata}
          className="w-full h-full object-cover"
          {...videoProps}
        />
      ) : (
        <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" {...imgProps} />
      )}
    </div>
  );
});

LazyMedia.displayName = 'LazyMedia';
export default LazyMedia;
