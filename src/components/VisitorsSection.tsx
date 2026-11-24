import { Hotel, Plane as PlaneIcon, MapPin, Car, ArrowRight, CalendarCheck } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./heritage/SectionHeading";
import { NdopTexture } from "./heritage/Motif";
import landscape from "@/assets/foumban-landscape.jpg";
import { useTranslation, Trans } from "react-i18next";
import { Link } from "react-router-dom";

const VisitorsSection = () => {
    const { t } = useTranslation();
    return (
        <section id="visiteurs" className="section-padding bg-paper relative overflow-hidden">
            <div className="container mx-auto relative z-10">
                <SectionHeading
                    title={<Trans i18nKey="visitors.title" components={{ 0: <span className="text-primary" /> }} />}
                    lead={t('visitors.subtitle')}
                />

                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                    {/* Accommodation */}
                    <AnimatedSection delay={0.05}>
                        <div className="relative overflow-hidden rounded-3xl bg-navy text-white shadow-[0_26px_50px_-28px_rgba(0,30,50,0.65)]">
                            <div className="relative h-52 md:h-60">
                                <img src={landscape} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
                            </div>
                            <NdopTexture opacity={0.06} fade="bottom" className="top-52 md:top-60" />
                            <div className="relative px-7 pb-8 -mt-10 md:px-9">
                                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-5 shadow-lg">
                                    <Hotel className="w-6 h-6 text-navy" />
                                </div>
                                <h3 className="font-display text-2xl md:text-3xl font-black mb-3">{t('visitors.accommodation.title')}</h3>
                                <p className="text-white/80 font-body text-base leading-relaxed mb-6">
                                    <Trans i18nKey="visitors.accommodation.desc" components={{ 0: <span className="text-secondary font-semibold" /> }} />
                                </p>
                                <div className="border-t border-white/15 pt-5 mb-6">
                                    <p className="font-display font-bold text-white">{t('visitors.accommodation.cta_title')}</p>
                                    <p className="text-sm text-white/65 mt-1">{t('visitors.accommodation.cta_desc')}</p>
                                </div>
                                <Link
                                    to="/booking"
                                    className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-navy font-display font-black px-5 py-4 rounded-2xl shadow-[0_14px_30px_-14px_rgba(255,204,0,0.6)] transition active:scale-[0.98]"
                                >
                                    <CalendarCheck size={18} /> {t('visitors.accommodation.cta_button')} <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Access */}
                    <AnimatedSection delay={0.12}>
                        <h3 className="font-display text-2xl md:text-3xl font-black text-foreground mb-2 flex items-center gap-3">
                            <MapPin className="text-primary" /> {t('visitors.access.title')}
                        </h3>
                        <div className="divide-y divide-foreground/10 border-y border-foreground/10 mt-6">
                            <div className="py-7">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-11 h-11 rounded-xl bg-navy text-secondary flex items-center justify-center">
                                        <PlaneIcon size={20} />
                                    </div>
                                    <h4 className="font-display text-xl font-black text-foreground">{t('visitors.access.plane.title')}</h4>
                                </div>
                                <p className="text-foreground/75 font-body leading-relaxed">{t('visitors.access.plane.desc')}</p>
                                <p className="mt-3 flex items-center gap-2 text-primary font-display font-bold text-sm">
                                    Douala / Yaoundé <ArrowRight size={14} /> Bafoussam
                                </p>
                            </div>
                            <div className="py-7">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-11 h-11 rounded-xl bg-navy text-secondary flex items-center justify-center">
                                        <Car size={20} />
                                    </div>
                                    <h4 className="font-display text-xl font-black text-foreground">{t('visitors.access.road.title')}</h4>
                                </div>
                                <p className="text-foreground/75 font-body leading-relaxed mb-4">{t('visitors.access.road.desc')}</p>
                                <div className="flex flex-wrap gap-2">
                                    {["Yaoundé", "Douala", "Bafoussam"].map((city) => (
                                        <span key={city} className="px-4 py-1.5 bg-background rounded-full text-sm font-medium border border-foreground/10">
                                            {city}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
};

export default VisitorsSection;
