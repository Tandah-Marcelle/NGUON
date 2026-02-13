import { motion } from "framer-motion";
import { Palette, TrendingUp, Users, MapPin } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import LottieAnimation from "./LottieAnimation";
import fireworksAnimation from "@/assets/fireworks.json";
import { useTranslation, Trans } from "react-i18next";

const impacts = [
  {
    icon: Palette,
    title: "impact.items.cultural.title",
    items: "impact.items.cultural.items",
  },
  {
    icon: TrendingUp,
    title: "impact.items.economic.title",
    items: "impact.items.economic.items",
  },
  {
    icon: Users,
    title: "impact.items.social.title",
    items: "impact.items.social.items",
  },
  {
    icon: MapPin,
    title: "impact.items.territorial.title",
    items: "impact.items.territorial.items",
  },
];

const ImpactSection = () => {
  const { t } = useTranslation();
  return (
    <section className="section-padding bg-gradient-to-b from-background via-cream/20 to-background overflow-hidden relative">
      {/* Soft decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      {/* Fireworks Lottie Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.12 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute top-0 right-0 w-full h-full pointer-events-none z-0"
      >
        <LottieAnimation
          animationData={fireworksAnimation}
          loop={true}
          style={{ width: "100%", height: "100%" }}
        />
      </motion.div>

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="text-center mb-16">
          <p className="text-secondary font-body text-sm uppercase tracking-[0.3em] mb-4 font-semibold">{t('impact.subtitle')}</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            <Trans i18nKey="impact.title" components={{ 0: <span className="text-primary" /> }} />
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            {t('impact.description')}
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6">
          {impacts.map((impact, i) => (
            <AnimatedSection key={impact.title} delay={i * 0.1}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white dark:bg-card rounded-2xl p-8 shadow-sm border-4 border-transparent transition-all duration-300 hover:border-secondary hover:shadow-2xl h-full"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <impact.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">{t(impact.title)}</h3>
                </div>
                <ul className="space-y-3">
                  {(t(impact.items, { returnObjects: true }) as string[]).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-muted-foreground font-body text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
