import AnimatedSection from "./AnimatedSection";
import cultureCeremony from "@/assets/culture-ceremony.jpg";
import palaceInterior from "@/assets/palace-interior.jpg";
import { motion } from "framer-motion";
import { Sparkles, Award, Users } from "lucide-react";
import LottieAnimation from "./LottieAnimation";
import aiFlowAnimation from "@/assets/ai animation Flow 1.json";

const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-gradient-to-b from-background via-cream/30 to-background overflow-hidden relative">
      {/* Soft decorative elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      {/* AI Flow Lottie Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.08, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full pointer-events-none z-0"
      >
        <LottieAnimation
          animationData={aiFlowAnimation}
          loop={true}
        />
      </motion.div>

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-secondary font-body text-sm uppercase tracking-[0.3em] mb-4 font-semibold"
          >
            Depuis 1394
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
          >
            À Propos du <span className="text-primary">Nguon</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground font-body text-lg max-w-3xl mx-auto leading-relaxed"
          >
            Un patrimoine culturel vivant qui unit tradition et modernité depuis plus de six siècles
          </motion.p>
        </AnimatedSection>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Sparkles, title: "Tradition", desc: "Plus de 600 ans d'histoire" },
            { icon: Award, title: "Patrimoine", desc: "Reconnu internationalement" },
            { icon: Users, title: "Communauté", desc: "500K+ participants" },
          ].map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="bg-primary text-white dark:bg-card dark:text-foreground rounded-2xl p-6 shadow-sm border border-border/50 text-center hover:shadow-md"
              >
                <div className="w-14 h-14 rounded-full bg-white/20 dark:bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-white dark:text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-white dark:text-foreground mb-2">{item.title}</h3>
                <p className="text-white/90 dark:text-muted-foreground font-body text-sm">{item.desc}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          <AnimatedSection direction="left">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl overflow-hidden shadow-lg"
            >
              <img src={cultureCeremony} alt="Cérémonie culturelle" className="w-full h-[450px] object-cover" />
            </motion.div>
          </AnimatedSection>
          <AnimatedSection direction="right" delay={0.2}>
            <div className="space-y-6">
              <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Une institution vivante depuis plus de six siècles
              </h3>
              <div className="w-20 h-1 bg-gradient-to-r from-secondary to-secondary/50 rounded-full" />
              <div className="space-y-4">
                {[
                  "Fondé en 1394 par le Roi Ncharé Yen, le Royaume Bamoun a institué le NGUON comme un mécanisme communautaire de gouvernance, de régulation sociale et de célébration des valeurs fondatrices du Royaume.",
                  "Issu d'une quête de terre, d'unité et de cohésion, le Royaume Bamoun s'est structuré autour de principes de symbiose, d'équilibre et de responsabilité collective, symbolisés par le scarabée, emblème du NGUON.",
                  "Interdit entre 1924 et 1960 par l'administration coloniale, le NGUON a été réhabilité après l'indépendance du Cameroun, puis institutionnalisé en 1992 comme Grandes Journées Traditionnelles, Culturelles et Économiques du peuple Bamoun.",
                ].map((text, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="text-muted-foreground font-body leading-relaxed text-base"
                  >
                    {text}
                  </motion.p>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Recognition Section */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <AnimatedSection direction="left" className="order-2 md:order-1">
            <div className="space-y-6">
              <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Un patrimoine reconnu
              </h3>
              <div className="w-20 h-1 bg-gradient-to-r from-secondary to-secondary/50 rounded-full" />
              <div className="space-y-3">
                {[
                  "Une institution de gouvernance traditionnelle vivante",
                  "Un espace structuré de dialogue communautaire",
                  "Une manifestation majeure du patrimoine culturel immatériel",
                  "Une plateforme de développement économique et touristique local",
                  "Un outil de transmission et de sauvegarde des savoirs ancestraux",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    whileHover={{ x: 8, backgroundColor: "hsl(var(--secondary) / 0.05)" }}
                    className="flex items-start gap-3 p-3 rounded-lg transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground font-body text-base">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection direction="right" delay={0.2} className="order-1 md:order-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl overflow-hidden shadow-lg"
            >
              <img src={palaceInterior} alt="Palais Bamoun" className="w-full h-[450px] object-cover" />
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
