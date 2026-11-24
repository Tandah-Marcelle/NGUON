import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, Search, MousePointerClick, Mail, ShieldCheck, RefreshCw, X, ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { VoteModal, VoteImageLightbox, type VoteProfile } from "@/components/vote/VoteModal";
import { cleanText, displayName } from "@/lib/voteText";
import heroBg from "@/assets/dance-performance.jpg";
import { NdopTexture } from "@/components/heritage/Motif";

const photoOf = (p: VoteProfile) => p.photoPresignedUrl ?? p.photoUrl;
const pageUrl = () => `${window.location.origin}/vote`;
const profileUrl = (id: number) => `${window.location.origin}/vote/${id}`;
const fold = (s: string) => s.normalize("NFKD").replace(/\p{Diacritic}/gu, "").toLowerCase();

// Native share sheet on phones (straight into WhatsApp etc.), clipboard elsewhere.
async function share(url: string, text: string, copied: string, failed: string) {
  if (navigator.share) {
    try {
      await navigator.share({ title: text, text, url });
      return;
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    toast.success(copied);
  } catch {
    toast.error(failed);
  }
}

export default function VotePage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [profiles, setProfiles] = useState<VoteProfile[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [query, setQuery] = useState("");
  const [voteTarget, setVoteTarget] = useState<VoteProfile | null>(null);
  const [lightbox, setLightbox] = useState<VoteProfile | null>(null);

  const load = () => {
    setStatus("loading");
    api.getVoteProfiles()
      .then((data: VoteProfile[]) => {
        setProfiles(data.map((p) => ({ ...p, name: displayName(p.name), description: p.description && cleanText(p.description).trim() })));
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    document.title = `${t("vote.page_title")} — Nguon`;
  }, [t]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [id]);

  const spotlight = useMemo(
    () => (id ? profiles.find((p) => String(p.id) === id) ?? null : null),
    [id, profiles],
  );

  // Candidate link: hold the spotlight layout while loading; an unknown id falls back to the general page.
  const showSpotlight = Boolean(id) && (status === "loading" || spotlight !== null);

  const filtered = useMemo(() => {
    const q = fold(query.trim());
    return q ? profiles.filter((p) => fold(`${p.name} ${p.description ?? ""}`).includes(q)) : profiles;
  }, [profiles, query]);

  const sharePage = () => share(pageUrl(), t("vote.share_page_text"), t("vote.share_copied"), t("vote.error_generic"));
  const shareProfile = (p: VoteProfile) =>
    share(profileUrl(p.id), t("vote.share_profile_text", { name: p.name }), t("vote.share_copied"), t("vote.error_generic"));

  const steps = [
    { icon: MousePointerClick, title: t("vote.step1_title"), desc: t("vote.step1_desc") },
    { icon: Mail, title: t("vote.step2_title"), desc: t("vote.step2_desc") },
    { icon: ShieldCheck, title: t("vote.step3_title"), desc: t("vote.step3_desc") },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ── Hero: a candidate's personal link opens straight on that candidate ── */}
      <section className={`relative overflow-hidden bg-navy ${showSpotlight ? "pt-24 pb-20 md:pt-32 md:pb-24" : "pt-28 pb-24 md:pt-36 md:pb-28"}`}>
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/55 via-navy/60 to-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--navy)/0.55),transparent_70%)]" />
        <NdopTexture opacity={0.07} fade="bottom" />

        {showSpotlight ? (
          <div className="container mx-auto px-4 relative z-10 max-w-5xl">
            {!spotlight ? (
              <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden md:flex">
                <div className="h-[46vh] md:h-auto md:w-96 md:aspect-[4/5] bg-white/10 animate-pulse" />
                <div className="p-6 md:p-10 flex-1 space-y-4">
                  <div className="h-3 w-40 rounded bg-white/10 animate-pulse" />
                  <div className="h-9 w-3/4 rounded bg-white/10 animate-pulse" />
                  <div className="h-14 w-full md:w-72 rounded-2xl bg-white/10 animate-pulse" />
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl border border-secondary/40 bg-card shadow-2xl shadow-black/30 overflow-hidden md:flex"
              >
                <button
                  onClick={() => setLightbox(spotlight)}
                  aria-label={spotlight.name}
                  className="relative block w-full h-[46vh] md:h-auto md:w-96 md:aspect-[4/5] flex-shrink-0 bg-muted overflow-hidden"
                >
                  <img src={photoOf(spotlight)} alt={spotlight.name} className="absolute inset-0 w-full h-full object-cover object-top" />
                </button>
                <div className="p-6 md:p-10 flex flex-col justify-center min-w-0">
                  <p className="font-body text-sm text-muted-foreground mb-1">{t("vote.spotlight_eyebrow")}</p>
                  <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-foreground leading-tight text-balance">{spotlight.name}</h1>
                  <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setVoteTarget(spotlight)}
                      className="inline-flex items-center justify-center gap-2 bg-secondary text-navy font-display font-black px-7 py-4 rounded-2xl shadow-lg shadow-secondary/30 hover:bg-secondary/90 active:scale-[0.98] transition"
                    >
                      <Heart size={18} className="fill-current flex-shrink-0" />
                      <span className="truncate">{t("vote.vote_button")}</span>
                    </button>
                    <button
                      onClick={() => shareProfile(spotlight)}
                      className="inline-flex items-center justify-center gap-2 border border-border font-display font-bold text-foreground px-6 py-4 rounded-2xl hover:bg-muted active:scale-[0.98] transition"
                    >
                      <Share2 size={16} /> {t("vote.share")}
                    </button>
                  </div>
                  {spotlight.description && (
                    <p className="mt-6 text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">{spotlight.description}</p>
                  )}
                  <a href="#candidats" className="mt-5 text-sm font-bold text-primary hover:text-secondary transition-colors">
                    {t("vote.see_all")} ↓
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="container mx-auto px-4 relative z-10 max-w-5xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] text-balance"
            >
              {t("vote.page_title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-4 text-white/75 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed"
            >
              {t("vote.page_desc")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <a
                href="#candidats"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-secondary text-navy font-display font-black text-sm px-7 py-3.5 rounded-2xl shadow-lg shadow-secondary/30 hover:bg-secondary/90 active:scale-[0.98] transition"
              >
                {t("vote.home_cta_button")} <ArrowDown size={16} />
              </a>
              <button
                onClick={sharePage}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 border border-white/25 bg-white/10 backdrop-blur text-white font-display font-bold text-sm px-6 py-3.5 rounded-2xl hover:bg-white/15 active:scale-[0.98] transition"
              >
                <Share2 size={16} /> {t("vote.share_page")}
              </button>
            </motion.div>

            {/* How it works */}
            <motion.ol
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 grid grid-cols-3 gap-2 sm:gap-4 text-left"
            >
              {steps.map((s, i) => (
                <li key={s.title} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-3 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-secondary/15 border border-secondary/30 flex items-center justify-center flex-shrink-0">
                      <s.icon size={17} className="text-secondary" />
                    </div>
                    <p className="font-display text-xs sm:text-sm font-black text-white leading-tight">
                      <span className="text-secondary mr-1">{i + 1}.</span>{s.title}
                    </p>
                  </div>
                  <p className="hidden sm:block mt-2.5 text-xs text-white/60 leading-relaxed">{s.desc}</p>
                </li>
              ))}
            </motion.ol>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-12 md:h-16 bg-background" style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }} />
      </section>

      {/* ── Candidates ── */}
      <section id="candidats" className="container mx-auto px-4 max-w-6xl pb-24 scroll-mt-28">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-black text-foreground">{t("vote.all_candidates")}</h2>
            {status === "ready" && profiles.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">{t("vote.candidates_count", { count: profiles.length })}</p>
            )}
          </div>
          {status === "ready" && profiles.length > 6 && (
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("vote.search_placeholder")}
                className="w-full rounded-2xl border border-input bg-card pl-10 pr-10 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Effacer"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}
        </div>

        {status === "loading" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-border bg-card">
                <div className="aspect-[4/5] bg-muted animate-pulse" />
                <div className="p-3 sm:p-4"><div className="h-10 rounded-xl bg-muted animate-pulse" /></div>
              </div>
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-20 rounded-3xl border border-border bg-card">
            <p className="font-display font-bold text-foreground">{t("vote.load_error")}</p>
            <button
              onClick={load}
              className="mt-5 inline-flex items-center gap-2 bg-primary text-white font-bold text-sm px-6 py-3 rounded-2xl hover:bg-primary/90 transition"
            >
              <RefreshCw size={15} /> {t("vote.retry")}
            </button>
          </div>
        )}

        {status === "ready" && profiles.length === 0 && (
          <div className="text-center py-20 rounded-3xl border border-border bg-card">
            <div className="w-16 h-16 rounded-2xl bg-secondary/15 flex items-center justify-center mx-auto mb-4">
              <Heart size={26} className="text-secondary" />
            </div>
            <h3 className="font-display text-xl font-black text-foreground">{t("vote.empty_title")}</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">{t("vote.empty_desc")}</p>
            <Link to="/" className="mt-6 inline-block text-sm font-bold text-primary hover:text-secondary">← Nguon</Link>
          </div>
        )}

        {status === "ready" && profiles.length > 0 && filtered.length === 0 && (
          <p className="text-center py-16 text-muted-foreground">{t("vote.no_results", { q: query })}</p>
        )}

        {status === "ready" && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filtered.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: Math.min(i % 4, 3) * 0.05 }}
                className={`group relative rounded-2xl overflow-hidden border bg-card flex flex-col shadow-sm hover:shadow-xl transition-shadow ${
                  spotlight?.id === p.id ? "border-secondary ring-2 ring-secondary/40" : "border-border"
                }`}
              >
                <button
                  onClick={() => setLightbox(p)}
                  className="relative aspect-[4/5] bg-muted overflow-hidden text-left"
                  aria-label={p.name}
                >
                  <img
                    src={photoOf(p)} alt={p.name} loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                    <p className="font-display font-black text-white text-sm sm:text-base leading-tight line-clamp-2">{p.name}</p>
                  </div>
                </button>
                <button
                  onClick={() => shareProfile(p)}
                  title={t("vote.share")}
                  aria-label={t("vote.share")}
                  className="absolute top-2 right-2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                >
                  <Share2 size={15} />
                </button>
                <div className="p-2.5 sm:p-3.5">
                  <button
                    onClick={() => setVoteTarget(p)}
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-secondary text-navy font-display font-black text-sm py-2.5 sm:py-3 rounded-xl hover:bg-secondary/90 active:scale-[0.97] transition"
                  >
                    <Heart size={15} className="fill-current" /> {t("vote.vote_button")}
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      <Footer />

      <AnimatePresence>
        {voteTarget && (
          <VoteModal
            profile={voteTarget}
            onClose={() => setVoteTarget(null)}
            onVoted={() =>
              setProfiles((prev) => prev.map((p) => (p.id === voteTarget.id ? { ...p, voteCount: p.voteCount + 1 } : p)))
            }
          />
        )}
        {lightbox && <VoteImageLightbox profile={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>
  );
}
