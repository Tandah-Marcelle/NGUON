import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plus,
    Calendar as CalendarIcon,
    MapPin,
    Clock,
    Edit2,
    Trash2,
    Search,
    Eye,
    X
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Programme {
    id: number;
    activity: string;
    location: string;
    date: string;
    startTime: string;
    endTime?: string;
    imageUrl?: string;
    pdfUrl?: string;
    published: boolean;
}

const ProgrammeManagement = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [programmes, setProgrammes] = useState<Programme[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteItem, setDeleteItem] = useState<Programme | null>(null);
    const [previewItem, setPreviewItem] = useState<Programme | null>(null);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

    useEffect(() => {
        loadProgrammes();
    }, []);

    const loadProgrammes = async () => {
        try {
            const data = await api.getProgrammes();
            setProgrammes(data);
        } catch (error) {
            console.error('Failed to load programmes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = (item: Programme) => {
        setPreviewItem(item);
        if (item.imageUrl) {
            setPreviewImageUrl(api.getMediaViewUrl(item.imageUrl));
        }
    };

    const handleDelete = async () => {
        if (!deleteItem) return;
        
        try {
            if (deleteItem.imageUrl) await api.deleteFile(deleteItem.imageUrl);
            if (deleteItem.pdfUrl) await api.deleteFile(deleteItem.pdfUrl);
            await api.deleteProgramme(deleteItem.id);
            setProgrammes(programmes.filter(p => p.id !== deleteItem.id));
            setDeleteItem(null);
            toast({
                title: "Succès",
                description: "Le programme a été supprimé avec succès.",
            });
        } catch (error) {
            console.error('Failed to delete programme:', error);
            toast({
                title: "Erreur",
                description: "Impossible de supprimer le programme.",
                variant: "destructive",
            });
        }
    };
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">Calendrier du Festival</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body">Gérez le programme détaillé des festivités.</p>
                </div>
                <button 
                    onClick={() => navigate("/admin/programme/create")}
                    className="flex items-center gap-2 px-6 py-3 bg-secondary text-primary rounded-2xl font-bold shadow-lg shadow-secondary/10 hover:scale-105 transition-transform"
                >
                    <Plus size={20} />
                    Nouvel Événement
                </button>
            </div>

            {/* Simple Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Rechercher une activité..."
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 font-body text-sm"
                />
            </div>

            {/* Grid of Events */}
            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-8 text-slate-400">Chargement...</div>
                ) : programmes.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">Aucun programme trouvé</div>
                ) : (
                    programmes.map((item, i) => (
                        <AnimatedSection key={item.id} delay={i * 0.05}>
                            <div className="bg-white dark:bg-card p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex flex-col items-center justify-center text-primary">
                                        <p className="text-xs font-bold uppercase">{item.date.split('-')[1]}</p>
                                        <p className="text-2xl font-bold leading-none">{item.date.split('-')[2]}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-display font-bold text-slate-800 dark:text-white text-lg">{item.activity}</h3>
                                        <div className="flex flex-wrap items-center gap-4 text-xs font-body text-slate-400">
                                            <span className="flex items-center gap-1.5"><Clock size={12} /> {item.startTime}</span>
                                            <span className="flex items-center gap-1.5"><MapPin size={12} /> {item.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-500 rounded-full text-[10px] font-bold uppercase mr-4">
                                        {item.published ? "Publié" : "Brouillon"}
                                    </div>
                                    <button 
                                        onClick={() => handlePreview(item)}
                                        className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-slate-400 hover:text-primary transition-all"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button 
                                        onClick={() => navigate(`/admin/programme/edit/${item.id}`)}
                                        className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-slate-400 hover:text-primary transition-all"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button 
                                        onClick={() => setDeleteItem(item)}
                                        className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-slate-400 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </AnimatedSection>
                    ))
                )}
            </div>

            {/* Preview Modal */}
            {previewItem && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreviewItem(null)}>
                    <div className="bg-white dark:bg-card rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-6">
                            <h2 className="font-display text-2xl font-bold text-slate-800 dark:text-white">{previewItem.activity}</h2>
                            <button onClick={() => setPreviewItem(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        {previewImageUrl && (
                            <img src={previewImageUrl} alt={previewItem.activity} className="w-full h-64 object-cover rounded-2xl mb-6" />
                        )}

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                                <CalendarIcon size={20} />
                                <span>{new Date(previewItem.date).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                                <Clock size={20} />
                                <span>{previewItem.startTime}{previewItem.endTime && ` - ${previewItem.endTime}`}</span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                                <MapPin size={20} />
                                <span>{previewItem.location}</span>
                            </div>
                        </div>

                        {previewItem.pdfUrl && (
                            <a
                                href={api.getMediaViewUrl(previewItem.pdfUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-6 bg-primary text-white rounded-2xl font-bold hover:scale-105 transition-transform"
                            >
                                Voir le PDF
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteItem && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteItem(null)}>
                    <div className="bg-white dark:bg-card rounded-3xl shadow-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
                        <h2 className="font-display text-2xl font-bold text-slate-800 dark:text-white mb-4">Confirmer la suppression</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Êtes-vous sûr de vouloir supprimer <span className="font-bold">{deleteItem.activity}</span> ? Cette action est irréversible.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setDeleteItem(null)}
                                className="flex-1 py-3 px-6 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-3 px-6 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgrammeManagement;
