import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Trash2, Plus, FileText, X, Send, EyeOff, ExternalLink, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function fileViewUrl(path: string) {
  return `${API_BASE_URL}/files/view/?path=${encodeURIComponent(path)}`;
}

const isPdf = (p: string) => p.toLowerCase().endsWith(".pdf");
const isImg = (p: string) => /\.(png|jpe?g|gif|webp|svg)$/i.test(p);

// ── File Viewer Modal (image gallery + PDF embed) ─────────────────────────────
interface ViewerFile { url: string; title: string }

function FileViewer({
  files, startIndex, onClose,
}: { files: ViewerFile[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);
  const file = files[idx];
  const multi = files.length > 1;
  const pdf = isPdf(file.url);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-xl" />
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 16 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-5xl flex flex-col bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
        style={{ maxHeight: "92vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <FileText size={15} className="text-primary flex-shrink-0" />
            <span className="font-display font-bold text-sm text-foreground truncate">{file.title}</span>
            {multi && (
              <span className="font-body text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex-shrink-0">
                {idx + 1} / {files.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <a href={file.url} target="_blank" rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-primary border border-primary/20 hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors">
              <ExternalLink size={12} /> Ouvrir
            </a>
            <button onClick={onClose}
              className="w-8 h-8 rounded-xl bg-muted hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 flex items-center justify-center transition-colors">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-muted/30" style={{ height: "76vh" }}>
          {pdf ? (
            <iframe src={file.url} className="w-full h-full border-0" title={file.title} />
          ) : (
            <img src={file.url} alt={file.title} className="w-full h-full object-contain" />
          )}
        </div>

        {/* Navigation (multi only) */}
        {multi && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-card flex-shrink-0">
            <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
              className="flex items-center gap-1.5 text-xs font-bold text-foreground/60 disabled:opacity-30 hover:text-primary px-3 py-1.5 rounded-lg hover:bg-primary/5 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={14} /> Précédent
            </button>
            <div className="flex items-center gap-1.5">
              {files.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === idx ? "bg-primary w-5" : "bg-muted-foreground/30 w-2"}`} />
              ))}
            </div>
            <button onClick={() => setIdx(i => Math.min(files.length - 1, i + 1))} disabled={idx === files.length - 1}
              className="flex items-center gap-1.5 text-xs font-bold text-foreground/60 disabled:opacity-30 hover:text-primary px-3 py-1.5 rounded-lg hover:bg-primary/5 disabled:cursor-not-allowed transition-colors">
              Suivant <ChevronRight size={14} />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Confirm modal ─────────────────────────────────────────────────────────────
function ConfirmModal({
  open, title, description, confirmLabel, confirmClass, loading, result,
  onConfirm, onClose,
}: {
  open: boolean; title: string; description: string; confirmLabel: string;
  confirmClass: string; loading: boolean; result: "success" | "error" | null;
  onConfirm: () => void; onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0a1628] rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        {result === null && (
          <>
            <div className="flex items-start gap-3">
              <AlertTriangle size={22} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">{title}</h3>
                <p className="text-sm text-slate-500 mt-1">{description}</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>Annuler</Button>
              <Button size="sm" className={confirmClass} onClick={onConfirm} disabled={loading}>
                {loading ? "En cours..." : confirmLabel}
              </Button>
            </div>
          </>
        )}
        {result === "success" && (
          <div className="text-center space-y-3 py-2">
            <CheckCircle size={40} className="mx-auto text-green-500" />
            <p className="font-semibold text-slate-800 dark:text-white">
              {confirmLabel.includes("Dépublier") ? "Concours dépublié" : "Concours publié !"}
            </p>
            <p className="text-sm text-slate-500">
              {confirmLabel.includes("Dépublier")
                ? "Le concours n'est plus visible publiquement."
                : "Les inscriptions sont maintenant ouvertes."}
            </p>
            <Button size="sm" onClick={onClose} className="w-full">Fermer</Button>
          </div>
        )}
        {result === "error" && (
          <div className="text-center space-y-3 py-2">
            <X size={40} className="mx-auto text-red-500" />
            <p className="font-semibold text-slate-800 dark:text-white">Une erreur est survenue</p>
            <p className="text-sm text-slate-500">Veuillez réessayer.</p>
            <Button size="sm" variant="outline" onClick={onClose} className="w-full">Fermer</Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── PDF / Image preview card ──────────────────────────────────────────────────
function FilePreviewCard({ path, titre, onDelete, deleting, onPreview }: {
  path: string; titre: string; onDelete: () => void; deleting: boolean;
  onPreview: () => void;
}) {
  const pdf = isPdf(path);
  return (
    <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden bg-slate-50 dark:bg-white/5">
      {/* Preview area — clickable */}
      <div
        className="relative w-full h-40 bg-slate-100 dark:bg-white/5 flex items-center justify-center cursor-pointer group"
        onClick={onPreview}
      >
        {pdf ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 pointer-events-none">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <FileText size={24} className="text-red-400" />
            </div>
            <span className="text-xs text-muted-foreground font-body">Document PDF</span>
          </div>
        ) : (
          <img
            src={fileViewUrl(path)}
            alt={titre}
            className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
          />
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
          <ZoomIn size={22} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center gap-2 px-3 py-2">
        <FileText size={14} className="text-red-400 flex-shrink-0" />
        <span className="flex-1 text-sm font-medium text-slate-700 dark:text-white truncate">{titre}</span>
        <button onClick={onPreview} className="text-primary hover:text-primary/80 transition-colors" title="Voir">
          <ExternalLink size={14} />
        </button>
        <Button
          variant="ghost" size="sm"
          className="text-red-400 hover:text-red-600 hover:bg-red-50 h-7 w-7 p-0"
          onClick={onDelete} disabled={deleting}
        >
          <Trash2 size={13} />
        </Button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ConcoursForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [concours, setConcours] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingAffiche, setUploadingAffiche] = useState(false);
  const [form, setForm] = useState({ categorie: "", sousCategorie: "", affiche: "" as string | undefined });
  const [fiches, setFiches] = useState<{ id: number; titre: string; fichierPdf: string }[]>([]);
  const [newFiche, setNewFiche] = useState({ titre: "", file: null as File | null });
  const [addingFiche, setAddingFiche] = useState(false);
  const [deletingFicheId, setDeletingFicheId] = useState<number | null>(null);

  // Viewer modal
  const [viewer, setViewer] = useState<{ files: ViewerFile[]; startIndex: number } | null>(null);

  // Submit/unpublish modal
  const [modal, setModal] = useState<{ type: "publish" | "unpublish" } | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalResult, setModalResult] = useState<"success" | "error" | null>(null);

  const afficheInputRef = useRef<HTMLInputElement>(null);
  const ficheInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEdit) return;
    api.getConcoursById(Number(id)).then((c) => {
      setConcours(c);
      setForm({ categorie: c.categorie, sousCategorie: c.sousCategorie, affiche: c.affiche });
      setFiches(c.fichesDescriptives ?? []);
    }).catch(() => toast.error("Erreur chargement concours"));
  }, [id]);

  const handleAfficheUpload = async (file: File) => {
    setUploadingAffiche(true);
    try {
      const { fileName } = await api.uploadConcoursAffiche(file);
      const updated = await api.updateConcours(Number(id), { ...form, categorie: form.categorie, sousCategorie: form.sousCategorie, periode: "NGUON-2026", affiche: fileName });
      setForm(f => ({ ...f, affiche: fileName }));
      setConcours(updated);
      toast.success("Affiche enregistrée");
    } catch {
      toast.error("Erreur upload affiche");
    } finally {
      setUploadingAffiche(false);
    }
  };

  const handleSave = async () => {
    if (!form.categorie || !form.sousCategorie) {
      toast.error("Remplissez tous les champs obligatoires");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        const updated = await api.updateConcours(Number(id), { ...form, periode: "NGUON-2026" });
        setConcours(updated);
        toast.success("Concours mis à jour");
      } else {
        const created = await api.createConcours({ ...form, periode: "NGUON-2026" });
        toast.success("Concours créé — ajoutez l'affiche et les fiches");
        navigate(`/admin/concours/edit/${created.id}`, { replace: true });
      }
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleAddFiche = async () => {
    if (!newFiche.titre || !newFiche.file) { toast.error("Titre et fichier PDF requis"); return; }
    setAddingFiche(true);
    try {
      const { fileName } = await api.uploadConcoursFiche(newFiche.file);
      const fiche = await api.addFicheConcours(Number(id), { titre: newFiche.titre, fichierPdf: fileName });
      setFiches(f => [...f, fiche]);
      setNewFiche({ titre: "", file: null });
      if (ficheInputRef.current) ficheInputRef.current.value = "";
      toast.success("Fiche ajoutée");
    } catch {
      toast.error("Erreur ajout fiche");
    } finally {
      setAddingFiche(false);
    }
  };

  const handleDeleteFiche = async (ficheId: number) => {
    setDeletingFicheId(ficheId);
    try {
      await api.deleteFicheConcours(ficheId);
      setFiches(f => f.filter(x => x.id !== ficheId));
      toast.success("Fiche supprimée");
    } catch {
      toast.error("Erreur suppression fiche");
    } finally {
      setDeletingFicheId(null);
    }
  };

  const handleModalConfirm = async () => {
    if (!modal) return;
    setModalLoading(true);
    try {
      const updated = modal.type === "publish"
        ? await api.soumettreConcours(Number(id))
        : await api.unsoumettreConcours(Number(id));
      setConcours(updated);
      setModalResult("success");
    } catch {
      setModalResult("error");
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => { setModal(null); setModalResult(null); };

  const isPublished = concours?.soumis ?? false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/concours")} className="gap-2 w-fit">
          <ArrowLeft size={16} /> Retour
        </Button>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
            {isEdit ? "Gérer le concours" : "Nouveau concours"}
          </h1>
          {isEdit && (
            <Badge variant={isPublished ? "default" : "secondary"} className="w-fit gap-1">
              {isPublished ? <><CheckCircle size={11} /> Publié</> : "Brouillon"}
            </Badge>
          )}
        </div>
        {/* Publish / Unpublish button — top right */}
        {isEdit && (
          <Button
            size="sm"
            className={`gap-2 w-fit ${isPublished ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}
            onClick={() => setModal({ type: isPublished ? "unpublish" : "publish" })}
          >
            {isPublished ? <><EyeOff size={14} /> Dépublier</> : <><Send size={14} /> Publier</>}
          </Button>
        )}
      </div>

      {/* Two-column layout on lg+ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* LEFT COLUMN — infos + affiche */}
        <div className="space-y-6">

          {/* Informations générales */}
          <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-white/5 p-5 sm:p-6 space-y-4">
            <h2 className="font-semibold text-slate-700 dark:text-white">Informations générales</h2>

            <div className="space-y-2">
              <Label>Catégorie *</Label>
              <Input
                placeholder="ex: ARTS – CULTURE – CRÉATIVITÉ"
                value={form.categorie}
                onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Sous-catégorie / Titre *</Label>
              <Input
                placeholder="ex: Grand Prix International des Arts et du Patrimoine Bamoun"
                value={form.sousCategorie}
                onChange={e => setForm(f => ({ ...f, sousCategorie: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Période</Label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">NGUON-2026</span>
                <span className="text-xs text-slate-400 ml-auto">Fixé</span>
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? "Sauvegarde..." : isEdit ? "Mettre à jour" : "Créer le concours"}
            </Button>
          </div>

          {/* Affiche d'annonce */}
          {isEdit && (
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-white/5 p-5 sm:p-6 space-y-4">
              <div>
                <h2 className="font-semibold text-slate-700 dark:text-white">Affiche d'annonce</h2>
                <p className="text-xs text-slate-400 mt-0.5">Image ou PDF visible publiquement</p>
              </div>

              {form.affiche ? (
                <div className="space-y-3">
                  {/* Preview — clickable */}
                  <div
                    className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 cursor-pointer group"
                    onClick={() => setViewer({ files: [{ url: fileViewUrl(form.affiche!), title: form.sousCategorie || "Affiche" }], startIndex: 0 })}
                  >
                    {isPdf(form.affiche) ? (
                      <div className="w-full h-56 flex flex-col items-center justify-center gap-3 bg-red-50/40 dark:bg-red-900/10 group-hover:bg-red-50/60 dark:group-hover:bg-red-900/20 transition-colors">
                        <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <FileText size={28} className="text-red-400" />
                        </div>
                        <span className="text-sm text-muted-foreground font-body">Document PDF — cliquer pour voir</span>
                      </div>
                    ) : (
                      <img src={fileViewUrl(form.affiche)} alt="affiche" className="w-full h-56 object-contain group-hover:scale-[1.02] transition-transform duration-300" />
                    )}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                      <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewer({ files: [{ url: fileViewUrl(form.affiche!), title: form.sousCategorie || "Affiche" }], startIndex: 0 })}
                      className="flex-1 text-xs text-primary hover:underline truncate flex items-center gap-1"
                    >
                      <ExternalLink size={12} /> Voir en plein écran
                    </button>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600 hover:bg-red-50 gap-1 text-xs"
                      onClick={async () => {
                        setSaving(true);
                        try {
                          await api.updateConcours(Number(id), { ...form, periode: "NGUON-2026", affiche: undefined });
                          setForm(f => ({ ...f, affiche: undefined }));
                          toast.success("Affiche retirée");
                        } catch { toast.error("Erreur"); } finally { setSaving(false); }
                      }}
                      disabled={saving}
                    >
                      <X size={12} /> Retirer
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => afficheInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl p-10 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  {uploadingAffiche
                    ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                    : <>
                        <Upload size={28} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-sm text-slate-400">Cliquer pour uploader</p>
                        <p className="text-xs text-slate-300 mt-1">Image ou PDF</p>
                      </>
                  }
                </div>
              )}
              <input ref={afficheInputRef} type="file" accept="image/*,.pdf" className="hidden"
                onChange={e => e.target.files?.[0] && handleAfficheUpload(e.target.files[0])} />
            </div>
          )}

          {/* Submit / Unpublish — bottom of left column */}
          {isEdit && (
            <div className={`rounded-2xl border p-5 space-y-3 ${isPublished ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-500/20" : "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-500/20"}`}>
              <div>
                <p className="font-semibold text-slate-700 dark:text-white text-sm">
                  {isPublished ? "Concours actuellement publié" : "Prêt à publier ?"}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isPublished
                    ? "Dépublier masquera ce concours du public. Les inscriptions existantes sont conservées."
                    : "Une fois publié, le concours sera visible et les inscriptions ouvertes."}
                </p>
              </div>
              <Button
                className={`w-full gap-2 ${isPublished ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}
                onClick={() => setModal({ type: isPublished ? "unpublish" : "publish" })}
              >
                {isPublished ? <><EyeOff size={15} /> Dépublier le concours</> : <><Send size={15} /> Publier le concours</>}
              </Button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — fiches descriptives */}
        {isEdit && (
          <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-white/5 p-5 sm:p-6 space-y-5">
            <div>
              <h2 className="font-semibold text-slate-700 dark:text-white">Fiches descriptives</h2>
              <p className="text-xs text-slate-400 mt-0.5">Documents PDF de description du concours</p>
            </div>

            {/* Existing fiches grid */}
            {fiches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fiches.map((fiche, fi) => (
                  <FilePreviewCard
                    key={fiche.id}
                    path={fiche.fichierPdf}
                    titre={fiche.titre}
                    onDelete={() => handleDeleteFiche(fiche.id)}
                    deleting={deletingFicheId === fiche.id}
                    onPreview={() => setViewer({
                      files: fiches.map(f => ({ url: fileViewUrl(f.fichierPdf), title: f.titre })),
                      startIndex: fi,
                    })}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">Aucune fiche ajoutée</p>
            )}

            {/* Add new fiche */}
            <div className="border border-dashed border-slate-200 dark:border-white/10 rounded-xl p-4 space-y-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Ajouter une fiche</p>
              <Input
                placeholder="Titre (ex: Règlement du concours)"
                value={newFiche.titre}
                onChange={e => setNewFiche(f => ({ ...f, titre: e.target.value }))}
              />
              <div
                onClick={() => ficheInputRef.current?.click()}
                className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-slate-200 dark:border-white/10 hover:border-primary/50 transition-colors"
              >
                <Upload size={15} className="text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-400 truncate">
                  {newFiche.file ? newFiche.file.name : "Choisir un PDF"}
                </span>
              </div>
              <input ref={ficheInputRef} type="file" accept=".pdf" className="hidden"
                onChange={e => setNewFiche(f => ({ ...f, file: e.target.files?.[0] ?? null }))} />
              <Button onClick={handleAddFiche} disabled={addingFiche} size="sm" className="gap-2 w-full">
                <Plus size={14} />
                {addingFiche ? "Ajout en cours..." : "Ajouter cette fiche"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={!!modal}
        title={modal?.type === "publish" ? "Publier ce concours ?" : "Dépublier ce concours ?"}
        description={
          modal?.type === "publish"
            ? "Une fois confirmé, ce concours sera visible publiquement et les inscriptions seront ouvertes."
            : "Ce concours sera masqué du public. Les inscriptions existantes seront conservées."
        }
        confirmLabel={modal?.type === "publish" ? "Publier" : "Dépublier"}
        confirmClass={modal?.type === "publish" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-amber-500 hover:bg-amber-600 text-white"}
        loading={modalLoading}
        result={modalResult}
        onConfirm={handleModalConfirm}
        onClose={closeModal}
      />

      {/* File Viewer Modal */}
      <AnimatePresence>
        {viewer && (
          <FileViewer
            files={viewer.files}
            startIndex={viewer.startIndex}
            onClose={() => setViewer(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
