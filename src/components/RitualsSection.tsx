import { useState, useEffect } from "react";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./heritage/SectionHeading";
import { NdopTexture } from "./heritage/Motif";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { pageCache } from "@/lib/pageCache";
import LazyMedia from "@/components/LazyMedia";

const RitualItem = ({ activity, i, activeIndex, setActiveIndex, setIsHovered }: any) => {
  const active = activeIndex === i;
  return (
    <motion.li
      initial={{ opacity: 0, x: -14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        onMouseEnter={() => { setActiveIndex(i); setIsHovered(true); }}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => { setActiveIndex(i); setIsHovered(true); }}
        onBlur={() => setIsHovered(false)}
        onClick={() => setActiveIndex(i)}
        aria-pressed={active}
        className={`w-full text-left flex gap-4 items-start px-4 py-4 rounded-xl transition-colors duration-300 ${
          active ? "bg-white/10" : "hover:bg-white/5"
        }`}
      >
        <span className={`font-display text-xl font-black tabular-nums flex-shrink-0 w-8 transition-colors ${active ? "text-secondary" : "text-white/35"}`}>
          {String(activity.displayOrder).padStart(2, "0")}
        </span>
        <span>
          <span className={`block font-display text-base md:text-lg font-black transition-colors ${active ? "text-white" : "text-white/85"}`}>{activity.name}</span>
          <span className={`mt-1 font-body text-sm leading-relaxed transition-colors ${active ? "block text-white/75" : "hidden md:block text-white/50"}`}>{activity.description}</span>
        </span>
      </button>
    </motion.li>
  );
};

const RitualsSection = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      const cached = pageCache.get<any[]>('activities');
      if (cached) { setActivities(cached); setLoading(false); return; }
      try {
        const data = await api.getActivities();
        const published = data
          .filter((activity: any) => activity.published)
          .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
        pageCache.set('activities', published);
        setActivities(published);
      } catch (error) {
        console.error('Failed to load activities:', error);
      } finally {
        setLoading(false);
      }
    };
    loadActivities();
  }, []);

  useEffect(() => {
    if (activities.length === 0) return;
    const interval = setInterval(() => {
      if (!isHovered) {
        setActiveIndex((prev) => (prev + 1) % activities.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered, activities.length]);

  return (
    <section id="rituals" className="section-padding bg-navy text-white overflow-hidden relative">
      <NdopTexture opacity={0.06} fade="edges" />
      <div className="container mx-auto relative z-10">
        <SectionHeading tone="light" title={t('rituals.title')} lead={t('rituals.description')} />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Rituals */}
          <div>
            <AnimatedSection>
              <h3 className="font-display text-2xl md:text-3xl font-black text-white mb-5">
                {t('rituals.governance_title')}
              </h3>
            </AnimatedSection>
            <ul className="space-y-1">
              {loading ? (
                <li className="space-y-2">
                  {Array.from({ length: 5 }).map((_, k) => <div key={k} className="h-16 rounded-xl bg-white/5 animate-pulse" />)}
                </li>
              ) : activities.length === 0 ? (
                <li className="py-10 text-white/60 font-body">{t('rituals.no_activities')}</li>
              ) : (
                activities.map((activity, i) => (
                  <RitualItem
                    key={activity.id}
                    activity={activity}
                    i={i}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    setIsHovered={setIsHovered}
                  />
                ))
              )}
            </ul>
          </div>

          {/* Villages & Image */}
          <div className="lg:sticky lg:top-28">
            <AnimatedSection direction="right">
              <div className="relative h-[320px] md:h-[420px] mb-10 group">
                {activities.length > 0 && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-2xl overflow-hidden shadow-[0_30px_60px_-25px_rgba(0,0,0,0.7)] ring-1 ring-white/15"
                    >
                      <LazyMedia
                        presignedUrl={activities[activeIndex].presignedUrl}
                        rawPath={activities[activeIndex].image}
                        alt={activities[activeIndex].name}
                        className="w-full h-full"
                        imgProps={{
                          className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        }}
                      />
                      {/* Caption Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-6 pt-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                        <p className="text-white font-display text-xl font-bold">{activities[activeIndex].name}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2}>
              <h3 className="font-display text-2xl md:text-3xl font-black text-white mb-5">
                {t('rituals.villages_title')}
              </h3>
            </AnimatedSection>
            <ul className="flex flex-wrap gap-2.5">
              {(t('rituals.villages', { returnObjects: true }) as string[]).map((v, i) => (
                <motion.li
                  key={v}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-body text-sm text-white/85"
                >
                  <span className="w-1.5 h-1.5 rotate-45 bg-secondary" />
                  {v}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RitualsSection;
