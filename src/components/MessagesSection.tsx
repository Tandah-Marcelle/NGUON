import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import majesty from "@/assets/majesty.jpg";
import palaceInterior from "@/assets/palace-interior.jpg";
import { Quote } from "lucide-react";

const MessagesSection = () => {
    return (
        <section className="py-24 bg-white dark:bg-background overflow-hidden relative">
            <div className="container mx-auto px-4">
                {/* Sultan's Message */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                    <div className="relative order-2 lg:order-1">
                        <AnimatedSection direction="left">
                            {/* Main Portrait Container */}
                            <div className="relative w-full max-w-[500px] aspect-square mx-auto">
                                {/* Circular image with premium border */}
                                <div className="absolute inset-0 rounded-full border-[12px] border-primary/5 p-4 z-10">
                                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl">
                                        <img
                                            src={majesty}
                                            alt="Sa Majesté le Sultan"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Floating Bubbles - Inspired by reference */}
                                <motion.div
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-4 -left-12 md:-left-20 z-20 bg-white/80 dark:bg-card/80 backdrop-blur-xl p-4 md:p-6 rounded-2xl shadow-xl border border-primary/10 max-w-[280px]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Quote size={20} />
                                        </div>
                                        <div>
                                            <p className="font-display font-bold text-foreground text-sm">Sa Majesté</p>
                                            <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Sultan Roi des Bamoun</p>
                                        </div>
                                    </div>
                                    <p className="mt-3 font-body text-xs italic text-foreground/80 leading-relaxed">
                                        "Le Nguon est l'âme de notre peuple, un pont entre notre illustre passé et notre avenir commun."
                                    </p>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 12, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    className="absolute bottom-12 -right-8 md:-right-16 z-20 bg-primary text-white p-4 md:p-6 rounded-2xl shadow-2xl border border-secondary/20 max-w-[240px]"
                                >
                                    <p className="font-display font-bold text-secondary text-base mb-1">Tradition & Modernité</p>
                                    <p className="font-body text-xs text-white/90 leading-relaxed">
                                        Un héritage de paix et de développement pour les générations futures.
                                    </p>
                                </motion.div>

                                {/* Decorative background circle */}
                                <div className="absolute -inset-8 bg-primary/5 rounded-full -z-1" />
                            </div>
                        </AnimatedSection>
                    </div>

                    <div className="order-1 lg:order-2">
                        <AnimatedSection direction="right">
                            <p className="text-secondary font-body text-sm uppercase tracking-[0.3em] mb-4 font-semibold">Parole d'Honneur</p>
                            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
                                Message de <span className="text-primary italic">Sa Majesté</span> le Sultan
                            </h2>
                            <div className="space-y-6 text-muted-foreground font-body text-lg leading-relaxed">
                                <p>
                                    "Peuple Bamoun, Amis du Nguon, c'est avec une immense fierté que nous vous accueillons pour cette nouvelle édition de notre fête ancestrale.
                                    Le Nguon n'est pas seulement une célébration, c'est un serment de fidélité à nos ancêtres et un engagement envers le progrès."
                                </p>
                                <p>
                                    "Cette année, nous mettons l'accent sur l'unité et la transmission. Il est de notre devoir de préserver cette flamme qui illumine le Noun et rayonne au-delà de nos frontières."
                                </p>
                                <div className="pt-4">
                                    <p className="font-display font-bold text-foreground text-xl">Mouhammad-Nabil Mforifoum Mbombo Njoya</p>
                                    <p className="text-primary font-semibold italic">Sultan Roi des Bamoun</p>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>

                {/* Coordinator's Message */}
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <AnimatedSection direction="left">
                            <p className="text-secondary font-body text-sm uppercase tracking-[0.3em] mb-4 font-semibold">Organisation</p>
                            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
                                Mot du <span className="text-primary">Coordonnateur</span> National
                            </h2>
                            <div className="space-y-6 text-muted-foreground font-body text-lg leading-relaxed">
                                <p>
                                    "Notre défi est de faire de chaque édition du Nguon une expérience inoubliable. Nous travaillons sans relâche pour allier la rigueur ancestrale des rituels à l'excellence organisationnelle moderne."
                                </p>
                                <p>
                                    "Le Nguon est devenu une plateforme majeure de développement territorial. Bienvenue au cœur de la culture Bamoun."
                                </p>
                                <div className="pt-4">
                                    <p className="font-display font-bold text-foreground text-xl">M. Oumarou NCHARE</p>
                                    <p className="text-primary font-semibold italic">Coordonnateur National du Nguon</p>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>

                    <div className="relative">
                        <AnimatedSection direction="right">
                            <div className="relative group overflow-hidden rounded-[2.5rem] bg-warm-white p-2">
                                <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-xl">
                                    <img
                                        src={palaceInterior} // Using a placeholder for now, ideally coordinator portrait
                                        alt="Coordonnateur National"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                                </div>

                                {/* Decorative card overlay */}
                                <div className="absolute -bottom-6 -left-6 bg-secondary p-6 rounded-2xl shadow-xl z-20 hidden md:block">
                                    <p className="text-primary font-display font-bold text-2xl">Vision 2026</p>
                                    <p className="text-primary/70 font-body text-xs font-semibold">Excellence & Engagement</p>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MessagesSection;
