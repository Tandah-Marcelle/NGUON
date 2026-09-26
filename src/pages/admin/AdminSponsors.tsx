import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Search, Pencil, Trash2, X, CheckCircle2, AlertCircle, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api, uploadFileWithProgress } from "@/lib/api";
import AdminPager from "@/components/admin/AdminPager";

const PAGE_SIZE = 12;

export default function AdminSponsors() {
  const { t } = useTranslation();
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", image: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Submit flow: confirm -> upload/save (with progress) -> success/error ──
  const [showConfirm, setShowConfirm] = useState(false);
  const [flow, setFlow] = useState<"idle" | "running" | "success" | "error">("idle");
  const [flowError, setFlowError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setPage(0), 300);
    return () => clearTimeout(id);
  }, [searchQuery]);

  useEffect(() => {
    const id = setTimeout(() => loadSponsors(), 250);
    return () => clearTimeout(id);
  }, [page, searchQuery]);

  const loadSponsors = async () => {
    setLoading(true);
    try {
      const res = await api.getSponsorsPaged(page, PAGE_SIZE, searchQuery || undefined);
      setSponsors(res.content);
      setTotalElements(res.totalElements);
      setTotalPages(res.totalPages);
    } catch (error) {
      toast.error(t('admin.sponsors.toasts.load_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedSponsor(null);
    setFormData({ name: "", image: "" });
    setImageFile(null);
    setPreviewUrl(null);
    setFlow("idle");
    setIsFormOpen(true);
  };

  const handleEdit = (sponsor: any) => {
    setSelectedSponsor(sponsor);
    setFormData({ name: sponsor.name, image: sponsor.image });
    setImageFile(null);
    setPreviewUrl(null);
    setFlow("idle");
    setIsFormOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (!selectedSponsor) {
      setFormData({ ...formData, image: "" });
    }
  };

  const handleDelete = (sponsor: any) => {
    setSelectedSponsor(sponsor);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.deleteSponsor(selectedSponsor.id);
      toast.success(t('admin.sponsors.toasts.delete_success'));
      loadSponsors();
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error(t('admin.sponsors.toasts.delete_error'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    setShowConfirm(true);
  };

  const runSubmit = async () => {
    setFlow("running");
    setFlowError("");
    setUploadProgress(0);
    try {
      let imagePath = formData.image;

      if (imageFile) {
        const { fileName } = await uploadFileWithProgress("/files/upload/sponsor", imageFile, setUploadProgress);
        imagePath = fileName;
      }

      const data = { ...formData, image: imagePath };

      if (selectedSponsor) {
        await api.updateSponsor(selectedSponsor.id, data);
      } else {
        await api.createSponsor(data);
      }

      setFlow("success");
      toast.success(selectedSponsor ? t('admin.sponsors.toasts.update_success') : t('admin.sponsors.toasts.create_success'));
      loadSponsors();
      setTimeout(() => { setIsFormOpen(false); setFlow("idle"); }, 900);
    } catch (error) {
      setFlow("error");
      const raw = error instanceof Error ? error.message : t('admin.sponsors.toasts.error_generic');
      setFlowError(raw.length > 300 ? raw.slice(0, 300) + "…" : raw);
    }
  };

  const filteredSponsors = sponsors;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('admin.sponsors.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('admin.sponsors.description')}</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={20} />
          {t('admin.sponsors.create_button')}
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder={t('admin.sponsors.search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">{t('admin.sponsors.loading')}</div>
      ) : filteredSponsors.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">{t('admin.sponsors.empty')}</div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSponsors.map((sponsor) => (
            <div key={sponsor.id} className="bg-card border rounded-lg overflow-hidden">
              <div className="relative h-32 bg-white flex items-center justify-center p-4">
                <img
                  src={sponsor.presignedUrl ?? api.getMediaViewUrl(sponsor.image)}
                  alt={sponsor.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-center mb-4">{sponsor.name}</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(sponsor)} className="flex-1">
                    <Pencil size={16} />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(sponsor)} className="flex-1">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminPager page={page} size={PAGE_SIZE} totalElements={totalElements} totalPages={totalPages} onPageChange={setPage} />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedSponsor ? t('admin.sponsors.form.title_edit') : t('admin.sponsors.form.title_create')}
            </DialogTitle>
            <DialogDescription>
              {selectedSponsor ? t('admin.sponsors.form.description_edit') : t('admin.sponsors.form.description_create')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <Label>{t('admin.sponsors.form.name_label')}</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label>{t('admin.sponsors.form.image_label')}</Label>
              {!previewUrl && !formData.image && (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required={!selectedSponsor}
                />
              )}
              {(previewUrl || formData.image) && (
                <div className="mt-2 relative">
                  <img
                    src={previewUrl || selectedSponsor?.presignedUrl || api.getMediaViewUrl(formData.image)}
                    alt="Preview"
                    className="w-full h-32 object-contain bg-white rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X size={16} />
                  </Button>
                  {!previewUrl && formData.image && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => document.getElementById('file-input')?.click()}
                    >
                      Change Image
                    </Button>
                  )}
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                {t('admin.sponsors.form.cancel')}
              </Button>
              <Button type="submit">
                {selectedSponsor ? t('admin.sponsors.form.update') : t('admin.sponsors.form.create')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Confirmation dialog ── */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSponsor ? "Confirmer la mise à jour" : "Confirmer la création"}</DialogTitle>
            <DialogDescription>
              {selectedSponsor
                ? <>Voulez-vous enregistrer les modifications apportées à <strong>{formData.name}</strong> ?</>
                : <>Voulez-vous créer le sponsor <strong>{formData.name}</strong> ?</>
              }
              {imageFile && <> L'image sera envoyée.</>}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-2">
            <Button type="button" variant="outline" onClick={() => setShowConfirm(false)}>Annuler</Button>
            <Button type="button" onClick={() => { setShowConfirm(false); runSubmit(); }}>
              {selectedSponsor ? "Confirmer la mise à jour" : "Confirmer la création"}
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
                {imageFile ? `Envoi de l'image… (${uploadProgress}%)` : "Enregistrement en cours…"}
              </h3>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mt-4">
                <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${imageFile ? uploadProgress : 100}%` }} />
              </div>
            </div>
          )}
          {flow === "success" && (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={30} className="text-green-600" />
              </div>
              <h3 className="font-black text-lg">{selectedSponsor ? "Sponsor mis à jour !" : "Sponsor créé !"}</h3>
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

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.sponsors.delete_modal.title')}</DialogTitle>
            <DialogDescription>
              {t('admin.sponsors.delete_modal.description')} &quot;{selectedSponsor?.name}&quot;?
              <br />
              {t('admin.sponsors.delete_modal.warning')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
              {t('admin.sponsors.delete_modal.cancel')}
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? t('admin.sponsors.form.saving') : t('admin.sponsors.delete_modal.confirm')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
