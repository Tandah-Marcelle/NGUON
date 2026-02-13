import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const RolesCreate = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: "", description: "" });

    useEffect(() => {
        if (isEditMode) {
            loadRole();
        }
    }, [id]);

    const loadRole = async () => {
        try {
            const data = await api.getRoleById(Number(id));
            setFormData({ name: data.name, description: data.description });
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger le rôle", variant: "destructive" });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditMode) {
                await api.updateRole(Number(id), formData);
                toast({ title: "Succès", description: "Rôle mis à jour" });
            } else {
                await api.createRole(formData);
                toast({ title: "Succès", description: "Rôle créé" });
            }
            navigate("/admin/roles");
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible d'enregistrer le rôle", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate("/admin/roles")} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">
                        {isEditMode ? "Modifier le Rôle" : "Créer un Rôle"}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body">
                        {isEditMode ? "Modifiez les informations du rôle." : "Ajoutez un nouveau rôle."}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nom du rôle</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all resize-none"
                            required
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/roles")}
                            className="flex-1 py-3 px-6 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-6 bg-slate-800 text-white rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
                        >
                            {loading ? "Enregistrement..." : isEditMode ? "Mettre à jour" : "Créer le rôle"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RolesCreate;
