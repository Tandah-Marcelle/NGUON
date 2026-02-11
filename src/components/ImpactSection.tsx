import { motion } from "framer-motion";
import { Palette, TrendingUp, Users, MapPin } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import LottieAnimation from "./LottieAnimation";
import fireworksAnimation from "@/assets/fireworks.json";

const impacts = [
  {
    icon: Palette,
    title: "Impact Culturel",
    items: [
      "Sauvegarde active d'un patrimoine culturel immatériel vivant",
      "Transmission intergénérationnelle des savoirs, rites et pratiques",
      "Rayonnement culturel national et international",
    ],
  },
  {
    icon: TrendingUp,
    title: "Impact Économique",
    items: [
      "Mobilisation du tissu économique local",
      "Valorisation des artisans, agriculteurs, PME et entrepreneurs",
      "Création d'opportunités commerciales et partenariales durables",
    ],
  },
  {
    icon: Users,
    title: "Impact Social",
    items: [
      "Dialogue structuré entre autorités traditionnelles et populations",
      "Inclusion des femmes, des jeunes et des groupes communautaires",
      "Renforcement du sentiment d'appartenance et de cohésion sociale",
    ],
  },
  {
    icon: MapPin,
    title: "Impact Territorial",
    items: [
      "Valorisation des sites patrimoniaux et rituels",
      "Amélioration des infrastructures d'accueil",
      "Renforcement de l'attractivité du territoire du Noun",
    ],
  },
];

const ImpactSection = () => {
  return (
    <section className="section-padding bg-gradient-to-b from-background via-cream/20 to-background overflow-hidden relative">
      {/* Soft decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="text-center mb-16">
          <p className="text-secondary font-body text-sm uppercase tracking-[0.3em] mb-4 font-semibold">Un héritage vivant</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Impact <span className="text-primary">Multidimensionnel</span>
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            Le Nguon rayonne sur tous les aspects de la vie communautaire
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
                whileHover={{ y: -6 }}
                className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border border-border/50 h-full transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <impact.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">{impact.title}</h3>
                </div>
                <ul className="space-y-3">
                  {impact.items.map((item, idx) => (
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
