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
    <section id="participer" className="section-padding relative overflow-hidden">
      {/* Background with pattern */}
      <div className="absolute inset-0 z-0 section-cream">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a843' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Plane Lottie Animation - Travel/Tourism */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 0.3, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute top-20 right-0 w-64 h-64 md:w-96 md:h-96 z-[1] pointer-events-none"
      >
        <LottieAnimation
          animationData={planeAnimation}
          loop={true}
        />
      </motion.div>

      {/* Decorative blur elements */}
      <motion.div
        className="absolute bottom-10 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl z-[1]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="text-center mb-16">
          <p className="text-secondary font-body text-sm uppercase tracking-[0.2em] mb-3">Rejoignez-nous</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Participer au <span className="text-gold-gradient">Nguon</span>
          </h2>
          <div className="gold-line mb-6" />
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            S'associer au Nguon, c'est investir dans un événement durable, structuré et à forte valeur
            symbolique, économique et médiatique.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {reasons.map((r, i) => (
            <AnimatedSection key={r.text} delay={i * 0.1} direction="scale">
              <motion.div
                whileHover={{ scale: 1.04, y: -4 }}
                className="card-cultural flex items-center gap-4 border border-border/50"
              >
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <r.icon className="w-6 h-6 text-secondary" />
                </div>
                <p className="text-foreground font-body font-medium">{r.text}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {["Sponsor", "Partenaire", "Exposant"].map((type, i) => (
            <AnimatedSection key={type} delay={i * 0.15} direction="up">
              <motion.div
                whileHover={{ y: -8 }}
                className="card-cultural text-center border-2 border-secondary/20 hover:border-secondary/50 transition-colors"
              >
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">{type}</h3>
                <p className="text-muted-foreground font-body text-sm mb-6">
                  Découvrez les opportunités de participation en tant que {type.toLowerCase()}.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="gold-gradient text-foreground font-body font-semibold px-8 py-3 rounded-lg transition-all"
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
