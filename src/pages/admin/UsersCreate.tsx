import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const UsersCreate = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams();
    const { toast } = useToast();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        roleId: "",
        active: true
    });

    useEffect(() => {
        loadRoles();
    }, []);

    useEffect(() => {
        if (isEditMode) {
            loadUser();
        } else {
            setFormData({
                username: "",
                password: "",
                email: "",
                roleId: "",
                active: true
            });
        }
    }, [id, isEditMode]);

    const loadRoles = async () => {
        try {
            const data = await api.getRoles();
            setRoles(data);
        } catch (error) {
            toast({ title: t('admin.users.toasts.save_error'), description: t('admin.users.toasts.load_role_error'), variant: "destructive" });
        }
    };

    const loadUser = async () => {
        try {
            const data = await api.getUserById(Number(id));
            setFormData({
                username: data.username,
                password: "",
                email: data.email,
                roleId: data.role?.id || "",
                active: data.active
            });
        } catch (error) {
            toast({ title: t('admin.users.toasts.save_error'), description: t('admin.users.toasts.load_user_error'), variant: "destructive" });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.roleId) {
            toast({ title: t('admin.users.toasts.save_error'), description: t('admin.users.toasts.select_role_error'), variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            const payload = {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                role: { id: Number(formData.roleId) },
                active: formData.active
            };
            if (isEditMode) {
                await api.updateUser(Number(id), payload);
                toast({ title: t('admin.users.toasts.create_success'), description: t('admin.users.toasts.update_success') });
            } else {
                await api.createUser(payload);
                toast({ title: t('admin.users.toasts.create_success'), description: t('admin.users.toasts.create_success') });
            }
            navigate("/admin/users");
        } catch (error) {
            toast({ title: t('admin.users.toasts.save_error'), description: t('admin.users.toasts.save_error'), variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate("/admin/users")} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">
                        {isEditMode ? t('admin.users.form.title_edit') : t('admin.users.form.title_create')}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body">
                        {isEditMode ? t('admin.users.form.description_edit') : t('admin.users.form.description_create')}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('admin.users.form.username_label')}</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            {t('admin.users.form.password_label')} {isEditMode && t('admin.users.form.password_hint')}
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                            required={!isEditMode}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('admin.users.form.email_label')}</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('admin.users.form.role_label')}</label>
                        <select
                            value={formData.roleId}
                            onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                            required
                        >
                            <option value="">{t('admin.users.form.select_role')}</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="active"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            className="w-5 h-5 rounded border-slate-300"
                        />
                        <label htmlFor="active" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            {t('admin.users.form.active_label')}
                        </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/users")}
                            className="flex-1 py-3 px-6 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                        >
                            {t('admin.users.form.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-6 bg-slate-800 text-white rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
                        >
                            {loading ? t('admin.users.form.creating') : isEditMode ? t('admin.users.form.update') : t('admin.users.form.create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UsersCreate;
