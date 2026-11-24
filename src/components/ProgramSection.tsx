import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Download, Calendar, Clock, MapPin, ChevronRight, FileText } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./heritage/SectionHeading";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { pageCache } from "@/lib/pageCache";
import LazyMedia from "@/components/LazyMedia";

// Import fallback images
import koutaba from "@/assets/Abbaye_de_Koutaba_6_-_Vue_générale.jpg";
import palace from "@/assets/Le-Palais-du-sultan-de-Foumban-au-Cameroun.jpg";
import museum from "@/assets/Musée-du-palais-de-Foumban.jpg";
import landscape from "@/assets/foumban-landscape.jpg";

const fallbackImages = [koutaba, palace, museum, landscape];

const PROTECTED_TERMS = ['Nguon', 'Sha’Pam', 'Ncharé Yen', 'Bamoun', 'Foumban', 'NGUON'];

const protectTerms = (text: string) => {
    if (!text) return "";
    let protectedText = text;
    PROTECTED_TERMS.forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        protectedText = protectedText.replace(regex, `<span class="notranslate">${term}</span>`);
    });
    return protectedText;
};

import { useTranslate } from "@/hooks/useTranslate";

const ProgramCard = ({ programme, delay, index }: { programme: any; delay: number; index: number }) => {
    const { t, i18n } = useTranslation();

    const protectedActivity = useMemo(() => protectTerms(programme.activity), [programme.activity]);
    const protectedLocation = useMemo(() => protectTerms(programme.location), [programme.location]);
    const { translatedText: activity } = useTranslate(protectedActivity);
    const { translatedText: location } = useTranslate(protectedLocation);

    return (
        <AnimatedSection delay={delay}>
            <motion.div
                whileHover={{ y: -10 }}
                className="relative group h-[500px] w-full rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500"
            >
                {/* Background Image */}
                <div className="absolute inset-0">
                    <LazyMedia
                        presignedUrl={programme.imagePresignedUrl}
                        rawPath={programme.imageUrl}
                        fallback={fallbackImages[index % fallbackImages.length]}
                        alt={programme.activity}
                        className="absolute inset-0 w-full h-full"
                        imgProps={{ className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" }}
                    />
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
                            {t('program.day')} {programme.dayOrder}
                        </span>
                        <span className="text-secondary/90 text-sm font-bold tracking-wide">
                            {new Date(programme.date).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'fr-FR')}
                        </span>
                    </div>

                    <h3 className="font-display text-3xl font-bold mb-3 group-hover:text-secondary transition-colors" dangerouslySetInnerHTML={{ __html: activity }} />

                    <div className="flex items-center gap-4 text-white/70 text-sm mb-4">
                        <div className="flex items-center gap-1">
                            <Clock size={16} />
                            {programme.startTime.substring(0, 5)} - {programme.endTime?.substring(0, 5) || '...'}
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin size={16} />
                            <span dangerouslySetInnerHTML={{ __html: location }} />
                        </div>
                    </div>

                    {programme.pdfUrl && (
                        <motion.a
                            href={programme.pdfPresignedUrl ?? `${import.meta.env.VITE_API_BASE_URL}/files/view/${programme.pdfUrl}`}
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
        const cached = pageCache.get<any[]>('programmes');
        if (cached) { setProgrammes(cached); setLoading(false); return; }
        try {
            const data = await api.getProgrammes();
            const published = data.filter((p: any) => p.published !== false).sort((a: any, b: any) => a.dayOrder - b.dayOrder);
            pageCache.set('programmes', published);
            setProgrammes(published);
        } catch (error) {
            console.error('Failed to load programmes:', error);
        } finally {
            setLoading(false);
        }
    };

    const mainPdf = programmes.find((p: any) => p.pdfUrl);

    return (
        <section id="programme" className="section-padding bg-paper relative overflow-hidden">
            <div className="container mx-auto relative z-10">
                <SectionHeading
                    title={t('program.title')}
                    lead={t('program.description')}
                    action={mainPdf ? (
                        <a
                            href={mainPdf.pdfPresignedUrl ?? `${import.meta.env.VITE_API_BASE_URL}/files/view/${mainPdf.pdfUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-6 py-3.5 bg-navy text-white rounded-2xl font-display font-bold shadow-[0_12px_28px_-14px_rgba(0,30,50,0.6)] hover:bg-navy-deep active:scale-[0.98] transition group"
                        >
                            <FileText size={18} className="text-secondary" />
                            {t('program.download_pdf')}
                        </a>
                    ) : undefined}
                />

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
