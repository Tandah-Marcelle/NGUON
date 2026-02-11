import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import ParallaxImage from "./ParallaxImage";
import foumbanLandscape from "@/assets/foumban-landscape.jpg";
import artisan from "@/assets/artisan.jpg";

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
    <section id="sites" className="section-padding section-cream overflow-hidden">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-secondary font-body text-sm uppercase tracking-[0.2em] mb-3">Lieux sacrés</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Sites des <span className="text-gold-gradient">Manifestations</span>
          </h2>
          <div className="gold-line" />
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
          <div className="space-y-8">
            {sites.map((site, i) => (
              <AnimatedSection key={site.name} delay={i * 0.15} direction="left">
                <motion.div
                  whileHover={{ x: 8 }}
                  className="border-l-4 border-secondary pl-6 py-2"
                >
                  <h3 className="font-display text-2xl font-bold text-foreground mb-3">{site.name}</h3>
                  <ul className="space-y-2">
                    {site.items.map((item) => (
                      <li key={item} className="text-muted-foreground font-body text-sm flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          <div className="space-y-8">
            <AnimatedSection direction="right">
              <ParallaxImage src={foumbanLandscape} alt="Foumban" className="h-[300px]" />
            </AnimatedSection>
            <AnimatedSection direction="right" delay={0.2}>
              <ParallaxImage src={artisan} alt="Artisanat Bamoun" className="h-[250px]" />
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SitesSection;
