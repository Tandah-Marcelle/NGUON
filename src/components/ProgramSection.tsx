import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Calendar, Clock, MapPin, ChevronRight, FileText } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";

// Import fallback images
import koutaba from "@/assets/Abbaye_de_Koutaba_6_-_Vue_générale.jpg";
import palace from "@/assets/Le-Palais-du-sultan-de-Foumban-au-Cameroun.jpg";
import museum from "@/assets/Musée-du-palais-de-Foumban.jpg";
import landscape from "@/assets/foumban-landscape.jpg";

const fallbackImages = [koutaba, palace, museum, landscape];

const ProgramCard = ({ programme, delay, index }: { programme: any; delay: number; index: number }) => {
    const { t } = useTranslation();
    const imageUrl = programme.imageUrl ? api.getMediaViewUrl(programme.imageUrl) : fallbackImages[index % fallbackImages.length];
    
    return (
        <AnimatedSection delay={delay}>
            <motion.div
                whileHover={{ y: -10 }}
                className="relative group h-[500px] w-full rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500"
            >
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src={imageUrl}
                        alt={programme.activity}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Multi-layer Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                {/* Floating Bookmark/Icon */}
                <div className="absolute top-6 right-6">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                        <FileText size={18} />
                    </div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] uppercase tracking-widest font-bold border border-white/20">
                            Jour {programme.dayOrder}
                        </span>
                        <span className="text-secondary/90 text-sm font-bold tracking-wide">
                            {new Date(programme.date).toLocaleDateString('fr-FR')}
                        </span>
                    </div>

                    <h3 className="font-display text-3xl font-bold mb-3 group-hover:text-secondary transition-colors">
                        {programme.activity}
                    </h3>

                    <div className="flex items-center gap-4 text-white/70 text-sm mb-4">
                        <div className="flex items-center gap-1">
                            <Clock size={16} />
                            {programme.startTime.substring(0, 5)} - {programme.endTime?.substring(0, 5) || '...'}
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin size={16} />
                            {programme.location}
                        </div>
                    </div>

                    {programme.pdfUrl && (
                        <motion.a
                            href={api.getMediaViewUrl(programme.pdfUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full py-4 bg-white text-primary font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-secondary hover:text-black transition-all shadow-xl"
                        >
                            {t('program.download')} <Download size={18} />
                        </motion.a>
                    )}
                </div>
            </motion.div>
        </AnimatedSection>
    );
};

const ProgramSection = () => {
    const { t } = useTranslation();
    const [programmes, setProgrammes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProgrammes();
    }, []);

    const loadProgrammes = async () => {
        try {
            const data = await api.getProgrammes();
            const published = data.filter((p: any) => p.published).sort((a: any, b: any) => a.dayOrder - b.dayOrder);
            setProgrammes(published);
        } catch (error) {
            console.error('Failed to load programmes:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="programme" className="section-padding bg-warm-white relative overflow-hidden">
            {/* Decorative patterns */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-background to-transparent opacity-50" />

            <div className="container mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <AnimatedSection className="max-w-2xl">
                        <p className="text-secondary font-body text-sm uppercase tracking-[0.3em] mb-4 font-semibold">{t('program.subtitle')}</p>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-5xl font-bold text-foreground mb-4">
                            {t('program.title')}
                        </h2>
                        <p className="text-muted-foreground font-body text-lg">
                            {t('program.description')}
                        </p>
                    </AnimatedSection>

                    <AnimatedSection delay={0.2}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 px-8 py-5 bg-primary text-white rounded-2xl font-bold shadow-xl hover:bg-primary/90 transition-all group"
                        >
                            <FileText className="group-hover:rotate-12 transition-transform" />
                            {t('program.download_pdf')}
                        </motion.button>
                    </AnimatedSection>
                </div>

                {/* 4-column Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : programmes.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {programmes.map((programme, i) => (
                            <ProgramCard key={programme.id} programme={programme} delay={i * 0.1} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">{t('program.no_programmes')}</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProgramSection;
