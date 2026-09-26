import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Clock, Upload, X, Image as ImageIcon, FileText, CheckCircle2, AlertCircle, RotateCcw, Loader2 } from "lucide-react";
import { api, uploadFileWithProgress } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ProgrammeCreate = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams();
    const { toast } = useToast();
    const isEditMode = !!id;
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // ── Submit flow: confirm -> upload/save (with progress) -> success/error ──
    const [showConfirm, setShowConfirm] = useState(false);
    const [flow, setFlow] = useState<"idle" | "running" | "success" | "error">("idle");
    const [flowError, setFlowError] = useState("");
    const [imageProgress, setImageProgress] = useState(0);
    const [pdfProgress, setPdfProgress] = useState(0);

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

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!e.currentTarget.reportValidity()) return;
        setShowConfirm(true);
    };

    const runSubmit = async () => {
        setFlow("running");
        setFlowError("");
        setImageProgress(0);
        setPdfProgress(0);
        try {
            let imageUrl = formData.imageUrl;
            let pdfUrl = formData.pdfUrl;

            // Upload image if selected
            if (imageFile) {
                const { fileName } = await uploadFileWithProgress("/files/upload/programme", imageFile, setImageProgress);
                imageUrl = fileName;
            }

            // Upload PDF if selected
            if (pdfFile) {
                const { fileName } = await uploadFileWithProgress("/files/upload/programme", pdfFile, setPdfProgress);
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

            setFlow("success");
            toast({
                title: t('admin.programme.toasts.create_success'),
                description: isEditMode ? t('admin.programme.toasts.update_success') : t('admin.programme.toasts.create_success'),
            });
            setTimeout(() => navigate("/admin/programme"), 900);
        } catch (error: any) {
            setFlow("error");
            const errorMessage = error?.message || error?.toString() || "Une erreur s'est produite.";
            const raw = errorMessage.includes('409') || errorMessage.includes('already exists')
                ? `Conflit de jour : un programme existe déjà pour le jour ${formData.dayOrder}. Veuillez choisir un autre numéro de jour.`
                : errorMessage;
            setFlowError(raw.length > 300 ? raw.slice(0, 300) + "…" : raw);
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
                <form onSubmit={handleFormSubmit} className="space-y-6">
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
                            className="flex-1 py-3 px-6 bg-secondary text-primary rounded-2xl font-bold shadow-lg shadow-secondary/10 hover:scale-105 transition-transform"
                        >
                            {isEditMode ? t('admin.programme.form.update') : t('admin.programme.form.create')}
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
                                ? <>Voulez-vous enregistrer les modifications apportées à <strong>{formData.activity}</strong> ?</>
                                : <>Voulez-vous créer le programme <strong>{formData.activity}</strong> ?</>
                            }
                            {(imageFile || pdfFile) && <> Les fichiers seront envoyés.</>}
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
                                {imageFile && imageProgress < 100 ? `Envoi de l'image… (${imageProgress}%)`
                                    : pdfFile && pdfProgress < 100 ? `Envoi du PDF… (${pdfProgress}%)`
                                    : "Enregistrement en cours…"}
                            </h3>
                            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mt-4">
                                <div
                                    className="h-full bg-primary transition-all duration-300 rounded-full"
                                    style={{ width: `${imageFile && imageProgress < 100 ? imageProgress : pdfFile && pdfProgress < 100 ? pdfProgress : 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                    {flow === "success" && (
                        <div className="text-center py-4">
                            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 size={30} className="text-green-600" />
                            </div>
                            <h3 className="font-black text-lg">{isEditMode ? "Programme mis à jour !" : "Programme créé !"}</h3>
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

export default ProgrammeCreate;
