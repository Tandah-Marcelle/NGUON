import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Eye,
    Trash2,
    CheckCircle2,
    XCircle,
    Mail
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const ContactsManagement = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            const data = await api.getContacts();
            setContacts(data);
        } catch (error) {
            toast({ title: t('admin.contacts.toasts.load_error'), description: t('admin.contacts.toasts.load_error'), variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.deleteContact(id);
            toast({ title: "Succès", description: t('admin.contacts.toasts.delete_success') });
            loadContacts();
            setDeleteId(null);
        } catch (error) {
            toast({ title: t('admin.contacts.toasts.delete_error'), description: t('admin.contacts.toasts.delete_error'), variant: "destructive" });
        }
    };

    const filteredContacts = contacts.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">{t('admin.contacts.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body">{t('admin.contacts.description')}</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder={t('admin.contacts.search_placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all font-body text-sm"
                />
            </div>

            {/* Contacts Table */}
            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden font-body">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">{t('admin.contacts.table.contact')}</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">{t('admin.contacts.table.message')}</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">{t('admin.contacts.table.date')}</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">{t('admin.contacts.table.status')}</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">{t('admin.contacts.table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {filteredContacts.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800 dark:text-white">{item.name}</p>
                                            <p className="text-xs text-slate-500">{item.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">{item.message}</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.createdAt}</td>
                                <td className="px-6 py-4">
                                    {item.responded ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold">
                                            <CheckCircle2 size={12} /> {t('admin.contacts.status.responded')}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-[10px] font-bold">
                                            <XCircle size={12} /> {t('admin.contacts.status.pending')}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/contacts/view/${item.id}`)}
                                            className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-primary transition-all"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(item.id)}
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
                        <h3 className="text-xl font-bold mb-4">{t('admin.contacts.delete_modal.title')}</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">{t('admin.contacts.delete_modal.description')}</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5">{t('admin.contacts.delete_modal.cancel')}</button>
                            <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600">{t('admin.contacts.delete_modal.confirm')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactsManagement;
