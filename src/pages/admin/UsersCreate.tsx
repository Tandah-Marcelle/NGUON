import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const UsersCreate = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        roleId: "",
        active: true
    });

    useEffect(() => {
        loadRoles();
    }, []);

    useEffect(() => {
        if (isEditMode) {
            loadUser();
        } else {
            setFormData({
                username: "",
                password: "",
                email: "",
                roleId: "",
                active: true
            });
        }
    }, [id, isEditMode]);

    const loadRoles = async () => {
        try {
            const data = await api.getRoles();
            setRoles(data);
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger les rôles", variant: "destructive" });
        }
    };

    const loadUser = async () => {
        try {
            const data = await api.getUserById(Number(id));
            setFormData({
                username: data.username,
                password: "",
                email: data.email,
                roleId: data.role?.id || "",
                active: data.active
            });
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger l'utilisateur", variant: "destructive" });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.roleId) {
            toast({ title: "Erreur", description: "Veuillez sélectionner un rôle", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            const payload = {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                role: { id: Number(formData.roleId) },
                active: formData.active
            };
            if (isEditMode) {
                await api.updateUser(Number(id), payload);
                toast({ title: "Succès", description: "Utilisateur mis à jour" });
            } else {
                await api.createUser(payload);
                toast({ title: "Succès", description: "Utilisateur créé" });
            }
            navigate("/admin/users");
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible d'enregistrer l'utilisateur", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate("/admin/users")} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">
                        {isEditMode ? "Modifier l'Utilisateur" : "Créer un Utilisateur"}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body">
                        {isEditMode ? "Modifiez les informations de l'utilisateur." : "Ajoutez un nouvel utilisateur."}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nom d'utilisateur</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Mot de passe {isEditMode && "(laisser vide pour ne pas changer)"}
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                            required={!isEditMode}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Rôle</label>
                        <select
                            value={formData.roleId}
                            onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                            required
                        >
                            <option value="">Sélectionner un rôle</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="active"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            className="w-5 h-5 rounded border-slate-300"
                        />
                        <label htmlFor="active" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            Compte actif
                        </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/users")}
                            className="flex-1 py-3 px-6 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-6 bg-slate-800 text-white rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
                        >
                            {loading ? "Enregistrement..." : isEditMode ? "Mettre à jour" : "Créer l'utilisateur"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UsersCreate;
