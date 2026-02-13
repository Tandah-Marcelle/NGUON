import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const SiteForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        image: "",
        townTitle: "",
        subTownTitles: [] as string[]
    });
    const [newSubTown, setNewSubTown] = useState("");

    useEffect(() => {
        if (id) {
            loadSite();
        }
    }, [id]);

    const loadSite = async () => {
        try {
            const data = await api.getSiteById(Number(id));
            setFormData(data);
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger le site", variant: "destructive" });
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const { presignedUrl } = await api.uploadSiteFile(file);
            setFormData({ ...formData, image: presignedUrl });
            toast({ title: "Succès", description: "Image téléchargée" });
        } catch (error) {
            toast({ title: "Erreur", description: "Échec du téléchargement", variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const addSubTown = () => {
        if (newSubTown.trim()) {
            setFormData({ ...formData, subTownTitles: [...formData.subTownTitles, newSubTown.trim()] });
            setNewSubTown("");
        }
    };

    const removeSubTown = (index: number) => {
        setFormData({ ...formData, subTownTitles: formData.subTownTitles.filter((_, i) => i !== index) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (id) {
                await api.updateSite(Number(id), formData);
                toast({ title: "Succès", description: "Site modifié avec succès" });
            } else {
                await api.createSite(formData);
                toast({ title: "Succès", description: "Site créé avec succès" });
            }
            navigate("/admin/sites");
        } catch (error) {
            toast({ title: "Erreur", description: "Échec de l'opération", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <button
                onClick={() => navigate("/admin/sites")}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Retour aux sites</span>
            </button>

            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 p-8">
                <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-8">
                    {id ? "Modifier le Site" : "Nouveau Site"}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 block">Image</label>
                        {formData.image && (
                            <div className="mb-4">
                                <img src={formData.image} alt="Preview" className="w-full h-48 object-cover rounded-2xl" />
                            </div>
                        )}
                        <label className="flex items-center justify-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-2xl hover:bg-primary/20 transition-all cursor-pointer">
                            <Upload size={20} />
                            {uploading ? "Téléchargement..." : "Télécharger une image"}
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                        </label>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 block">Ville</label>
                        <input
                            type="text"
                            required
                            value={formData.townTitle}
                            onChange={(e) => setFormData({ ...formData, townTitle: e.target.value })}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 focus:outline-none focus:border-primary/50 transition-all"
                            placeholder="Ex: Yaoundé"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 block">Quartiers</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={newSubTown}
                                onChange={(e) => setNewSubTown(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubTown())}
                                className="flex-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 focus:outline-none focus:border-primary/50 transition-all"
                                placeholder="Ex: Bastos"
                            />
                            <button
                                type="button"
                                onClick={addSubTown}
                                className="px-6 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all"
                            >
                                Ajouter
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.subTownTitles.map((sub, i) => (
                                <span key={i} className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full">
                                    {sub}
                                    <button type="button" onClick={() => removeSubTown(i)} className="hover:text-red-500">
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading || !formData.image}
                            className="flex-1 px-6 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50"
                        >
                            {loading ? "Enregistrement..." : id ? "Modifier" : "Créer"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/admin/sites")}
                            className="px-6 py-3 bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-slate-300 dark:hover:bg-white/10 transition-all"
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SiteForm;
