import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AnimatedSection from "./AnimatedSection";
import { X, ZoomIn } from "lucide-react";
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
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section id="media" className="section-padding bg-background overflow-hidden relative">
      {/* Decorative elements */}
      <motion.div
        className="absolute top-0 right-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-secondary font-body text-sm uppercase tracking-[0.2em] mb-3"
          >
            Galerie
          </motion.p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            <span className="text-gold-gradient">Médiathèque</span>
          </h2>
          <motion.div
            className="gold-line"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          />
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[220px]">
          {images.map((img, i) => (
            <AnimatedSection key={i} delay={i * 0.08} direction="scale" className={img.span}>
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
                className="image-frame h-full w-full cursor-pointer relative group overflow-hidden"
                onClick={() => setSelectedImage(i)}
              >
                <motion.img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent flex flex-col items-center justify-end pb-6 transition-opacity"
                >
                  <ZoomIn className="text-secondary mb-2" size={32} />
                  <p className="text-primary-foreground font-display text-lg font-bold">{img.alt}</p>
                </motion.div>

                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8 }}
                />
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </motion.button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="max-w-6xl max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                className="w-full h-full object-contain rounded-lg"
              />
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white text-center mt-4 font-display text-xl"
              >
                {images[selectedImage].alt}
              </motion.p>
            </motion.div>

            {/* Navigation arrows */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
              <motion.button
                whileHover={{ scale: 1.2, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((prev) => (prev! > 0 ? prev! - 1 : images.length - 1));
                }}
                className="text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-sm transition-colors"
              >
                ←
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.2, x: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((prev) => (prev! < images.length - 1 ? prev! + 1 : 0));
                }}
                className="text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-sm transition-colors"
              >
                →
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
