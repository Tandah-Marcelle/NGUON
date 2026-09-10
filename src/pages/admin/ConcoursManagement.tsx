import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2, Send, Eye, FileText, CheckCircle, Clock, EyeOff, Search } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminPager from "@/components/admin/AdminPager";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PAGE_SIZE = 15;

export default function ConcoursManagement() {
  const navigate = useNavigate();
  const [concours, setConcours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getConcoursPaged(page, PAGE_SIZE, search || undefined);
      setConcours(res.content);
      setTotalElements(res.totalElements);
      setTotalPages(res.totalPages);
    } catch {
      toast.error("Erreur lors du chargement des concours");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => setPage(0), 300);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    const id = setTimeout(() => load(), 250);
    return () => clearTimeout(id);
  }, [page, search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.deleteConcours(deleteId);
      toast.success("Concours supprimé");
      load();
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteId(null);
    }
  };

  const handleTogglePublish = async (c: any) => {
    setSubmittingId(c.id);
    try {
      const updated = c.soumis
        ? await api.unsoumettreConcours(c.id)
        : await api.soumettreConcours(c.id);
      setConcours(prev => prev.map(x => x.id === c.id ? updated : x));
      toast.success(c.soumis ? "Concours dépublié" : "Concours publié — inscriptions ouvertes !");
    } catch {
      toast.error("Erreur");
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading && concours.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">Concours NGUON</h1>
          <p className="text-slate-500 text-sm mt-1">Gérer les concours et défis du NGUON</p>
        </div>
        <Button onClick={() => navigate("/admin/concours/create")} className="gap-2">
          <Plus size={16} /> Nouveau Concours
        </Button>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Rechercher un concours…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {concours.length === 0 ? (
        <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-white/5 p-16 text-center">
          <FileText size={40} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Aucun concours créé pour le moment</p>
          <Button onClick={() => navigate("/admin/concours/create")} variant="outline" className="mt-4 gap-2">
            <Plus size={16} /> Créer le premier concours
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {concours.map((c) => (
            <div key={c.id} className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-white/5 p-6 flex flex-col md:flex-row md:items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              {/* Affiche preview */}
              <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-white/5 flex-shrink-0 overflow-hidden">
                {c.affiche ? (
                  c.affiche.endsWith(".pdf") ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText size={24} className="text-red-400" />
                    </div>
                  ) : (
                    <img
                      src={c.affichePresignedUrl ?? `${API_BASE_URL}/files/view/?path=${encodeURIComponent(c.affiche)}`}
                      alt="affiche"
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <FileText size={24} />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{c.categorie}</span>
                  <Badge variant={c.soumis ? "default" : "secondary"} className="gap-1 text-xs">
                    {c.soumis ? <><CheckCircle size={10} /> Ouvert</> : <><Clock size={10} /> Brouillon</>}
                  </Badge>
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white truncate">{c.sousCategorie}</h3>
                <p className="text-sm text-slate-400 mt-0.5">Période : {c.periode} · {c.fichesDescriptives?.length ?? 0} fiche(s)</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                    size="sm"
                    variant="outline"
                    className={`gap-1 ${c.soumis ? "text-amber-600 border-amber-200 hover:bg-amber-50" : "text-green-600 border-green-200 hover:bg-green-50"}`}
                    onClick={() => handleTogglePublish(c)}
                    disabled={submittingId === c.id}
                  >
                    {c.soumis ? <EyeOff size={14} /> : <Send size={14} />}
                    {submittingId === c.id ? "..." : c.soumis ? "Dépublier" : "Publier"}
                  </Button>
                <Button size="sm" variant="outline" className="gap-1" onClick={() => navigate(`/admin/concours/edit/${c.id}`)}>
                  <Eye size={14} /> Gérer
                </Button>
                <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => setDeleteId(c.id)}>
                    <Trash2 size={14} />
                  </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminPager page={page} size={PAGE_SIZE} totalElements={totalElements} totalPages={totalPages} onPageChange={setPage} />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce concours ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
