import { motion } from "framer-motion";
import { Target, Heart, TrendingUp, BookOpen, Globe } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import LottieAnimation from "./LottieAnimation";
import aiFlowAnimation from "@/assets/ai animation Flow 1.json";

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
    <section className="section-padding bg-background overflow-hidden relative">
      {/* Soft decorative gradient orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="text-center mb-16">
          <p className="text-secondary font-body text-sm uppercase tracking-[0.3em] mb-4 font-semibold">Notre mission</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Objectifs du <span className="text-primary">Nguon</span>
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            Des valeurs ancestrales au service du développement communautaire
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectives.map((obj, i) => (
            <AnimatedSection key={obj.title} delay={i * 0.1}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border border-border/50 h-full transition-all hover:shadow-md"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
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
