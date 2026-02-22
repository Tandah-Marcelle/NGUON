import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function AdminActualities() {
  const { t } = useTranslation();
  const [actualities, setActualities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedActuality, setSelectedActuality] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    media: "",
    published: true,
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadActualities();
  }, []);

  const loadActualities = async () => {
    try {
      const data = await api.getActualities();
      setActualities(data);
    } catch (error) {
      toast.error(t('admin.actualities.toasts.load_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedActuality(null);
    setFormData({ title: "", description: "", media: "", published: true });
    setMediaFile(null);
    setPreviewUrl(null);
    setIsFormOpen(true);
  };

  const handleEdit = (actuality: any) => {
    setSelectedActuality(actuality);
    setFormData({
      title: actuality.title,
      description: actuality.description,
      media: actuality.media,
      published: actuality.published,
    });
    setMediaFile(null);
    setPreviewUrl(null);
    setIsFormOpen(true);
  };

  const isVideo = (filename: string) => {
    return /\.(mp4|webm|ogg)$/i.test(filename);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setMediaFile(null);
    setPreviewUrl(null);
    if (!selectedActuality) {
      setFormData({ ...formData, media: "" });
    }
  };

  const handleDelete = (actuality: any) => {
    setSelectedActuality(actuality);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.deleteActuality(selectedActuality.id);
      toast.success(t('admin.actualities.toasts.delete_success'));
      loadActualities();
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error(t('admin.actualities.toasts.delete_error'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let mediaPath = formData.media;

      if (mediaFile) {
        const uploadResult = await api.uploadActualityFile(mediaFile);
        mediaPath = uploadResult.fileName;
      }

      const data = { ...formData, media: mediaPath };

      if (selectedActuality) {
        await api.updateActuality(selectedActuality.id, data);
        toast.success(t('admin.actualities.toasts.update_success'));
      } else {
        await api.createActuality(data);
        toast.success(t('admin.actualities.toasts.create_success'));
      }

      loadActualities();
      setIsFormOpen(false);
    } catch (error) {
      toast.error(t('admin.actualities.toasts.error_generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredActualities = actualities.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('admin.actualities.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('admin.actualities.description')}</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={20} />
          {t('admin.actualities.create_button')}
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder={t('admin.actualities.search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">{t('admin.actualities.loading')}</div>
      ) : filteredActualities.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">{t('admin.actualities.empty')}</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActualities.map((actuality) => (
            <div key={actuality.id} className="bg-card border rounded-lg overflow-hidden">
              <div className="relative h-48">
                {isVideo(actuality.media) ? (
                  <video
                    src={api.getMediaViewUrl(actuality.media)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={api.getMediaViewUrl(actuality.media)}
                    alt={actuality.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded text-xs ${actuality.published ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
                    {actuality.published ? t('admin.actualities.status.published') : t('admin.actualities.status.draft')}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{actuality.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{actuality.description}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(actuality)} className="flex-1">
                    <Pencil size={16} />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(actuality)} className="flex-1">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedActuality ? t('admin.actualities.form.title_edit') : t('admin.actualities.form.title_create')}
            </DialogTitle>
            <DialogDescription>
              {selectedActuality ? t('admin.actualities.form.description_edit') : t('admin.actualities.form.description_create')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>{t('admin.actualities.form.title_label')}</Label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label>{t('admin.actualities.form.description_label')}</Label>
              <Textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <Label>{t('admin.actualities.form.media_label')}</Label>
              {!previewUrl && !formData.media && (
                <Input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  required={!selectedActuality}
                />
              )}
              {(previewUrl || formData.media) && (
                <div className="mt-2 relative">
                  {(mediaFile?.type.startsWith('video/') || isVideo(formData.media)) ? (
                    <video
                      src={previewUrl || api.getMediaViewUrl(formData.media)}
                      controls
                      className="w-full h-48 object-cover rounded"
                    />
                  ) : (
                    <img
                      src={previewUrl || api.getMediaViewUrl(formData.media)}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded"
                    />
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X size={16} />
                  </Button>
                  {!previewUrl && formData.media && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => document.getElementById('file-input')?.click()}
                    >
                      Change Media
                    </Button>
                  )}
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <Label>{t('admin.actualities.form.publish_label')}</Label>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                {t('admin.actualities.form.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('admin.actualities.form.saving') : selectedActuality ? t('admin.actualities.form.update') : t('admin.actualities.form.create')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.actualities.delete_modal.title')}</DialogTitle>
            <DialogDescription>
              {t('admin.actualities.delete_modal.description')} &quot;{selectedActuality?.title}&quot;?
              <br />
              {t('admin.actualities.delete_modal.warning')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
              {t('admin.actualities.delete_modal.cancel')}
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? t('admin.actualities.form.saving') : t('admin.actualities.delete_modal.confirm')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
