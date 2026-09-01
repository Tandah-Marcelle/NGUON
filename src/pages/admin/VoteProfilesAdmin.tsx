import { useState, useRef, useEffect } from "react";
import {
  Plus, Search, Pencil, Trash2, X, ImagePlus,
  CheckCircle2, Circle, Loader2, Eye, EyeOff, Users, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { api } from "@/lib/api";

type VoteProfile = {
  id: number;
  name: string;
  description?: string;
  photoUrl: string;
  photoPresignedUrl?: string;
  published: boolean;
  voteCount: number;
};

type Voter = { email: string; verifiedAt: string };

// id is assigned by the backend on create — 0 is just a form placeholder, never sent.
const EMPTY: VoteProfile = { id: 0, name: "", description: "", photoUrl: "", published: true, voteCount: 0 };

// ─── Row ────────────────────────────────────────────────────────────────────────
const ProfileRow = ({
  profile, onEdit, onDelete, onToggleVisibility, onViewVoters,
}: { profile: VoteProfile; onEdit: () => void; onDelete: () => void; onToggleVisibility: () => void; onViewVoters: () => void }) => (
  <div className="flex items-center gap-4 bg-card border border-border/50 rounded-2xl p-4 hover:shadow-md transition-shadow">
    <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0">
      {profile.photoUrl
        ? <img src={profile.photoPresignedUrl ?? profile.photoUrl} alt={profile.name} className="w-full h-full object-cover" />
        : <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex flex-wrap items-center gap-2 mb-0.5">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${profile.published ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
          {profile.published ? "Publié" : "Masqué"}
        </span>
      </div>
      <p className="font-bold text-foreground truncate">{profile.name}</p>
      {profile.description && <p className="text-xs text-muted-foreground truncate">{profile.description}</p>}
    </div>
    <button
      onClick={onViewVoters}
      className="flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl hover:bg-primary/5 transition-colors"
      title="Voir les votants"
    >
      <span className="text-lg font-black text-primary">{profile.voteCount}</span>
      <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1"><Users size={10} /> votes</span>
    </button>
    <div className="flex gap-2 flex-shrink-0">
      <Button
        variant="outline" size="sm" onClick={onToggleVisibility}
        title={profile.published ? "Masquer aux visiteurs" : "Rendre visible"}
      >
        {profile.published ? <EyeOff size={13} /> : <Eye size={13} />}
      </Button>
      <Button variant="outline" size="sm" onClick={onEdit} className="gap-1"><Pencil size={13} /> Modifier</Button>
      <Button variant="destructive" size="sm" onClick={onDelete}><Trash2 size={13} /></Button>
    </div>
  </div>
);

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function VoteProfilesAdmin() {
  const [profiles, setProfiles] = useState<VoteProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<VoteProfile | null>(null);
  const [selected, setSelected] = useState<VoteProfile | null>(null);

  const [form, setForm] = useState<VoteProfile>(EMPTY);
  const [photoFile, setPhotoFile] = useState<{ file: File; previewUrl: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [votersTarget, setVotersTarget] = useState<VoteProfile | null>(null);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [votersLoading, setVotersLoading] = useState(false);

  const loadProfiles = () => {
    setLoading(true);
    // Admin endpoint — unlike the public one, includes hidden/unpublished profiles too.
    api.getVoteProfilesAdmin()
      .then(setProfiles)
      .catch(() => toast.error("Impossible de charger les profils"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadProfiles(); }, []);

  const openCreate = () => { setSelected(null); setForm(EMPTY); setPhotoFile(null); setFormOpen(true); };
  const openEdit = (p: VoteProfile) => { setSelected(p); setForm(p); setPhotoFile(null); setFormOpen(true); };
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
    setPhotoFile({ file, previewUrl: URL.createObjectURL(file) });
    if (fileRef.current) fileRef.current.value = "";
  };

  const removePhoto = () => {
    if (photoFile) URL.revokeObjectURL(photoFile.previewUrl);
    setPhotoFile(null);
    setForm(f => ({ ...f, photoUrl: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile && !form.photoUrl) {
      toast.error("Veuillez ajouter une photo");
      return;
    }
    setIsSubmitting(true);
    try {
      let photoUrl = form.photoUrl;
      if (photoFile) {
        setUploading(true);
        const { fileName } = await api.uploadVoteProfileFile(photoFile.file);
        photoUrl = fileName;
        setUploading(false);
      }

      const payload = { name: form.name, description: form.description || undefined, photoUrl, published: form.published };

      if (selected) {
        const updated = await api.updateVoteProfile(selected.id, payload);
        setProfiles(prev => prev.map(p => p.id === selected.id ? updated : p));
        toast.success("Profil mis à jour");
      } else {
        const created = await api.createVoteProfile(payload);
        setProfiles(prev => [...prev, created]);
        toast.success("Profil créé");
      }
      setFormOpen(false);
    } catch {
      toast.error("Une erreur s'est produite");
    } finally {
      setIsSubmitting(false);
      setUploading(false);
    }
  };

  const handleToggleVisibility = async (profile: VoteProfile) => {
    try {
      const updated = await api.updateVoteProfile(profile.id, {
        name: profile.name, description: profile.description, photoUrl: profile.photoUrl,
        published: !profile.published,
      });
      setProfiles(prev => prev.map(p => p.id === profile.id ? updated : p));
      toast.success(updated.published ? "Profil publié" : "Profil masqué");
    } catch {
      toast.error("Impossible de modifier la visibilité");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteVoteProfile(deleteTarget.id);
      setProfiles(prev => prev.filter(p => p.id !== deleteTarget.id));
      toast.success("Profil supprimé");
      setDeleteTarget(null);
    } catch {
      toast.error("La suppression a échoué");
    }
  };

  const filtered = profiles.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Votes — Miss & Master</h1>
          <p className="text-muted-foreground mt-1">Gérez les profils soumis au vote du public sur la page Concours.</p>
        </div>
        <Button onClick={openCreate} className="gap-2 flex-shrink-0"><Plus size={18} /> Nouveau profil</Button>
      </div>

      {/* Filters */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Rechercher un profil…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Profils", value: profiles.length, color: "text-foreground" },
          { label: "Publiés", value: profiles.filter(p => p.published).length, color: "text-green-600" },
          { label: "Votes reçus", value: profiles.reduce((s, p) => s + p.voteCount, 0), color: "text-primary" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border/50 rounded-2xl p-4 text-center">
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground font-semibold mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 size={22} className="animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3"><Star size={22} className="text-primary" /></div>
          <p className="text-muted-foreground font-semibold">Aucun profil trouvé</p>
          <Button onClick={openCreate} variant="outline" className="mt-4 gap-2"><Plus size={15} /> Ajouter le premier</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => (
            <ProfileRow
              key={p.id} profile={p}
              onEdit={() => openEdit(p)}
              onDelete={() => openDelete(p)}
              onToggleVisibility={() => handleToggleVisibility(p)}
              onViewVoters={() => openVoters(p)}
            />
          ))}
        </div>
      )}

      {/* ── CREATE / EDIT DIALOG ── */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-black text-xl">{selected ? "Modifier le profil" : "Nouveau profil"}</DialogTitle>
            <DialogDescription>{selected ? "Modifiez les informations du profil." : "Ajoutez un nouveau profil soumis au vote."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 pt-1">
            <div>
              <Label className="mb-2 block font-black text-base">Photo *</Label>
              {(photoFile || form.photoUrl) ? (
                <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-border/50 bg-muted group">
                  <img src={photoFile?.previewUrl ?? form.photoPresignedUrl ?? form.photoUrl} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={removePhoto}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={10} />
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
              <Label className="mb-1.5 block">Nom *</Label>
              <Input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex : Aïcha Njoya" />
            </div>

            <div>
              <Label className="mb-1.5 block">Description (optionnel)</Label>
              <textarea rows={3} value={form.description ?? ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>

            <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-muted/50">
              <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="w-4 h-4 rounded" />
              <span className="text-sm font-semibold flex items-center gap-2">
                {form.published ? <CheckCircle2 size={14} className="text-green-600" /> : <Circle size={14} className="text-muted-foreground" />}
                Visible sur la page Concours
              </span>
            </label>

            <div className="flex gap-3 pt-2 border-t border-border">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setFormOpen(false)}>Annuler</Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (uploading ? "Envoi de la photo…" : "Enregistrement…") : selected ? "Mettre à jour" : "Créer le profil"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>Êtes-vous sûr de vouloir supprimer <strong>{deleteTarget?.name}</strong> ? Cette action est irréversible et supprimera aussi tous ses votes.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Annuler</Button>
            <Button variant="destructive" onClick={confirmDelete}>Supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Voters dialog */}
      <Dialog open={!!votersTarget} onOpenChange={o => !o && setVotersTarget(null)}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-black text-xl">Votants — {votersTarget?.name}</DialogTitle>
            <DialogDescription>{votersTarget?.voteCount ?? 0} vote(s) confirmé(s).</DialogDescription>
          </DialogHeader>
          {votersLoading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 size={20} className="animate-spin" />
            </div>
          ) : voters.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Aucun vote pour l'instant.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground font-bold uppercase tracking-wider border-b border-border">
                  <th className="pb-2">Email</th>
                  <th className="pb-2 text-right">Confirmé le</th>
                </tr>
              </thead>
              <tbody>
                {voters.map(v => (
                  <tr key={v.email} className="border-b border-border/50 last:border-0">
                    <td className="py-2 font-medium text-foreground">{v.email}</td>
                    <td className="py-2 text-right text-muted-foreground text-xs">
                      {new Date(v.verifiedAt).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
