import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import AnimatedSection from "./AnimatedSection";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import { api } from "@/lib/api";

const GallerySection = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [mediaItems, setMediaItems] = useState<any[]>([]);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const data = await api.getMediaItems();
        const published = data.filter((item: any) => item.published);
        setMediaItems(published);
      } catch (error) {
        console.error('Failed to load media:', error);
      }
    };
    loadMedia();
  }, []);

  return (
    <section id="media" className="section-padding bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden relative">
      {/* Soft decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-secondary font-body text-sm uppercase tracking-[0.3em] mb-4 font-semibold"
          >
            {t('gallery.subtitle')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
          >
            <Trans i18nKey="gallery.title" components={{ 0: <span className="text-primary" /> }} />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-body text-lg max-w-2xl mx-auto"
          >
            {t('gallery.description')}
          </motion.p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item, i) => (
            <AnimatedSection key={item.id} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer"
                onClick={() => setSelectedImage(i)}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-md bg-white dark:bg-card">
                  <div className="aspect-[4/3] overflow-hidden">
                    <motion.img
                      src={api.getMediaViewUrl(item.url)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent flex flex-col items-center justify-center transition-opacity"
                  >
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                      <Play className="text-white" size={24} />
                    </div>
                    <p className="text-white font-display text-xl font-bold">{item.title}</p>
                  </motion.div>
                </div>
                <div className="mt-4 px-2">
                  <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full mb-2">
                    {item.title}
                  </span>
                  <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.description}
                  </h3>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Professional Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && mediaItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/96 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-6 right-6 text-white/80 hover:text-white p-3 hover:bg-white/10 rounded-full transition-all z-10"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedImage(null)}
            >
              <X size={28} />
            </motion.button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 30 }}
              className="max-w-6xl w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white dark:bg-card rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={api.getMediaViewUrl(mediaItems[selectedImage].url)}
                  alt={mediaItems[selectedImage].title}
                  className="w-full max-h-[70vh] object-contain"
                />
                <div className="p-6 bg-gradient-to-t from-card to-muted">
                  <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full mb-3">
                    {mediaItems[selectedImage].title}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    {mediaItems[selectedImage].description}
                  </h3>
                </div>
              </div>
            </motion.div>

            {/* Navigation Arrows */}
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => (prev! > 0 ? prev! - 1 : mediaItems.length - 1));
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 p-4 rounded-full backdrop-blur-md transition-all"
            >
              <ChevronLeft size={28} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => (prev! < mediaItems.length - 1 ? prev! + 1 : 0));
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 p-4 rounded-full backdrop-blur-md transition-all"
            >
              <ChevronRight size={28} />
            </motion.button>

            {/* Image Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
              <span className="text-white font-body text-sm">
                {selectedImage + 1} / {mediaItems.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
