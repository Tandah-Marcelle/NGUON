import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Image as ImageIcon, Video, X, CheckCircle2, AlertCircle, RotateCcw, Loader2 } from "lucide-react";
import { api, uploadFileWithProgress } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const MediaCreate = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams();
    const { toast } = useToast();
    const isEditMode = !!id;
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // ── Submit flow: confirm -> upload/save (with progress) -> success/error ──
    const [showConfirm, setShowConfirm] = useState(false);
    const [flow, setFlow] = useState<"idle" | "running" | "success" | "error">("idle");
    const [flowError, setFlowError] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);

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

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isEditMode && !selectedFile) {
            toast({
                title: t('admin.media.toasts.error_generic'),
                description: t('admin.media.toasts.select_file_error'),
                variant: "destructive",
            });
            return;
        }

        if (!e.currentTarget.reportValidity()) return;
        setShowConfirm(true);
    };

    const runSubmit = async () => {
        setFlow("running");
        setFlowError("");
        setUploadProgress(0);
        try {
            let fileUrl = formData.url;

            // Upload new file if selected
            if (selectedFile) {
                const { fileName } = await uploadFileWithProgress(
                    "/files/upload/media",
                    selectedFile,
                    setUploadProgress
                );
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

            setFlow("success");
            toast({
                title: t('admin.media.toasts.create_success'),
                description: isEditMode ? t('admin.media.toasts.update_success') : t('admin.media.toasts.create_success'),
            });
            setTimeout(() => navigate("/admin/media"), 900);
        } catch (error) {
            setFlow("error");
            const raw = error instanceof Error ? error.message : "Une erreur s'est produite.";
            setFlowError(raw.length > 300 ? raw.slice(0, 300) + "…" : raw);
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
                <form onSubmit={handleFormSubmit} className="space-y-6">
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
                            className="flex-1 py-3 px-6 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                        >
                            {isEditMode ? t('admin.media.form.update') : t('admin.media.form.create')}
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
                                ? <>Voulez-vous enregistrer les modifications apportées à <strong>{formData.title}</strong> ?</>
                                : <>Voulez-vous créer le média <strong>{formData.title}</strong> ?</>
                            }
                            {selectedFile && <> Le fichier sera envoyé.</>}
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
                                {selectedFile ? `Envoi du fichier… (${uploadProgress}%)` : "Enregistrement en cours…"}
                            </h3>
                            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mt-4">
                                <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${selectedFile ? uploadProgress : 100}%` }} />
                            </div>
                        </div>
                    )}
                    {flow === "success" && (
                        <div className="text-center py-4">
                            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 size={30} className="text-green-600" />
                            </div>
                            <h3 className="font-black text-lg">{isEditMode ? "Média mis à jour !" : "Média créé !"}</h3>
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
        </div>
    );
};

export default MediaCreate;
