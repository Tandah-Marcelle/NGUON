import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import LottieAnimation from "./LottieAnimation";
import dancePerformance from "@/assets/dance-performance.jpg";
import aiFlowAnimation from "@/assets/ai animation Flow 1.json";

const rituals = [
  { name: "Ka'Nguon", desc: "Rituel d'Annonce officiel du lancement du Nguon" },
  { name: "Nyam Nguon", desc: "Rituel d'offrandes au Monarque" },
  { name: "Shi'rum", desc: "Rituel de collecte des doléances" },
  { name: "Nyi Nguon", desc: "Rituel d'entrée solennelle de la société secrète au Palais" },
  { name: "Sha'Pam", desc: "Rituel de la pharmacopée traditionnelle" },
  { name: "Kem Mfon", desc: "Rituel du jugement du Monarque" },
  { name: "Fit Nkindi & Sho'Melue", desc: "Rituel de marche et tambour d'appel" },
];

const villages = [
  "Village des bâtisseurs", "Village artisanal", "Village gastronomique",
  "Village des jeux et loisirs", "Village des communautés / UNESCO",
  "Village social et humanitaire", "Village campement", "Village Agropastoral et sylvicole",
];

const RitualsSection = () => {
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
            Rituels & Programme
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
                    whileHover={{ x: 8 }}
                    className="flex gap-4 items-start p-4 rounded-xl bg-white dark:bg-card shadow-sm border border-border/50 transition-all hover:shadow-md"
                  >
                    <span className="font-display text-2xl font-bold text-secondary/60 flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h4 className="font-display text-lg font-bold text-foreground mb-1">{r.name}</h4>
                      <p className="text-muted-foreground font-body text-sm">{r.desc}</p>
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* Villages & Image */}
          <div>
            <AnimatedSection direction="right">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl overflow-hidden shadow-lg mb-8"
              >
                <img src={dancePerformance} alt="Performance de danse" className="w-full h-[350px] object-cover" />
              </motion.div>
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
