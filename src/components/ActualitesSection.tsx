import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import AnimatedSection from "./AnimatedSection";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { pageCache } from "@/lib/pageCache";
import LazyMedia from "@/components/LazyMedia";
import { X, Play, ChevronLeft, ChevronRight, Share2, Check } from "lucide-react";
import { useTranslate } from "@/hooks/useTranslate";

const PROTECTED_TERMS = ['Nguon', 'Sha\u2019Pam', 'Nchar\u00e9 Yen', 'Bamoun', 'Foumban', 'NGUON'];

const protectTerms = (text: string) => {
  let protectedText = text;
  PROTECTED_TERMS.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    protectedText = protectedText.replace(regex, `<span class="notranslate">${term}</span>`);
  });
  return protectedText;
};

const getShareUrl = (id: number) =>
  `${window.location.origin}/api/actualities/preview/${id}`;

const ShareButton = ({ item, stopPropagation = false }: { item: any; stopPropagation?: boolean }) => {
  const [copied, setCopied] = useState(false);
  const handleShare = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    navigator.clipboard.writeText(getShareUrl(item.id));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleShare}
      title="Copy share link"
      className="p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors"
    >
      {copied ? <Check size={16} className="text-green-500" /> : <Share2 size={16} />}
    </button>
  );
};

const NewsCard = ({ item, index, isVideo, setSelectedItem }: any) => {
  const protectedTitle = useMemo(() => protectTerms(item.title), [item.title]);
  const protectedDesc = useMemo(() => protectTerms(item.description), [item.description]);
  const { translatedText: title } = useTranslate(protectedTitle);
  const { translatedText: description } = useTranslate(protectedDesc);

  return (
    <AnimatedSection key={item.id} delay={index * 0.1}>
      <motion.div
        whileHover={{ y: -8 }}
        onClick={() => setSelectedItem({ ...item, translatedTitle: title, translatedDescription: description })}
        className="bg-white dark:bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/50 cursor-pointer"
      >
        <div className="relative h-64 overflow-hidden">
          {isVideo(item.media) ? (
            <>
              <LazyMedia
                presignedUrl={item.presignedUrl}
                rawPath={item.media}
                type="video"
                className="w-full h-full"
                videoProps={{ className: "w-full h-full object-cover" }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="bg-white/90 rounded-full p-4">
                  <Play size={28} className="text-primary fill-primary" />
                </div>
              </div>
            </>
          ) : (
            <LazyMedia
              presignedUrl={item.presignedUrl}
              rawPath={item.media}
              alt={item.title}
              className="w-full h-full"
              imgProps={{ className: "w-full h-full object-cover transition-transform duration-500 hover:scale-110" }}
            />
          )}
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="font-display text-xl font-bold text-foreground" dangerouslySetInnerHTML={{ __html: title }} />
            <div onClick={(e) => e.stopPropagation()}>
              <ShareButton item={item} />
            </div>
          </div>
          <p className="text-muted-foreground font-body text-sm leading-relaxed line-clamp-3" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      </motion.div>
    </AnimatedSection>
  );
};

const ActualitesSection = () => {
  const { t } = useTranslation();
  const [actualites, setActualities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 3;

  const isVideo = (filename: string) => /\.(mp4|webm|ogg)$/i.test(filename);

  // Capture the ?news param immediately on mount before anything clears it
  const initialNewsId = new URLSearchParams(window.location.search).get('news');

  // Update OG meta tags for rich social previews (only when selectedItem changes to a value)
  useEffect(() => {
    if (!selectedItem) return;
    const imageUrl = selectedItem.presignedUrl ?? api.getMediaViewUrl(selectedItem.media);
    const setMeta = (prop: string, content: string, attr = 'property') => {
      let el = document.querySelector(`meta[${attr}='${prop}']`) as HTMLMetaElement;
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, prop); document.head.appendChild(el); }
      el.content = content;
    };
    document.title = `${selectedItem.title} \u2014 NGUON`;
    setMeta('og:title', selectedItem.title);
    setMeta('og:description', selectedItem.description.slice(0, 200));
    setMeta('og:image', imageUrl);
    setMeta('og:url', getShareUrl(selectedItem.id));
    setMeta('twitter:title', selectedItem.title, 'name');
    setMeta('twitter:description', selectedItem.description.slice(0, 200), 'name');
    setMeta('twitter:image', imageUrl, 'name');
    window.history.replaceState(null, '', `?news=${selectedItem.id}`);
  }, [selectedItem]);

  useEffect(() => {
    const loadActualities = async () => {
      const cached = pageCache.get<any[]>('actualities');
      if (cached) {
        const published = cached;
        setActualities(published);
        setLoading(false);
        return;
      }
      try {
        const data = await api.getActualities();
        const byRecency = (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        const published = [
          ...data.filter((a: any) => a.published && isVideo(a.media)).sort(byRecency),
          ...data.filter((a: any) => a.published && !isVideo(a.media)).sort(byRecency),
        ];
        pageCache.set('actualities', published);
        setActualities(published);
      } catch (error) {
        console.error('Failed to load actualities:', error);
      } finally {
        setLoading(false);
      }
    };
    loadActualities();
  }, []);

  // Auto-open news item from URL param ?news=ID
  useEffect(() => {
    if (loading || actualites.length === 0 || !initialNewsId) return;
    const found = actualites.find((a) => String(a.id) === initialNewsId);
    if (found) {
      setSelectedItem(found);
      setTimeout(() => {
        document.getElementById('actualites')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [loading, actualites]);

  const totalPages = Math.ceil(actualites.length / PAGE_SIZE);
  const paged = actualites.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  if (loading) {
    return (
      <section className="section-padding bg-background">
        <div className="container mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </section>
    );
  }

  if (actualites.length === 0) return null;

  return (
    <section id="actualites" className="section-padding bg-background">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('actualites.title')}
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            {t('actualites.description')}
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paged.map((item, index) => (
            <NewsCard
              key={item.id}
              item={item}
              index={index}
              isVideo={isVideo}
              setSelectedItem={setSelectedItem}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 rounded-full border border-border disabled:opacity-30 hover:bg-muted transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-muted-foreground">{page + 1} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-2 rounded-full border border-border disabled:opacity-30 hover:bg-muted transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-card rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="relative">
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <ShareButton item={selectedItem} stopPropagation />
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="relative bg-black/5 dark:bg-black/40 flex items-center justify-center">
                  {isVideo(selectedItem.media) ? (
                    <LazyMedia
                      presignedUrl={selectedItem.presignedUrl}
                      rawPath={selectedItem.media}
                      type="video"
                      className="w-full h-96"
                      videoProps={{ className: "w-full h-full object-cover", controls: true }}
                    />
                  ) : (
                    <LazyMedia
                      presignedUrl={selectedItem.presignedUrl}
                      rawPath={selectedItem.media}
                      alt={selectedItem.title}
                      className="w-full flex items-center justify-center"
                      imgProps={{ className: "w-full max-h-[70vh] object-contain" }}
                    />
                  )}
                </div>
                <div className="p-8">
                  <h2 className="font-display text-3xl font-bold text-foreground mb-4" dangerouslySetInnerHTML={{ __html: selectedItem.translatedTitle || selectedItem.title }} />
                  <p className="text-muted-foreground font-body text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedItem.translatedDescription || selectedItem.description }} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ActualitesSection;
