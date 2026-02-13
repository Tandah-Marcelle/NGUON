import { motion } from "framer-motion";
import { Target, Heart, TrendingUp, BookOpen, Globe } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import masks from "@/assets/masks.png";
import masks2 from "@/assets/masks2.png";
import dancers from "@/assets/dancers.png";
import { useTranslation, Trans } from "react-i18next";

const objectives = [
  {
    icon: Target,
    title: "objectives.items.governance.title",
    text: "objectives.items.governance.text",
  },
  {
    icon: Heart,
    title: "objectives.items.social_cohesion.title",
    text: "objectives.items.social_cohesion.text",
  },
  {
    icon: TrendingUp,
    title: "objectives.items.local_economy.title",
    text: "objectives.items.local_economy.text",
  },
  {
    icon: BookOpen,
    title: "objectives.items.transmission.title",
    text: "objectives.items.transmission.text",
  },
  {
    icon: Globe,
    title: "objectives.items.universal_heritage.title",
    text: "objectives.items.universal_heritage.text",
  },
];

const ObjectivesSection = () => {
  const { t } = useTranslation();
  return (
    <section className="section-padding bg-background overflow-hidden relative">

      {/* Soft decorative gradient orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl z-[1]" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl z-[1]" />

      {/* Traditional mask animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        whileInView={{ opacity: 0.08, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute top-10 right-10 w-80 h-80 md:w-96 md:h-96 z-[1] pointer-events-none"
      >
        <img src={masks} alt="" className="w-full h-full object-contain" />
      </motion.div>

      {/* Additional decorative masks */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotate: 15 }}
        whileInView={{ opacity: 0.06, scale: 1, rotate: 5 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, delay: 0.5 }}
        className="absolute top-40 left-10 w-64 h-64 md:w-80 md:h-80 z-[1] pointer-events-none"
      >
        <img src={masks2} alt="" className="w-full h-full object-contain" />
      </motion.div>

      {/* Dancers decorative background - Bottom Left */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 0.12, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 0.7 }}
        className="absolute bottom-0 left-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] z-[1] pointer-events-none"
      >
        <img src={dancers} alt="" className="w-full h-full object-contain object-bottom-left" />
      </motion.div>

      {/* Dancers decorative background - Center */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.08, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.5, delay: 0.9 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[800px] md:h-[800px] z-[0] pointer-events-none"
      >
        <img src={dancers} alt="" className="w-full h-full object-contain opacity-70" />
      </motion.div>

      {/* Dancers decorative background - Bottom Right */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 0.12, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 1.1 }}
        className="absolute bottom-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] z-[1] pointer-events-none"
      >
        <img src={dancers} alt="" className="w-full h-full object-contain object-bottom-right" />
      </motion.div>

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="text-center mb-16">
          <p className="text-secondary font-body text-sm uppercase tracking-[0.3em] mb-4 font-semibold">{t('objectives.subtitle')}</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            <Trans i18nKey="objectives.title" components={{ 0: <span className="text-primary" /> }} />
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            {t('objectives.description')}
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
                className="group bg-white dark:bg-card rounded-2xl p-8 shadow-sm border border-border/50 h-full transition-all duration-300 hover:bg-primary hover:shadow-2xl hover:border-primary"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-white/20">
                  <obj.icon className="w-7 h-7 text-primary transition-colors duration-300 group-hover:text-white" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3 transition-colors duration-300 group-hover:text-white">
                  {t(obj.title)}
                </h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed transition-colors duration-300 group-hover:text-white/90">
                  {t(obj.text)}
                </p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ObjectivesSection;
