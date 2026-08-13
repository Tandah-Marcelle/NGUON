import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Star, Hotel, UtensilsCrossed, ImagePlus, Video,
  X, MapPin, Phone, Mail, Globe, Clock, BadgeCheck,
  CheckCircle2, Circle, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { BookingMedia, BookingProperty } from "./BookingManagement";

// ─── Constants ────────────────────────────────────────────────────────────────
const EMPTY_FORM: BookingProperty = {
  category: "hotel",
  name: "", tagline: "", description: "",
  address: "", phone: "", whatsapp: "", email: "", website: "",
  priceFrom: "", priceTo: "", priceUnit: "FCFA / nuit",
  stars: 3, cuisine: "", openingHours: "",
  features: [], accentColor: "#0047AB",
  featured: false, published: false, media: [],
};

// ─── Star picker ──────────────────────────────────────────────────────────────
const StarPicker = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(n => (
      <button key={n} type="button" onClick={() => onChange(n)}>
        <Star size={22} className={n <= value ? "fill-secondary text-secondary" : "text-muted-foreground/30"} />
      </button>
    ))}
  </div>
);

// ─── Media preview tile ───────────────────────────────────────────────────────
const MediaTile = ({ item, onRemove }: { item: BookingMedia; onRemove: () => void }) => {
  const src =
    item.url.startsWith("blob:") || item.url.startsWith("http") || item.url.startsWith("/")
      ? item.url
      : ((item as any).presignedUrl ?? api.getMediaViewUrl(item.url));
  return (
    <div className="relative rounded-xl overflow-hidden border border-border/50 bg-muted group">
      <div className="h-28 bg-black/5 flex items-center justify-center">
        {item.type === "image"
          ? <img src={src} alt={item.alt} className="w-full h-full object-cover" />
          : <div className="flex flex-col items-center gap-1 text-muted-foreground"><Video size={24} /><span className="text-xs">Vidéo</span></div>
        }
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
      >
        <X size={12} />
      </button>
      <div className="px-2 py-1">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase">{item.type}</span>
      </div>
    </div>
  );
};

// ─── Form page ────────────────────────────────────────────────────────────────
export default function BookingForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [form, setForm] = useState<BookingProperty>(EMPTY_FORM);
  const [mediaFiles, setMediaFiles] = useState<{ file: File; type: "image" | "video"; previewUrl: string }[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEdit);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing property when editing
  useEffect(() => {
    if (!isEdit) return;
    api.getBookingPropertyById(parseInt(id!))
      .then(data => setForm({ ...data, features: data.features ?? [] }))
      .catch(() => toast.error("Impossible de charger l'établissement"))
      .finally(() => setIsLoading(false));
  }, [id, isEdit]);

  // ── Media helpers ──────────────────────────────────────────────────────────
  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const items = files.map(f => ({
      file: f,
      type: f.type.startsWith("video") ? "video" as const : "image" as const,
      previewUrl: URL.createObjectURL(f),
    }));
    setMediaFiles(prev => [...prev, ...items]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeNewFile = (idx: number) => {
    URL.revokeObjectURL(mediaFiles[idx].previewUrl);
    setMediaFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const removeExistingMedia = (mediaId?: number, idx?: number) => {
    if (mediaId) {
      setForm(prev => ({ ...prev, media: prev.media?.filter(m => m.id !== mediaId) ?? [] }));
    } else if (idx !== undefined) {
      setForm(prev => ({ ...prev, media: prev.media?.filter((_, i) => i !== idx) ?? [] }));
    }
  };

  // ── Feature helpers ────────────────────────────────────────────────────────
  const addFeature = () => {
    const f = featureInput.trim();
    if (f && !form.features.includes(f)) setForm(prev => ({ ...prev, features: [...prev.features, f] }));
    setFeatureInput("");
  };
  const removeFeature = (f: string) => setForm(prev => ({ ...prev, features: prev.features.filter(x => x !== f) }));

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Upload new files
      const uploadedMedia: BookingMedia[] = [];
      for (const item of mediaFiles) {
        try {
          const { fileName } = await api.uploadBookingFile(item.file);
          uploadedMedia.push({ type: item.type, url: fileName, alt: item.file.name });
        } catch {
          uploadedMedia.push({ type: item.type, url: item.previewUrl, alt: item.file.name });
        }
      }

      const payload: BookingProperty = {
        ...form,
        media: [...(form.media ?? []), ...uploadedMedia],
      };

      if (isEdit) {
        await api.updateBookingProperty(parseInt(id!), payload);
        toast.success("Établissement mis à jour avec succès");
      } else {
        await api.createBookingProperty(payload);
        toast.success("Établissement créé avec succès");
      }

      navigate("/admin/booking");
    } catch {
      toast.error("Une erreur s'est produite");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        Chargement…
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">

      {/* ── Back + title ── */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/booking")}
          className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
          aria-label="Retour"
        >
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {isEdit ? "Modifier l'établissement" : "Nouvel établissement"}
          </h1>
          <p className="text-muted-foreground mt-0.5">
            {isEdit
              ? "Modifiez les informations, les médias ou les options de l'établissement."
              : "Renseignez les informations et ajoutez des images ou vidéos."}
          </p>
        </div>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Category */}
        <div className="bg-white dark:bg-card rounded-[2rem] border border-border/50 p-6 shadow-sm space-y-5">
          <h2 className="font-display font-bold text-lg">Catégorie</h2>
          <div className="flex gap-3">
            {(["hotel", "restaurant"] as const).map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setForm(f => ({ ...f, category: c }))}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 font-bold text-base transition-all ${
                  form.category === c
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                {c === "hotel" ? <Hotel size={20} /> : <UtensilsCrossed size={20} />}
                {c === "hotel" ? "Hôtel" : "Restaurant"}
              </button>
            ))}
          </div>
        </div>

        {/* General info */}
        <div className="bg-white dark:bg-card rounded-[2rem] border border-border/50 p-6 shadow-sm space-y-5">
          <h2 className="font-display font-bold text-lg">Informations générales</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 block">Nom *</Label>
              <Input
                required value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ex : Hôtel Palais Royal"
              />
            </div>
            <div>
              <Label className="mb-1.5 block">Accroche *</Label>
              <Input
                required value={form.tagline}
                onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
                placeholder="Ex : Au cœur de la cité impériale"
              />
            </div>
          </div>

          <div>
            <Label className="mb-1.5 block">Description *</Label>
            <textarea
              required rows={4} value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Description complète de l'établissement…"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 block flex items-center gap-1.5"><MapPin size={13} /> Adresse *</Label>
              <Input
                required value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                placeholder="Quartier, Ville, Cameroun"
              />
            </div>
            <div>
              <Label className="mb-1.5 block flex items-center gap-1.5"><Phone size={13} /> Téléphone *</Label>
              <Input
                required value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+237 6XX XXX XXX"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label className="mb-1.5 block">WhatsApp</Label>
              <Input value={form.whatsapp ?? ""} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} placeholder="+237…" />
            </div>
            <div>
              <Label className="mb-1.5 block flex items-center gap-1.5"><Mail size={13} /> Email</Label>
              <Input type="email" value={form.email ?? ""} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <Label className="mb-1.5 block flex items-center gap-1.5"><Globe size={13} /> Site web</Label>
              <Input value={form.website ?? ""} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://…" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white dark:bg-card rounded-[2rem] border border-border/50 p-6 shadow-sm space-y-5">
          <h2 className="font-display font-bold text-lg">Tarifs</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label className="mb-1.5 block">Prix minimum</Label>
              <Input value={form.priceFrom ?? ""} onChange={e => setForm(f => ({ ...f, priceFrom: e.target.value }))} placeholder="25 000" />
            </div>
            <div>
              <Label className="mb-1.5 block">Prix maximum</Label>
              <Input value={form.priceTo ?? ""} onChange={e => setForm(f => ({ ...f, priceTo: e.target.value }))} placeholder="80 000" />
            </div>
            <div>
              <Label className="mb-1.5 block">Unité de prix</Label>
              <Input value={form.priceUnit ?? ""} onChange={e => setForm(f => ({ ...f, priceUnit: e.target.value }))} placeholder="FCFA / nuit" />
            </div>
          </div>
        </div>

        {/* Category-specific */}
        <div className="bg-white dark:bg-card rounded-[2rem] border border-border/50 p-6 shadow-sm space-y-5">
          <h2 className="font-display font-bold text-lg">
            {form.category === "hotel" ? "Hôtel — détails" : "Restaurant — détails"}
          </h2>
          {form.category === "hotel" ? (
            <div>
              <Label className="mb-2 block">Classement étoiles</Label>
              <StarPicker value={form.stars ?? 3} onChange={v => setForm(f => ({ ...f, stars: v }))} />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block">Type de cuisine</Label>
                <Input
                  value={form.cuisine ?? ""}
                  onChange={e => setForm(f => ({ ...f, cuisine: e.target.value }))}
                  placeholder="Ex : Cuisine Bamoun traditionnelle"
                />
              </div>
              <div>
                <Label className="mb-1.5 block flex items-center gap-1.5"><Clock size={13} /> Horaires d'ouverture</Label>
                <Input
                  value={form.openingHours ?? ""}
                  onChange={e => setForm(f => ({ ...f, openingHours: e.target.value }))}
                  placeholder="Ex : Lun–Dim 11h–23h"
                />
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-card rounded-[2rem] border border-border/50 p-6 shadow-sm space-y-4">
          <h2 className="font-display font-bold text-lg flex items-center gap-2">
            <BadgeCheck size={18} className="text-secondary" /> Équipements & Points forts
          </h2>
          <div className="flex gap-2">
            <Input
              value={featureInput}
              onChange={e => setFeatureInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
              placeholder="Ex : WiFi gratuit, Piscine, Parking…"
            />
            <Button type="button" variant="outline" onClick={addFeature} className="flex-shrink-0">
              Ajouter
            </Button>
          </div>
          {form.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.features.map(f => (
                <span key={f} className="flex items-center gap-1.5 text-sm bg-primary/10 border border-primary/20 text-primary font-semibold px-3 py-1.5 rounded-full">
                  {f}
                  <button type="button" onClick={() => removeFeature(f)} className="ml-0.5 hover:text-destructive transition-colors">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Media */}
        <div className="bg-white dark:bg-card rounded-[2rem] border border-border/50 p-6 shadow-sm space-y-4">
          <h2 className="font-display font-bold text-lg">Médias (images & vidéos)</h2>

          {/* Existing media */}
          {(form.media ?? []).length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground font-semibold mb-3 uppercase tracking-wider">Médias actuels</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {(form.media ?? []).map((m, i) => (
                  <MediaTile
                    key={m.id ?? i}
                    item={m}
                    onRemove={() => removeExistingMedia(m.id, m.id ? undefined : i)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* New files preview */}
          {mediaFiles.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground font-semibold mb-3 uppercase tracking-wider">
                Nouveaux fichiers ({mediaFiles.length})
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {mediaFiles.map((m, i) => (
                  <MediaTile
                    key={i}
                    item={{ type: m.type, url: m.previewUrl }}
                    onRemove={() => removeNewFile(i)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Drop zone */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileAdd}
            className="hidden"
            id="booking-media-upload"
          />
          <label
            htmlFor="booking-media-upload"
            className="flex flex-col items-center justify-center gap-2 w-full py-8 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary"
          >
            <ImagePlus size={28} />
            <span className="text-sm font-semibold">Cliquer pour ajouter des images ou vidéos</span>
            <span className="text-xs opacity-60">JPG, PNG, MP4, MOV — plusieurs fichiers acceptés</span>
          </label>
        </div>

        {/* Branding */}
        <div className="bg-white dark:bg-card rounded-[2rem] border border-border/50 p-6 shadow-sm space-y-5">
          <h2 className="font-display font-bold text-lg">Branding & Visibilité</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <Label className="mb-2 block">Couleur d'accentuation</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.accentColor ?? "#0047AB"}
                  onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))}
                  className="w-12 h-12 rounded-xl border border-border cursor-pointer p-1"
                />
                <Input
                  value={form.accentColor ?? ""}
                  onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))}
                  className="font-mono text-sm"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Utilisée pour la bordure et l'accentuation de la carte.</p>
            </div>

            <div className="flex flex-col gap-4 justify-center">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                  className="w-5 h-5 rounded border-border text-secondary focus:ring-secondary"
                />
                <span className="font-semibold flex items-center gap-2">
                  <Sparkles size={15} className="text-secondary" />
                  Mettre en avant (Recommandé)
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                />
                <span className="font-semibold flex items-center gap-2">
                  {form.published
                    ? <CheckCircle2 size={15} className="text-green-600" />
                    : <Circle size={15} className="text-muted-foreground" />
                  }
                  Publier immédiatement
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit bar */}
        <div className="flex gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 py-6 text-base rounded-2xl"
            onClick={() => navigate("/admin/booking")}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-6 text-base rounded-2xl shadow-lg shadow-primary/20"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Enregistrement…
              </span>
            ) : isEdit ? "Mettre à jour" : "Créer l'établissement"}
          </Button>
        </div>

      </form>
    </div>
  );
}
