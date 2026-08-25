import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ShopCategory } from "@/data/shopData";
import { api } from "@/lib/api";
import FaIconPicker, { CategoryIcon } from "@/components/FaIconPicker";
import type { IconName } from "@fortawesome/fontawesome-svg-core";

type CategoryForm = { key: string; label: string; icon: string; description: string };

const EMPTY: CategoryForm = { key: "", label: "", icon: "tag", description: "" };

export default function ShopCategoriesAdmin() {
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ShopCategory | null>(null);
  const [selected, setSelected] = useState<ShopCategory | null>(null);
  const [form, setForm] = useState<CategoryForm>(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    api.getShopCategories()
      .then(setCategories)
      .catch(() => toast.error("Impossible de charger les catégories"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => { setSelected(null); setForm(EMPTY); setFormOpen(true); };
  const openEdit = (c: ShopCategory) => { setSelected(c); setForm({ key: c.key, label: c.label, icon: c.icon ?? "tag", description: c.description ?? "" }); setFormOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.key.trim() || !form.label.trim()) { toast.error("Clé et libellé requis"); return; }
    if (!selected && categories.some(c => c.key === form.key)) { toast.error("Cette clé existe déjà"); return; }

    setIsSubmitting(true);
    try {
      const payload = { key: form.key, label: form.label, icon: form.icon, description: form.description, displayOrder: selected?.displayOrder ?? categories.length };
      if (selected) {
        await api.updateShopCategory(selected.id, payload);
        toast.success("Catégorie mise à jour");
      } else {
        await api.createShopCategory(payload);
        toast.success("Catégorie créée");
      }
      setFormOpen(false);
      load();
    } catch {
      toast.error("Une erreur s'est produite");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteShopCategory(deleteTarget.id);
      toast.success("Catégorie supprimée");
      setDeleteTarget(null);
      load();
    } catch {
      toast.error("La suppression a échoué");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Catégories de la Boutique</h1>
          <p className="text-muted-foreground mt-1">Gérez les catégories et leurs icônes Font Awesome.</p>
        </div>
        <Button onClick={openCreate} className="gap-2 flex-shrink-0">
          <Plus size={18} /> Nouvelle catégorie
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 size={22} className="animate-spin" />
        </div>
      )}

      {/* Grid of category cards */}
      {!loading && (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.key} className="bg-card border border-border/50 rounded-2xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              {/* Icon preview */}
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <CategoryIcon icon={cat.icon} className="w-7 h-7 text-primary" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(cat)}><Pencil size={13} /></Button>
                <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(cat)}><Trash2 size={13} /></Button>
              </div>
            </div>
            <h3 className="font-bold text-foreground text-lg">{cat.label}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">{cat.key}</span>
              <span className="text-xs text-primary font-mono bg-primary/8 px-2 py-0.5 rounded">{cat.icon}</span>
            </div>
            {cat.description && <p className="text-sm text-muted-foreground mt-2">{cat.description}</p>}
          </div>
        ))}
      </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-black">
              {selected ? "Modifier la catégorie" : "Nouvelle catégorie"}
            </DialogTitle>
            <DialogDescription>
              {selected
                ? "Modifiez le libellé, l'icône ou la description."
                : "Créez une nouvelle catégorie avec une icône Font Awesome."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 pt-1">
            {/* Key + Label */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block">Clé *</Label>
                <Input
                  required
                  value={form.key}
                  onChange={e => setForm(f => ({ ...f, key: e.target.value.toLowerCase().replace(/\s+/g, "_") }))}
                  placeholder="ex : artisanat"
                  disabled={!!selected}
                />
                <p className="text-[10px] text-muted-foreground mt-1">Identifiant unique, non modifiable après création.</p>
              </div>
              <div>
                <Label className="mb-1.5 block">Libellé *</Label>
                <Input
                  required
                  value={form.label}
                  onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                  placeholder="Ex : Artisanat"
                />
              </div>
            </div>

            {/* Icon picker */}
            <div>
              <FaIconPicker
                label="Icône Font Awesome"
                value={form.icon as IconName | ""}
                onChange={icon => setForm(f => ({ ...f, icon }))}
              />
              {/* Live preview */}
              {form.icon && (
                <div className="flex items-center gap-3 mt-3 p-3 bg-primary/5 rounded-xl border border-primary/15">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <CategoryIcon icon={form.icon} className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{form.label || "Aperçu"}</p>
                    <p className="text-xs font-mono text-muted-foreground">{form.icon}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <Label className="mb-1.5 block">Description (optionnel)</Label>
              <Input
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Courte description de la catégorie"
              />
            </div>

            <div className="flex gap-3 pt-1 border-t border-border">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setFormOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Enregistrement…" : selected ? "Mettre à jour" : "Créer la catégorie"}
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
            <DialogDescription>
              Supprimer la catégorie <strong>{deleteTarget?.label}</strong> ?<br />
              Les produits associés conserveront leur ancienne catégorie.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Annuler</Button>
            <Button variant="destructive" onClick={confirmDelete}>Supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
