import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function AdminSponsors() {
  const { t } = useTranslation();
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", image: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadSponsors();
  }, []);

  const loadSponsors = async () => {
    try {
      const data = await api.getSponsors();
      setSponsors(data);
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
    setIsFormOpen(true);
  };

  const handleEdit = (sponsor: any) => {
    setSelectedSponsor(sponsor);
    setFormData({ name: sponsor.name, image: sponsor.image });
    setImageFile(null);
    setPreviewUrl(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imagePath = formData.image;

      if (imageFile) {
        const uploadResult = await api.uploadSponsorFile(imageFile);
        imagePath = uploadResult.fileName;
      }

      const data = { ...formData, image: imagePath };

      if (selectedSponsor) {
        await api.updateSponsor(selectedSponsor.id, data);
        toast.success(t('admin.sponsors.toasts.update_success'));
      } else {
        await api.createSponsor(data);
        toast.success(t('admin.sponsors.toasts.create_success'));
      }

      loadSponsors();
      setIsFormOpen(false);
    } catch (error) {
      toast.error(t('admin.sponsors.toasts.error_generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSponsors = sponsors.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('admin.sponsors.form.saving') : selectedSponsor ? t('admin.sponsors.form.update') : t('admin.sponsors.form.create')}
              </Button>
            </div>
          </form>
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
