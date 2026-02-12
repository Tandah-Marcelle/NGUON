import { motion } from "framer-motion";
import { Download, Calendar, Clock, MapPin, ChevronRight, FileText } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

// Import images for cards
import koutaba from "@/assets/Abbaye_de_Koutaba_6_-_Vue_générale.jpg";
import palace from "@/assets/Le-Palais-du-sultan-de-Foumban-au-Cameroun.jpg";
import museum from "@/assets/Musée-du-palais-de-Foumban.jpg";
import landscape from "@/assets/foumban-landscape.jpg";

const programDays = [
    {
        day: "Jour 1",
        date: "Vendredi 04 Dec",
        title: "Ouverture Officielle",
        desc: "Cérémonie d'ouverture avec la parade impériale et les premiers rituels de bénédiction.",
        time: "09:00 - 18:00",
        location: "Place des Fêtes",
        tags: ["Parade", "Cérémonie"],
        image: koutaba,
    },
    {
        day: "Jour 2",
        date: "Samedi 05 Dec",
        title: "Rituels Secrètes",
        desc: "Entrée solennelle de la société secrète au Palais et rituels de gouvernance.",
        time: "10:00 - 20:00",
        location: "Cour Royale",
        tags: ["Rituels", "Gouvernance"],
        image: palace,
    },
    {
        day: "Jour 3",
        date: "Dimanche 06 Dec",
        title: "Concours de Danse",
        desc: "Grand rassemblement des groupes de danse traditionnelle du Noun.",
        time: "08:00 - 17:00",
        location: "Esplanade du Palais",
        tags: ["Culture", "Danse"],
        image: museum,
    },
    {
        day: "Jour 4",
        date: "Lundi 07 Dec",
        title: "Clôture & Marché",
        desc: "Foire artisanale, gastronomie locale et festivités de clôture du Nguon.",
        time: "09:00 - 15:00",
        location: "Village du Festival",
        tags: ["Artisanat", "Clôture"],
        image: landscape,
    },
];

const ProgramCard = ({ day, delay }: { day: any; delay: number }) => {
    return (
        <AnimatedSection delay={delay}>
            <motion.div
                whileHover={{ y: -10 }}
                className="relative group h-[500px] w-full rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500"
            >
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src={day.image}
                        alt={day.title}
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
                            {day.day}
                        </span>
                        <span className="text-secondary/90 text-sm font-bold tracking-wide">
                            {day.date}
                        </span>
                    </div>

                    <h3 className="font-display text-3xl font-bold mb-3 group-hover:text-secondary transition-colors">
                        {day.title}
                    </h3>

                    <p className="text-white/70 font-body text-sm mb-6 line-clamp-3 leading-relaxed">
                        {day.desc}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {day.tags.map((tag: string) => (
                            <span key={tag} className="px-4 py-1.5 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/10">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-4 bg-white text-primary font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-secondary hover:text-black transition-all shadow-xl"
                    >
                        Télécharger <Download size={18} />
                    </motion.button>
                </div>
            </motion.div>
        </AnimatedSection>
    );
};

const ProgramSection = () => {
    return (
        <section id="programme" className="section-padding bg-warm-white relative overflow-hidden">
            {/* Decorative patterns */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-background to-transparent opacity-50" />

            <div className="container mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <AnimatedSection className="max-w-2xl">
                        <p className="text-secondary font-body text-sm uppercase tracking-[0.3em] mb-4 font-semibold">Calendrier du Festival</p>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-5xl font-bold text-foreground mb-4">
                            Programme détaillé
                        </h2>
                        <p className="text-muted-foreground font-body text-lg">
                            Ne manquez aucun moment fort de cette édition exceptionnelle du Nguon.
                        </p>
                    </AnimatedSection>

                    <AnimatedSection delay={0.2}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 px-8 py-5 bg-primary text-white rounded-2xl font-bold shadow-xl hover:bg-primary/90 transition-all group"
                        >
                            <FileText className="group-hover:rotate-12 transition-transform" />
                            Télécharger le programme PDF
                        </motion.button>
                    </AnimatedSection>
                </div>

                {/* 4-column Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {programDays.map((day, i) => (
                        <ProgramCard key={day.day} day={day} delay={i * 0.1} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProgramSection;
