import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import equinox from "@/assets/equinox.png";
import edclogo from "@/assets/EDClogo.png";
import crtv from "@/assets/crtv.png";
import logo1 from "@/assets/logo1.png";
import sourcelogo from "@/assets/sourcelogo.png";
import canal2 from "@/assets/canal2.png";
import balafon from "@/assets/balafon.png";

const partners = [
    { name: "Equinox", logo: equinox },
    { name: "EDC", logo: edclogo },
    { name: "CRTV", logo: crtv },
    { name: "Orange", logo: logo1 },
    { name: "Source du Pays", logo: sourcelogo },
    { name: "Canal 2", logo: canal2 },
    { name: "Balafon", logo: balafon },
];

const PartnersSection = () => {
    const { t } = useTranslation();

    // Duplicate the partners array to create a seamless loop
    const doubledPartners = [...partners, ...partners];

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
                    {doubledPartners.map((partner, index) => (
                        <div
                            key={`${partner.name}-${index}`}
                            className="flex-shrink-0 mx-12 md:mx-16 lg:mx-20 flex items-center justify-center opacity-90 hover:opacity-100 transition-all duration-500 transform hover:scale-110"
                        >
                            <img
                                src={partner.logo}
                                alt={partner.name}
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
