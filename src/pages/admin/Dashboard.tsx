import { motion } from "framer-motion";
import {
    Users,
    Image as ImageIcon,
    Calendar,
    TrendingUp,
    Clock,
    ArrowUpRight
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const stats = [
    { label: "Visiteurs attendus", value: "500,000+", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Média validés", value: "124", icon: ImageIcon, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Événements", value: "32", icon: Calendar, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Engagement", value: "+12%", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
];

const Dashboard = () => {
    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">Bonjour, Administrateur</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body">Voici l'état actuel de la plateforme Nguon 2026.</p>
                </div>
                <div className="flex items-center gap-3 text-sm font-body px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl shadow-sm">
                    <Clock size={16} className="text-primary" />
                    <span className="text-slate-600 dark:text-slate-300">Dernière mise à jour: Aujourd'hui à 14:30</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <AnimatedSection key={stat.label} delay={i * 0.1}>
                        <div className="bg-white dark:bg-card p-6 rounded-[2rem] shadow-sm border border-slate-200 dark:border-white/5 hover:shadow-xl transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div className="text-green-500 bg-green-500/10 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                                    <ArrowUpRight size={10} /> 2.5%
                                </div>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</h3>
                        </div>
                    </AnimatedSection>
                ))}
            </div>

            {/* Main Grid Content */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        Activités récentes
                    </h2>
                    <div className="bg-white dark:bg-card rounded-[2.5rem] p-8 shadow-sm border border-slate-200 dark:border-white/5 space-y-6">
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="flex items-start gap-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                    <ImageIcon className="text-slate-400" size={18} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">Nouveau média ajouté à la galerie</p>
                                    <p className="text-xs text-slate-500 mt-1">"Parade impériale - Jour 1" par Admin</p>
                                    <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-tighter">
                                        <Clock size={10} /> Il y a 2 heures
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
                        Actions rapides
                    </h2>
                    <div className="grid gap-4">
                        <button className="flex items-center gap-4 p-4 bg-primary text-white rounded-2xl hover:opacity-90 transition-all font-body text-sm font-bold shadow-lg shadow-primary/20">
                            <ImageIcon size={20} />
                            Ajouter un média
                        </button>
                        <button className="flex items-center gap-4 p-4 bg-secondary text-primary rounded-2xl hover:opacity-90 transition-all font-body text-sm font-bold shadow-lg shadow-secondary/10">
                            <Calendar size={20} />
                            Nouvel événement
                        </button>
                        <button className="flex items-center gap-4 p-4 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all font-body text-sm font-bold shadow-sm">
                            <Users size={20} />
                            Gérer les accès
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
