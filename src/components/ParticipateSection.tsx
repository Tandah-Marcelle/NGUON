import { motion } from "framer-motion";
import { Eye, Zap, Globe, Heart, Handshake } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import LottieAnimation from "./LottieAnimation";
import planeAnimation from "@/assets/Plane.json";

const reasons = [
  { icon: Eye, text: "Visibilité massive et qualitative" },
  { icon: Zap, text: "Activation terrain et engagement direct" },
  { icon: Globe, text: "Accès à de nouveaux marchés" },
  { icon: Heart, text: "Image RSE, diversité et inclusion" },
  { icon: Handshake, text: "Opportunités de partenariats durables" },
];

const ParticipateSection = () => {
  return (
    <section id="participer" className="section-padding bg-gradient-to-b from-background via-secondary/5 to-background relative overflow-hidden">
      {/* Soft decorative blur elements */}
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      {/* Plane Lottie Animation */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 0.2, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute top-20 right-0 w-64 h-64 md:w-96 md:h-96 z-0 pointer-events-none"
      >
        <LottieAnimation
          animationData={planeAnimation}
          loop={true}
        />
      </motion.div>

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="text-center mb-16">
          <p className="text-secondary font-body text-sm uppercase tracking-[0.3em] mb-4 font-semibold">Rejoignez-nous</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Participer au <span className="text-primary">Nguon</span>
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto leading-relaxed">
            S'associer au Nguon, c'est investir dans un événement durable, structuré et à forte valeur
            symbolique, économique et médiatique.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {reasons.map((r, i) => (
            <AnimatedSection key={r.text} delay={i * 0.08}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="bg-white dark:bg-card rounded-2xl p-5 shadow-sm border border-border/50 flex items-center gap-4 transition-all hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <r.icon className="w-6 h-6 text-secondary" />
                </div>
                <p className="text-foreground font-body font-medium text-sm">{r.text}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {["Sponsor", "Partenaire", "Exposant"].map((type, i) => (
            <AnimatedSection key={type} delay={i * 0.1}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-card rounded-2xl p-8 shadow-sm border-2 border-border/50 text-center transition-all hover:shadow-md"
              >
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">{type}</h3>
                <p className="text-muted-foreground font-body text-sm mb-6 leading-relaxed">
                  Découvrez les opportunités de participation en tant que {type.toLowerCase()}.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-primary hover:bg-primary/90 text-white font-body font-semibold px-8 py-3 rounded-xl transition-all"
                >
                  En savoir plus
                </motion.button>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ParticipateSection;
