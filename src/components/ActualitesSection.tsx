import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import AnimatedSection from "./AnimatedSection";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { X } from "lucide-react";

const PROTECTED_TERMS = ['Nguon', 'Sha’Pam', 'Ncharé Yen', 'Bamoun', 'Foumban', 'NGUON'];

const protectTerms = (text: string) => {
  let protectedText = text;
  PROTECTED_TERMS.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    protectedText = protectedText.replace(regex, `<span class="notranslate">${term}</span>`);
  });
  return protectedText;
};

import { useTranslate } from "@/hooks/useTranslate";

const NewsCard = ({ item, index, isVideo, setSelectedItem }: any) => {
  const { translatedText: title } = useTranslate(protectTerms(item.title));
  const { translatedText: description } = useTranslate(protectTerms(item.description));

  return (
    <AnimatedSection key={item.id} delay={index * 0.1}>
      <motion.div
        whileHover={{ y: -8 }}
        onClick={() => setSelectedItem({ ...item, translatedTitle: title, translatedDescription: description })}
        className="bg-white dark:bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/50 cursor-pointer"
      >
        <div className="relative h-64 overflow-hidden">
          {isVideo(item.media) ? (
            <video
              src={api.getMediaViewUrl(item.media)}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={api.getMediaViewUrl(item.media)}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          )}
        </div>
        <div className="p-6">
          <h3 className="font-display text-xl font-bold text-foreground mb-3" dangerouslySetInnerHTML={{ __html: title }} />
          <p className="text-muted-foreground font-body text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      </motion.div>
    </AnimatedSection>
  );
};

const ActualitesSection = () => {
  const { t } = useTranslation();
  const [actualites, setActualities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    const loadActualities = async () => {
      try {
        const data = await api.getActualities();
        setActualities(data.filter((a: any) => a.published).slice(0, 3));
      } catch (error) {
        console.error('Failed to load actualities:', error);
      } finally {
        setLoading(false);
      }
    };
    loadActualities();
  }, []);

  const isVideo = (filename: string) => /\.(mp4|webm|ogg)$/i.test(filename);

  if (loading) {
    return (
      <section className="section-padding bg-background">
        <div className="container mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </section>
    );
  }

  if (actualites.length === 0) return null;

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('actualites.title')}
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            {t('actualites.description')}
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {actualites.map((item, index) => (
            <NewsCard
              key={item.id}
              item={item}
              index={index}
              isVideo={isVideo}
              setSelectedItem={setSelectedItem}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-card rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="relative">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                  <X size={24} />
                </button>
                <div className="relative h-96">
                  {isVideo(selectedItem.media) ? (
                    <video
                      src={api.getMediaViewUrl(selectedItem.media)}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={api.getMediaViewUrl(selectedItem.media)}
                      alt={selectedItem.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-8">
                  <h2 className="font-display text-3xl font-bold text-foreground mb-4" dangerouslySetInnerHTML={{ __html: selectedItem.translatedTitle || selectedItem.title }} />
                  <p className="text-muted-foreground font-body text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedItem.translatedDescription || selectedItem.description }} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ActualitesSection;
