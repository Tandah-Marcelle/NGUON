import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Star, Hotel, UtensilsCrossed, ImagePlus,
  X, MapPin, Phone, Mail, Globe, Clock, BadgeCheck,
  CheckCircle2, Circle, Sparkles, AlertCircle, RotateCcw, Loader2, Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { api, uploadFileWithProgress } from "@/lib/api";
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

type PendingFile = {
  file: File;
  type: "image" | "video";
  previewUrl: string;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
  uploadedFileName?: string;
  errorMsg?: string;
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

// ─── Video preview tile — a real decoded poster frame + a big, obvious play
// button. Native <video controls> inside a ~110px tile is nearly unusable
// (the scrubber/buttons are too small to hit), so this renders a silent,
// non-interactive poster instead and hands clicks to the parent, which opens
// a properly sized playback dialog (see PreviewDialog below).
const VideoPreview = ({ src, className, onOpen }: { src: string; className?: string; onOpen: () => void }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const onLoadedMetadata = () => {
    const v = ref.current;
    if (!v) return;
    try { v.currentTime = Math.min(0.5, (v.duration || 1) / 2); } catch { /* ignore */ }
  };
  return (
    <button
      type="button"
      onClick={onOpen}
      className="relative w-full h-full block"
      aria-label="Prévisualiser la vidéo"
    >
      <video
        ref={ref}
        src={src}
        preload="metadata"
        muted
        playsInline
        onLoadedMetadata={onLoadedMetadata}
        className={className}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/30 transition-colors">
        <div className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center shadow-md">
          <Play size={16} className="text-primary fill-primary ml-0.5" />
        </div>
      </div>
    </button>
  );
};

// ─── Media preview tile (existing, already-saved media) ──────────────────────
const MediaTile = ({ item, onRemove, onPreviewVideo }: { item: BookingMedia; onRemove: () => void; onPreviewVideo: (src: string) => void }) => {
  const src =
    item.url.startsWith("blob:") || item.url.startsWith("http") || item.url.startsWith("/")
      ? item.url
      : ((item as any).presignedUrl ?? api.getMediaViewUrl(item.url));
  return (
    <div className="relative rounded-xl overflow-hidden border border-border/50 bg-muted group">
      <div className="h-28 bg-black/5 flex items-center justify-center">
        {item.type === "image"
          ? <img src={src} alt={item.alt} className="w-full h-full object-cover" />
          : <VideoPreview src={src} className="w-full h-full object-cover" onOpen={() => onPreviewVideo(src)} />
        }
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow z-10"
      >
        <X size={12} />
      </button>
      <div className="px-2 py-1">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase">{item.type}</span>
      </div>
    </div>
  );
};

// ─── Pending (not-yet-uploaded) file tile — shows real preview + upload state ─
const PendingTile = ({ item, onRemove, onPreviewVideo }: { item: PendingFile; onRemove: () => void; onPreviewVideo: (src: string) => void }) => (
  <div className="relative rounded-xl overflow-hidden border border-border/50 bg-muted group">
    <div className="h-28 bg-black/5 flex items-center justify-center relative">
      {item.type === "image"
        ? <img src={item.previewUrl} alt={item.file.name} className="w-full h-full object-cover" />
        : <VideoPreview src={item.previewUrl} className="w-full h-full object-cover" onOpen={() => onPreviewVideo(item.previewUrl)} />
      }
      {item.status === "uploading" && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1.5 text-white pointer-events-none">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-xs font-bold">{item.progress}%</span>
        </div>
      )}
      {item.status === "done" && (
        <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center">
          <CheckCircle2 size={13} />
        </div>
      )}
      {item.status === "error" && (
        <div className="absolute inset-0 bg-destructive/80 flex flex-col items-center justify-center gap-1 text-white p-2 text-center pointer-events-none">
          <AlertCircle size={18} />
          <span className="text-[10px] font-semibold leading-tight">{item.errorMsg ?? "Échec de l'envoi"}</span>
        </div>
      )}
    </div>
    <button
      type="button"
      onClick={onRemove}
      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow z-10"
    >
      <X size={12} />
    </button>
    <div className="px-2 py-1 truncate">
      <span className="text-[10px] font-semibold text-muted-foreground uppercase">{item.type}</span>
    </div>
  </div>
);

// ─── Form page ────────────────────────────────────────────────────────────────
export default function BookingForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [form, setForm] = useState<BookingProperty>(EMPTY_FORM);
  const [mediaFiles, setMediaFiles] = useState<PendingFile[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [isLoading, setIsLoading] = useState(isEdit);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Submit flow: confirm -> upload/save (with progress) -> success/error ──
  const [showConfirm, setShowConfirm] = useState(false);
  const [flow, setFlow] = useState<"idle" | "running" | "success" | "error">("idle");
  const [flowError, setFlowError] = useState("");
  const [previewVideoSrc, setPreviewVideoSrc] = useState<string | null>(null);

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
    const items: PendingFile[] = files.map(f => ({
      file: f,
      type: f.type.startsWith("video") ? "video" as const : "image" as const,
      previewUrl: URL.createObjectURL(f),
      status: "pending",
      progress: 0,
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

  // ── Submit: open confirmation first (native required-field validation still applies) ──
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    setShowConfirm(true);
  };

  // ── Actual upload + save, run after confirmation; re-runnable as "retry" ──
  const runSubmit = async () => {
    setFlow("running");
    setFlowError("");
    try {
      // React state set inside this loop (setMediaFiles) never reflects back
      // into the `mediaFiles` variable within this same function call — it's
      // a snapshot from render time. So the fileName each upload resolves to
      // is tracked in this local array instead, and THAT is what builds the
      // payload below — reading the (stale) state here silently sent
      // `url: undefined` for every newly uploaded file.
      const resolvedFileNames: (string | undefined)[] = mediaFiles.map(m => m.uploadedFileName);

      for (let i = 0; i < mediaFiles.length; i++) {
        if (mediaFiles[i].status === "done" && resolvedFileNames[i]) continue;
        setMediaFiles(prev => prev.map((m, idx) => idx === i ? { ...m, status: "uploading", progress: 0, errorMsg: undefined } : m));
        try {
          const { fileName } = await uploadFileWithProgress(
            "/files/upload/booking",
            mediaFiles[i].file,
            (pct) => setMediaFiles(prev => prev.map((m, idx) => idx === i ? { ...m, progress: pct } : m))
          );
          resolvedFileNames[i] = fileName;
          setMediaFiles(prev => prev.map((m, idx) => idx === i ? { ...m, status: "done", progress: 100, uploadedFileName: fileName } : m));
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Échec de l'envoi";
          setMediaFiles(prev => prev.map((m, idx) => idx === i ? { ...m, status: "error", errorMsg: msg } : m));
          throw new Error(`Échec de l'envoi de « ${mediaFiles[i].file.name} » : ${msg}`);
        }
      }

      const uploadedMedia: BookingMedia[] = mediaFiles.map((m, i) => ({
        type: m.type, url: resolvedFileNames[i]!, alt: m.file.name,
      }));

      const payload: BookingProperty = {
        ...form,
        media: [...(form.media ?? []), ...uploadedMedia],
      };

      if (isEdit) {
        await api.updateBookingProperty(parseInt(id!), payload);
      } else {
        await api.createBookingProperty(payload);
      }

      setFlow("success");
      toast.success(isEdit ? "Établissement mis à jour avec succès" : "Établissement créé avec succès");
      setTimeout(() => navigate("/admin/booking"), 900);
    } catch (err) {
      setFlow("error");
      // Defensive cap — an unexpected raw server error page (e.g. a
      // stack-trace-shaped response body) should never break this dialog's
      // layout; the text area below also wraps and scrolls regardless.
      const raw = err instanceof Error ? err.message : "Une erreur s'est produite.";
      setFlowError(raw.length > 300 ? raw.slice(0, 300) + "…" : raw);
    }
  };

  const uploadedCount = mediaFiles.filter(m => m.status === "done").length;
  const totalToUpload = mediaFiles.length;
  const aggregateProgress = totalToUpload === 0 ? 100
    : Math.round(mediaFiles.reduce((sum, m) => sum + (m.status === "done" ? 100 : m.progress), 0) / totalToUpload);

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
      <form onSubmit={handleFormSubmit} className="space-y-8">

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
                    onPreviewVideo={setPreviewVideoSrc}
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
                  <PendingTile key={i} item={m} onRemove={() => removeNewFile(i)} onPreviewVideo={setPreviewVideoSrc} />
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
            className="flex-1 py-6 text-base rounded-2xl shadow-lg shadow-primary/20"
          >
            {isEdit ? "Mettre à jour" : "Créer l'établissement"}
          </Button>
        </div>

      </form>

      {/* ── Confirmation dialog ── */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Confirmer la mise à jour" : "Confirmer la création"}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? <>Voulez-vous enregistrer les modifications apportées à <strong>{form.name}</strong> ?</>
                : <>Voulez-vous créer l'établissement <strong>{form.name}</strong> ?</>
              }
              {mediaFiles.length > 0 && <> {mediaFiles.length} nouveau(x) média(s) seront envoyés.</>}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-2">
            <Button type="button" variant="outline" onClick={() => setShowConfirm(false)}>Annuler</Button>
            <Button type="button" onClick={() => { setShowConfirm(false); runSubmit(); }}>
              {isEdit ? "Confirmer la mise à jour" : "Confirmer la création"}
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
              <h3 className="font-display font-bold text-lg mb-1">
                {totalToUpload > 0 && uploadedCount < totalToUpload
                  ? `Envoi des médias… (${uploadedCount}/${totalToUpload})`
                  : "Enregistrement en cours…"}
              </h3>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mt-4">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${aggregateProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{aggregateProgress}%</p>
            </div>
          )}
          {flow === "success" && (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={30} className="text-green-600" />
              </div>
              <h3 className="font-display font-bold text-lg">
                {isEdit ? "Établissement mis à jour !" : "Établissement créé !"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Redirection vers la liste…</p>
            </div>
          )}
          {flow === "error" && (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={28} className="text-destructive" />
              </div>
              <h3 className="font-display font-bold text-lg mb-1">Échec de l'enregistrement</h3>
              <p className="text-sm text-muted-foreground mb-5 break-words max-h-32 overflow-y-auto">{flowError}</p>
              <div className="flex gap-3 justify-center">
                <Button type="button" variant="outline" onClick={() => setFlow("idle")}>Fermer</Button>
                <Button type="button" onClick={runSubmit} className="gap-2"><RotateCcw size={15} /> Réessayer</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Video preview dialog — real playback at a usable size ── */}
      <Dialog open={!!previewVideoSrc} onOpenChange={(open) => !open && setPreviewVideoSrc(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-black border-0 text-white">
          {previewVideoSrc && (
            <video
              key={previewVideoSrc}
              src={previewVideoSrc}
              controls
              autoPlay
              playsInline
              className="w-full max-h-[80vh]"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
