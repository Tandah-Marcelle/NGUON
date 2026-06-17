import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, FileText, ExternalLink, Trophy, PenLine, Award, Users, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import bg3 from "@/assets/bg3.jpg";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const fileUrl = (p: string) => `${API_BASE}/files/view/?path=${encodeURIComponent(p)}`;

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  JEUNESSE: Star,
  ARTS: Award,
  AMBASSADEURS: Users,
  SPORTS: Trophy,
  FEMME: Users,
  PATRIMOINE: Award,
  TOURISME: Star,
  ANIMATION: Users,
  default: Trophy,
};

function getCategoryIcon(cat: string): React.ElementType {
  for (const key of Object.keys(CATEGORY_ICONS)) {
    if (cat.toUpperCase().includes(key)) return CATEGORY_ICONS[key];
  }
  return CATEGORY_ICONS.default;
}

export default function ConcoursPublic() {
  const [concours, setConcours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFiches, setExpandedFiches] = useState<number | null>(null);

  useEffect(() => {
    api.getConcoursPublic()
      .then(setConcours)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const grouped = concours.reduce<Record<string, any[]>>((acc, c) => {
    (acc[c.categorie] = acc[c.categorie] || []).push(c);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[460px] md:min-h-[520px] flex items-center pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={bg3} alt="" className="w-full h-full object-cover" style={{ filter: "brightness(0.32) saturate(1.2)" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#003B5C]/95 via-[#003B5C]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
        </div>

        {/* Decorative */}
        <div className="absolute top-10 right-0 w-[480px] h-[480px] bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-secondary via-secondary/50 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="h-0.5 w-12 bg-secondary rounded-full" />
                <span className="text-secondary font-body text-xs font-black uppercase tracking-[0.3em]">NGUON 2026</span>
                <div className="h-0.5 w-6 bg-secondary/40 rounded-full" />
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-5">
                Concours{" "}
                <span className="text-secondary">&amp; Défis</span>
                <br />
                <span className="text-white/90">du NGUON</span>
              </h1>

              <p className="font-body text-white/70 text-base md:text-lg leading-relaxed max-w-xl">
                Inscrivez-vous aux différents concours et défis organisés par la Fondation NGUON
                et participez à la célébration du patrimoine culturel Bamoun lors du{" "}
                <span className="text-secondary font-semibold">NGUON 2026</span>.
              </p>

              <div className="flex items-center gap-8 mt-7">
                {[
                  { value: "18+", label: "Concours" },
                  { value: "8", label: "Catégories" },
                  { value: "2026", label: "Édition" },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="font-display text-2xl font-black text-secondary">{s.value}</div>
                    <div className="font-body text-xs text-white/50 uppercase tracking-wider">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: CTA card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex-shrink-0"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center max-w-xs shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center mx-auto mb-4">
                  <Trophy size={28} className="text-secondary" />
                </div>
                <h3 className="font-display text-xl font-black text-white mb-2">Prêt à concourir ?</h3>
                <p className="font-body text-white/60 text-sm mb-6 leading-relaxed">
                  Choisissez vos concours et soumettez votre candidature en quelques étapes.
                </p>
                <button
                  disabled
                  className="group w-full flex items-center justify-center gap-2.5 bg-secondary text-[#003B5C] font-display font-black text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-secondary/30 cursor-not-allowed opacity-80"
                >
                  <PenLine size={16} />
                  M'inscrire à un concours
                </button>
                <p className="font-body text-white/40 text-xs mt-3">Inscription gratuite · NGUON 2026</p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-background" style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }} />
      </section>

      {/* ── CONCOURS LIST ─────────────────────────────────────────────────────── */}
      <section className="section-padding pb-24">
        <div className="container mx-auto max-w-6xl">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-secondary font-body text-xs font-black uppercase tracking-[0.3em] mb-3">
              Découvrez nos concours
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-black text-foreground mb-4">
              Concours &amp; Défis{" "}
              <span className="text-primary">NGUON 2026</span>
            </h2>
            <div className="h-0.5 w-16 bg-secondary rounded-full mx-auto mb-4" />
            <p className="font-body text-muted-foreground text-base max-w-2xl mx-auto leading-relaxed">
              Cliquez sur un concours pour voir ses détails. Chaque participant peut s'inscrire à un ou plusieurs concours.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-2 border-t-primary animate-spin" />
              </div>
              <p className="font-body text-muted-foreground text-sm">Chargement des concours…</p>
            </div>
          ) : concours.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 bg-card rounded-3xl border border-border shadow-sm"
            >
              <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
                <Trophy size={32} className="text-muted-foreground/30" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground/50 mb-2">
                Aucun concours disponible pour le moment
              </h3>
              <p className="font-body text-muted-foreground text-sm max-w-sm mx-auto">
                Revenez bientôt pour découvrir les concours et défis du NGUON 2026.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-14">
              {Object.entries(grouped).map(([cat, items], catIndex) => {
                const CatIcon = getCategoryIcon(cat);
                return (
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: catIndex * 0.04 }}
                  >
                    {/* Category header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-9 h-9 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center flex-shrink-0">
                        <CatIcon size={16} className="text-secondary" />
                      </div>
                      <h2 className="font-display text-sm font-black uppercase tracking-widest text-secondary">
                        {cat}
                      </h2>
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    <div className="space-y-6">
                      {items.map((c, i) => (
                        <ConcoursCard
                          key={c.id}
                          concours={c}
                          index={i}
                          expandedFiches={expandedFiches}
                          setExpandedFiches={setExpandedFiches}
                        />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Bottom static CTA */}
          {concours.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-16 text-center"
            >
              <div className="inline-flex flex-col sm:flex-row items-center gap-5 bg-primary/5 border border-primary/20 rounded-3xl px-8 py-6">
                <div className="text-left">
                  <h3 className="font-display text-lg font-black text-foreground">Prêt à vous inscrire ?</h3>
                  <p className="font-body text-muted-foreground text-sm">Complétez votre fiche de souscription en ligne</p>
                </div>
                <button
                  disabled
                  className="flex items-center gap-2 bg-primary text-white font-display font-black text-sm px-7 py-3.5 rounded-2xl shadow-lg shadow-primary/25 cursor-not-allowed opacity-80 whitespace-nowrap"
                >
                  <PenLine size={15} />
                  M'inscrire maintenant
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ── Concours Card ─────────────────────────────────────────────────────────────
interface ConcoursCardProps {
  concours: any;
  index: number;
  expandedFiches: number | null;
  setExpandedFiches: (id: number | null) => void;
}

function ConcoursCard({ concours: c, index, expandedFiches, setExpandedFiches }: ConcoursCardProps) {
  const hasFiches = c.fichesDescriptives?.length > 0;
  const isFichesOpen = expandedFiches === c.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300"
    >
      {/* ── Top row: thumbnail + title + badge + s'inscrire ── */}
      <div className="flex items-center gap-4 p-5 border-b border-border/50">
        {/* Affiche thumbnail */}
        <div className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border">
          {c.affiche ? (
            c.affiche.toLowerCase().endsWith(".pdf") ? (
              <div className="w-full h-full flex items-center justify-center bg-red-50 dark:bg-red-900/20">
                <FileText size={22} className="text-red-400" />
              </div>
            ) : (
              <img src={fileUrl(c.affiche)} alt={c.sousCategorie} className="w-full h-full object-cover" />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/5">
              <Trophy size={22} className="text-primary/30" />
            </div>
          )}
        </div>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-base md:text-lg text-foreground leading-tight">
            {c.sousCategorie}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="font-body text-xs text-muted-foreground">
              Période : <span className="font-semibold text-foreground/70">{c.periode}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Inscriptions ouvertes
            </span>
          </div>
        </div>

        {/* Static S'inscrire button */}
        <button
          disabled
          className="hidden sm:flex items-center gap-2 bg-secondary text-[#003B5C] font-display font-black text-xs px-4 py-2.5 rounded-xl shadow-sm cursor-not-allowed opacity-85 flex-shrink-0"
        >
          <PenLine size={13} />
          S'inscrire
        </button>
      </div>

      {/* ── Main content: affiche left + PDF right ── */}
      <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border/50">

        {/* LEFT: Full affiche */}
        <div className="p-5">
          <p className="font-body text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <span className="w-4 h-0.5 bg-secondary rounded-full inline-block" />
            Affiche d'annonce
          </p>

          {c.affiche ? (
            <div className="rounded-2xl overflow-hidden border border-border bg-muted/30">
              {c.affiche.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={fileUrl(c.affiche)}
                  className="w-full h-72 border-0"
                  title="affiche"
                />
              ) : (
                <img
                  src={fileUrl(c.affiche)}
                  alt="affiche"
                  className="w-full h-72 object-contain bg-muted/50"
                />
              )}
              <div className="px-4 py-2.5 bg-card border-t border-border/50 flex justify-end">
                <a
                  href={fileUrl(c.affiche)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink size={12} />
                  Voir en plein écran
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-border/60 h-56 flex flex-col items-center justify-center text-muted-foreground/50 gap-2 bg-muted/20">
              <Trophy size={28} className="text-muted-foreground/20" />
              <span className="font-body text-sm">Aucune affiche disponible</span>
            </div>
          )}
        </div>

        {/* RIGHT: Fiches descriptives */}
        <div className="p-5">
          <button
            onClick={() => setExpandedFiches(isFichesOpen ? null : c.id)}
            className="w-full flex items-center justify-between mb-3 group"
          >
            <p className="font-body text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <span className="w-4 h-0.5 bg-secondary rounded-full inline-block" />
              Fiches descriptives
              {hasFiches && (
                <span className="ml-1 font-bold text-primary">({c.fichesDescriptives.length})</span>
              )}
            </p>
            {hasFiches && (
              <motion.div
                animate={{ rotate: isFichesOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-muted-foreground group-hover:text-primary transition-colors"
              >
                <ChevronDown size={16} />
              </motion.div>
            )}
          </button>

          {!hasFiches ? (
            <div className="rounded-2xl border-2 border-dashed border-border/60 h-56 flex flex-col items-center justify-center text-muted-foreground/50 gap-2 bg-muted/20">
              <FileText size={28} className="text-muted-foreground/20" />
              <span className="font-body text-sm">Aucune fiche disponible</span>
            </div>
          ) : isFichesOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {c.fichesDescriptives.map((f: any) => (
                <div key={f.id} className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
                  <div className="h-52 bg-muted/50">
                    <iframe
                      src={fileUrl(f.fichierPdf)}
                      className="w-full h-full border-0"
                      title={f.titre}
                    />
                  </div>
                  <div className="flex items-center gap-2.5 px-4 py-2.5 bg-card border-t border-border/50">
                    <FileText size={14} className="text-red-400 flex-shrink-0" />
                    <span className="flex-1 font-body text-sm font-semibold text-foreground truncate">{f.titre}</span>
                    <a
                      href={fileUrl(f.fichierPdf)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors flex-shrink-0"
                    >
                      <ExternalLink size={12} />
                      Ouvrir
                    </a>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            /* Preview first fiche when collapsed */
            <div
              className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm cursor-pointer group"
              onClick={() => setExpandedFiches(c.id)}
            >
              <div className="h-52 bg-muted/50 relative">
                <iframe
                  src={fileUrl(c.fichesDescriptives[0].fichierPdf)}
                  className="w-full h-full border-0 pointer-events-none"
                  title={c.fichesDescriptives[0].titre}
                />
                {c.fichesDescriptives.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    +{c.fichesDescriptives.length - 1} fiche(s)
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity font-body text-xs font-bold text-white bg-black/50 px-3 py-1.5 rounded-full">
                    Voir toutes les fiches
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-card border-t border-border/50">
                <FileText size={14} className="text-red-400 flex-shrink-0" />
                <span className="flex-1 font-body text-sm font-semibold text-foreground truncate">
                  {c.fichesDescriptives[0].titre}
                </span>
                <a
                  href={fileUrl(c.fichesDescriptives[0].fichierPdf)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors flex-shrink-0"
                >
                  <ExternalLink size={12} />
                  Ouvrir
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile S'inscrire ── */}
      <div className="sm:hidden px-5 pb-5">
        <button
          disabled
          className="w-full flex items-center justify-center gap-2 bg-secondary text-[#003B5C] font-display font-black text-sm px-4 py-3 rounded-xl shadow-sm cursor-not-allowed opacity-85"
        >
          <PenLine size={14} />
          S'inscrire à ce concours
        </button>
      </div>
    </motion.div>
  );
}
