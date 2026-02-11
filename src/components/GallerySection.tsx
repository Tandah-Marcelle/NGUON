import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import heroBg from "@/assets/hero-bg.jpg";
import cultureCeremony from "@/assets/culture-ceremony.jpg";
import artisan from "@/assets/artisan.jpg";
import foumbanLandscape from "@/assets/foumban-landscape.jpg";
import palaceInterior from "@/assets/palace-interior.jpg";
import dancePerformance from "@/assets/dance-performance.jpg";

const images = [
  { src: heroBg, alt: "Cérémonie Nguon", span: "md:col-span-2 md:row-span-2" },
  { src: cultureCeremony, alt: "Culture Bamoun", span: "" },
  { src: artisan, alt: "Artisanat", span: "" },
  { src: foumbanLandscape, alt: "Foumban", span: "md:col-span-2" },
  { src: palaceInterior, alt: "Palais Royal", span: "" },
  { src: dancePerformance, alt: "Danse traditionnelle", span: "" },
];

const GallerySection = () => {
  return (
    <section id="media" className="section-padding bg-background overflow-hidden">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-secondary font-body text-sm uppercase tracking-[0.2em] mb-3">Galerie</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            <span className="text-gold-gradient">Médiathèque</span>
          </h2>
          <div className="gold-line" />
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[220px]">
          {images.map((img, i) => (
            <AnimatedSection key={i} delay={i * 0.08} direction="scale" className={img.span}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="image-frame h-full w-full cursor-pointer"
              >
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-primary/60 flex items-center justify-center transition-opacity"
                >
                  <p className="text-primary-foreground font-display text-lg font-bold">{img.alt}</p>
                </motion.div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
