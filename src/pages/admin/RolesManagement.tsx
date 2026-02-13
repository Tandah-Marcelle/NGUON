import {
    ShieldCheck,
    Plus,
    Trash2,
    Edit2,
    Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";

const roles = [
    { id: 1, name: "Super Admin", description: "Accès total à toute la plateforme et gestion des utilisateurs.", users: 2 },
    { id: 2, name: "Éditeur", description: "Gestion des médias et du programme uniquement.", users: 5 },
    { id: 3, name: "Modérateur", description: "Validation des commentaires et retours visiteurs.", users: 3 },
];

const RolesManagement = () => {
    const navigate = useNavigate();
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">Rôles & Accès</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body">Gérez les permissions et les rôles des utilisateurs de la plateforme.</p>
                </div>
                <button 
                    onClick={() => navigate("/admin/roles/create")}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-2xl font-bold shadow-lg shadow-black/10 hover:scale-105 transition-transform"
                >
                    <Plus size={20} />
                    Créer un rôle
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role, i) => (
                    <AnimatedSection key={role.id} delay={i * 0.1}>
                        <div className="bg-white dark:bg-card h-full p-8 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 flex flex-col hover:shadow-xl transition-all">
                            <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white mb-6">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="font-display text-xl font-bold text-slate-800 dark:text-white mb-3">
                                {role.name}
                            </h3>
                            <p className="font-body text-sm text-slate-500 leading-relaxed mb-8 flex-1">
                                {role.description}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
                                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                    <Users size={16} />
                                    {role.users} utilisateurs
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => navigate(`/admin/roles/edit/${role.id}`)}
                                        className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-primary transition-all"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-red-500 transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                ))}
            </div>
        </div>
    );
};

export default RolesManagement;
