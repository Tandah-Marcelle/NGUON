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
  const [src, setSrc] = useState<string | null>(null);

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
        <video src={src} className="w-full h-full object-cover" {...videoProps} />
      ) : (
        <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" {...imgProps} />
      )}
    </div>
  );
});

LazyMedia.displayName = 'LazyMedia';
export default LazyMedia;
