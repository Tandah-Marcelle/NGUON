import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import ParallaxImage from "./ParallaxImage";
import foumbanLandscape from "@/assets/foumban-landscape.jpg";
import artisan from "@/assets/artisan.jpg";
import bg2 from "@/assets/bg2.jpg";

const sites = [
  {
    name: "Foumban",
    items: ["Cour d'Apparat", "Palais des Rois Bamoun", "Village Nguon (21 hectares)", "Porte des tranchées"],
  },
  { name: "Foumbot", items: ["Mont Mbapit : compétitions sportives et ascension"] },
  { name: "Njimom", items: ["Les sept pierres de Njimom : site historique de fondation du Royaume"] },
  { name: "Koutaba", items: ["Activités culturelles et sportives décentralisées"] },
];

const SitesSection = () => {
  return (
    <section id="sites" className="section-padding bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
      {/* Soft decorative overlay */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="text-center mb-16">
          <p className="text-secondary font-body text-sm uppercase tracking-[0.3em] mb-4 font-semibold">Lieux sacrés</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Sites des <span className="text-primary">Manifestations</span>
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            Des lieux chargés d'histoire et de spiritualité
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          <div className="space-y-6">
            {sites.map((site, i) => (
              <AnimatedSection key={site.name} delay={i * 0.1}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ x: 8 }}
                  className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border-l-4 border-secondary transition-all hover:shadow-md"
                >
                  <h3 className="font-display text-2xl font-bold text-foreground mb-4">{site.name}</h3>
                  <ul className="space-y-2">
                    {site.items.map((item, idx) => (
                      <li key={idx} className="text-muted-foreground font-body text-sm flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          <div className="space-y-6">
            <AnimatedSection direction="right">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl overflow-hidden shadow-lg"
              >
                <img src={foumbanLandscape} alt="Foumban" className="w-full h-[350px] object-cover" />
              </motion.div>
            </AnimatedSection>
            <AnimatedSection direction="right" delay={0.2}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl overflow-hidden shadow-lg"
              >
                <img src={artisan} alt="Artisanat Bamoun" className="w-full h-[300px] object-cover" />
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SitesSection;
