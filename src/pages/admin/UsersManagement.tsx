import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Trash2, Edit2, User, CheckCircle, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const UsersManagement = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await api.getUsers();
            setUsers(data);
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger les utilisateurs", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.deleteUser(id);
            toast({ title: "Succès", description: "Utilisateur supprimé" });
            loadUsers();
            setDeleteId(null);
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de supprimer l'utilisateur", variant: "destructive" });
        }
    };

    const filteredUsers = users.filter(u => 
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">Utilisateurs</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body">Gérez les comptes utilisateurs de la plateforme.</p>
                </div>
                <button 
                    onClick={() => navigate("/admin/users/create")}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform"
                >
                    <Plus size={20} />
                    Créer un utilisateur
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all font-body text-sm"
                />
            </div>

            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden font-body">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Utilisateur</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Email</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Rôle</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Statut</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <User size={20} />
                                        </div>
                                        <p className="font-semibold text-slate-800 dark:text-white">{user.username}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{user.email}</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{user.role?.name}</td>
                                <td className="px-6 py-4">
                                    {user.active ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold">
                                            <CheckCircle size={12} /> Actif
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-[10px] font-bold">
                                            <XCircle size={12} /> Inactif
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                                            className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-primary transition-all"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => setDeleteId(user.id)}
                                            className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {deleteId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-card rounded-3xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">Êtes-vous sûr de vouloir supprimer cet utilisateur?</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5">Annuler</button>
                            <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600">Supprimer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManagement;
