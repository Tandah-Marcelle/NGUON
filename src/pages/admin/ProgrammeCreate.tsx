import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Clock, Upload, X, Image as ImageIcon, FileText } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const ProgrammeCreate = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams();
    const { toast } = useToast();
    const isEditMode = !!id;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        dayOrder: 1,
        activity: "",
        location: "",
        date: "",
        startTime: "",
        endTime: "",
        imageUrl: "",
        pdfUrl: "",
        published: false
    });

    useEffect(() => {
        if (isEditMode) {
            loadProgramme();
        }
    }, [id, isEditMode]);

    const loadProgramme = async () => {
        try {
            const programme = await api.getProgrammeById(parseInt(id!));
            setFormData({
                dayOrder: programme.dayOrder || 1,
                activity: programme.activity,
                location: programme.location,
                date: programme.date,
                startTime: programme.startTime.substring(0, 5),
                endTime: programme.endTime ? programme.endTime.substring(0, 5) : "",
                imageUrl: programme.imageUrl || "",
                pdfUrl: programme.pdfUrl || "",
                published: programme.published
            });

            // Set preview for existing image
            if (programme.imageUrl) {
                setImagePreview(api.getMediaViewUrl(programme.imageUrl));
            }
        } catch (error) {
            toast({
                title: t('admin.programme.toasts.error_generic'),
                description: t('admin.programme.toasts.load_error'),
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

    const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPdfFile(file);
        }
    };

    const handleRemoveImage = () => {
        if (imagePreview && imageFile) {
            URL.revokeObjectURL(imagePreview);
        }
        setImageFile(null);
        setImagePreview(null);
        setFormData({ ...formData, imageUrl: "" });
    };

    const handleRemovePdf = () => {
        setPdfFile(null);
        setFormData({ ...formData, pdfUrl: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let imageUrl = formData.imageUrl;
            let pdfUrl = formData.pdfUrl;

            // Upload image if selected
            if (imageFile) {
                const { fileName } = await api.uploadProgrammeFile(imageFile);
                imageUrl = fileName;
            }

            // Upload PDF if selected
            if (pdfFile) {
                const { fileName } = await api.uploadProgrammeFile(pdfFile);
                pdfUrl = fileName;
            }

            const programmeData = {
                dayOrder: formData.dayOrder,
                date: formData.date,
                startTime: formData.startTime + ":00",
                endTime: formData.endTime ? formData.endTime + ":00" : null,
                location: formData.location,
                activity: formData.activity,
                imageUrl,
                pdfUrl,
                published: formData.published
            };

            if (isEditMode) {
                await api.updateProgramme(parseInt(id!), programmeData);
            } else {
                await api.createProgramme(programmeData);
            }

            toast({
                title: t('admin.programme.toasts.create_success'),
                description: isEditMode ? t('admin.programme.toasts.update_success') : t('admin.programme.toasts.create_success'),
            });

            navigate("/admin/programme");
        } catch (error: any) {
            const errorMessage = error.message || error.toString();
            if (errorMessage.includes('409') || errorMessage.includes('already exists')) {
                toast({
                    title: "Conflit de jour",
                    description: `Un programme existe déjà pour le jour ${formData.dayOrder}. Veuillez choisir un autre numéro de jour.`,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: t('admin.programme.toasts.error_generic'),
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
                    onClick={() => navigate("/admin/programme")}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">
                        {isEditMode ? t('admin.programme.form.title_edit') : t('admin.programme.form.title_create')}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-body">
                        {isEditMode ? t('admin.programme.form.description_edit') : t('admin.programme.form.description_create')}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Jour (Ordre)
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={formData.dayOrder}
                            onChange={(e) => setFormData({ ...formData, dayOrder: parseInt(e.target.value) })}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            {t('admin.programme.form.activity_label')}
                        </label>
                        <input
                            type="text"
                            value={formData.activity}
                            onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            {t('admin.programme.form.location_label')}
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                {t('admin.programme.form.date_label')}
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                {t('admin.programme.form.start_time_label')}
                            </label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            {t('admin.programme.form.end_time_label')}
                        </label>
                        <input
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            {t('admin.programme.form.image_label')} {isEditMode && t('admin.programme.form.image_hint')}
                        </label>
                        {imagePreview ? (
                            <div className="relative">
                                <div className="bg-slate-50 dark:bg-white/5 border-2 border-slate-300 dark:border-white/10 rounded-2xl p-4">
                                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-contain rounded-lg" />
                                </div>
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
                                    {t('admin.programme.form.select_image')}
                                </label>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            {t('admin.programme.form.pdf_label')} {isEditMode && t('admin.programme.form.pdf_hint')}
                        </label>
                        {pdfFile || formData.pdfUrl ? (
                            <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 border-2 border-slate-300 dark:border-white/10 rounded-2xl py-3 px-4">
                                <div className="flex items-center gap-2">
                                    <FileText size={20} />
                                    <span className="text-sm">{pdfFile ? pdfFile.name : formData.pdfUrl}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemovePdf}
                                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-500 transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handlePdfSelect}
                                    className="hidden"
                                    id="pdf-upload"
                                />
                                <label
                                    htmlFor="pdf-upload"
                                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl cursor-pointer hover:border-primary transition-all"
                                >
                                    <FileText size={20} />
                                    {t('admin.programme.form.select_pdf')}
                                </label>
                            </div>
                        )}
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
                            {t('admin.programme.form.publish_label')}
                        </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/programme")}
                            className="flex-1 py-3 px-6 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                        >
                            {t('admin.programme.form.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-6 bg-secondary text-primary rounded-2xl font-bold shadow-lg shadow-secondary/10 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t('admin.programme.form.creating')}
                                </span>
                            ) : isEditMode ? t('admin.programme.form.update') : t('admin.programme.form.create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProgrammeCreate;
