import { motion } from "framer-motion";
import { Target, Heart, TrendingUp, BookOpen, Globe } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const objectives = [
  {
    icon: Target,
    title: "Gouvernance",
    text: "Mécanisme traditionnel d'évaluation de la gouvernance à travers le réquisitoire public des Fonanguon",
  },
  {
    icon: Heart,
    title: "Cohésion sociale",
    text: "Renforcer la paix sociale, la participation citoyenne et la cohésion communautaire",
  },
  {
    icon: TrendingUp,
    title: "Économie locale",
    text: "Favoriser les échanges économiques locaux comme levier de lutte contre la précarité",
  },
  {
    icon: BookOpen,
    title: "Transmission",
    text: "Sauvegarder, transmettre et valoriser les pratiques culturelles et sociales Bamoun",
  },
  {
    icon: Globe,
    title: "Patrimoine universel",
    text: "Contribuer à la construction d'un patrimoine culturel vivant universel",
  },
];

const ObjectivesSection = () => {
  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-secondary font-body text-sm uppercase tracking-[0.2em] mb-3">Notre mission</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Objectifs du <span className="text-gold-gradient">Nguon</span>
          </h2>
          <div className="gold-line" />
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {objectives.map((obj, i) => (
            <AnimatedSection key={obj.title} delay={i * 0.1} direction="scale">
              <motion.div
                whileHover={{ y: -8, boxShadow: "var(--shadow-elevated)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="card-cultural h-full border border-border/50"
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <obj.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{obj.title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{obj.text}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ObjectivesSection;
