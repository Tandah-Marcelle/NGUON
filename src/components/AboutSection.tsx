import AnimatedSection from "./AnimatedSection";
import ParallaxImage from "./ParallaxImage";
import TextReveal from "./TextReveal";
import BlobAnimation from "./BlobAnimation";
import cultureCeremony from "@/assets/culture-ceremony.jpg";
import palaceInterior from "@/assets/palace-interior.jpg";
import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section id="about" className="section-padding section-cream overflow-hidden relative">
      {/* Blob Animation Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <BlobAnimation numBalls={15} />
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl z-[1]" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl z-[1]" />

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-secondary font-body text-sm uppercase tracking-[0.2em] mb-3"
          >
            Depuis 1394
          </motion.p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            <TextReveal>À Propos du</TextReveal>{" "}
            <span className="text-gold-gradient">
              <TextReveal delay={0.3}>Nguon</TextReveal>
            </span>
          </h2>
          <motion.div
            className="gold-line"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </AnimatedSection>

        {/* Row 1 */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          <AnimatedSection direction="left">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <ParallaxImage src={cultureCeremony} alt="Cérémonie culturelle" className="h-[400px] md:h-[500px]" />
            </motion.div>
          </AnimatedSection>
          <AnimatedSection direction="right" delay={0.2}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                Une institution vivante depuis plus de six siècles
              </h3>
              <motion.div
                className="gold-line-left mb-6"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              />
              <div className="space-y-4">
                {[
                  "Fondé en 1394 par le Roi Ncharé Yen, le Royaume Bamoun a institué le NGUON comme un mécanisme communautaire de gouvernance, de régulation sociale et de célébration des valeurs fondatrices du Royaume.",
                  "Issu d'une quête de terre, d'unité et de cohésion, le Royaume Bamoun s'est structuré autour de principes de symbiose, d'équilibre et de responsabilité collective, symbolisés par le scarabée, emblème du NGUON.",
                  "Interdit entre 1924 et 1960 par l'administration coloniale, le NGUON a été réhabilité après l'indépendance du Cameroun, puis institutionnalisé en 1992 comme Grandes Journées Traditionnelles, Culturelles et Économiques du peuple Bamoun.",
                ].map((text, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="text-muted-foreground font-body leading-relaxed"
                  >
                    {text}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          </AnimatedSection>
        </div>

        {/* Row 2: Recognized as */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <AnimatedSection direction="left" delay={0.1} className="order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                Un patrimoine reconnu
              </h3>
              <motion.div
                className="gold-line-left mb-6"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              />
              <ul className="space-y-4">
                {[
                  "Une institution de gouvernance traditionnelle vivante",
                  "Un espace structuré de dialogue communautaire",
                  "Une manifestation majeure du patrimoine culturel immatériel",
                  "Une plateforme de développement économique et touristique local",
                  "Un outil de transmission et de sauvegarde des savoirs ancestraux",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex items-start gap-3 text-muted-foreground font-body group"
                  >
                    <motion.span
                      className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0"
                      whileHover={{ scale: 1.5 }}
                      transition={{ duration: 0.2 }}
                    />
                    <span className="group-hover:text-foreground transition-colors duration-300">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatedSection>
          <AnimatedSection direction="right" delay={0.2} className="order-1 md:order-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <ParallaxImage src={palaceInterior} alt="Palais Bamoun" className="h-[400px] md:h-[500px]" />
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
