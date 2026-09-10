import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Star, Hotel, UtensilsCrossed, Sparkles, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { api } from "@/lib/api";
import AdminPager from "@/components/admin/AdminPager";

const PAGE_SIZE = 15;

// ─── Types (shared) ───────────────────────────────────────────────────────────
export interface BookingMedia { id?: number; type: "image" | "video"; url: string; alt?: string; }
export interface BookingProperty {
  id?: number;
  category: "hotel" | "restaurant";
  name: string; tagline: string; description: string;
  address: string; phone: string; whatsapp?: string; email?: string; website?: string;
  priceFrom?: string; priceTo?: string; priceUnit?: string;
  stars?: number; cuisine?: string; openingHours?: string;
  features: string[];
  accentColor?: string; featured: boolean; published: boolean;
  media?: BookingMedia[];
}

// ─── Row ──────────────────────────────────────────────────────────────────────
const PropertyRow = ({
  prop, onEdit, onDelete, onToggleVisibility,
}: { prop: BookingProperty; onEdit: () => void; onDelete: () => void; onToggleVisibility: () => void }) => {
  const firstImg = prop.media?.find(m => m.type === "image");
  const src = firstImg
    ? (firstImg.url.startsWith("blob:") || firstImg.url.startsWith("http") || firstImg.url.startsWith("/")
      ? firstImg.url : ((firstImg as any).presignedUrl ?? api.getMediaViewUrl(firstImg.url)))
    : null;

  return (
    <div className="flex items-center gap-4 bg-card border border-border/50 rounded-2xl p-4 hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
        {src
          ? <img src={src} alt={prop.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            {prop.category === "hotel" ? <Hotel size={24} /> : <UtensilsCrossed size={24} />}
          </div>}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${prop.category === "hotel" ? "bg-primary/10 text-primary" : "bg-secondary/20 text-secondary"}`}>
            {prop.category === "hotel" ? "Hôtel" : "Restaurant"}
          </span>
          {prop.featured && (
            <span className="text-[10px] font-black bg-secondary text-black px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles size={8} /> Recommandé
            </span>
          )}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${prop.published ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
            {prop.published ? "Publié" : "Brouillon"}
          </span>
        </div>
        <h3 className="font-bold text-foreground truncate">{prop.name}</h3>
        <p className="text-xs text-muted-foreground truncate">{prop.tagline}</p>
        <div className="flex items-center gap-3 mt-1">
          {prop.priceFrom && (
            <span className="text-xs font-black text-primary">Dès {prop.priceFrom} {prop.priceUnit}</span>
          )}
          {prop.stars && prop.category === "hotel" && (
            <div className="flex gap-0.5">
              {Array.from({ length: prop.stars }).map((_, i) => (
                <Star key={i} size={11} className="fill-secondary text-secondary" />
              ))}
            </div>
          )}
          <span className="text-xs text-muted-foreground">{prop.media?.length ?? 0} média(s)</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0">
        <Button
          variant="outline" size="sm" onClick={onToggleVisibility}
          title={prop.published ? "Masquer (repasser en brouillon)" : "Publier"}
          className="gap-1.5"
        >
          {prop.published ? <EyeOff size={14} /> : <Eye size={14} />}
        </Button>
        <Button variant="outline" size="sm" onClick={onEdit} className="gap-1.5">
          <Pencil size={14} /> Modifier
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
};

// ─── List page ────────────────────────────────────────────────────────────────
export default function BookingManagement() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<BookingProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "hotel" | "restaurant">("all");
  const [deleteTarget, setDeleteTarget] = useState<BookingProperty | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  // Small unpaginated fetch used only for the category-breakdown stat tiles.
  const [allProperties, setAllProperties] = useState<BookingProperty[]>([]);

  useEffect(() => {
    api.getBookingPropertiesAdmin().then(setAllProperties).catch(() => {});
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setPage(0), 300);
    return () => clearTimeout(id);
  }, [search, categoryFilter]);

  useEffect(() => {
    const id = setTimeout(() => load(), 250);
    return () => clearTimeout(id);
  }, [page, search, categoryFilter]);

  const load = async () => {
    setLoading(true);
    try {
      // Admin endpoint — unlike the public one, includes unpublished drafts too,
      // otherwise there'd be no way to find and republish something once hidden.
      const res = await api.getBookingPropertiesPaged(page, PAGE_SIZE, search || undefined, categoryFilter === "all" ? undefined : categoryFilter);
      setProperties(res.content);
      setTotalElements(res.totalElements);
      setTotalPages(res.totalPages);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (prop: BookingProperty) => {
    if (!prop.id) return;
    try {
      const updated = await api.updateBookingProperty(prop.id, { ...prop, published: !prop.published });
      setProperties(prev => prev.map(p => p.id === prop.id ? updated : p));
      api.getBookingPropertiesAdmin().then(setAllProperties).catch(() => {});
      toast.success(updated.published ? "Établissement publié" : "Établissement masqué");
    } catch {
      toast.error("Impossible de modifier la visibilité");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget?.id) return;
    setIsDeleting(true);
    try {
      await api.deleteBookingProperty(deleteTarget.id);
      toast.success("Établissement supprimé");
      load();
      api.getBookingPropertiesAdmin().then(setAllProperties).catch(() => {});
      setDeleteTarget(null);
    } catch {
      toast.error("Impossible de supprimer l'établissement");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hôtels & Restaurants</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les établissements partenaires du Nguon 2026.
          </p>
        </div>
        <Button onClick={() => navigate("/admin/booking/create")} className="gap-2 flex-shrink-0">
          <Plus size={18} /> Nouvel établissement
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, adresse…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "hotel", "restaurant"] as const).map(c => (
            <Button
              key={c}
              variant={categoryFilter === c ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter(c)}
              className="gap-1.5"
            >
              {c === "hotel" && <Hotel size={14} />}
              {c === "restaurant" && <UtensilsCrossed size={14} />}
              {c === "all" ? "Tous" : c === "hotel" ? "Hôtels" : "Restaurants"}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: totalElements, color: "text-foreground" },
          { label: "Hôtels", value: allProperties.filter(p => p.category === "hotel").length, color: "text-primary" },
          { label: "Restaurants", value: allProperties.filter(p => p.category === "restaurant").length, color: "text-secondary" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border/50 rounded-2xl p-4 text-center">
            <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground font-semibold mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* List */}
      {loading && properties.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">Chargement…</div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Hotel size={28} className="text-primary/50" />
          </div>
          <p className="text-muted-foreground font-semibold">Aucun établissement trouvé</p>
          <Button
            onClick={() => navigate("/admin/booking/create")}
            variant="outline"
            className="mt-4 gap-2"
          >
            <Plus size={16} /> Ajouter le premier
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map(p => (
            <PropertyRow
              key={p.id ?? p.name}
              prop={p}
              onEdit={() => navigate(`/admin/booking/edit/${p.id}`)}
              onDelete={() => setDeleteTarget(p)}
              onToggleVisibility={() => handleToggleVisibility(p)}
            />
          ))}
        </div>
      )}

      <AdminPager page={page} size={PAGE_SIZE} totalElements={totalElements} totalPages={totalPages} onPageChange={setPage} />

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer <strong>{deleteTarget?.name}</strong> ?
              <br />Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? "Suppression…" : "Supprimer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
