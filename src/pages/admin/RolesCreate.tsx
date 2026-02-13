import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";

const RolesCreate = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    // Mock data - replace with API call
    const roles = [
        { id: 1, name: "Super Admin", description: "Accès total à toute la plateforme et gestion des utilisateurs.", users: 2 },
        { id: 2, name: "Éditeur", description: "Gestion des médias et du programme uniquement.", users: 5 },
        { id: 3, name: "Modérateur", description: "Validation des commentaires et retours visiteurs.", users: 3 },
    ];

    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });

    useEffect(() => {
        if (isEditMode) {
            const role = roles.find(r => r.id === parseInt(id));
            if (role) {
                setFormData({
                    name: role.name,
                    description: role.description
                });
            }
        }
    }, [id, isEditMode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement API call to create/update role
        console.log(isEditMode ? "Updating role:" : "Creating role:", formData);
        navigate("/admin/roles");
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/admin/roles")}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">
                        {isEditMode ? "Modifier le Rôle" : "Créer un Rôle"}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body">
                        {isEditMode ? "Modifiez les informations du rôle." : "Ajoutez un nouveau rôle avec des permissions."}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Nom du rôle
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Description
                        </label>
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
                            className="flex-1 py-3 px-6 bg-slate-800 text-white rounded-2xl font-bold shadow-lg shadow-black/10 hover:scale-105 transition-transform"
                        >
                            {isEditMode ? "Mettre à jour" : "Créer le rôle"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RolesCreate;
