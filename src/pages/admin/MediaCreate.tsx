import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Image as ImageIcon, Video, X } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const MediaCreate = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams();
    const { toast } = useToast();
    const isEditMode = !!id;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Mock data - replace with API call
    const mediaItems = [
        { id: 1, title: "Parade Impériale", type: "Image", url: "/galerie1.jpg", published: true },
        { id: 2, title: "Rituels de bénédiction", type: "Vidéo", url: "youtube.com/...", published: false },
        { id: 3, title: "Artisanat Bamoun", type: "Image", url: "/galerie2.jpg", published: true },
        { id: 4, title: "Discours d'ouverture", type: "Vidéo", url: "vimeo.com/...", published: true },
    ];

    const [formData, setFormData] = useState({
        title: "",
        type: "Image",
        url: "",
        description: "",
        published: false
    });

    useEffect(() => {
        if (isEditMode) {
            loadMedia();
        }
    }, [id, isEditMode]);

    const loadMedia = async () => {
        try {
            const media = await api.getMediaById(parseInt(id!));
            setFormData({
                title: media.title,
                type: media.type,
                url: media.url,
                description: media.description || "",
                published: media.published
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de charger le média.",
                variant: "destructive",
            });
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
            setFormData({ ...formData, url: file.name });
        }
    };

    const handleRemoveFile = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(null);
        setFormData({ ...formData, url: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isEditMode && !selectedFile) {
            toast({
                title: t('admin.media.toasts.error_generic'),
                description: t('admin.media.toasts.select_file_error'),
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            let fileUrl = formData.url;

            // Upload new file if selected
            if (selectedFile) {
                const { fileName } = await api.uploadFile(selectedFile);
                fileUrl = fileName;
            }

            // Create or update media
            if (isEditMode) {
                await api.updateMedia(parseInt(id!), {
                    type: formData.type,
                    url: fileUrl,
                    title: formData.title,
                    description: formData.description,
                    published: formData.published
                });
            } else {
                await api.createMedia({
                    type: formData.type,
                    url: fileUrl,
                    title: formData.title,
                    description: formData.description,
                    published: formData.published
                });
            }

            toast({
                title: t('admin.media.toasts.create_success'),
                description: isEditMode ? t('admin.media.toasts.update_success') : t('admin.media.toasts.create_success'),
            });

            navigate("/admin/media");
        } catch (error) {
            toast({
                title: t('admin.media.toasts.error_generic'),
                description: t('admin.media.toasts.error_generic'),
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
                    onClick={() => navigate("/admin/media")}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">
                        {isEditMode ? t('admin.media.form.title_edit') : t('admin.media.form.title_create')}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body">
                        {isEditMode ? t('admin.media.form.description_edit') : t('admin.media.form.description_create')}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            {t('admin.media.form.title_label')}
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            {t('admin.media.form.type_label')}
                        </label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: "Image" })}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 transition-all ${formData.type === "Image"
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
                                    }`}
                            >
                                <ImageIcon size={20} />
                                {t('admin.media.form.image_type')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: "Vidéo" })}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 transition-all ${formData.type === "Vidéo"
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
                                    }`}
                            >
                                <Video size={20} />
                                {t('admin.media.form.video_type')}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            {t('admin.media.form.file_label')} {isEditMode && t('admin.media.form.file_hint')}
                        </label>
                        {previewUrl ? (
                            <div className="relative">
                                <div className="bg-slate-50 dark:bg-white/5 border-2 border-slate-300 dark:border-white/10 rounded-2xl p-4">
                                    {formData.type === "Image" ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-48 object-contain rounded-lg" />
                                    ) : (
                                        <video src={previewUrl} controls className="w-full h-48 rounded-lg" />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                <input
                                    type="file"
                                    accept={formData.type === "Image" ? "image/*" : "video/*"}
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl cursor-pointer hover:border-primary transition-all"
                                >
                                    <Upload size={20} />
                                    {t('admin.media.form.select_file')}
                                </label>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            {t('admin.media.form.url_label')}
                        </label>
                        <input
                            type="text"
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            placeholder={formData.type === "Image" ? "/galerie1.jpg" : "youtube.com/..."}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            {t('admin.media.form.description_label')}
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all min-h-[100px]"
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
                            {t('admin.media.form.publish_label')}
                        </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/media")}
                            className="flex-1 py-3 px-6 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                        >
                            {t('admin.media.form.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-6 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t('admin.media.form.creating')}
                                </span>
                            ) : isEditMode ? t('admin.media.form.update') : t('admin.media.form.create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MediaCreate;
