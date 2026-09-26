import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, CheckCircle2, AlertCircle, RotateCcw, Loader2 } from "lucide-react";
import { api, uploadFileWithProgress } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SiteForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formData, setFormData] = useState({
        image: "",
        townTitle: "",
        subTownTitles: [] as string[],
        published: true
    });
    const [newSubTown, setNewSubTown] = useState("");

    // ── Submit flow: confirm -> save -> success/error ──
    const [showConfirm, setShowConfirm] = useState(false);
    const [flow, setFlow] = useState<"idle" | "running" | "success" | "error">("idle");
    const [flowError, setFlowError] = useState("");

    useEffect(() => {
        if (id) {
            loadSite();
        }
    }, [id]);

    const loadSite = async () => {
        try {
            const data = await api.getSiteById(Number(id));
            setFormData(data);
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger le site", variant: "destructive" });
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadProgress(0);
        try {
            const { fileName } = await uploadFileWithProgress("/files/upload/site", file, setUploadProgress);
            setFormData({ ...formData, image: fileName });
            toast({ title: "Succès", description: "Image téléchargée" });
        } catch (error) {
            toast({ title: "Erreur", description: error instanceof Error ? error.message : "Échec du téléchargement", variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const addSubTown = () => {
        if (newSubTown.trim()) {
            setFormData({ ...formData, subTownTitles: [...formData.subTownTitles, newSubTown.trim()] });
            setNewSubTown("");
        }
    };

    const removeSubTown = (index: number) => {
        setFormData({ ...formData, subTownTitles: formData.subTownTitles.filter((_, i) => i !== index) });
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!e.currentTarget.reportValidity()) return;
        setShowConfirm(true);
    };

    const runSubmit = async () => {
        setFlow("running");
        setFlowError("");
        try {
            if (id) {
                await api.updateSite(Number(id), formData);
            } else {
                await api.createSite(formData);
            }
            setFlow("success");
            toast({ title: "Succès", description: id ? "Site modifié avec succès" : "Site créé avec succès" });
            setTimeout(() => navigate("/admin/sites"), 900);
        } catch (error) {
            setFlow("error");
            const raw = error instanceof Error ? error.message : "Échec de l'opération.";
            setFlowError(raw.length > 300 ? raw.slice(0, 300) + "…" : raw);
        }
    };

    return (
        <div className="space-y-8">
            <button
                onClick={() => navigate("/admin/sites")}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Retour aux sites</span>
            </button>

            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/5 p-8">
                <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-8">
                    {id ? "Modifier le Site" : "Nouveau Site"}
                </h1>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div>
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 block">Image</label>
                        {formData.image && (
                            <div className="mb-4">
                                <img src={api.getMediaViewUrl(formData.image)} alt="Preview" className="w-full h-48 object-cover rounded-2xl" />
                            </div>
                        )}
                        <label className="flex items-center justify-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-2xl hover:bg-primary/20 transition-all cursor-pointer">
                            <Upload size={20} />
                            {uploading ? `Téléchargement… ${uploadProgress}%` : "Télécharger une image"}
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                        </label>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 block">Ville</label>
                        <input
                            type="text"
                            required
                            value={formData.townTitle}
                            onChange={(e) => setFormData({ ...formData, townTitle: e.target.value })}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 focus:outline-none focus:border-primary/50 transition-all"
                            placeholder="Ex: Yaoundé"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 block">Quartiers</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={newSubTown}
                                onChange={(e) => setNewSubTown(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubTown())}
                                className="flex-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 focus:outline-none focus:border-primary/50 transition-all"
                                placeholder="Ex: Bastos"
                            />
                            <button
                                type="button"
                                onClick={addSubTown}
                                className="px-6 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all"
                            >
                                Ajouter
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.subTownTitles.map((sub, i) => (
                                <span key={i} className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full">
                                    {sub}
                                    <button type="button" onClick={() => removeSubTown(i)} className="hover:text-red-500">
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="published"
                            checked={formData.published}
                            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                            className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="published" className="text-sm font-bold text-slate-600 dark:text-slate-400">
                            Publier immédiatement
                        </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={!formData.image}
                            className="flex-1 px-6 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50"
                        >
                            {id ? "Modifier" : "Créer"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/admin/sites")}
                            className="px-6 py-3 bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-slate-300 dark:hover:bg-white/10 transition-all"
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>

            {/* ── Confirmation dialog ── */}
            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{id ? "Confirmer la mise à jour" : "Confirmer la création"}</DialogTitle>
                        <DialogDescription>
                            {id
                                ? <>Voulez-vous enregistrer les modifications apportées à <strong>{formData.townTitle}</strong> ?</>
                                : <>Voulez-vous créer le site <strong>{formData.townTitle}</strong> ?</>
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-3 justify-end mt-2">
                        <Button type="button" variant="outline" onClick={() => setShowConfirm(false)}>Annuler</Button>
                        <Button type="button" onClick={() => { setShowConfirm(false); runSubmit(); }}>
                            {id ? "Confirmer la mise à jour" : "Confirmer la création"}
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
                            <h3 className="font-black text-lg mb-1">Enregistrement en cours…</h3>
                        </div>
                    )}
                    {flow === "success" && (
                        <div className="text-center py-4">
                            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 size={30} className="text-green-600" />
                            </div>
                            <h3 className="font-black text-lg">{id ? "Site mis à jour !" : "Site créé !"}</h3>
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

export default SiteForm;
