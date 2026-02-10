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
    <section className="section-padding bg-background overflow-hidden relative">
      {/* Fireworks Lottie Animation - Celebration of Impact */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.25 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute top-0 right-0 w-full h-full pointer-events-none z-0"
      >
        <LottieAnimation
          animationData={fireworksAnimation}
          loop={true}
          style={{ width: "100%", height: "100%", transform: "scale(1.2)" }}
        />
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-10 left-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="text-center mb-16">
          <p className="text-secondary font-body text-sm uppercase tracking-[0.2em] mb-3">Un héritage vivant</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Impact <span className="text-gold-gradient">Multidimensionnel</span>
          </h2>
          <div className="gold-line" />
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8">
          {impacts.map((impact, i) => (
            <AnimatedSection key={impact.title} delay={i * 0.12} direction={i % 2 === 0 ? "left" : "right"}>
              <motion.div
                whileHover={{ y: -6 }}
                className="card-cultural h-full border border-border/50"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <impact.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">{impact.title}</h3>
                </div>
                <ul className="space-y-3">
                  {impact.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-muted-foreground font-body text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
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
