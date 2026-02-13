import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    CheckCircle2,
    XCircle,
    Activity,
    X,
    Eye
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface ActivityItem {
    id: number;
    name: string;
    description: string;
    image?: string;
    displayOrder: number;
    published: boolean;
    createdAt: string;
}

const ActivitiesManagement = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteItem, setDeleteItem] = useState<ActivityItem | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        loadActivities();
    }, []);

    const loadActivities = async () => {
        try {
            const data = await api.getActivities();
            const sorted = data.sort((a: any, b: any) => a.displayOrder - b.displayOrder);
            setActivities(sorted);
        } catch (error) {
            console.error('Failed to load activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteItem) return;

        try {
            await api.deleteActivity(deleteItem.id);
            setActivities(activities.filter(a => a.id !== deleteItem.id));
            setDeleteItem(null);
            toast({
                title: "Succès",
                description: t('admin.activities.toasts.delete_success'),
            });
        } catch (error) {
            toast({
                title: t('admin.activities.toasts.delete_error'),
                description: t('admin.activities.toasts.delete_error'),
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">{t('admin.activities.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body">{t('admin.activities.description')}</p>
                </div>
                <button
                    onClick={() => navigate("/admin/activities/create")}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                    <Plus size={20} />
                    {t('admin.activities.create_button')}
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder={t('admin.activities.search_placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all font-body text-sm"
                />
            </div>

            {/* Activities Table */}
            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden font-body">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Ordre</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">{t('admin.activities.table.activity')}</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">{t('admin.activities.table.description')}</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">{t('admin.activities.table.status')}</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">{t('admin.activities.table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">{t('admin.activities.loading')}</td>
                            </tr>
                        ) : activities.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">{t('admin.activities.empty')}</td>
                            </tr>
                        ) : (
                            activities.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {item.displayOrder}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {item.image ? (
                                                <div className="relative group">
                                                    <img 
                                                        src={api.getMediaViewUrl(item.image)} 
                                                        alt={item.name} 
                                                        className="w-10 h-10 rounded-lg object-cover cursor-pointer" 
                                                        onClick={() => setPreviewImage(api.getMediaViewUrl(item.image))}
                                                    />
                                                    <button
                                                        onClick={() => setPreviewImage(api.getMediaViewUrl(item.image))}
                                                        className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Eye size={16} className="text-white" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                    <Activity size={20} />
                                                </div>
                                            )}
                                            <span className="font-semibold text-slate-800 dark:text-white">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">{item.description}</td>
                                    <td className="px-6 py-4">
                                        {item.published ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold">
                                                <CheckCircle2 size={12} /> {t('admin.activities.status.published')}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-400 rounded-full text-[10px] font-bold">
                                                <XCircle size={12} /> {t('admin.activities.status.draft')}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/activities/edit/${item.id}`)}
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

            {deleteItem && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteItem(null)}>
                    <div className="bg-white dark:bg-card rounded-3xl shadow-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
                        <h2 className="font-display text-2xl font-bold text-slate-800 dark:text-white mb-4">{t('admin.activities.delete_modal.title')}</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            {t('admin.activities.delete_modal.description')} <span className="font-bold">{deleteItem.name}</span> ? {t('admin.activities.delete_modal.warning')}
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setDeleteItem(null)}
                                className="flex-1 py-3 px-6 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                            >
                                {t('admin.activities.delete_modal.cancel')}
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-3 px-6 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all"
                            >
                                {t('admin.activities.delete_modal.confirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {previewImage && (
                <div 
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <img 
                            src={previewImage} 
                            alt="Preview" 
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivitiesManagement;
