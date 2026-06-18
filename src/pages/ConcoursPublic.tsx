import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, ExternalLink, Trophy, PenLine, Award, Users, Star, X,
  ChevronLeft, ChevronRight, ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import bg3 from "@/assets/bg3.jpg";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const fileUrl = (p: string) => `${API_BASE}/files/view/?path=${encodeURIComponent(p)}`;
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

// ── Image Modal (images only — PDFs open in new tab) ─────────────────────────
interface ModalFile { url: string; title: string }

function ImageModal({ files, startIndex, onClose }: { files: ModalFile[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);
  const { t } = useTranslation();
  const file = files[idx];
  const multi = files.length > 1;

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
      <div className="absolute inset-0 bg-background/70 backdrop-blur-2xl" />
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 16 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-4xl flex flex-col bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
        style={{ maxHeight: "90vh" }}
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

        {/* Image */}
        <div className="flex-1 overflow-hidden bg-muted/40" style={{ height: "72vh" }}>
          <img src={file.url} alt={file.title} className="w-full h-full object-contain" />
        </div>

        {/* Nav */}
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

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ConcoursPublic() {
  const [concours, setConcours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ files: ModalFile[]; startIndex: number } | null>(null);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    api.getConcoursPublic().then(setConcours).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Images → modal, PDFs → new tab
  const handleFile = (url: string, title: string) => {
    if (isImg(url)) setModal({ files: [{ url, title }], startIndex: 0 });
    else window.open(url, "_blank", "noreferrer");
  };

  const handleFiche = (fiches: any[], fi: number) => {
    const url = fileUrl(fiches[fi].fichierPdf);
    if (isImg(url)) {
      setModal({
        files: fiches.map((x: any) => ({ url: fileUrl(x.fichierPdf), title: x.titre })),
        startIndex: fi,
      });
    } else {
      window.open(url, "_blank", "noreferrer");
    }
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
                  onClick={() => navigate("/concours/inscription")}
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
                      navigate={navigate}
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
                      onClick={() => navigate("/concours/inscription")}
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

      <Footer />

      <AnimatePresence>
        {modal && <ImageModal files={modal.files} startIndex={modal.startIndex} onClose={() => setModal(null)} />}
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
  navigate: (path: string) => void;
}

function ConcoursCard({ concours: c, index, onFile, onFiche, navigate }: ConcoursCardProps) {
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
              ? <img src={fileUrl(c.affiche)} alt={c.sousCategorie} className="w-full h-full object-cover" />
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
          onClick={() => navigate("/concours/inscription")}
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
            onClick={() => onFile(fileUrl(c.affiche), c.sousCategorie)}
          >
            {isImg(c.affiche) ? (
              <img
                src={fileUrl(c.affiche)}
                alt="affiche"
                className="w-full h-56 object-contain bg-muted/50 group-hover:scale-[1.02] transition-transform duration-300"
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
            onClick={() => navigate("/concours/inscription")}
            className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-[#003B5C] font-display font-black text-sm px-4 py-3 rounded-xl shadow-sm transition-all"
          >
            <PenLine size={14} /> {t('concours.card_register_mobile')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
