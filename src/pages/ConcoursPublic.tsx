import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  FileText, ExternalLink, Trophy, PenLine, Award, Users, Star, X,
  ChevronLeft, ChevronRight, ChevronDown, Download, ZoomIn, ZoomOut,
  Heart, Loader2, Check, AlertCircle, Mail, KeyRound, Share2,
} from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import LazyMedia from "@/components/LazyMedia";
import bg3 from "@/assets/bg3.jpg";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
// Legacy URL builder — used as fallback when presignedUrl is absent
const fileUrl = (p: string) => `${API_BASE}/files/view/?path=${encodeURIComponent(p)}`;
// Prefer the presigned URL embedded in the response; fall back to legacy builder
const resolveUrl = (presignedUrl: string | null | undefined, rawPath: string) =>
  presignedUrl ?? fileUrl(rawPath);
const isImg = (p: string) => /\.(png|jpe?g|gif|webp|svg)$/i.test(p);

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  JEUNESSE: Star, ARTS: Award, AMBASSADEURS: Users,
  SPORTS: Trophy, FEMME: Users, PATRIMOINE: Award,
  TOURISME: Star, ANIMATION: Users, default: Trophy,
};
function getCategoryIcon(cat: string): React.ElementType {
  for (const key of Object.keys(CATEGORY_ICONS))
    if (cat.toUpperCase().includes(key)) return CATEGORY_ICONS[key];
  return CATEGORY_ICONS.default;
}

// ── File Viewer Modal — handles both images AND PDFs inline ──────────────────
interface ModalFile { url: string; title: string }

function PdfViewer({ url, title }: { url: string; title: string }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    let objectUrl: string;
    fetch(url)
      .then(r => { if (!r.ok) throw new Error(); return r.blob(); })
      .then(blob => { objectUrl = URL.createObjectURL(blob); setBlobUrl(objectUrl); })
      .catch(() => setFetchError(true));
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [url]);

  const handleDownload = () => {
    if (blobUrl) {
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = title + ".pdf";
      a.click();
    } else {
      window.open(url, "_blank");
    }
  };

  if (fetchError) return (
    <div className="flex flex-col items-center justify-center gap-3 text-white/60 h-full bg-zinc-700">
      <FileText size={40} className="opacity-30" />
      <p className="text-sm">Impossible de charger le PDF.</p>
      <button onClick={() => window.open(url, "_blank")}
        className="flex items-center gap-2 text-xs font-bold text-white bg-primary px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
        <Download size={13} /> Télécharger
      </button>
    </div>
  );

  if (!blobUrl) return (
    <div className="flex flex-col items-center justify-center gap-3 text-white/60 h-full bg-zinc-700">
      <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      <p className="text-sm">Chargement…</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/60 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber <= 1}
            className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center disabled:opacity-30 hover:bg-primary/10 transition-colors">
            <ChevronLeft size={13} />
          </button>
          <span className="font-body text-xs text-foreground font-semibold px-1">
            {numPages ? `${pageNumber} / ${numPages}` : "…"}
          </span>
          <button onClick={() => setPageNumber(p => Math.min(numPages, p + 1))} disabled={pageNumber >= numPages}
            className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center disabled:opacity-30 hover:bg-primary/10 transition-colors">
            <ChevronRight size={13} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setScale(s => Math.max(0.5, +(s - 0.25).toFixed(2)))}
            className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-primary/10 transition-colors">
            <ZoomOut size={13} />
          </button>
          <span className="font-body text-xs text-foreground/60 w-10 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(s => Math.min(3, +(s + 0.25).toFixed(2)))}
            className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-primary/10 transition-colors">
            <ZoomIn size={13} />
          </button>
          <button onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs font-bold text-primary border border-primary/30 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors ml-2">
            <Download size={12} /> Télécharger
          </button>
        </div>
      </div>
      {/* canvas */}
      <div className="flex-1 overflow-auto bg-zinc-700 flex justify-center py-4">
        <Document
          file={blobUrl}
          onLoadSuccess={({ numPages }) => { setNumPages(numPages); setPageNumber(1); }}
          onLoadError={() => setFetchError(true)}
          loading={
            <div className="flex items-center justify-center gap-3 text-white/60 py-16">
              <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            </div>
          }
        >
          <Page pageNumber={pageNumber} scale={scale} renderTextLayer renderAnnotationLayer className="shadow-2xl" />
        </Document>
      </div>
    </div>
  );
}

function FileViewer({ files, startIndex, onClose }: { files: ModalFile[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);
  const { t } = useTranslation();
  const file = files[idx];
  const multi = files.length > 1;
  const isPdf = /\.pdf(\?.*)?$/i.test(file.url) || file.url.toLowerCase().includes(".pdf");

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-xl" />
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 16 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-5xl flex flex-col bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
        style={{ maxHeight: "92vh", height: "92vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <FileText size={15} className="text-primary flex-shrink-0" />
            <span className="font-display font-bold text-sm text-foreground truncate">{file.title}</span>
            {multi && (
              <span className="font-body text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex-shrink-0">
                {idx + 1} / {files.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <a href={file.url} target="_blank" rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-primary border border-primary/20 hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors">
              <ExternalLink size={12} /> {t('concours.modal_open')}
            </a>
            <button onClick={onClose}
              className="w-8 h-8 rounded-xl bg-muted hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 flex items-center justify-center transition-colors">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isPdf ? (
            <PdfViewer url={file.url} title={file.title} />
          ) : (
            <div className="h-full overflow-auto bg-muted/30">
              <img src={file.url} alt={file.title} className="w-full h-auto block" />
            </div>
          )}
        </div>

        {/* Multi-file navigation */}
        {multi && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-card flex-shrink-0">
            <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
              className="flex items-center gap-1.5 text-xs font-bold text-foreground/60 disabled:opacity-30 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5 disabled:cursor-not-allowed">
              <ChevronLeft size={14} /> {t('concours.modal_prev')}
            </button>
            <div className="flex items-center gap-1.5">
              {files.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === idx ? "bg-primary w-5" : "bg-muted-foreground/30 hover:bg-muted-foreground/60 w-2"}`} />
              ))}
            </div>
            <button onClick={() => setIdx(i => Math.min(files.length - 1, i + 1))} disabled={idx === files.length - 1}
              className="flex items-center gap-1.5 text-xs font-bold text-foreground/60 disabled:opacity-30 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5 disabled:cursor-not-allowed">
              {t('concours.modal_next')} <ChevronRight size={14} />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

const PAGE_SIZE = 6;

// ── Vote modal — email → OTP → success ────────────────────────────────────────
type VoteProfile = {
  id: number; name: string; description?: string;
  photoUrl: string; photoPresignedUrl?: string; voteCount: number;
};

// A literal dashed/dotted circle, spinning — the loading indicator requested
// for the send/verify steps (distinct from the site's usual arc spinner).
const DottedSpinner = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <div
    className={`rounded-full border-2 border-dashed border-current animate-spin ${className}`}
    style={{ width: size, height: size }}
  />
);

const OTP_LENGTH = 6;

// Six individual boxes instead of one text field — filters to alphanumeric,
// auto-advances focus, supports paste, and fires onComplete the instant the
// last box is filled (no separate submit click needed).
function OtpBoxInput({
  value, onChange, onComplete, disabled,
}: { value: string; onChange: (v: string) => void; onComplete: (v: string) => void; disabled?: boolean }) {
  const chars = value.padEnd(OTP_LENGTH, " ").split("").slice(0, OTP_LENGTH);
  const refs = useState(() => Array.from({ length: OTP_LENGTH }, () => null as HTMLInputElement | null))[0];

  const setChar = (i: number, raw: string) => {
    const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!clean) {
      const next = value.slice(0, i) + value.slice(i + 1);
      onChange(next);
      return;
    }
    const next = (value.slice(0, i) + clean[0] + value.slice(i + 1)).slice(0, OTP_LENGTH);
    onChange(next);
    if (clean[0] && i < OTP_LENGTH - 1) refs[i + 1]?.focus();
    if (next.length === OTP_LENGTH && !next.includes(" ")) onComplete(next);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    onChange(pasted);
    const last = Math.min(pasted.length, OTP_LENGTH) - 1;
    refs[last]?.focus();
    if (pasted.length === OTP_LENGTH) onComplete(pasted);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !chars[i].trim() && i > 0) refs[i - 1]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {chars.map((c, i) => (
        <input
          key={i}
          ref={el => { refs[i] = el; }}
          value={c.trim()}
          onChange={e => setChar(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          maxLength={1}
          inputMode="text"
          autoFocus={i === 0}
          className="w-11 h-13 sm:w-12 sm:h-14 text-center text-lg font-black uppercase border-2 border-input rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition disabled:opacity-50"
        />
      ))}
    </div>
  );
}

function VoteModal({ profile, onClose, onVoted }: { profile: VoteProfile; onClose: () => void; onVoted: () => void }) {
  const { t } = useTranslation();
  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.requestVoteOtp({ voteProfileId: profile.id, email });
      if (res.success) {
        setStep("otp");
      } else {
        setError(res.message ?? t("vote.error_generic"));
      }
    } catch {
      setError(t("vote.error_generic"));
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async (code: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.confirmVoteOtp({ email, otp: code });
      if (res.success) {
        setStep("success");
        onVoted();
      } else {
        setError(res.message ?? t("vote.error_generic"));
      }
    } catch {
      setError(t("vote.error_generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="bg-card rounded-3xl border border-border shadow-2xl w-full max-w-sm p-7 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <X size={16} />
        </button>

        {step !== "success" && (
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0">
              <img src={profile.photoPresignedUrl ?? profile.photoUrl} alt={profile.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-display font-black text-foreground leading-tight">{profile.name}</p>
              <p className="text-xs text-muted-foreground">{t("vote.modal_subtitle")}</p>
            </div>
          </div>
        )}

        {step === "email" && (
          <form onSubmit={submitEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-foreground/60 uppercase tracking-wider mb-1.5">{t("vote.email_label")}</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  required type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder={t("vote.email_placeholder")} autoFocus disabled={loading}
                  className="w-full border border-input rounded-xl pl-10 pr-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition disabled:opacity-50"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">{t("vote.email_hint")}</p>
            </div>
            {error && (
              <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-3 py-2.5 text-xs font-semibold">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" /> {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white font-black py-3 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50">
              {loading ? <><DottedSpinner /> {t("vote.sending")}</> : t("vote.send_code")}
            </button>
          </form>
        )}

        {step === "otp" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-foreground/60 uppercase tracking-wider mb-3 text-center">{t("vote.otp_label")}</label>
              <OtpBoxInput value={otp} onChange={setOtp} onComplete={submitOtp} disabled={loading} />
              <p className="text-xs text-muted-foreground mt-3 text-center">{t("vote.otp_hint", { email })}</p>
            </div>
            {loading && (
              <div className="flex items-center justify-center gap-2 text-primary text-sm font-semibold">
                <DottedSpinner /> {t("vote.verifying")}
              </div>
            )}
            {error && (
              <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-3 py-2.5 text-xs font-semibold">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" /> {error}
              </div>
            )}
            <button type="button" onClick={() => { setStep("email"); setOtp(""); setError(""); }} disabled={loading} className="w-full text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-50">
              {t("vote.change_email")}
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-3">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-green-600" />
            </div>
            <h3 className="font-display text-lg font-black text-foreground mb-1.5">{t("vote.success_title")}</h3>
            <p className="text-sm text-muted-foreground mb-5">{t("vote.success_desc", { name: profile.name })}</p>
            <button onClick={onClose} className="w-full bg-primary text-white font-black py-3 rounded-xl hover:bg-primary/90 transition-all">
              {t("vote.close")}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Image lightbox — click a candidate photo to enlarge; close via the X
// button or by clicking anywhere outside the image ─────────────────────────
function VoteImageLightbox({ profile, onClose }: { profile: VoteProfile; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
        <X size={20} />
      </button>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
        onClick={e => e.stopPropagation()}
        className="max-w-lg w-full"
      >
        <img
          src={profile.photoPresignedUrl ?? profile.photoUrl} alt={profile.name}
          className="w-full max-h-[75vh] object-contain rounded-2xl"
        />
        <p className="text-center text-white font-display font-black text-lg mt-4">{profile.name}</p>
        {profile.description && <p className="text-center text-white/60 text-sm mt-1 max-w-md mx-auto">{profile.description}</p>}
      </motion.div>
    </motion.div>
  );
}

// ── Vote gallery section ───────────────────────────────────────────────────────
function VoteSection() {
  const [profiles, setProfiles] = useState<VoteProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [voteTarget, setVoteTarget] = useState<VoteProfile | null>(null);
  const [lightboxTarget, setLightboxTarget] = useState<VoteProfile | null>(null);
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const cardRefs = useState(() => new Map<number, HTMLDivElement>())[0];

  useEffect(() => {
    api.getVoteProfiles().then(setProfiles).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Deep link from a shared card (?vote=<id>) — scroll straight to that
  // profile and give it a brief highlight so it's obvious which one was shared.
  // Waits on `loading` too: `profiles` can update a render before `loading`
  // flips false, i.e. before the cards (and their refs) actually exist.
  useEffect(() => {
    if (loading) return;
    const sharedId = Number(searchParams.get("vote"));
    if (!sharedId || profiles.length === 0) return;
    const el = cardRefs.get(sharedId);
    if (!el) return;
    const id = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightId(sharedId);
      setTimeout(() => setHighlightId(null), 2500);
    }, 400);
    return () => clearTimeout(id);
  }, [profiles, loading, searchParams, cardRefs]);

  const shareProfile = async (p: VoteProfile) => {
    const url = `${window.location.origin}/concours?vote=${p.id}#votes`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t("vote.share_copied"));
    } catch {
      toast.error(t("vote.error_generic"));
    }
  };

  // id="votes" stays mounted regardless of load state / empty result so the
  // hero and homepage CTAs always have a valid anchor to scroll/link to.
  return (
    <div id="votes">
      {(loading || profiles.length > 0) && (
        <section className="relative pt-24 pb-24 overflow-hidden bg-[#003B5C]">
          {/* Curved transition from the plain Concours list section above — a
              clearly separate, spotlighted feature, not a continuation of it. */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-background" style={{ clipPath: "ellipse(60% 100% at 50% 0%)" }} />
          <div className="absolute top-10 right-0 w-[420px] h-[420px] bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
              <div className="w-14 h-14 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center mx-auto mb-5">
                <Heart size={24} className="text-secondary" />
              </div>
              <p className="text-secondary font-body text-xs font-black uppercase tracking-[0.3em] mb-3">{t("vote.eyebrow")}</p>
              <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-4">
                {t("vote.title")}
              </h2>
              <div className="h-0.5 w-16 bg-secondary rounded-full mx-auto mb-4" />
              <p className="font-body text-white/60 text-base max-w-2xl mx-auto leading-relaxed">
                {t("vote.description")}
              </p>
            </motion.div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="relative w-14 h-14">
                  <div className="absolute inset-0 rounded-full border-2 border-secondary/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-t-secondary animate-spin" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {profiles.map((p, i) => (
                  <motion.div
                    key={p.id}
                    ref={el => { if (el) cardRefs.set(p.id, el); }}
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    {highlightId === p.id && (
                      <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 2.2, times: [0, 0.15, 0.7, 1] }}
                        className="absolute inset-0 rounded-2xl ring-4 ring-inset ring-secondary pointer-events-none z-10"
                      />
                    )}
                    <div className="relative aspect-square bg-muted overflow-hidden cursor-pointer group" onClick={() => setLightboxTarget(p)}>
                      <img src={p.photoPresignedUrl ?? p.photoUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <button
                        onClick={e => { e.stopPropagation(); shareProfile(p); }}
                        title={t("vote.share")}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <p className="font-display font-black text-foreground leading-tight mb-1">{p.name}</p>
                      {p.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">{p.description}</p>}
                      <button
                        onClick={() => setVoteTarget(p)}
                        className="mt-auto text-xs font-black bg-secondary text-[#003B5C] px-3 py-2 rounded-full hover:bg-secondary/90 transition-all w-full"
                      >
                        {t("vote.vote_button")}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <AnimatePresence>
            {voteTarget && (
              <VoteModal
                profile={voteTarget}
                onClose={() => setVoteTarget(null)}
                onVoted={() => setProfiles(prev => prev.map(p => p.id === voteTarget.id ? { ...p, voteCount: p.voteCount + 1 } : p))}
              />
            )}
            {lightboxTarget && (
              <VoteImageLightbox profile={lightboxTarget} onClose={() => setLightboxTarget(null)} />
            )}
          </AnimatePresence>
        </section>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ConcoursPublic() {
  const [concours, setConcours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ files: ModalFile[]; startIndex: number } | null>(null);
  const [page, setPage] = useState(0);
  const [noConcoursAlert, setNoConcoursAlert] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    api.getConcoursPublic().then(setConcours).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Arriving with #votes in the URL (e.g. from the homepage CTA) — scroll to
  // it once the page has settled, since the anchor may render after mount.
  useEffect(() => {
    if (window.location.hash === "#votes") {
      const id = setTimeout(() => {
        document.getElementById("votes")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
      return () => clearTimeout(id);
    }
  }, []);

  // Guard: show alert if no concours yet
  const goInscription = () => {
    if (!loading && concours.length === 0) { setNoConcoursAlert(true); return; }
    navigate("/concours/inscription");
  };

  // All files → viewer (PDF renders via iframe, images render as <img>)
  const handleFile = (url: string, title: string) => {
    setModal({ files: [{ url, title }], startIndex: 0 });
  };

  const handleFiche = (fiches: any[], fi: number) => {
    setModal({
    files: fiches.map((x: any) => ({ url: resolveUrl(x.presignedUrl, x.fichierPdf), title: x.titre })),
      startIndex: fi,
    });
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-[460px] md:min-h-[520px] flex items-center pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={bg3} alt="" className="w-full h-full object-cover" style={{ filter: "brightness(0.32) saturate(1.2)" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#003B5C]/95 via-[#003B5C]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
        </div>
        <div className="absolute top-10 right-0 w-[480px] h-[480px] bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-secondary via-secondary/50 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-0.5 w-12 bg-secondary rounded-full" />
                <span className="text-secondary font-body text-xs font-black uppercase tracking-[0.3em]">{t('concours.eyebrow')}</span>
                <div className="h-0.5 w-6 bg-secondary/40 rounded-full" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-5">
                <span className="text-secondary">{t('concours.hero_title_line1')}</span>
                <br /><span className="text-white/90">{t('concours.hero_title_line2')}</span>
              </h1>
              <p className="font-body text-white/70 text-base md:text-lg leading-relaxed max-w-xl">
                {t('concours.hero_description')}
              </p>
              <div className="flex items-center gap-8 mt-7">
                {[
                  { value: "18+", labelKey: "concours.stat_contests" },
                  { value: "8",   labelKey: "concours.stat_categories" },
                  { value: "2026", labelKey: "concours.stat_edition" },
                ].map((s, i) => (
                  <motion.div key={s.labelKey} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }} className="text-center">
                    <div className="font-display text-2xl font-black text-secondary">{s.value}</div>
                    <div className="font-body text-xs text-white/50 uppercase tracking-wider">{t(s.labelKey)}</div>
                  </motion.div>
                ))}
              </div>

              {/* Separate feature: voting for Miss/Master — distinct from contest registration above */}
              <motion.a
                href="#votes"
                onClick={(e) => { e.preventDefault(); document.getElementById("votes")?.scrollIntoView({ behavior: "smooth" }); }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-6 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-secondary/40 rounded-2xl pl-3 pr-5 py-2.5 hover:bg-white/15 hover:border-secondary/70 transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Heart size={16} className="text-[#003B5C]" />
                </div>
                <div className="text-left">
                  <p className="font-display text-sm font-black text-white leading-tight">{t("vote.hero_cta_title")}</p>
                  <p className="font-body text-[11px] text-white/60">{t("vote.hero_cta_desc")} →</p>
                </div>
              </motion.a>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="flex-shrink-0">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center max-w-xs shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center mx-auto mb-4">
                  <Trophy size={28} className="text-secondary" />
                </div>
                <h3 className="font-display text-xl font-black text-white mb-2">{t('concours.cta_card_title')}</h3>
                <p className="font-body text-white/60 text-sm mb-6 leading-relaxed">
                  {t('concours.cta_card_desc')}
                </p>
                <button
                  onClick={goInscription}
                  className="w-full flex items-center justify-center gap-2.5 bg-secondary hover:bg-secondary/90 text-[#003B5C] font-display font-black text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-secondary/30 transition-all hover:scale-105">
                  <PenLine size={16} /> {t('concours.cta_register')}
                </button>
                <p className="font-body text-white/40 text-xs mt-3">{t('concours.cta_free')}</p>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-background" style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }} />
      </section>

      {/* ── CONCOURS LIST ── */}
      <section className="section-padding pb-24">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
            <p className="text-secondary font-body text-xs font-black uppercase tracking-[0.3em] mb-3">{t('concours.list_eyebrow')}</p>
            <h2 className="font-display text-3xl md:text-4xl font-black text-foreground mb-4">
              <span className="text-primary">{t('concours.list_title')}</span>
            </h2>
            <div className="h-0.5 w-16 bg-secondary rounded-full mx-auto mb-4" />
            <p className="font-body text-muted-foreground text-base max-w-2xl mx-auto leading-relaxed">
              {t('concours.list_description')}
            </p>
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-2 border-t-primary animate-spin" />
              </div>
              <p className="font-body text-muted-foreground text-sm">{t('concours.loading')}</p>
            </div>
          ) : concours.length === 0 ? (
            <div className="text-center py-24 bg-card rounded-3xl border border-border shadow-sm">
              <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
                <Trophy size={32} className="text-muted-foreground/30" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground/50 mb-2">{t('concours.empty_title')}</h3>
              <p className="font-body text-muted-foreground text-sm max-w-sm mx-auto">{t('concours.empty_desc')}</p>
            </div>
          ) : (() => {
            const totalPages = Math.ceil(concours.length / PAGE_SIZE);
            const paginated = concours.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
            return (
              <>
                {/* 2-col grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {paginated.map((c, i) => (
                    <ConcoursCard
                      key={c.id}
                      concours={c}
                      index={i}
                      onFile={handleFile}
                      onFiche={handleFiche}
                      onInscription={goInscription}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex flex-col items-center gap-4">
                    {/* Page info */}
                    <p className="font-body text-sm text-muted-foreground">
                      {t('concours.pagination_info', { current: page + 1, total: totalPages, count: concours.length })}
                    </p>

                    {/* Buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        disabled={page === 0}
                        onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 600, behavior: "smooth" }); }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card font-display font-bold text-sm text-foreground/70 hover:text-primary hover:border-primary/40 hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft size={16} /> {t('concours.prev')}
                      </button>

                      {/* Page dots */}
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalPages }).map((_, pi) => (
                          <button
                            key={pi}
                            onClick={() => { setPage(pi); window.scrollTo({ top: 600, behavior: "smooth" }); }}
                            className={`rounded-full transition-all duration-300 ${
                              pi === page
                                ? "bg-primary w-7 h-2.5"
                                : "bg-border hover:bg-primary/40 w-2.5 h-2.5"
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        disabled={page >= totalPages - 1}
                        onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 600, behavior: "smooth" }); }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card font-display font-bold text-sm text-foreground/70 hover:text-primary hover:border-primary/40 hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        {t('concours.next')} <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Bottom CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-14 text-center"
                >
                  <div className="inline-flex flex-col sm:flex-row items-center gap-5 bg-primary/5 border border-primary/20 rounded-3xl px-8 py-6">
                    <div className="text-left">
                      <h3 className="font-display text-lg font-black text-foreground">{t('concours.bottom_cta_title')}</h3>
                      <p className="font-body text-muted-foreground text-sm">{t('concours.bottom_cta_desc')}</p>
                    </div>
                    <button
                      onClick={goInscription}
                      className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-display font-black text-sm px-7 py-3.5 rounded-2xl shadow-lg shadow-primary/25 transition-all hover:scale-105 whitespace-nowrap"
                    >
                      <PenLine size={15} /> {t('concours.register_now')}
                    </button>
                  </div>
                </motion.div>
              </>
            );
          })()}
        </div>
      </section>

      <VoteSection />

      <Footer />

      <AnimatePresence>
        {modal && <FileViewer files={modal.files} startIndex={modal.startIndex} onClose={() => setModal(null)} />}
      </AnimatePresence>

      {/* ── No-concours alert ── */}
      <AnimatePresence>
        {noConcoursAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            onClick={() => setNoConcoursAlert(false)}
          >
            <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={e => e.stopPropagation()}
              className="relative bg-card border border-border rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mx-auto mb-5">
                <Trophy size={28} className="text-secondary" />
              </div>

              {/* Text */}
              <h3 className="font-display text-xl font-black text-foreground mb-2">
                Aucun concours disponible
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Les concours et défis du <span className="text-secondary font-semibold">NGUON 2026</span> ne
                sont pas encore disponibles. Revenez bientôt pour vous inscrire.
              </p>

              {/* Divider */}
              <div className="h-px bg-border my-5" />

              {/* Close button */}
              <button
                onClick={() => setNoConcoursAlert(false)}
                className="w-full bg-primary hover:bg-primary/90 text-white font-display font-black text-sm px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-md shadow-primary/20"
              >
                Compris
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Concours Card ─────────────────────────────────────────────────────────────
interface ConcoursCardProps {
  concours: any;
  index: number;
  onFile: (url: string, title: string) => void;
  onFiche: (fiches: any[], fi: number) => void;
  onInscription: () => void;
}

function ConcoursCard({ concours: c, index, onFile, onFiche, onInscription }: ConcoursCardProps) {
  const { t } = useTranslation();
  const hasFiches = c.fichesDescriptives?.length > 0;
  const FICHES_PREVIEW = 3;
  const [fichesExpanded, setFichesExpanded] = useState(false);

  const fichesToShow = hasFiches
    ? fichesExpanded
      ? c.fichesDescriptives
      : c.fichesDescriptives.slice(0, FICHES_PREVIEW)
    : [];
  const hasMore = hasFiches && c.fichesDescriptives.length > FICHES_PREVIEW;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col"
    >
      {/* ── Card Header: title + badge + S'inscrire ── */}
      <div className="flex items-start gap-4 p-5 border-b border-border/50">
        {/* Thumbnail */}
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border">
          {c.affiche ? (
            isImg(c.affiche)
              ? <LazyMedia presignedUrl={c.affichePresignedUrl} rawPath={c.affiche} alt={c.sousCategorie} className="w-full h-full" imgProps={{ className: "w-full h-full object-cover" }} />
              : <div className="w-full h-full flex items-center justify-center bg-red-50 dark:bg-red-900/20"><FileText size={20} className="text-red-400" /></div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/5"><Trophy size={20} className="text-primary/30" /></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-base text-foreground leading-snug">{c.sousCategorie}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="font-body text-xs text-muted-foreground">
              {t('concours.card_periode')} : <span className="font-semibold text-foreground/70">{c.periode}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {t('concours.card_open')}
            </span>
          </div>
        </div>

        {/* S'inscrire — desktop */}
        <button
          onClick={onInscription}
          className="hidden sm:flex items-center gap-1.5 bg-secondary hover:bg-secondary/90 text-[#003B5C] font-display font-black text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all hover:scale-105 flex-shrink-0"
        >
          <PenLine size={12} /> {t('concours.card_register')}
        </button>
      </div>

      {/* ── Affiche ── */}
      <div className="px-5 pt-5">
        <p className="font-body text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
          <span className="w-4 h-0.5 bg-secondary rounded-full inline-block" />
          {t('concours.card_affiche')}
        </p>
        {c.affiche ? (
          <div
            className="rounded-2xl overflow-hidden border border-border bg-muted/30 cursor-pointer group"
            onClick={() => onFile(resolveUrl(c.affichePresignedUrl, c.affiche), c.sousCategorie)}
          >
            {isImg(c.affiche) ? (
              <LazyMedia
                presignedUrl={c.affichePresignedUrl}
                rawPath={c.affiche}
                alt="affiche"
                className="w-full h-56"
                imgProps={{ className: "w-full h-full object-contain bg-muted/50 group-hover:scale-[1.02] transition-transform duration-300" }}
              />
            ) : (
              <div className="w-full h-56 flex flex-col items-center justify-center gap-3 bg-red-50/40 dark:bg-red-900/10 group-hover:bg-red-50/60 dark:group-hover:bg-red-900/20 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <FileText size={28} className="text-red-400" />
                </div>
                <span className="font-body text-sm font-semibold text-muted-foreground">{t('concours.card_doc_pdf')}</span>
                <span className="font-body text-xs text-primary font-bold flex items-center gap-1">
                  <ExternalLink size={11} /> {t('concours.card_open_newtab')}
                </span>
              </div>
            )}
            <div className="px-4 py-2.5 bg-card border-t border-border/50 flex justify-end">
              <span className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-primary/70 transition-colors">
                <ExternalLink size={12} />
                {isImg(c.affiche) ? t('concours.card_fullscreen') : t('concours.card_open_pdf')}
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-border/60 h-44 flex flex-col items-center justify-center text-muted-foreground/50 gap-2 bg-muted/20">
            <Trophy size={24} className="text-muted-foreground/20" />
            <span className="font-body text-sm">{t('concours.card_no_affiche')}</span>
          </div>
        )}
      </div>

      {/* ── Fiches descriptives (stacked below affiche) ── */}
      <div className="px-5 pt-5 pb-5 flex-1 flex flex-col">
        <p className="font-body text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
          <span className="w-4 h-0.5 bg-secondary rounded-full inline-block" />
          {t('concours.card_fiches')}
          {hasFiches && (
            <span className="font-bold text-primary">({c.fichesDescriptives.length})</span>
          )}
        </p>

        {!hasFiches ? (
          <div className="rounded-2xl border-2 border-dashed border-border/60 h-28 flex flex-col items-center justify-center text-muted-foreground/50 gap-2 bg-muted/20">
            <FileText size={22} className="text-muted-foreground/20" />
            <span className="font-body text-sm">{t('concours.card_no_fiches')}</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {fichesToShow.map((f: any, fi: number) => (
              <div
                key={f.id}
                onClick={() => onFiche(c.fichesDescriptives, c.fichesDescriptives.indexOf(f))}
                className="group flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20 hover:bg-primary/5 hover:border-primary/30 cursor-pointer transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <FileText size={16} className="text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{f.titre}</p>
                  <p className="font-body text-xs text-muted-foreground">
                    {f.fichierPdf?.toLowerCase().endsWith(".pdf") ? t('concours.card_doc_pdf') : "Image"}
                  </p>
                </div>
                <ExternalLink size={13} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </div>
            ))}

            {/* Voir plus / Voir moins */}
            {hasMore && (
              <button
                onClick={() => setFichesExpanded(e => !e)}
                className="flex items-center justify-center gap-1.5 text-xs font-bold text-primary/70 hover:text-primary transition-colors py-2.5 border border-dashed border-primary/20 hover:border-primary/50 rounded-xl hover:bg-primary/5 mt-1"
              >
                <motion.div animate={{ rotate: fichesExpanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown size={14} />
                </motion.div>
                {fichesExpanded
                  ? t('concours.card_voir_moins')
                  : t('concours.card_voir_plus', { count: c.fichesDescriptives.length - FICHES_PREVIEW })}
              </button>
            )}
          </div>
        )}

        {/* S'inscrire — mobile, pinned to bottom of card */}
        <div className="sm:hidden mt-4">
          <button
            onClick={onInscription}
            className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-[#003B5C] font-display font-black text-sm px-4 py-3 rounded-xl shadow-sm transition-all"
          >
            <PenLine size={14} /> {t('concours.card_register_mobile')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
