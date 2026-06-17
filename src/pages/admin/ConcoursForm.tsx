import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Trash2, Plus, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ConcoursForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [saving, setSaving] = useState(false);
  const [uploadingAffiche, setUploadingAffiche] = useState(false);
  const [form, setForm] = useState({
    categorie: "",
    sousCategorie: "",
    periode: "NGUON-2026",
    affiche: "" as string | undefined,
  });
  const [fiches, setFiches] = useState<{ id: number; titre: string; fichierPdf: string }[]>([]);
  const [newFiche, setNewFiche] = useState({ titre: "", file: null as File | null });
  const [addingFiche, setAddingFiche] = useState(false);
  const [deletingFicheId, setDeletingFicheId] = useState<number | null>(null);

  const afficheInputRef = useRef<HTMLInputElement>(null);
  const ficheInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEdit) return;
    api.getConcoursById(Number(id)).then((c) => {
      setForm({ categorie: c.categorie, sousCategorie: c.sousCategorie, periode: c.periode, affiche: c.affiche });
      setFiches(c.fichesDescriptives ?? []);
    }).catch(() => toast.error("Erreur chargement concours"));
  }, [id]);

  const handleAfficheUpload = async (file: File) => {
    setUploadingAffiche(true);
    try {
      const { fileName } = await api.uploadConcoursAffiche(file);
      setForm(f => ({ ...f, affiche: fileName }));
      toast.success("Affiche uploadée");
    } catch {
      toast.error("Erreur upload affiche");
    } finally {
      setUploadingAffiche(false);
    }
  };

  const handleSave = async () => {
    if (!form.categorie || !form.sousCategorie || !form.periode) {
      toast.error("Remplissez tous les champs obligatoires");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await api.updateConcours(Number(id), form);
        toast.success("Concours mis à jour");
      } else {
        const created = await api.createConcours(form);
        toast.success("Concours créé");
        navigate(`/admin/concours/edit/${created.id}`, { replace: true });
        return;
      }
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleAddFiche = async () => {
    if (!newFiche.titre || !newFiche.file) {
      toast.error("Titre et fichier PDF requis");
      return;
    }
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

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/concours")} className="gap-2">
          <ArrowLeft size={16} /> Retour
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">
            {isEdit ? "Gérer le concours" : "Nouveau concours"}
          </h1>
        </div>
      </div>

      {/* Informations générales */}
      <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-white/5 p-6 space-y-5">
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
          <Label>Période *</Label>
          <Input
            placeholder="ex: NGUON-2026"
            value={form.periode}
            onChange={e => setForm(f => ({ ...f, periode: e.target.value }))}
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "Sauvegarde..." : isEdit ? "Mettre à jour" : "Créer le concours"}
        </Button>
      </div>

      {/* Affiche — only after creation */}
      {isEdit && (
        <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-white/5 p-6 space-y-4">
          <h2 className="font-semibold text-slate-700 dark:text-white">Affiche d'annonce</h2>
          <p className="text-sm text-slate-400">Image ou PDF affiché publiquement</p>

          {form.affiche ? (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              {form.affiche.endsWith(".pdf") ? (
                <FileText size={32} className="text-red-400 flex-shrink-0" />
              ) : (
                <img
                  src={`${API_BASE_URL}/files/view/?path=${encodeURIComponent(form.affiche)}`}
                  alt="affiche"
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-white truncate">{form.affiche.split("/").pop()}</p>
                <a
                  href={`${API_BASE_URL}/files/view/?path=${encodeURIComponent(form.affiche)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  Voir l'affiche
                </a>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-red-500"
                onClick={() => setForm(f => ({ ...f, affiche: undefined }))}
              >
                <X size={16} />
              </Button>
            </div>
          ) : (
            <div
              onClick={() => afficheInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              {uploadingAffiche ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              ) : (
                <>
                  <Upload size={28} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-sm text-slate-400">Cliquer pour uploader (image ou PDF)</p>
                </>
              )}
            </div>
          )}
          <input
            ref={afficheInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleAfficheUpload(e.target.files[0])}
          />
          {form.affiche && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={async () => {
                setSaving(true);
                try {
                  await api.updateConcours(Number(id), form);
                  toast.success("Affiche liée au concours");
                } catch { toast.error("Erreur"); } finally { setSaving(false); }
              }}
              disabled={saving}
            >
              {saving ? "..." : "Enregistrer l'affiche"}
            </Button>
          )}
        </div>
      )}

      {/* Fiches descriptives — only after creation */}
      {isEdit && (
        <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-white/5 p-6 space-y-4">
          <h2 className="font-semibold text-slate-700 dark:text-white">Fiches descriptives (PDF)</h2>

          {fiches.length > 0 && (
            <div className="space-y-2">
              {fiches.map(fiche => (
                <div key={fiche.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                  <FileText size={18} className="text-red-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-white truncate">{fiche.titre}</p>
                    <a
                      href={`${API_BASE_URL}/files/view/?path=${encodeURIComponent(fiche.fichierPdf)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      Ouvrir le PDF
                    </a>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteFiche(fiche.id)}
                    disabled={deletingFicheId === fiche.id}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add new fiche */}
          <div className="border border-dashed border-slate-200 dark:border-white/10 rounded-xl p-4 space-y-3">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Ajouter une fiche</p>
            <Input
              placeholder="Titre de la fiche (ex: Règlement du concours)"
              value={newFiche.titre}
              onChange={e => setNewFiche(f => ({ ...f, titre: e.target.value }))}
            />
            <div
              onClick={() => ficheInputRef.current?.click()}
              className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-slate-200 dark:border-white/10 hover:border-primary/50 transition-colors"
            >
              <Upload size={16} className="text-slate-400" />
              <span className="text-sm text-slate-400">
                {newFiche.file ? newFiche.file.name : "Choisir un PDF"}
              </span>
            </div>
            <input
              ref={ficheInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={e => setNewFiche(f => ({ ...f, file: e.target.files?.[0] ?? null }))}
            />
            <Button onClick={handleAddFiche} disabled={addingFiche} size="sm" className="gap-2 w-full">
              <Plus size={14} />
              {addingFiche ? "Ajout en cours..." : "Ajouter cette fiche"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
