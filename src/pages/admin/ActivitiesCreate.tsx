import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const ActivitiesCreate = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams();
    const { toast } = useToast();
    const isEditMode = !!id;
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock data - replace with API call
    const activities = [
        { id: 1, name: "Danse traditionnelle", description: "Spectacle de danse Bamoun avec costumes traditionnels", published: true },
        { id: 2, name: "Exposition artisanale", description: "Présentation des œuvres d'art et artisanat local", published: true },
        { id: 3, name: "Conférence historique", description: "Histoire et culture du royaume Bamoun", published: false },
    ];

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        published: false
    });

    useEffect(() => {
        if (isEditMode) {
            loadActivity();
        }
    }, [id, isEditMode]);

    const loadActivity = async () => {
        try {
            const activity = await api.getActivityById(parseInt(id!));
            setFormData({
                name: activity.name,
                description: activity.description,
                published: activity.published
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de charger l'activité.",
                variant: "destructive",
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (isEditMode) {
                await api.updateActivity(parseInt(id!), formData);
                toast({
                    title: t('admin.activities.toasts.create_success'), // Using create_success title as generic success or separate key? Using generic 'Succès' -> t('admin.activities.form.save')? No, title usually "Succès".
                    description: t('admin.activities.toasts.update_success'),
                });
            } else {
                await api.createActivity(formData);
                toast({
                    title: t('admin.activities.toasts.create_success'),
                    description: t('admin.activities.toasts.create_success'),
                });
            }
            navigate("/admin/activities");
        } catch (error) {
            toast({
                title: t('admin.activities.toasts.error_generic'),
                description: t('admin.activities.toasts.error_generic'),
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/admin/activities")}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">
                        {isEditMode ? t('admin.activities.form.title_edit') : t('admin.activities.form.title_create')}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body">
                        {isEditMode ? t('admin.activities.form.description_edit') : t('admin.activities.form.description_create')}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            {t('admin.activities.form.name_label')}
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            {t('admin.activities.form.description_label')}
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={5}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all resize-none"
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
                            {t('admin.activities.form.publish_label')}
                        </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/activities")}
                            className="flex-1 py-3 px-6 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                        >
                            {t('admin.activities.form.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-6 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isSubmitting ? t('admin.activities.form.creating') : isEditMode ? t('admin.activities.form.update') : t('admin.activities.form.create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ActivitiesCreate;
