import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Search, Pencil, Trash2, Sparkles, Star,
  ShoppingBag, X, ImagePlus, Video, BadgeCheck,
  CheckCircle2, Circle, ChevronDown, Loader2, Eye, EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Product, ProductCategory, ProductMedia, ShopCategory,
  loadShopCategories, labelOf, iconOf,
} from "@/data/shopData";
import { api } from "@/lib/api";

// ─── Types ─────────────────────────────────────────────────────────────────────
// id is assigned by the backend on create — 0 is just a form placeholder, never sent.
const EMPTY: Product = {
  id: 0, category: "artisanat", name: "", tagline: "", description: "",
  price: 0, unit: "pièce", inStock: true, stockQty: undefined,
  seller: "", sellerLocation: "", phone: "", whatsapp: "",
  media: [], tags: [], featured: false, badge: undefined, published: true,
};

const BADGES = ["", "Nouveau", "Promo", "Exclusif Nguon"];

// ─── Media tile ────────────────────────────────────────────────────────────────
const MediaTile = ({ item, onRemove }: { item: ProductMedia & { previewUrl?: string }; onRemove: () => void }) => {
  const src = item.previewUrl ?? item.presignedUrl ?? item.url;
  return (
    <div className="relative rounded-xl overflow-hidden border border-border/50 bg-muted group">
      <div className="h-24">
        {item.type === "image"
          ? <img src={src} alt={item.alt} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-muted-foreground"><Video size={20} /><span className="text-[10px]">Vidéo</span></div>
        }
      </div>
      <button type="button" onClick={onRemove}
        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <X size={10} />
      </button>
    </div>
  );
};

// ─── Row ────────────────────────────────────────────────────────────────────────
const ProductRow = ({
  product, onEdit, onDelete, onToggleVisibility,
}: { product: Product; onEdit: () => void; onDelete: () => void; onToggleVisibility: () => void }) => {
  const img = product.media.find(m => m.type === "image");
  return (
    <div className="flex items-center gap-4 bg-card border border-border/50 rounded-2xl p-4 hover:shadow-md transition-shadow">
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0">
        {img ? <img src={img.presignedUrl ?? img.url} alt={product.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-2xl">{iconOf(product.category)}</div>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {iconOf(product.category)} {labelOf(product.category)}
          </span>
          {product.featured && <span className="text-[10px] font-black bg-secondary text-black px-2 py-0.5 rounded-full flex items-center gap-0.5"><Sparkles size={8} /> Recommandé</span>}
          {product.badge && <span className="text-[10px] font-black bg-primary text-white px-2 py-0.5 rounded-full">{product.badge}</span>}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.inStock ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
            {product.inStock ? "En stock" : "Rupture"}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.published ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
            {product.published ? "Publié" : "Masqué"}
          </span>
        </div>
        <p className="font-bold text-foreground truncate">{product.name}</p>
        <p className="text-xs text-muted-foreground truncate">{product.tagline}</p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs font-black text-primary">{product.price.toLocaleString("fr-FR")} FCFA / {product.unit}</span>
          <span className="text-xs text-muted-foreground">{product.seller}</span>
          <span className="text-xs text-muted-foreground">{product.media.length} média(s)</span>
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <Button
          variant="outline" size="sm" onClick={onToggleVisibility}
          title={product.published ? "Masquer aux clients" : "Rendre visible"}
        >
          {product.published ? <EyeOff size={13} /> : <Eye size={13} />}
        </Button>
        <Button variant="outline" size="sm" onClick={onEdit} className="gap-1"><Pencil size={13} /> Modifier</Button>
        <Button variant="destructive" size="sm" onClick={onDelete}><Trash2 size={13} /></Button>
      </div>
    </div>
  );
};

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function ShopProductsAdmin() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<ProductCategory | "all">("all");

  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);

  const [form, setForm] = useState<Product>(EMPTY);
  const [mediaFiles, setMediaFiles] = useState<{ file: File; type: "image" | "video"; previewUrl: string }[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadProducts = () => {
    setLoading(true);
    // Admin endpoint — unlike the public one, includes hidden/unpublished
    // products too, otherwise there'd be no way to find and republish one.
    api.getShopProductsAdmin()
      .then(setProducts)
      .catch(() => toast.error("Impossible de charger les produits"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
    loadShopCategories().then(setCategories);
  }, []);

  const openCreate = () => { setSelected(null); setForm({ ...EMPTY, category: categories[0]?.key ?? "artisanat" }); setMediaFiles([]); setTagInput(""); setFormOpen(true); };
  const openEdit = (p: Product) => { setSelected(p); setForm({ ...p, tags: [...p.tags] }); setMediaFiles([]); setTagInput(""); setFormOpen(true); };
  const openDelete = (p: Product) => setDeleteTarget(p);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setMediaFiles(prev => [...prev, ...files.map(f => ({
      file: f, type: f.type.startsWith("video") ? "video" as const : "image" as const,
      previewUrl: URL.createObjectURL(f),
    }))]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeNewFile = (i: number) => { URL.revokeObjectURL(mediaFiles[i].previewUrl); setMediaFiles(p => p.filter((_, j) => j !== i)); };
  const removeExisting = (url: string) => setForm(f => ({ ...f, media: f.media.filter(m => m.url !== url) }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) setForm(f => ({ ...f, tags: [...f.tags, t] }));
    setTagInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Upload any newly-picked files first, then fold them in alongside the
      // media the admin kept from the existing product.
      setUploadingCount(mediaFiles.length);
      const uploaded: ProductMedia[] = await Promise.all(
        mediaFiles.map(async (f) => {
          const { fileName } = await api.uploadShopFile(f.file);
          return { type: f.type, url: fileName, alt: f.file.name };
        })
      );
      setUploadingCount(0);

      const media = [...form.media, ...uploaded].map((m, i) => ({
        id: m.id, type: m.type, url: m.url, alt: m.alt, displayOrder: i,
      }));

      const payload = {
        category: form.category, name: form.name, tagline: form.tagline, description: form.description,
        price: form.price, comparePrice: form.comparePrice, unit: form.unit,
        inStock: form.inStock, stockQty: form.stockQty,
        seller: form.seller, sellerLocation: form.sellerLocation, phone: form.phone, whatsapp: form.whatsapp,
        tags: form.tags, featured: form.featured, badge: form.badge, published: form.published,
        media,
      };

      if (selected) {
        const updated = await api.updateShopProduct(selected.id, payload);
        setProducts(prev => prev.map(p => p.id === selected.id ? updated : p));
        toast.success("Produit mis à jour");
      } else {
        const created = await api.createShopProduct(payload);
        setProducts(prev => [...prev, created]);
        toast.success("Produit créé");
      }
      setFormOpen(false);
    } catch {
      toast.error("Une erreur s'est produite");
    } finally {
      setIsSubmitting(false);
      setUploadingCount(0);
    }
  };

  const handleToggleVisibility = async (product: Product) => {
    try {
      const updated = await api.updateShopProduct(product.id, {
        category: product.category, name: product.name, tagline: product.tagline, description: product.description,
        price: product.price, comparePrice: product.comparePrice, unit: product.unit,
        inStock: product.inStock, stockQty: product.stockQty,
        seller: product.seller, sellerLocation: product.sellerLocation, phone: product.phone, whatsapp: product.whatsapp,
        tags: product.tags, featured: product.featured, badge: product.badge,
        published: !product.published,
        media: product.media.map((m, i) => ({ id: m.id, type: m.type, url: m.url, alt: m.alt, displayOrder: i })),
      });
      setProducts(prev => prev.map(p => p.id === product.id ? updated : p));
      toast.success(updated.published ? "Produit publié" : "Produit masqué");
    } catch {
      toast.error("Impossible de modifier la visibilité");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteShopProduct(deleteTarget.id);
      setProducts(prev => prev.filter(p => p.id !== deleteTarget.id));
      toast.success("Produit supprimé");
      setDeleteTarget(null);
    } catch {
      toast.error("La suppression a échoué");
    }
  };

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const mSearch = !q || p.name.toLowerCase().includes(q) || p.seller.toLowerCase().includes(q);
    const mCat = catFilter === "all" || p.category === catFilter;
    return mSearch && mCat;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Produits de la Boutique</h1>
          <p className="text-muted-foreground mt-1">Gérez les articles vendus sur la boutique Nguon 2026.</p>
        </div>
        <Button onClick={openCreate} className="gap-2 flex-shrink-0"><Plus size={18} /> Nouveau produit</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Nom, vendeur…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant={catFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setCatFilter("all")}>Tous</Button>
          {categories.map(c => (
            <Button key={c.key} variant={catFilter === c.key ? "default" : "outline"} size="sm" onClick={() => setCatFilter(c.key)}>
              {c.icon} {c.label.split(" ")[0]}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: products.length, color: "text-foreground" },
          { label: "En stock", value: products.filter(p => p.inStock).length, color: "text-green-600" },
          { label: "Recommandés", value: products.filter(p => p.featured).length, color: "text-secondary" },
          { label: "Catégories", value: new Set(products.map(p => p.category)).size, color: "text-primary" },
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
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 text-2xl">🛍️</div>
          <p className="text-muted-foreground font-semibold">Aucun produit trouvé</p>
          <Button onClick={openCreate} variant="outline" className="mt-4 gap-2"><Plus size={15} /> Ajouter le premier</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => (
            <ProductRow
              key={p.id} product={p}
              onEdit={() => openEdit(p)}
              onDelete={() => openDelete(p)}
              onToggleVisibility={() => handleToggleVisibility(p)}
            />
          ))}
        </div>
      )}

      {/* ── CREATE / EDIT DIALOG ── */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-black text-xl">{selected ? "Modifier le produit" : "Nouveau produit"}</DialogTitle>
            <DialogDescription>{selected ? "Modifiez les informations du produit." : "Ajoutez un nouveau produit à la boutique."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 pt-1">
            {/* Category */}
            <div>
              <Label className="mb-1.5 block">Catégorie *</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <button key={c.key} type="button" onClick={() => setForm(f => ({ ...f, category: c.key }))}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border-2 transition-all ${form.category === c.key ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name + Tagline */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label className="mb-1.5 block">Nom *</Label><Input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex : Masque Bamoun sculpté" /></div>
              <div><Label className="mb-1.5 block">Accroche *</Label><Input required value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} placeholder="Ex : Symbole ancestral..." /></div>
            </div>

            {/* Description */}
            <div>
              <Label className="mb-1.5 block">Description *</Label>
              <textarea required rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>

            {/* Price + Unit */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div><Label className="mb-1.5 block">Prix (FCFA) *</Label><Input required type="number" min={0} value={form.price || ""} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} /></div>
              <div><Label className="mb-1.5 block">Prix barré</Label><Input type="number" min={0} value={form.comparePrice || ""} onChange={e => setForm(f => ({ ...f, comparePrice: Number(e.target.value) || undefined }))} /></div>
              <div><Label className="mb-1.5 block">Unité</Label><Input value={form.unit ?? ""} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="pièce" /></div>
            </div>

            {/* Stock */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block">Quantité en stock</Label>
                <Input type="number" min={0} value={form.stockQty ?? ""} onChange={e => setForm(f => ({ ...f, stockQty: Number(e.target.value) || undefined }))} />
              </div>
              <div className="flex flex-col gap-3 justify-end">
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-muted/50">
                  <input type="checkbox" checked={form.inStock} onChange={e => setForm(f => ({ ...f, inStock: e.target.checked }))} className="w-4 h-4 rounded" />
                  <span className="text-sm font-semibold flex items-center gap-2">
                    {form.inStock ? <CheckCircle2 size={14} className="text-green-600" /> : <Circle size={14} />} En stock
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-muted/50">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 rounded" />
                  <span className="text-sm font-semibold flex items-center gap-2"><Sparkles size={14} className="text-secondary" /> Recommandé</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-muted/50">
                  <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="w-4 h-4 rounded" />
                  <span className="text-sm font-semibold flex items-center gap-2">
                    {form.published
                      ? <CheckCircle2 size={14} className="text-green-600" />
                      : <Circle size={14} className="text-muted-foreground" />
                    }
                    Visible sur la boutique
                  </span>
                </label>
              </div>
            </div>

            {/* Seller */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label className="mb-1.5 block">Vendeur *</Label><Input required value={form.seller} onChange={e => setForm(f => ({ ...f, seller: e.target.value }))} /></div>
              <div><Label className="mb-1.5 block">Localisation vendeur *</Label><Input required value={form.sellerLocation} onChange={e => setForm(f => ({ ...f, sellerLocation: e.target.value }))} placeholder="Foumban, Région de l'Ouest" /></div>
            </div>

            {/* Contact */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label className="mb-1.5 block">WhatsApp</Label><Input value={form.whatsapp ?? ""} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} placeholder="+237…" /></div>
              <div><Label className="mb-1.5 block">Téléphone</Label><Input value={form.phone ?? ""} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            </div>

            {/* Badge */}
            <div>
              <Label className="mb-1.5 block">Badge</Label>
              <div className="flex gap-2 flex-wrap">
                {BADGES.map(b => (
                  <button key={b || "none"} type="button" onClick={() => setForm(f => ({ ...f, badge: b || undefined }))}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all ${(form.badge ?? "") === b ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                    {b || "Aucun"}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label className="mb-1.5 block flex items-center gap-1"><BadgeCheck size={13} /> Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input value={tagInput} onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                  placeholder="Ex : sculpture, bois…" />
                <Button type="button" variant="outline" onClick={addTag} className="flex-shrink-0">+</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs bg-primary/10 border border-primary/20 text-primary font-semibold px-2.5 py-1 rounded-full">
                    {tag}<button type="button" onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))}><X size={10} /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Media */}
            <div>
              <Label className="mb-2 block font-black text-base">Médias</Label>
              {form.media.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
                  {form.media.map((m, i) => (
                    <MediaTile key={i} item={m} onRemove={() => removeExisting(m.url)} />
                  ))}
                </div>
              )}
              {mediaFiles.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
                  {mediaFiles.map((m, i) => (
                    <MediaTile key={i} item={{ type: m.type, url: m.previewUrl, previewUrl: m.previewUrl }} onRemove={() => removeNewFile(i)} />
                  ))}
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*,video/*" multiple onChange={handleFiles} className="hidden" id="shop-media" />
              <label htmlFor="shop-media" className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-semibold text-muted-foreground hover:text-primary">
                <ImagePlus size={18} /> Ajouter des images ou vidéos
              </label>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2 border-t border-border">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setFormOpen(false)}>Annuler</Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting
                  ? (uploadingCount > 0 ? `Envoi des médias (${uploadingCount})…` : "Enregistrement…")
                  : selected ? "Mettre à jour" : "Créer le produit"}
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
            <DialogDescription>Êtes-vous sûr de vouloir supprimer <strong>{deleteTarget?.name}</strong> ? Cette action est irréversible.</DialogDescription>
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
