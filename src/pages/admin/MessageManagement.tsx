import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, X, CheckCircle2, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Message {
    id: number;
    authorityTitle: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    published: boolean;
}

const MessageManagement = () => {
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteItem, setDeleteItem] = useState<Message | null>(null);
    const [previewItem, setPreviewItem] = useState<Message | null>(null);
    const [editItem, setEditItem] = useState<Message | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        authorityTitle: "",
        content: "",
        published: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const data = await api.getMessages();
            setMessages(data);
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditItem(null);
        setFormData({ authorityTitle: "", content: "", published: false });
        setShowForm(true);
    };

    const handleEdit = (item: Message) => {
        setEditItem(item);
        setFormData({
            authorityTitle: item.authorityTitle,
            content: item.content,
            published: item.published
        });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (editItem) {
                await api.updateMessage(editItem.id, formData);
                toast({
                    title: "Succès",
                    description: "Le message a été mis à jour avec succès.",
                });
            } else {
                await api.createMessage(formData);
                toast({
                    title: "Succès",
                    description: "Le message a été créé avec succès.",
                });
            }
            setShowForm(false);
            setEditItem(null);
            setFormData({ authorityTitle: "", content: "", published: false });
            loadMessages();
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Une erreur s'est produite.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteItem) return;
        
        try {
            await api.deleteMessage(deleteItem.id);
            setMessages(messages.filter(m => m.id !== deleteItem.id));
            setDeleteItem(null);
            toast({
                title: "Succès",
                description: "Le message a été supprimé avec succès.",
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de supprimer le message.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">Messages des Autorités</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body">Gérez les messages officiels.</p>
                </div>
                <button 
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                    <Plus size={20} />
                    Nouveau Message
                </button>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-8 text-slate-400">Chargement...</div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">Aucun message trouvé</div>
                ) : (
                    messages.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-card p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-white/5">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <h3 className="font-display font-bold text-slate-800 dark:text-white text-lg mb-2">{item.authorityTitle}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">{item.content}</p>
                                    <p className="text-xs text-slate-400 mt-2">{new Date(item.createdAt).toLocaleDateString('fr-FR')}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {item.published ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold">
                                            <CheckCircle2 size={12} /> Publié
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-400 rounded-full text-xs font-bold">
                                            <XCircle size={12} /> Brouillon
                                        </span>
                                    )}
                                    <button onClick={() => setPreviewItem(item)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-primary transition-all">
                                        <Eye size={16} />
                                    </button>
                                    <button onClick={() => handleEdit(item)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-primary transition-all">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => setDeleteItem(item)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-red-500 transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white dark:bg-card rounded-3xl shadow-2xl max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
                        <h2 className="font-display text-2xl font-bold text-slate-800 dark:text-white mb-6">
                            {editItem ? "Modifier le Message" : "Nouveau Message"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Titre de l'Autorité
                                </label>
                                <input
                                    type="text"
                                    value={formData.authorityTitle}
                                    onChange={(e) => setFormData({ ...formData, authorityTitle: e.target.value })}
                                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Contenu
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all min-h-[200px]"
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="published"
                                    checked={formData.published}
                                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="published" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Publier immédiatement
                                </label>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 py-3 px-6 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 px-6 bg-primary text-white rounded-2xl font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {isSubmitting ? "Enregistrement..." : editItem ? "Mettre à jour" : "Créer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {previewItem && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreviewItem(null)}>
                    <div className="bg-white dark:bg-card rounded-3xl shadow-2xl max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-6">
                            <h2 className="font-display text-2xl font-bold text-slate-800 dark:text-white">{previewItem.authorityTitle}</h2>
                            <button onClick={() => setPreviewItem(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap mb-4">{previewItem.content}</p>
                        <div className="flex items-center justify-between text-sm text-slate-400">
                            <span>Créé le {new Date(previewItem.createdAt).toLocaleString('fr-FR')}</span>
                            {previewItem.published ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold">
                                    <CheckCircle2 size={12} /> Publié
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-400 rounded-full text-xs font-bold">
                                    <XCircle size={12} /> Brouillon
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {deleteItem && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteItem(null)}>
                    <div className="bg-white dark:bg-card rounded-3xl shadow-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
                        <h2 className="font-display text-2xl font-bold text-slate-800 dark:text-white mb-4">Confirmer la suppression</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Êtes-vous sûr de vouloir supprimer le message de <span className="font-bold">{deleteItem.authorityTitle}</span> ? Cette action est irréversible.
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

export default MessageManagement;
