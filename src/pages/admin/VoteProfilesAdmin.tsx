import { useState, useRef, useEffect } from "react";
import { cleanText, displayName } from "@/lib/voteText";
import {
  Plus, Search, Pencil, Trash2, X, ImagePlus,
  CheckCircle2, Circle, Loader2, Eye, EyeOff, Users, Star,
  AlertCircle, RotateCcw, BarChart3, ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { api, uploadFileWithProgress, type VoteCategory } from "@/lib/api";
import AdminPager from "@/components/admin/AdminPager";

const PAGE_SIZE = 12;

type VoteProfile = {
  id: number;
  name: string;
  description?: string;
  photoUrl: string;
  photoPresignedUrl?: string;
  published: boolean;
  voteCount: number;
  category?: VoteCategory;
};

type Voter = { email: string; verifiedAt: string };

// id is assigned by the backend on create — 0 is just a form placeholder, never sent.
const EMPTY: VoteProfile = { id: 0, name: "", description: "", photoUrl: "", published: true, voteCount: 0, category: "MISS" };
const CAT_LABEL: Record<VoteCategory, string> = { MISS: "Miss", MISTER: "Mister" };
const catOf = (p: VoteProfile): VoteCategory => p.category ?? "MISS";
const photo = (p: VoteProfile) => p.photoPresignedUrl ?? `${import.meta.env.VITE_API_BASE_URL}/files/view/${p.photoUrl}`;

// ─── Card ───────────────────────────────────────────────────────────────────────
const CategoryBadge = ({ c }: { c: VoteCategory }) => (
  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${c === "MISS" ? "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300" : "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"}`}>
    {CAT_LABEL[c]}
  </span>
);

const VisibilityBadge = ({ published }: { published: boolean }) => (
  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${published ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" : "bg-muted text-muted-foreground"}`}>
    {published ? "Publié" : "Masqué"}
  </span>
);

const ProfileCard = ({
  profile, onOpen, onEdit, onDelete, onToggleVisibility,
}: { profile: VoteProfile; onOpen: () => void; onEdit: () => void; onDelete: () => void; onToggleVisibility: () => void }) => (
  <article className={`flex flex-col bg-card border border-border/60 rounded-2xl overflow-hidden transition-shadow hover:shadow-lg ${profile.published ? "" : "opacity-75"}`}>
    <button type="button" onClick={onOpen} className="flex gap-4 p-4 text-left">
      <div className="w-24 sm:w-28 aspect-[4/5] flex-shrink-0 overflow-hidden rounded-xl bg-muted">
        {profile.photoUrl
          ? <img src={photo(profile)} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
          : <div className="h-full w-full flex items-center justify-center"><ImagePlus size={20} className="text-muted-foreground" /></div>}
      </div>
      <div className="min-w-0 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-1.5">
          <CategoryBadge c={catOf(profile)} />
          <VisibilityBadge published={profile.published} />
        </div>
        <h3 className="mt-2 font-bold text-foreground leading-snug line-clamp-2">{displayName(profile.name)}</h3>
        {profile.description && (
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">{cleanText(profile.description)}</p>
        )}
        <p className="mt-auto pt-2 flex items-baseline gap-1.5">
          <span className="font-display text-2xl font-black text-primary tabular-nums">{profile.voteCount}</span>
          <span className="text-xs font-semibold text-muted-foreground">vote{profile.voteCount > 1 ? "s" : ""}</span>
        </p>
      </div>
    </button>
    <div className="mt-auto flex flex-wrap gap-2 border-t border-border/60 bg-muted/30 px-4 py-3">
      <Button variant="outline" size="sm" onClick={onOpen} className="gap-1.5 flex-1"><Users size={14} /> Voir</Button>
      <Button variant="outline" size="sm" onClick={onEdit} className="gap-1.5 flex-1"><Pencil size={14} /> Modifier</Button>
      <Button variant="outline" size="sm" onClick={onToggleVisibility} title={profile.published ? "Masquer aux visiteurs" : "Rendre visible"} aria-label={profile.published ? "Masquer aux visiteurs" : "Rendre visible"}>
        {profile.published ? <EyeOff size={14} /> : <Eye size={14} />}
      </Button>
      <Button variant="outline" size="sm" onClick={onDelete} className="text-destructive hover:bg-destructive hover:text-white" aria-label="Supprimer"><Trash2 size={14} /></Button>
    </div>
  </article>
);

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function VoteProfilesAdmin() {
  const [profiles, setProfiles] = useState<VoteProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<VoteCategory | "ALL">("ALL");

  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<VoteProfile | null>(null);
  const [selected, setSelected] = useState<VoteProfile | null>(null);

  const [form, setForm] = useState<VoteProfile>(EMPTY);
  const [photoFile, setPhotoFile] = useState<{ file: File; previewUrl: string; progress: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Submit flow: confirm -> upload/save (with progress) -> success/error ──
  const [showConfirm, setShowConfirm] = useState(false);
  const [flow, setFlow] = useState<"idle" | "running" | "success" | "error">("idle");
  const [flowError, setFlowError] = useState("");

  const [votersTarget, setVotersTarget] = useState<VoteProfile | null>(null);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [votersLoading, setVotersLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  // Small, unpaginated fetch used only for the aggregate stat tiles below —
  // the main list itself stays paginated for the (potentially large) full set.
  const [allProfiles, setAllProfiles] = useState<VoteProfile[]>([]);

  const loadProfiles = () => {
    setLoading(true);
    // Admin endpoint — unlike the public one, includes hidden/unpublished profiles too.
    api.getVoteProfilesPaged(page, PAGE_SIZE, search || undefined, category === "ALL" ? undefined : category)
      .then(res => { setProfiles(res.content); setTotalElements(res.totalElements); setTotalPages(res.totalPages); })
      .catch(() => toast.error("Impossible de charger les profils"))
      .finally(() => setLoading(false));
  };

  const loadStats = () => {
    api.getVoteProfilesAdmin().then(setAllProfiles).catch(() => {});
  };

  useEffect(() => { loadStats(); }, []);

  useEffect(() => {
    const id = setTimeout(() => setPage(0), 300);
    return () => clearTimeout(id);
  }, [search, category]);

  useEffect(() => {
    const id = setTimeout(() => loadProfiles(), 250);
    return () => clearTimeout(id);
  }, [page, search, category]);

  const openCreate = () => {
    setSelected(null);
    setForm({ ...EMPTY, category: category === "ALL" ? "MISS" : category });
    setPhotoFile(null); setFlow("idle"); setFormOpen(true);
  };
  const openEdit = (p: VoteProfile) => {
    setVotersTarget(null);
    setSelected(p); setForm({ ...p, category: catOf(p) }); setPhotoFile(null); setFlow("idle"); setFormOpen(true);
  };
  const openDelete = (p: VoteProfile) => setDeleteTarget(p);

  const openVoters = (p: VoteProfile) => {
    setVotersTarget(p);
    setVotersLoading(true);
    api.getVoteProfileVoters(p.id)
      .then(setVoters)
      .catch(() => toast.error("Impossible de charger les votants"))
      .finally(() => setVotersLoading(false));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoFile) URL.revokeObjectURL(photoFile.previewUrl);
    setPhotoFile({ file, previewUrl: URL.createObjectURL(file), progress: 0 });
    if (fileRef.current) fileRef.current.value = "";
  };

  const removePhoto = () => {
    if (photoFile) URL.revokeObjectURL(photoFile.previewUrl);
    setPhotoFile(null);
    setForm(f => ({ ...f, photoUrl: "" }));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!photoFile && !form.photoUrl) {
      toast.error("Veuillez ajouter une photo");
      return;
    }
    if (!e.currentTarget.reportValidity()) return;
    setShowConfirm(true);
  };

  const runSubmit = async () => {
    setFlow("running");
    setFlowError("");
    try {
      let photoUrl = form.photoUrl;
      if (photoFile) {
        try {
          const { fileName } = await uploadFileWithProgress(
            "/files/upload/vote-profile",
            photoFile.file,
            (pct) => setPhotoFile(p => p ? { ...p, progress: pct } : p)
          );
          photoUrl = fileName;
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Échec de l'envoi";
          throw new Error(`Échec de l'envoi de la photo : ${msg}`);
        }
      }

      const payload = { name: form.name, description: form.description || undefined, photoUrl, published: form.published, category: catOf(form) };

      if (selected) {
        await api.updateVoteProfile(selected.id, payload);
      } else {
        await api.createVoteProfile(payload);
      }

      setFlow("success");
      toast.success(selected ? "Profil mis à jour" : "Profil créé");
      loadProfiles();
      loadStats();
      setTimeout(() => { setFormOpen(false); setFlow("idle"); }, 900);
    } catch (err) {
      setFlow("error");
      const raw = err instanceof Error ? err.message : "Une erreur s'est produite.";
      setFlowError(raw.length > 300 ? raw.slice(0, 300) + "…" : raw);
    }
  };

  const handleToggleVisibility = async (profile: VoteProfile) => {
    try {
      const updated = await api.updateVoteProfile(profile.id, {
        name: profile.name, description: profile.description, photoUrl: profile.photoUrl,
        published: !profile.published, category: catOf(profile),
      });
      loadProfiles();
      loadStats();
      setVotersTarget((t) => (t && t.id === profile.id ? { ...t, published: updated.published } : t));
      toast.success(updated.published ? "Profil publié" : "Profil masqué");
    } catch {
      toast.error("Impossible de modifier la visibilité");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteVoteProfile(deleteTarget.id);
      loadProfiles();
      loadStats();
      toast.success("Profil supprimé");
      setDeleteTarget(null);
    } catch {
      toast.error("La suppression a échoué");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Votes — Miss & Mister</h1>
          <p className="text-muted-foreground mt-1">Profils soumis au vote du public, en deux catégories : un vote Miss et un vote Mister par personne.</p>
        </div>
        <div className="flex flex-wrap gap-2 flex-shrink-0">
          <Button variant="outline" asChild className="gap-2"><Link to="/admin/vote-results"><BarChart3 size={18} /> Résultats & rapports</Link></Button>
          <Button onClick={openCreate} className="gap-2"><Plus size={18} /> Nouveau profil</Button>
        </div>
      </div>

      {/* Per-category figures */}
      <div className="grid sm:grid-cols-2 gap-4">
        {(["MISS", "MISTER"] as VoteCategory[]).map((c) => {
          const list = allProfiles.filter((p) => catOf(p) === c);
          return (
            <div key={c} className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-black text-foreground">{CAT_LABEL[c]}</h2>
                <CategoryBadge c={c} />
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-3">
                {[
                  { label: "Profils", value: list.length },
                  { label: "Publiés", value: list.filter((p) => p.published).length },
                  { label: "Votes", value: list.reduce((n, p) => n + p.voteCount, 0) },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col-reverse">
                    <dt className="text-xs text-muted-foreground font-semibold">{s.label}</dt>
                    <dd className="font-display text-2xl font-black text-foreground tabular-nums">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </div>

      {/* Category tabs + search */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div role="tablist" aria-label="Catégorie" className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1 md:inline-grid">
          {([["ALL", "Tous"], ["MISS", "Miss"], ["MISTER", "Mister"]] as [VoteCategory | "ALL", string][]).map(([value, label]) => (
            <button
              key={value}
              role="tab"
              aria-selected={category === value}
              onClick={() => setCategory(value)}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition ${
                category === value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
              <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                {value === "ALL" ? allProfiles.length : allProfiles.filter((p) => catOf(p) === value).length}
              </span>
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher un profil…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      {/* List */}
      {loading && profiles.length === 0 ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-52 rounded-2xl bg-muted animate-pulse" />)}
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-border">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3"><Star size={22} className="text-primary" /></div>
          <p className="text-foreground font-semibold">Aucun profil {category !== "ALL" ? CAT_LABEL[category] : ""} trouvé</p>
          <Button onClick={openCreate} variant="outline" className="mt-4 gap-2"><Plus size={15} /> Ajouter un profil</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {profiles.map(p => (
            <ProfileCard
              key={p.id} profile={p}
              onOpen={() => openVoters(p)}
              onEdit={() => openEdit(p)}
              onDelete={() => openDelete(p)}
              onToggleVisibility={() => handleToggleVisibility(p)}
            />
          ))}
        </div>
      )}

      <AdminPager page={page} size={PAGE_SIZE} totalElements={totalElements} totalPages={totalPages} onPageChange={setPage} />

      {/* ── CREATE / EDIT DIALOG ── */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-black text-xl">{selected ? "Modifier le profil" : "Nouveau profil"}</DialogTitle>
            <DialogDescription>{selected ? "Modifiez les informations du profil." : "Ajoutez un nouveau profil soumis au vote."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-5 pt-1">
            <div>
              <Label className="mb-2 block font-black text-base">Photo *</Label>
              {(photoFile || form.photoUrl) ? (
                <div className="relative w-32 aspect-[4/5] rounded-xl overflow-hidden border border-border/50 bg-muted">
                  <img src={photoFile?.previewUrl ?? form.photoPresignedUrl ?? form.photoUrl} alt="" className="w-full h-full object-cover object-top" />
                  <button type="button" onClick={removePhoto} aria-label="Retirer la photo"
                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-destructive transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" id="vote-profile-photo" />
                  <label htmlFor="vote-profile-photo" className="flex items-center justify-center gap-2 w-full py-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-semibold text-muted-foreground hover:text-primary">
                    <ImagePlus size={18} /> Ajouter une photo
                  </label>
                </>
              )}
            </div>

            <div>
              <Label className="mb-1.5 block">Catégorie *</Label>
              <div role="radiogroup" className="grid grid-cols-2 gap-2">
                {(["MISS", "MISTER"] as VoteCategory[]).map((c) => (
                  <button
                    key={c} type="button" role="radio" aria-checked={catOf(form) === c}
                    onClick={() => setForm(f => ({ ...f, category: c }))}
                    className={`rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition ${
                      catOf(form) === c ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {CAT_LABEL[c]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-1.5 block">Nom *</Label>
              <Input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex : Aïcha Njoya" />
            </div>

            <div>
              <Label className="mb-1.5 block">Présentation (optionnel)</Label>
              <textarea rows={6} value={form.description ?? ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>

            <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-muted/50">
              <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="w-4 h-4 rounded" />
              <span className="text-sm font-semibold flex items-center gap-2">
                {form.published ? <CheckCircle2 size={14} className="text-green-600" /> : <Circle size={14} className="text-muted-foreground" />}
                Visible sur la page des votes
              </span>
            </label>

            <div className="flex gap-3 pt-2 border-t border-border">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setFormOpen(false)}>Annuler</Button>
              <Button type="submit" className="flex-1">
                {selected ? "Mettre à jour" : "Créer le profil"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Confirmation dialog ── */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected ? "Confirmer la mise à jour" : "Confirmer la création"}</DialogTitle>
            <DialogDescription>
              {selected
                ? <>Voulez-vous enregistrer les modifications apportées à <strong>{form.name}</strong> ?</>
                : <>Voulez-vous créer le profil <strong>{form.name}</strong> ?</>
              }
              {photoFile && <> La photo sera envoyée.</>}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-2">
            <Button type="button" variant="outline" onClick={() => setShowConfirm(false)}>Annuler</Button>
            <Button type="button" onClick={() => { setShowConfirm(false); runSubmit(); }}>
              {selected ? "Confirmer la mise à jour" : "Confirmer la création"}
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
                {photoFile ? `Envoi de la photo… (${photoFile.progress}%)` : "Enregistrement en cours…"}
              </h3>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mt-4">
                <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${photoFile ? photoFile.progress : 100}%` }} />
              </div>
            </div>
          )}
          {flow === "success" && (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={30} className="text-green-600" />
              </div>
              <h3 className="font-black text-lg">{selected ? "Profil mis à jour !" : "Profil créé !"}</h3>
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

      {/* Delete dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>Êtes-vous sûr de vouloir supprimer <strong>{deleteTarget && displayName(deleteTarget.name)}</strong> ? Cette action est irréversible et supprimera aussi tous ses votes.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Annuler</Button>
            <Button variant="destructive" onClick={confirmDelete}>Supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile dialog */}
      <Dialog open={!!votersTarget} onOpenChange={o => !o && setVotersTarget(null)}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto p-0 gap-0 [&>button]:z-10 [&>button]:rounded-full [&>button]:bg-white/90 [&>button]:p-1.5 [&>button]:text-foreground [&>button]:opacity-100 [&>button]:shadow">
          {votersTarget && (
            <>
              <div className="grid md:grid-cols-[minmax(0,260px)_1fr]">
                <div className="relative bg-muted h-[38vh] md:h-auto md:min-h-[360px]">
                  {votersTarget.photoUrl && (
                    <img src={photo(votersTarget)} alt={displayName(votersTarget.name)} className="absolute inset-0 h-full w-full object-cover object-top" />
                  )}
                </div>
                <div className="p-6 flex flex-col min-w-0">
                  <div className="flex flex-wrap gap-1.5 pr-8">
                    <CategoryBadge c={catOf(votersTarget)} />
                    <VisibilityBadge published={votersTarget.published} />
                  </div>
                  <DialogHeader className="mt-3 text-left">
                    <DialogTitle className="font-display text-2xl font-black leading-tight">{displayName(votersTarget.name)}</DialogTitle>
                    <DialogDescription className="sr-only">Profil de vote et liste des votes confirmés</DialogDescription>
                  </DialogHeader>
                  <p className="mt-4 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-black text-primary tabular-nums">{votersTarget.voteCount}</span>
                    <span className="text-sm font-semibold text-muted-foreground">vote{votersTarget.voteCount > 1 ? "s" : ""} confirmé{votersTarget.voteCount > 1 ? "s" : ""}</span>
                  </p>
                  {votersTarget.description && (
                    <p className="mt-4 text-sm leading-relaxed text-foreground/80 whitespace-pre-line max-h-48 overflow-y-auto pr-1">
                      {cleanText(votersTarget.description)}
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => openEdit(votersTarget)} className="gap-1.5"><Pencil size={14} /> Modifier</Button>
                    <Button size="sm" variant="outline" onClick={() => handleToggleVisibility(votersTarget)} className="gap-1.5">
                      {votersTarget.published ? <><EyeOff size={14} /> Masquer</> : <><Eye size={14} /> Publier</>}
                    </Button>
                    <Button size="sm" variant="outline" asChild className="gap-1.5">
                      <a href={`/vote/${votersTarget.id}`} target="_blank" rel="noopener"><ExternalLink size={14} /> Page publique</a>
                    </Button>
                    <Button size="sm" variant="outline" asChild className="gap-1.5">
                      <Link to="/admin/vote-results"><BarChart3 size={14} /> Rapport</Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t border-border px-6 py-5">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <Users size={16} className="text-primary" /> Votes confirmés
                  {!votersLoading && <span className="text-sm font-semibold text-muted-foreground">({voters.length})</span>}
                </h4>
                {votersLoading ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground"><Loader2 size={20} className="animate-spin" /></div>
                ) : voters.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6">Aucun vote confirmé pour l'instant.</p>
                ) : (
                  <ul className="mt-3 max-h-72 overflow-y-auto divide-y divide-border/60 rounded-xl border border-border/60">
                    {voters.map(v => (
                      <li key={v.email} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 px-4 py-2.5">
                        <span className="text-sm font-medium text-foreground break-all">{v.email}</span>
                        <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0">
                          {new Date(v.verifiedAt).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
