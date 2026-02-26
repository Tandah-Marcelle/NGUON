import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation, Trans } from "react-i18next";
import AnimatedSection from "./AnimatedSection";
import { api } from "@/lib/api";

const SitesSection = () => {
  const { t } = useTranslation();
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allImages, setAllImages] = useState<string[]>([]);

  useEffect(() => {
    const loadSites = async () => {
      try {
        const data = await api.getSites();
        const publishedSites = data.filter((site: any) => site.published);
        setSites(publishedSites);
        const images = publishedSites
          .map((site: any) => site.image)
          .filter(Boolean)
          .map((img: string) => api.getMediaViewUrl(img));
        setAllImages(images);
      } catch (error) {
        console.error('Failed to load sites:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSites();
  }, []);

  useEffect(() => {
    if (allImages.length === 0) return;
    if (allImages.length === 1) {
      setBottomIndex(0);
      return;
    }
    setBottomIndex(1);
    const interval1 = setInterval(() => setTopIndex((i) => (i + 1) % allImages.length), 6000);
    const timeout = setTimeout(() => {
      const interval2 = setInterval(() => setBottomIndex((i) => (i + 1) % allImages.length), 6000);
      return () => clearInterval(interval2);
    }, 3000);
    return () => { clearInterval(interval1); clearTimeout(timeout); };
  }, [allImages]);
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
              sites.map((site, i) => (
                <AnimatedSection key={site.id} delay={i * 0.1}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ x: 8 }}
                    className="group bg-white dark:bg-card rounded-2xl p-8 shadow-sm border-l-4 border-secondary transition-all duration-300 hover:bg-primary hover:shadow-2xl hover:border-l-secondary"
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
              ))
            )}
          </div>

          {allImages.length > 0 && (
            <div className="space-y-6">
              <AnimatedSection direction="right">
                <div className="rounded-2xl overflow-hidden shadow-lg relative h-[350px]">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={topIndex}
                      src={allImages[topIndex]}
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
              {allImages.length > 1 && (
                <AnimatedSection direction="right" delay={0.2}>
                  <div className="rounded-2xl overflow-hidden shadow-lg relative h-[300px]">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={bottomIndex}
                        src={allImages[bottomIndex]}
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
