import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, Image as ImageIcon, Eye } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const ActivitiesCreate = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams();
    const { toast } = useToast();
    const isEditMode = !!id;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: "",
        displayOrder: 1,
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
                image: activity.image || "",
                displayOrder: activity.displayOrder || 1,
                published: activity.published
            });
            if (activity.image) {
                setImagePreview(api.getMediaViewUrl(activity.image));
            }
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de charger l'activité.",
                variant: "destructive",
            });
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        if (imagePreview && imageFile) {
            URL.revokeObjectURL(imagePreview);
        }
        setImageFile(null);
        setImagePreview(null);
        setFormData({ ...formData, image: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let imageUrl = formData.image;

            if (imageFile) {
                const { fileName } = await api.uploadActivityFile(imageFile);
                imageUrl = fileName;
            }

            const activityData = {
                name: formData.name,
                description: formData.description,
                image: imageUrl,
                displayOrder: formData.displayOrder,
                published: formData.published
            };

            if (isEditMode) {
                await api.updateActivity(parseInt(id!), activityData);
                toast({
                    title: "Succès",
                    description: t('admin.activities.toasts.update_success'),
                });
            } else {
                await api.createActivity(activityData);
                toast({
                    title: "Succès",
                    description: t('admin.activities.toasts.create_success'),
                });
            }
            navigate("/admin/activities");
        } catch (error: any) {
            const errorMessage = error.message || error.toString();
            if (errorMessage.includes('already exists')) {
                toast({
                    title: "Conflit d'ordre",
                    description: `Une activité existe déjà avec l'ordre ${formData.displayOrder}. Veuillez choisir un autre numéro.`,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: t('admin.activities.toasts.error_generic'),
                    description: errorMessage,
                    variant: "destructive",
                });
            }
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
                            Ordre d'affichage
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={formData.displayOrder}
                            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Image
                        </label>
                        {imagePreview ? (
                            <div className="relative">
                                <div 
                                    className="bg-slate-50 dark:bg-white/5 border-2 border-slate-300 dark:border-white/10 rounded-2xl p-4 cursor-pointer"
                                    onClick={() => setShowPreviewModal(true)}
                                >
                                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-contain rounded-lg" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPreviewModal(true)}
                                    className="absolute top-2 left-2 p-2 bg-primary text-white rounded-full hover:bg-primary/80 transition-all"
                                >
                                    <Eye size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl cursor-pointer hover:border-primary transition-all"
                                >
                                    <ImageIcon size={20} />
                                    Sélectionner une image
                                </label>
                            </div>
                        )}
                    </div>

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

            {showPreviewModal && imagePreview && (
                <div 
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowPreviewModal(false)}
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            onClick={() => setShowPreviewModal(false)}
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

export default ActivitiesCreate;
