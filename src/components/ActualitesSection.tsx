import { useTranslation } from "react-i18next";
import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";
import dancePerformance from "@/assets/dance-performance.jpg";
import cultureCeremony from "@/assets/culture-ceremony.jpg";
import palaceExterior from "@/assets/Le-Palais-du-sultan-de-Foumban-au-Cameroun.jpg";

const ActualitesSection = () => {
  const { t } = useTranslation();

  const actualites = [
    {
      id: 1,
      image: dancePerformance,
      title: t('actualites.items.0.title'),
      description: t('actualites.items.0.description'),
    },
    {
      id: 2,
      image: cultureCeremony,
      title: t('actualites.items.1.title'),
      description: t('actualites.items.1.description'),
    },
    {
      id: 3,
      image: palaceExterior,
      title: t('actualites.items.2.title'),
      description: t('actualites.items.2.description'),
    },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('actualites.title')}
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            {t('actualites.description')}
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {actualites.map((item, index) => (
            <AnimatedSection key={item.id} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/50"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActualitesSection;
