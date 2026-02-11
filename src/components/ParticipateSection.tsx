import { motion } from "framer-motion";
import { Eye, Zap, Globe, Heart, Handshake } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import patternBg from "@/assets/pattern-bg.jpg";

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
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={patternBg} alt="" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 section-cream" />
      </div>

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
