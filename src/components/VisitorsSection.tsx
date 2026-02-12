import { motion } from "framer-motion";
import { Hotel, Plane as PlaneIcon, MapPin, Car, Info } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import LottieAnimation from "./LottieAnimation";
import planeAnimation from "@/assets/Plane.json";

const VisitorsSection = () => {
    return (
        <section id="visiteurs" className="section-padding bg-background relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-4 relative z-10">
                <AnimatedSection className="text-center mb-16">
                    <p className="text-secondary font-body text-sm uppercase tracking-[0.3em] mb-4 font-semibold italic">Informations Pratiques</p>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                        Festivaliers & <span className="text-primary">Visiteurs</span>
                    </h2>
                    <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-8" />
                </AnimatedSection>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Accommodation Column */}
                    <AnimatedSection delay={0.1}>
                        <div className="bg-primary rounded-3xl p-8 shadow-xl border border-primary/50 h-full hover:shadow-primary/20 transition-all text-white relative overflow-hidden group">
                            {/* Decorative accent */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />

                            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                                <Hotel className="w-8 h-8 text-secondary" />
                            </div>
                            <h3 className="font-display text-2xl font-bold mb-4 text-white">Hébergement</h3>
                            <p className="text-white/90 font-body text-lg leading-relaxed mb-6">
                                Solutions d’hébergement disponibles à <span className="text-secondary font-semibold">Foumban</span> et environs.
                            </p>
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-start gap-4">
                                <Info className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                                <p className="text-sm text-white/80 font-medium">
                                    <span className="text-secondary font-bold">Détails à venir :</span> Prochainement, une liste d'hôtels et résidences partenaires sera disponible ici.
                                </p>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Access Column */}
                    <AnimatedSection delay={0.2}>
                        <div className="space-y-6">
                            <h3 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
                                <MapPin className="text-primary" /> Accès au festival
                            </h3>

                            {/* By Plane */}
                            <div className="relative bg-primary/5 rounded-3xl p-8 border border-primary/10 overflow-hidden group">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center">
                                            <PlaneIcon size={24} />
                                        </div>
                                        <h4 className="font-display text-xl font-bold">Par avion</h4>
                                    </div>
                                    <p className="text-muted-foreground font-body">
                                        Liaisons aériennes régulières vers l'aéroport de Koutaba (Bafoussam).
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 text-primary font-semibold">
                                        <span>Douala / Yaoundé</span>
                                        <motion.span
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                        >
                                            →
                                        </motion.span>
                                        <span>Bafoussam</span>
                                    </div>
                                </div>

                                {/* Plane Lottie Animation */}
                                <div className="absolute top-1/2 right-[-50px] -translate-y-1/2 w-64 h-64 pointer-events-none opacity-100 transition-opacity duration-500">
                                    <LottieAnimation
                                        animationData={planeAnimation}
                                        loop={true}
                                    />
                                </div>
                            </div>

                            {/* By Road */}
                            <div className="bg-white dark:bg-card rounded-3xl p-8 shadow-sm border border-border/50 hover:shadow-md transition-all">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-secondary text-white flex items-center justify-center">
                                        <Car size={24} />
                                    </div>
                                    <h4 className="font-display text-xl font-bold">Par route</h4>
                                </div>
                                <p className="text-muted-foreground font-body mb-4">
                                    Axes routiers principaux desservant la cité impériale de Foumban.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {["Yaoundé", "Douala", "Bafoussam"].map((city) => (
                                        <span
                                            key={city}
                                            className="px-4 py-2 bg-muted rounded-full text-sm font-medium border border-border/50"
                                        >
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
