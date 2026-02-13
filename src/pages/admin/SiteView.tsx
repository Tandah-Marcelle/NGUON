import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Edit } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const SiteView = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();
    const [site, setSite] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSite();
    }, [id]);

    const loadSite = async () => {
        try {
            const data = await api.getSiteById(Number(id));
            setSite(data);
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger le site", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    }

    if (!site) {
        return <div>Site non trouvé</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate("/admin/sites")}
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Retour aux sites</span>
                </button>
                <button
                    onClick={() => navigate(`/admin/sites/edit/${id}`)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all"
                >
                    <Edit size={20} />
                    Modifier
                </button>
            </div>

            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden">
                <div className="h-96 overflow-hidden">
                    <img src={api.getMediaViewUrl(site.image)} alt={site.townTitle} className="w-full h-full object-cover" />
                </div>
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <MapPin size={32} className="text-primary" />
                        <h1 className="font-display text-4xl font-bold text-slate-800 dark:text-white">{site.townTitle}</h1>
                    </div>

                    <div>
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Quartiers</h2>
                        <div className="flex flex-wrap gap-3">
                            {site.subTownTitles?.map((sub: string, i: number) => (
                                <span key={i} className="px-4 py-2 bg-primary/10 text-primary text-base rounded-xl font-medium">
                                    {sub}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteView;
