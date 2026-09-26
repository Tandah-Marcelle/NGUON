import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, Image as ImageIcon, Eye, CheckCircle2, AlertCircle, RotateCcw, Loader2 } from "lucide-react";
import { api, uploadFileWithProgress } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ActivitiesCreate = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams();
    const { toast } = useToast();
    const isEditMode = !!id;
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    // ── Submit flow: confirm -> upload/save (with progress) -> success/error ──
    const [showConfirm, setShowConfirm] = useState(false);
    const [flow, setFlow] = useState<"idle" | "running" | "success" | "error">("idle");
    const [flowError, setFlowError] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);

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
            const maxSize = 2 * 1024 * 1024; // 2MB in bytes
            if (file.size > maxSize) {
                toast({
                    title: "Image trop volumineuse",
                    description: "L'image doit faire moins de 2 Mo. Veuillez choisir une image plus petite.",
                    variant: "destructive",
                });
                e.target.value = ''; // Reset input
                return;
            }
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

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!e.currentTarget.reportValidity()) return;
        setShowConfirm(true);
    };

    const runSubmit = async () => {
        setFlow("running");
        setFlowError("");
        setUploadProgress(0);
        try {
            let imageUrl = formData.image;

            if (imageFile) {
                const { fileName } = await uploadFileWithProgress("/files/upload/activity", imageFile, setUploadProgress);
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
            } else {
                await api.createActivity(activityData);
            }

            setFlow("success");
            toast({
                title: "Succès",
                description: isEditMode ? t('admin.activities.toasts.update_success') : t('admin.activities.toasts.create_success'),
            });
            setTimeout(() => navigate("/admin/activities"), 900);
        } catch (error: any) {
            setFlow("error");
            const errorMessage = error?.message || error?.toString() || "Une erreur s'est produite.";
            const raw = errorMessage.includes('already exists')
                ? `Conflit d'ordre : une activité existe déjà avec l'ordre ${formData.displayOrder}. Veuillez choisir un autre numéro.`
                : errorMessage;
            setFlowError(raw.length > 300 ? raw.slice(0, 300) + "…" : raw);
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
                <form onSubmit={handleFormSubmit} className="space-y-6">
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
                            className="flex-1 py-3 px-6 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                        >
                            {isEditMode ? t('admin.activities.form.update') : t('admin.activities.form.create')}
                        </button>
                    </div>
                </form>
            </div>

            {/* ── Confirmation dialog ── */}
            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEditMode ? "Confirmer la mise à jour" : "Confirmer la création"}</DialogTitle>
                        <DialogDescription>
                            {isEditMode
                                ? <>Voulez-vous enregistrer les modifications apportées à <strong>{formData.name}</strong> ?</>
                                : <>Voulez-vous créer l'activité <strong>{formData.name}</strong> ?</>
                            }
                            {imageFile && <> L'image sera envoyée.</>}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-3 justify-end mt-2">
                        <Button type="button" variant="outline" onClick={() => setShowConfirm(false)}>Annuler</Button>
                        <Button type="button" onClick={() => { setShowConfirm(false); runSubmit(); }}>
                            {isEditMode ? "Confirmer la mise à jour" : "Confirmer la création"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ── Progress / result dialog — not dismissible while running ── */}
            <Dialog open={flow !== "idle"} onOpenChange={(open) => { if (!open && flow !== "running") setFlow("idle"); }}>
                <DialogContent
                    className="max-w-sm"
                    onInteractOutside={(e) => flow === "running" && e.preventDefault()}
                    onEscapeKeyDown={(e) => flow === "running" && e.preventDefault()}
                >
                    {flow === "running" && (
                        <div className="text-center py-4">
                            <Loader2 size={36} className="animate-spin text-primary mx-auto mb-4" />
                            <h3 className="font-black text-lg mb-1">
                                {imageFile ? `Envoi de l'image… (${uploadProgress}%)` : "Enregistrement en cours…"}
                            </h3>
                            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mt-4">
                                <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${imageFile ? uploadProgress : 100}%` }} />
                            </div>
                        </div>
                    )}
                    {flow === "success" && (
                        <div className="text-center py-4">
                            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 size={30} className="text-green-600" />
                            </div>
                            <h3 className="font-black text-lg">{isEditMode ? "Activité mise à jour !" : "Activité créée !"}</h3>
                        </div>
                    )}
                    {flow === "error" && (
                        <div className="text-center py-4">
                            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                                <AlertCircle size={28} className="text-destructive" />
                            </div>
                            <h3 className="font-black text-lg mb-1">Échec de l'enregistrement</h3>
                            <p className="text-sm text-muted-foreground mb-5 break-words max-h-32 overflow-y-auto">{flowError}</p>
                            <div className="flex gap-3 justify-center">
                                <Button type="button" variant="outline" onClick={() => setFlow("idle")}>Fermer</Button>
                                <Button type="button" onClick={runSubmit} className="gap-2"><RotateCcw size={15} /> Réessayer</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

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
