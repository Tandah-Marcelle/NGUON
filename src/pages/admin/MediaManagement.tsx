import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Image as ImageIcon,
    CheckCircle2,
    XCircle,
    Edit2,
    Trash2,
    Eye,
    X,
    Video,
    Download
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface MediaItem {
    id: number;
    title: string;
    type: string;
    url: string;
    description?: string;
    published: boolean;
    createdAt: string;
}

const MediaManagement = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [urlCache, setUrlCache] = useState<Map<string, string>>(new Map());
    const [deleteItem, setDeleteItem] = useState<MediaItem | null>(null);

    useEffect(() => {
        loadMedia();
    }, []);

    const loadMedia = async () => {
        try {
            const data = await api.getMediaItems();
            setMediaItems(data);
        } catch (error) {
            console.error('Failed to load media:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = (item: MediaItem) => {
        setPreviewItem(item);
        
        if (urlCache.has(item.url)) {
            setPreviewUrl(urlCache.get(item.url)!);
        } else {
            const viewUrl = api.getMediaViewUrl(item.url);
            setPreviewUrl(viewUrl);
            setUrlCache(new Map(urlCache.set(item.url, viewUrl)));
        }
    };

    const handleDownload = () => {
        if (!previewItem || !previewUrl) return;
        
        const link = document.createElement('a');
        link.href = previewUrl;
        link.download = previewItem.title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async () => {
        if (!deleteItem) return;
        
        try {
            await api.deleteFile(deleteItem.url);
            await api.deleteMedia(deleteItem.id);
            setMediaItems(mediaItems.filter(item => item.id !== deleteItem.id));
            setDeleteItem(null);
            toast({
                title: "Succès",
                description: "Le média a été supprimé avec succès.",
            });
        } catch (error) {
            console.error('Failed to delete media:', error);
            toast({
                title: "Erreur",
                description: "Impossible de supprimer le média.",
                variant: "destructive",
            });
        }
    };

    const closePreview = () => {
        setPreviewItem(null);
        setPreviewUrl(null);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">Galerie Média</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body">Gérez les photos et vidéos de l'événement.</p>
                </div>
                <button 
                    onClick={() => navigate("/admin/media/create")}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                    <Plus size={20} />
                    Nouveau Média
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un média..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all font-body text-sm"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 transition-all">
                    <Filter size={18} />
                    Filtres
                </button>
            </div>

            {/* Media Table */}
            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden font-body">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Média</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Type</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Date</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Statut</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">Chargement...</td>
                            </tr>
                        ) : mediaItems.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">Aucun média trouvé</td>
                            </tr>
                        ) : (
                            mediaItems.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-400">
                                                {item.type === "video" ? <Video size={20} /> : <ImageIcon size={20} />}
                                            </div>
                                            <span className="font-semibold text-slate-800 dark:text-white">{item.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.type}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                                    </td>
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
                                                onClick={() => handlePreview(item)}
                                                className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-primary transition-all"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button 
                                                onClick={() => navigate(`/admin/media/edit/${item.id}`)}
                                                className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-primary transition-all"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => setDeleteItem(item)}
                                                className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Preview Modal */}
            {previewItem && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closePreview}>
                    <div className="bg-white dark:bg-card rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row" onClick={(e) => e.stopPropagation()}>
                        {/* Media Preview */}
                        <div className="flex-1 bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-8">
                            {previewUrl ? (
                                previewItem.type === "video" ? (
                                    <video src={previewUrl} controls className="max-w-full max-h-[70vh] rounded-lg" />
                                ) : (
                                    <img src={previewUrl} alt={previewItem.title} className="max-w-full max-h-[70vh] rounded-lg object-contain" />
                                )
                            ) : (
                                <div className="text-slate-400 text-center">
                                    <p>Rien à prévisualiser</p>
                                </div>
                            )}
                        </div>

                        {/* Media Details */}
                        <div className="w-full md:w-96 p-8 space-y-6 overflow-y-auto">
                            <div className="flex items-start justify-between">
                                <h2 className="font-display text-2xl font-bold text-slate-800 dark:text-white">{previewItem.title}</h2>
                                <button onClick={closePreview} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 block">Type</label>
                                    <p className="text-slate-800 dark:text-white">{previewItem.type}</p>
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 block">URL</label>
                                    <p className="text-slate-800 dark:text-white text-sm break-all">{previewItem.url}</p>
                                </div>

                                {previewItem.description && (
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 block">Description</label>
                                        <p className="text-slate-800 dark:text-white">{previewItem.description}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 block">Statut</label>
                                    {previewItem.published ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold">
                                            <CheckCircle2 size={14} /> Publié
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-400 rounded-full text-xs font-bold">
                                            <XCircle size={14} /> Brouillon
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 block">Date de création</label>
                                    <p className="text-slate-800 dark:text-white">{new Date(previewItem.createdAt).toLocaleString('fr-FR')}</p>
                                </div>
                            </div>

                            {previewUrl && (
                                <button
                                    onClick={handleDownload}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                                >
                                    <Download size={20} />
                                    Télécharger
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteItem && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteItem(null)}>
                    <div className="bg-white dark:bg-card rounded-3xl shadow-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
                        <h2 className="font-display text-2xl font-bold text-slate-800 dark:text-white mb-4">Confirmer la suppression</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Êtes-vous sûr de vouloir supprimer <span className="font-bold">{deleteItem.title}</span> ? Cette action est irréversible.
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

export default MediaManagement;
