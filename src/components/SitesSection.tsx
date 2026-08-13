import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation, Trans } from "react-i18next";
import AnimatedSection from "./AnimatedSection";
import { api } from "@/lib/api";
import { pageCache } from "@/lib/pageCache";

const SitesSection = () => {
  const { t } = useTranslation();
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [topImages, setTopImages] = useState<string[]>([]);
  const [bottomImages, setBottomImages] = useState<string[]>([]);
  const [hoveredSite, setHoveredSite] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadSites = async () => {
      const cached = pageCache.get<any[]>('sites');
      if (cached) {
        setSites(cached);
        const images = cached
          .map((site: any) => site.presignedUrl ?? (site.image ? api.getMediaViewUrl(site.image) : null))
          .filter(Boolean) as string[];
        setAllImages(images);
        images.forEach((src: string) => {
          const img = new Image(); img.src = src;
          img.onload = () => setLoadedImages(prev => new Set(prev).add(src));
        });
        const half = Math.ceil(images.length / 2);
        setTopImages(images.slice(0, half));
        setBottomImages(images.slice(half));
        setLoading(false);
        return;
      }
      try {
        const data = await api.getSites();
        const publishedSites = data.filter((site: any) => site.published);
        pageCache.set('sites', publishedSites);
        setSites(publishedSites);
        const images = publishedSites
          .map((site: any) => site.presignedUrl ?? (site.image ? api.getMediaViewUrl(site.image) : null))
          .filter(Boolean) as string[];
        setAllImages(images);
        images.forEach((src: string) => {
          const img = new Image(); img.src = src;
          img.onload = () => setLoadedImages(prev => new Set(prev).add(src));
        });
        const half = Math.ceil(images.length / 2);
        setTopImages(images.slice(0, half));
        setBottomImages(images.slice(half));
      } catch (error) {
        console.error('Failed to load sites:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSites();
  }, []);

  useEffect(() => {
    if (topImages.length === 0 || hoveredSite !== null) return;
    const interval = setInterval(() => setTopIndex((i) => (i + 1) % topImages.length), 8000);
    return () => clearInterval(interval);
  }, [topImages, hoveredSite]);

  useEffect(() => {
    if (bottomImages.length === 0 || hoveredSite !== null) return;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => setBottomIndex((i) => (i + 1) % bottomImages.length), 8000);
      return () => clearInterval(interval);
    }, 4000);
    return () => clearTimeout(timeout);
  }, [bottomImages, hoveredSite]);
  return (
    <section id="sites" className="section-padding bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
      {/* Soft decorative overlay */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="text-center mb-16">
          <p className="text-secondary font-body text-sm uppercase tracking-[0.3em] mb-4 font-semibold"></p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            <Trans i18nKey="sites.title" components={{ 0: <span className="text-primary" /> }} />
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            {t('sites.description')}
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : sites.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-card rounded-2xl p-8">
                <p className="text-muted-foreground font-body text-lg">{t('sites.no_sites')}</p>
              </div>
            ) : (
              sites.map((site, i) => {
                const siteImageIndex = sites.findIndex(s => s.id === site.id);
                return (
                  <AnimatedSection key={site.id} delay={i * 0.1}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      whileHover={{ x: 8 }}
                      onMouseEnter={() => setHoveredSite(siteImageIndex)}
                      onMouseLeave={() => setHoveredSite(null)}
                      className="group bg-white dark:bg-card rounded-2xl p-8 shadow-sm border-l-4 border-secondary transition-all duration-300 hover:bg-primary hover:shadow-2xl hover:border-l-secondary cursor-pointer"
                    >
                      <h3 className="font-display text-2xl font-bold text-foreground mb-4 transition-colors duration-300 group-hover:text-white">
                        {site.townTitle}
                      </h3>
                      <ul className="space-y-3">
                        {site.subTownTitles?.map((item: string, idx: number) => (
                          <li key={idx} className="text-muted-foreground font-body text-sm flex items-start gap-3 transition-colors duration-300 group-hover:text-white/90">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0 transition-colors duration-300 group-hover:bg-white" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </AnimatedSection>
                );
              })
            )}
          </div>

          {allImages.length > 0 && (
            <div className="space-y-6">
              {topImages.length > 0 && (
                <AnimatedSection direction="right">
                  <div className="rounded-2xl overflow-hidden shadow-lg relative h-[350px]">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={hoveredSite !== null && hoveredSite < topImages.length ? `hovered-${hoveredSite}` : topIndex}
                        src={hoveredSite !== null && hoveredSite < topImages.length ? allImages[hoveredSite] : topImages[topIndex]}
                        alt="Site image"
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ duration: 1.2 }}
                        className="w-full h-full object-cover absolute"
                      />
                    </AnimatePresence>
                  </div>
                </AnimatedSection>
              )}
              {bottomImages.length > 0 && (
                <AnimatedSection direction="right" delay={0.2}>
                  <div className="rounded-2xl overflow-hidden shadow-lg relative h-[300px]">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={hoveredSite !== null && hoveredSite >= topImages.length ? `hovered-${hoveredSite}` : bottomIndex}
                        src={hoveredSite !== null && hoveredSite >= topImages.length ? allImages[hoveredSite] : bottomImages[bottomIndex]}
                        alt="Site image"
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ duration: 1.2 }}
                        className="w-full h-full object-cover absolute"
                      />
                    </AnimatePresence>
                  </div>
                </AnimatedSection>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SitesSection;
