import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Edit, Trash2, MapPin } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Sites = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [sites, setSites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSites();
    }, []);

    const loadSites = async () => {
        try {
            const data = await api.getSites();
            setSites(data);
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger les sites", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce site ?")) return;

        try {
            await api.deleteSite(id);
            toast({ title: "Succès", description: "Site supprimé avec succès" });
            loadSites();
        } catch (error) {
            toast({ title: "Erreur", description: "Échec de la suppression", variant: "destructive" });
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white">Sites de Manifestation</h1>
                <button
                    onClick={() => navigate("/admin/sites/create")}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all shadow-lg"
                >
                    <Plus size={20} />
                    Ajouter un Site
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sites.map((site) => (
                    <div key={site.id} className="bg-white dark:bg-card rounded-[2rem] shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden hover:shadow-xl transition-all">
                        <div className="h-48 overflow-hidden">
                            <img src={site.image} alt={site.townTitle} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <MapPin size={20} className="text-primary" />
                                <h3 className="font-display text-xl font-bold text-slate-800 dark:text-white">{site.townTitle}</h3>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {site.subTownTitles?.map((sub: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">{sub}</span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/admin/sites/${site.id}`)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500/20 transition-all"
                                >
                                    <Eye size={16} />
                                    Voir
                                </button>
                                <button
                                    onClick={() => navigate(`/admin/sites/edit/${site.id}`)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-500 rounded-xl hover:bg-orange-500/20 transition-all"
                                >
                                    <Edit size={16} />
                                    Modifier
                                </button>
                                <button
                                    onClick={() => handleDelete(site.id)}
                                    className="flex items-center justify-center px-4 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {sites.length === 0 && (
                <div className="text-center py-12">
                    <MapPin size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500">Aucun site trouvé</p>
                </div>
            )}
        </div>
    );
};

export default Sites;
