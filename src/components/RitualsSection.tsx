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
    <section id="programme" className="section-padding overflow-hidden relative">
      {/* Background pattern */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, hsl(46 92% 55% / 0.1) 35px, hsl(46 92% 55% / 0.1) 36px)`
      }} />

      {/* AI Flow Lottie Animation - Connection/Flow */}
      <motion.div
        initial={{ opacity: 0, rotate: -10 }}
        whileInView={{ opacity: 0.12, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
        className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-0"
      >
        <LottieAnimation
          animationData={aiFlowAnimation}
          loop={true}
        />
      </motion.div>

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="text-center mb-16">
          <p className="text-secondary font-body text-sm uppercase tracking-[0.2em] mb-3">Traditions ancestrales</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Rituels & Programme
          </h2>
          <div className="gold-line" />
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Rituals */}
          <div>
            <AnimatedSection>
              <h3 className="font-display text-2xl font-bold text-primary-foreground mb-8">
                Rituels de Gouvernance
              </h3>
            </AnimatedSection>
            <div className="space-y-4">
              {rituals.map((r, i) => (
                <AnimatedSection key={r.name} delay={i * 0.08} direction="left">
                  <motion.div
                    whileHover={{ x: 8, backgroundColor: "rgba(255,255,255,0.05)" }}
                    className="flex gap-4 items-start p-4 rounded-lg transition-colors"
                  >
                    <span className="font-display text-3xl font-bold text-secondary/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h4 className="font-display text-lg font-bold text-primary-foreground">{r.name}</h4>
                      <p className="text-primary-foreground/60 font-body text-sm">{r.desc}</p>
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* Villages & Image */}
          <div>
            <AnimatedSection direction="right">
              <div className="image-frame h-[300px] mb-10">
                <img src={dancePerformance} alt="Performance de danse" className="w-full h-full object-cover" />
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2}>
              <h3 className="font-display text-2xl font-bold text-primary-foreground mb-6">
                Villages Thématiques
              </h3>
            </AnimatedSection>
            <div className="grid grid-cols-2 gap-3">
              {villages.map((v, i) => (
                <AnimatedSection key={v} delay={i * 0.05} direction="scale">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-lg p-3 text-center"
                  >
                    <p className="text-primary-foreground/80 font-body text-sm">{v}</p>
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
