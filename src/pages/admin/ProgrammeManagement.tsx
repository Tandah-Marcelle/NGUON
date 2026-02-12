import { useState } from "react";
import {
    Plus,
    Calendar as CalendarIcon,
    MapPin,
    Clock,
    Edit2,
    Trash2,
    Search
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const programmes = [
    { id: 1, activity: "Cérémonie d'ouverture", location: "Place des Fêtes", date: "2026-12-04", startTime: "09:00", published: true },
    { id: 2, activity: "Spectacle de Danse", location: "Esplanade du Palais", date: "2026-12-05", startTime: "15:00", published: true },
    { id: 3, activity: "Foire Artisanale", location: "Village du Festival", date: "2026-12-06", startTime: "10:00", published: false },
];

const ProgrammeManagement = () => {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">Calendrier du Festival</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body">Gérez le programme détaillé des festivités.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-secondary text-primary rounded-2xl font-bold shadow-lg shadow-secondary/10 hover:scale-105 transition-transform">
                    <Plus size={20} />
                    Nouvel Événement
                </button>
            </div>

            {/* Simple Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Rechercher une activité..."
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 font-body text-sm"
                />
            </div>

            {/* Grid of Events */}
            <div className="grid gap-4">
                {programmes.map((item, i) => (
                    <AnimatedSection key={item.id} delay={i * 0.05}>
                        <div className="bg-white dark:bg-card p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex flex-col items-center justify-center text-primary">
                                    <p className="text-xs font-bold uppercase">{item.date.split('-')[1]}</p>
                                    <p className="text-2xl font-bold leading-none">{item.date.split('-')[2]}</p>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-display font-bold text-slate-800 dark:text-white text-lg">{item.activity}</h3>
                                    <div className="flex flex-wrap items-center gap-4 text-xs font-body text-slate-400">
                                        <span className="flex items-center gap-1.5"><Clock size={12} /> {item.startTime}</span>
                                        <span className="flex items-center gap-1.5"><MapPin size={12} /> {item.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-500 rounded-full text-[10px] font-bold uppercase mr-4">
                                    {item.published ? "Publié" : "Brouillon"}
                                </div>
                                <button className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-slate-400 hover:text-primary transition-all">
                                    <Edit2 size={18} />
                                </button>
                                <button className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-slate-400 hover:text-red-500 transition-all">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </AnimatedSection>
                ))}
            </div>
        </div>
    );
};

export default ProgrammeManagement;
