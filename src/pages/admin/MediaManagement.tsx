import { useState } from "react";
import { motion } from "framer-motion";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Image as ImageIcon,
    CheckCircle2,
    XCircle,
    Edit2,
    Trash2
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const mediaItems = [
    { id: 1, title: "Parade Impériale", type: "Image", url: "/galerie1.jpg", published: true, date: "2026-02-10" },
    { id: 2, title: "Rituels de bénédiction", type: "Vidéo", url: "youtube.com/...", published: false, date: "2026-02-11" },
    { id: 3, title: "Artisanat Bamoun", type: "Image", url: "/galerie2.jpg", published: true, date: "2026-02-12" },
    { id: 4, title: "Discours d'ouverture", type: "Vidéo", url: "vimeo.com/...", published: true, date: "2026-02-12" },
];

const MediaManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">Galerie Média</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body">Gérez les photos et vidéos de l'événement.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                    <Plus size={20} />
                    Nouveau Média
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un média..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all font-body text-sm"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 transition-all">
                    <Filter size={18} />
                    Filtres
                </button>
            </div>

            {/* Media Table */}
            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden font-body">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Média</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Type</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Date</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Statut</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {mediaItems.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-400">
                                            <ImageIcon size={20} />
                                        </div>
                                        <span className="font-semibold text-slate-800 dark:text-white">{item.title}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.type}</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.date}</td>
                                <td className="px-6 py-4">
                                    {item.published ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold">
                                            <CheckCircle2 size={12} /> Publié
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-400 rounded-full text-[10px] font-bold">
                                            <XCircle size={12} /> Brouillon
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-primary transition-all">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-red-500 transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MediaManagement;
