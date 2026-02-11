import AnimatedSection from "./AnimatedSection";
import ParallaxImage from "./ParallaxImage";
import cultureCeremony from "@/assets/culture-ceremony.jpg";
import palaceInterior from "@/assets/palace-interior.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="section-padding section-cream overflow-hidden">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-secondary font-body text-sm uppercase tracking-[0.2em] mb-3">Depuis 1394</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            À Propos du <span className="text-gold-gradient">Nguon</span>
          </h2>
          <div className="gold-line" />
        </AnimatedSection>

        {/* Row 1 */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          <AnimatedSection direction="left">
            <ParallaxImage src={cultureCeremony} alt="Cérémonie culturelle" className="h-[400px] md:h-[500px]" />
          </AnimatedSection>
          <AnimatedSection direction="right" delay={0.2}>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
              Une institution vivante depuis plus de six siècles
            </h3>
            <div className="gold-line-left mb-6" />
            <p className="text-muted-foreground font-body leading-relaxed mb-4">
              Fondé en 1394 par le Roi Ncharé Yen, le Royaume Bamoun a institué le NGUON comme un mécanisme
              communautaire de gouvernance, de régulation sociale et de célébration des valeurs fondatrices du Royaume.
            </p>
            <p className="text-muted-foreground font-body leading-relaxed mb-4">
              Issu d'une quête de terre, d'unité et de cohésion, le Royaume Bamoun s'est structuré autour de principes
              de symbiose, d'équilibre et de responsabilité collective, symbolisés par le scarabée, emblème du NGUON.
            </p>
            <p className="text-muted-foreground font-body leading-relaxed">
              Interdit entre 1924 et 1960 par l'administration coloniale, le NGUON a été réhabilité après
              l'indépendance du Cameroun, puis institutionnalisé en 1992 comme Grandes Journées Traditionnelles,
              Culturelles et Économiques du peuple Bamoun.
            </p>
          </AnimatedSection>
        </div>

        {/* Row 2: Recognized as */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <AnimatedSection direction="left" delay={0.1} className="order-2 md:order-1">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
              Un patrimoine reconnu
            </h3>
            <div className="gold-line-left mb-6" />
            <ul className="space-y-4">
              {[
                "Une institution de gouvernance traditionnelle vivante",
                "Un espace structuré de dialogue communautaire",
                "Une manifestation majeure du patrimoine culturel immatériel",
                "Une plateforme de développement économique et touristique local",
                "Un outil de transmission et de sauvegarde des savoirs ancestraux",
              ].map((item, i) => (
                <AnimatedSection key={i} delay={0.1 * i} direction="left">
                  <li className="flex items-start gap-3 text-muted-foreground font-body">
                    <span className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                    {item}
                  </li>
                </AnimatedSection>
              ))}
            </ul>
          </AnimatedSection>
          <AnimatedSection direction="right" delay={0.2} className="order-1 md:order-2">
            <ParallaxImage src={palaceInterior} alt="Palais Bamoun" className="h-[400px] md:h-[500px]" />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
