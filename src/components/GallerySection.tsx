import { motion, AnimatePresence } from "framer-motion";
import SmartMedia from "./SmartMedia";
import { useState, useEffect } from "react";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./heritage/SectionHeading";
import { X, ChevronLeft, ChevronRight, Play, Maximize2 } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import { api } from "@/lib/api";
import { pageCache } from "@/lib/pageCache";
import LazyMedia from "@/components/LazyMedia";

const GallerySection = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [mediaItems, setMediaItems] = useState<any[]>([]);

  useEffect(() => {
    const loadMedia = async () => {
      const cached = pageCache.get<any[]>('mediaItems');
      if (cached) { setMediaItems(cached); return; }
      try {
        const data = await api.getMediaItems();
        const published = data.filter((item: any) => item.published !== false);
        pageCache.set('mediaItems', published);
        setMediaItems(published);
      } catch (error) {
        console.error('Failed to load media:', error);
      }
    };
    loadMedia();
  }, []);

  return (
    <section id="media" className="section-padding bg-background overflow-hidden relative">
      <div className="container mx-auto relative z-10">
        <SectionHeading
          title={<Trans i18nKey="gallery.title" components={{ 0: <span className="text-primary" /> }} />}
          lead={t('gallery.description')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item, i) => (
            <AnimatedSection key={item.id} delay={i * 0.08}>
              <motion.div
                className="group cursor-pointer"
                onClick={() => setSelectedImage(i)}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-[0_18px_40px_-24px_rgba(0,30,50,0.45)]">
                  <SmartMedia
                    presignedUrl={item.presignedUrl}
                    rawPath={item.url}
                    type={String(item.type).toLowerCase() === "video" ? "video" : "image"}
                    alt={item.title}
                    className="aspect-[4/3] w-full"
                    mediaClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-navy/0 group-hover:bg-navy/35 transition-colors duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition duration-300">
                      {String(item.type).toLowerCase() === "video"
                        ? <Play className="text-navy fill-navy ml-0.5" size={20} />
                        : <Maximize2 className="text-navy" size={18} />}
                    </div>
                  </div>
                </div>
                <div className="mt-4 px-1">
                  <h3 className="font-display text-base md:text-lg font-black leading-snug text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  )}
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
                  src={mediaItems[selectedImage].presignedUrl ?? api.getMediaViewUrl(mediaItems[selectedImage].url)}
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
