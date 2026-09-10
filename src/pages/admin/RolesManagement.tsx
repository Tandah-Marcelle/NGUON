import { useState, useEffect } from "react";
import { ShieldCheck, Plus, Trash2, Edit2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import AdminPager from "@/components/admin/AdminPager";

const PAGE_SIZE = 12;

const RolesManagement = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const id = setTimeout(() => setPage(0), 300);
        return () => clearTimeout(id);
    }, [search]);

    useEffect(() => {
        const id = setTimeout(() => loadRoles(), 250);
        return () => clearTimeout(id);
    }, [page, search]);

    const loadRoles = async () => {
        setLoading(true);
        try {
            const res = await api.getRolesPaged(page, PAGE_SIZE, search || undefined);
            setRoles(res.content);
            setTotalElements(res.totalElements);
            setTotalPages(res.totalPages);
        } catch (error) {
            toast({ title: t('admin.roles.toasts.load_error'), description: t('admin.roles.toasts.load_error'), variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.deleteRole(id);
            toast({ title: "Succès", description: t('admin.roles.toasts.delete_success') });
            loadRoles();
            setDeleteId(null);
        } catch (error) {
            toast({ title: t('admin.roles.toasts.delete_error'), description: t('admin.roles.toasts.delete_error'), variant: "destructive" });
        }
    };

    if (loading && roles.length === 0) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">{t('admin.roles.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body">{t('admin.roles.description')}</p>
                </div>
                <button
                    onClick={() => navigate("/admin/roles/create")}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform"
                >
                    <Plus size={20} />
                    {t('admin.roles.create_button')}
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder={t('admin.roles.search_placeholder')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all font-body text-sm"
                />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role) => (
                    <div key={role.id} className="bg-white dark:bg-card p-8 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 flex flex-col hover:shadow-xl transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white mb-6">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="font-display text-xl font-bold text-slate-800 dark:text-white mb-3">{role.name}</h3>
                        <p className="font-body text-sm text-slate-500 leading-relaxed mb-8 flex-1">{role.description}</p>

                        <div className="flex justify-end gap-2 pt-6 border-t border-slate-100 dark:border-white/5">
                            <button
                                onClick={() => navigate(`/admin/roles/edit/${role.id}`)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-primary transition-all"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => setDeleteId(role.id)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-red-500 transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <AdminPager page={page} size={PAGE_SIZE} totalElements={totalElements} totalPages={totalPages} onPageChange={setPage} />

            {deleteId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-card rounded-3xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4">{t('admin.roles.delete_modal.title')}</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">{t('admin.roles.delete_modal.description')}</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5">{t('admin.roles.delete_modal.cancel')}</button>
                            <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600">{t('admin.roles.delete_modal.confirm')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RolesManagement;
