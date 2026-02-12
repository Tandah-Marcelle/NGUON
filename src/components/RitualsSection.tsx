import { useRef, useState, useEffect } from "react";
import AnimatedSection from "./AnimatedSection";
import LottieAnimation from "./LottieAnimation";
import { AnimatePresence, motion } from "framer-motion";

// Assets
import dancePerformance from "@/assets/dance-performance.jpg";
import cultureCeremony from "@/assets/culture-ceremony.jpg";
import cultureCeremony1 from "@/assets/culture-ceremony1.jpg";
import warrior from "@/assets/Monument_de_guerrier_au_sultanat_de_Foumban.jpeg";
import palaceInterior from "@/assets/palace-interior.jpg";
import artisan from "@/assets/artisan.jpg";
import palaceExterior from "@/assets/Le-Palais-du-sultan-de-Foumban-au-Cameroun.jpg";
import aiFlowAnimation from "@/assets/ai animation Flow 1.json";

const rituals = [
  { name: "Ka'Nguon", desc: "Rituel d'Annonce officiel du lancement du Nguon", image: cultureCeremony },
  { name: "Nyam Nguon", desc: "Rituel d'offrandes au Monarque", image: cultureCeremony1 },
  { name: "Shi'rum", desc: "Rituel de collecte des doléances", image: warrior },
  { name: "Nyi Nguon", desc: "Rituel d'entrée solennelle de la société secrète au Palais", image: palaceInterior },
  { name: "Sha'Pam", desc: "Rituel de la pharmacopée traditionnelle", image: artisan },
  { name: "Kem Mfon", desc: "Rituel du jugement du Monarque", image: palaceExterior },
  { name: "Fit Nkindi & Sho'Melue", desc: "Rituel de marche et tambour d'appel", image: dancePerformance },
];

const villages = [
  "Village des bâtisseurs", "Village artisanal", "Village gastronomique",
  "Village des jeux et loisirs", "Village des communautés / UNESCO",
  "Village social et humanitaire", "Village campement", "Village Agropastoral et sylvicole",
];

const RitualsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % rituals.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="programme" className="section-padding bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden relative">
      {/* Soft decorative elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      {/* AI Flow Lottie Animation */}
      <motion.div
        initial={{ opacity: 0, rotate: -10 }}
        whileInView={{ opacity: 0.1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
        className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none z-0"
      >
        <LottieAnimation
          animationData={aiFlowAnimation}
          loop={true}
        />
      </motion.div>

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="text-center mb-16">
          <p className="text-secondary font-body text-sm uppercase tracking-[0.3em] mb-4 font-semibold">Traditions ancestrales</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Rituels & actualités
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            Un programme riche en cérémonies et activités culturelles
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Rituals */}
          <div>
            <AnimatedSection>
              <h3 className="font-display text-3xl font-bold text-foreground mb-8">
                Rituels de Gouvernance
              </h3>
            </AnimatedSection>
            <div className="space-y-3">
              {rituals.map((r, i) => (
                <AnimatedSection key={r.name} delay={i * 0.06}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => setActiveIndex(i)}
                    className={`flex gap-4 items-start p-4 rounded-xl transition-all cursor-pointer shadow-sm border ${activeIndex === i
                      ? "bg-primary text-white border-primary shadow-lg ring-2 ring-primary/20 scale-[1.02]"
                      : "bg-white dark:bg-card border-border/50 text-foreground hover:shadow-md hover:x-2"
                      }`}
                  >
                    <span className={`font-display text-2xl font-bold flex-shrink-0 ${activeIndex === i ? "text-secondary" : "text-secondary/60"
                      }`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h4 className={`font-display text-lg font-bold mb-1 ${activeIndex === i ? "text-white" : "text-foreground"
                        }`}>{r.name}</h4>
                      <p className={`font-body text-sm ${activeIndex === i ? "text-white/80" : "text-muted-foreground"
                        }`}>{r.desc}</p>
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* Villages & Image */}
          <div>
            <AnimatedSection direction="right">
              <div className="relative h-[400px] mb-8 group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 dark:border-primary/20"
                  >
                    <img
                      src={rituals[activeIndex].image}
                      alt={rituals[activeIndex].name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Caption Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white font-display text-xl font-bold">{rituals[activeIndex].name}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2}>
              <h3 className="font-display text-3xl font-bold text-foreground mb-6">
                Villages Thématiques
              </h3>
            </AnimatedSection>
            <div className="grid grid-cols-2 gap-3">
              {villages.map((v, i) => (
                <AnimatedSection key={v} delay={i * 0.04}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white dark:bg-card border border-border/50 rounded-xl p-4 text-center shadow-sm transition-all hover:shadow-md"
                  >
                    <p className="text-foreground font-body text-sm font-medium">{v}</p>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RitualsSection;
