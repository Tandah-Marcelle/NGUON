import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useTranslation, Trans } from "react-i18next";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./heritage/SectionHeading";
import { TextileFrame } from "./heritage/Motif";
import { api } from "@/lib/api";
import { pageCache } from "@/lib/pageCache";

const SitesSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
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
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => setBottomIndex((i) => (i + 1) % bottomImages.length), 8000);
    }, 4000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [bottomImages, hoveredSite]);
  return (
    <section ref={sectionRef} id="sites" className="section-padding bg-background relative overflow-hidden">

      <div className="container mx-auto relative z-10">
        <SectionHeading
          title={<Trans i18nKey="sites.title" components={{ 0: <span className="text-primary" /> }} />}
          lead={t('sites.description')}
        />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="border-t border-foreground/10">
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
                      onMouseEnter={() => setHoveredSite(siteImageIndex)}
                      onMouseLeave={() => setHoveredSite(null)}
                      className="group border-b border-foreground/10 px-1 py-6 md:px-5 transition-colors duration-300 hover:bg-paper cursor-pointer rounded-xl"
                    >
                      <h3 className="flex items-center gap-3 font-display text-xl md:text-2xl font-black text-foreground mb-3 transition-colors duration-300 group-hover:text-primary">
                        <span className="w-2.5 h-2.5 rotate-45 bg-secondary flex-shrink-0 transition-transform duration-300 group-hover:rotate-[225deg]" />
                        {site.townTitle}
                      </h3>
                      <ul className="space-y-2 pl-6">
                        {site.subTownTitles?.map((item: string, idx: number) => (
                          <li key={idx} className="text-foreground/70 font-body text-sm leading-relaxed flex items-start gap-3">
                            <span className="w-1 h-1 rounded-full bg-foreground/40 mt-2 flex-shrink-0" />
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
            <div className="space-y-8">
              {topImages.length > 0 && (
                <AnimatedSection direction="right">
                  <TextileFrame side="right">
                  <div className="relative h-[300px] md:h-[360px] bg-muted">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={hoveredSite !== null && hoveredSite < topImages.length ? `hovered-${hoveredSite}` : topIndex}
                        src={inView ? (hoveredSite !== null && hoveredSite < topImages.length ? allImages[hoveredSite] : topImages[topIndex]) : undefined}
                        alt="Site image"
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ duration: 1.2 }}
                        className="w-full h-full object-cover absolute"
                      />
                    </AnimatePresence>
                  </div>
                  </TextileFrame>
                </AnimatedSection>
              )}
              {bottomImages.length > 0 && (
                <AnimatedSection direction="right" delay={0.2}>
                  <div className="rounded-2xl overflow-hidden shadow-[0_22px_45px_-20px_rgba(0,30,50,0.45)] relative h-[240px] md:h-[280px] bg-muted">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={hoveredSite !== null && hoveredSite >= topImages.length ? `hovered-${hoveredSite}` : bottomIndex}
                        src={inView ? (hoveredSite !== null && hoveredSite >= topImages.length ? allImages[hoveredSite] : bottomImages[bottomIndex]) : undefined}
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
