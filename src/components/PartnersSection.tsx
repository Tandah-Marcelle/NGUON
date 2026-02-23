import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const PartnersSection = () => {
    const { t } = useTranslation();
    const [sponsors, setSponsors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSponsors = async () => {
            try {
                const data = await api.getSponsors();
                setSponsors(data);
            } catch (error) {
                console.error('Failed to load sponsors:', error);
            } finally {
                setLoading(false);
            }
        };
        loadSponsors();
    }, []);

    if (loading || sponsors.length === 0) return null;

    const doubledSponsors = [...sponsors, ...sponsors];

    return (
        <section className="py-20 bg-warm-white dark:bg-card/30 overflow-hidden relative border-y border-primary/5">
            <div className="container mx-auto px-4 mb-12 text-center">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-secondary font-body text-sm uppercase tracking-[0.3em] mb-4 font-semibold"
                >
                    {t('partners.title')}
                </motion.p>
            </div>

            <div className="relative flex overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, "-50%"],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 30,
                            ease: "linear",
                        },
                    }}
                    className="flex whitespace-nowrap items-center py-4"
                >
                    {doubledSponsors.map((sponsor, index) => (
                        <div
                            key={`${sponsor.id}-${index}`}
                            className="flex-shrink-0 mx-12 md:mx-16 lg:mx-20 flex items-center justify-center opacity-90 hover:opacity-100 transition-all duration-500 transform hover:scale-110"
                        >
                            <img
                                src={api.getMediaViewUrl(sponsor.image)}
                                alt={sponsor.name}
                                className="h-12 md:h-16 lg:h-20 w-auto object-contain"
                            />
                        </div>
                    ))}
                </motion.div>

                {/* Gradient Masks for a softer feel */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-warm-white dark:from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-warm-white dark:from-background to-transparent z-10 pointer-events-none" />
            </div>
        </section>
    );
};

export default PartnersSection;
