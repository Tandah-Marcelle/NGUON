import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import AnimatedSection from "./AnimatedSection";
import monument1 from "@/assets/Monument_de_guerrier_au_sultanat_de_Foumban (1).jpeg";
import monument2 from "@/assets/Monument_de_guerrier_au_sultanat_de_Foumban.jpeg";
import musee1 from "@/assets/Musée-du-palais-de-Foumban.jpg";
import musee2 from "@/assets/musee-du-palais.jpg";
import abbaye from "@/assets/Abbaye_de_Koutaba_6_-_Vue_générale.jpg";
import palais from "@/assets/Le-Palais-du-sultan-de-Foumban-au-Cameroun.jpg";

const sites = [
  {
    name: "Foumban",
    items: ["Cour d'Apparat", "Palais des Rois Bamoun", "Village Nguon (21 hectares)", "Porte des tranchées"],
  },
  { name: "Foumbot", items: ["Mont Mbapit : compétitions sportives et ascension"] },
  { name: "Njimom", items: ["Les sept pierres de Njimom : site historique de fondation du Royaume"] },
  { name: "Koutaba", items: ["Activités culturelles et sportives décentralisées"] },
];

const SitesSection = () => {
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);
  const topImages = [monument1, monument2, abbaye];
  const bottomImages = [musee1, musee2, palais];

  useEffect(() => {
    const interval1 = setInterval(() => setTopIndex((i) => (i + 1) % 3), 6000);
    const timeout = setTimeout(() => {
      setBottomIndex(1);
      const interval2 = setInterval(() => setBottomIndex((i) => (i + 1) % 3), 6000);
      return () => clearInterval(interval2);
    }, 3000);
    return () => { clearInterval(interval1); clearTimeout(timeout); };
  }, []);
  return (
    <section id="sites" className="section-padding bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
      {/* Soft decorative overlay */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="text-center mb-16">
          <p className="text-secondary font-body text-sm uppercase tracking-[0.3em] mb-4 font-semibold">Lieux sacrés</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Sites des <span className="text-primary">Manifestations</span>
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            Des lieux chargés d'histoire et de spiritualité
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          <div className="space-y-6">
            {sites.map((site, i) => (
              <AnimatedSection key={site.name} delay={i * 0.1}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ x: 8 }}
                  className="group bg-white dark:bg-card rounded-2xl p-8 shadow-sm border-l-4 border-secondary transition-all duration-300 hover:bg-primary hover:shadow-2xl hover:border-l-secondary"
                >
                  <h3 className="font-display text-2xl font-bold text-foreground mb-4 transition-colors duration-300 group-hover:text-white">
                    {site.name}
                  </h3>
                  <ul className="space-y-3">
                    {site.items.map((item, idx) => (
                      <li key={idx} className="text-muted-foreground font-body text-sm flex items-start gap-3 transition-colors duration-300 group-hover:text-white/90">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0 transition-colors duration-300 group-hover:bg-white" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          <div className="space-y-6">
            <AnimatedSection direction="right">
              <div className="rounded-2xl overflow-hidden shadow-lg relative h-[350px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={topIndex}
                    src={topImages[topIndex]}
                    alt="Monument Foumban"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 1.2 }}
                    className="w-full h-full object-cover absolute"
                  />
                </AnimatePresence>
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right" delay={0.2}>
              <div className="rounded-2xl overflow-hidden shadow-lg relative h-[300px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={bottomIndex}
                    src={bottomImages[bottomIndex]}
                    alt="Musée du Palais"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 1.2 }}
                    className="w-full h-full object-cover absolute"
                  />
                </AnimatePresence>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SitesSection;
