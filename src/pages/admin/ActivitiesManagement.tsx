import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    CheckCircle2,
    XCircle,
    Activity
} from "lucide-react";

const activities = [
    { id: 1, name: "Danse traditionnelle", description: "Spectacle de danse Bamoun avec costumes traditionnels", published: true, createdAt: "2026-02-10" },
    { id: 2, name: "Exposition artisanale", description: "Présentation des œuvres d'art et artisanat local", published: true, createdAt: "2026-02-11" },
    { id: 3, name: "Conférence historique", description: "Histoire et culture du royaume Bamoun", published: false, createdAt: "2026-02-12" },
];

const ActivitiesManagement = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">Activités</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body">Gérez les activités du festival.</p>
                </div>
                <button 
                    onClick={() => navigate("/admin/activities/create")}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                    <Plus size={20} />
                    Nouvelle Activité
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Rechercher une activité..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all font-body text-sm"
                />
            </div>

            {/* Activities Table */}
            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden font-body">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Activité</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Description</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Date</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Statut</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {activities.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <Activity size={20} />
                                        </div>
                                        <span className="font-semibold text-slate-800 dark:text-white">{item.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">{item.description}</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.createdAt}</td>
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
                                        <button 
                                            onClick={() => navigate(`/admin/activities/edit/${item.id}`)}
                                            className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-primary transition-all"
                                        >
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

export default ActivitiesManagement;
