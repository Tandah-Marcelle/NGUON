import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, Eye, TableProperties } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function exportExcel(candidats: any[]) {
  const rows = candidats.flatMap(c => {
    const parts = c.participations ?? [];
    if (parts.length === 0) return [{
      "Nom & Prénoms": c.nomPrenoms, "Date Naissance": c.dateNaissance,
      "Sexe": c.sexe, "Nationalité": c.nationalite,
      "Profession/Établissement": c.professionEtablissement, "Ville": c.ville,
      "Téléphone": c.telephone, "WhatsApp": c.whatsapp, "E-mail": c.email,
      "Urgence Nom": c.urgenceNom, "Urgence Tél": c.urgenceTel,
      "Fait à": c.faitA, "Date Fait": c.dateFait,
      "Signature": c.signatureNom || c.signature || "",
      "Concours": "", "Catégorie": "", "Période": "", "Inscrit le": "",
    }];
    return parts.map((p: any) => ({
      "Nom & Prénoms": c.nomPrenoms, "Date Naissance": c.dateNaissance,
      "Sexe": c.sexe, "Nationalité": c.nationalite,
      "Profession/Établissement": c.professionEtablissement, "Ville": c.ville,
      "Téléphone": c.telephone, "WhatsApp": c.whatsapp, "E-mail": c.email,
      "Urgence Nom": c.urgenceNom, "Urgence Tél": c.urgenceTel,
      "Fait à": c.faitA, "Date Fait": c.dateFait,
      "Signature": c.signatureNom || c.signature || "",
      "Concours": p.concours?.sousCategorie ?? "",
      "Catégorie": p.concours?.categorie ?? "",
      "Période": p.periode ?? p.concours?.periode ?? "",
      "Inscrit le": p.inscritLe ? new Date(p.inscritLe).toLocaleDateString("fr-FR") : "",
    }));
  });
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Candidats");
  XLSX.writeFile(wb, `candidats_nguon_2026_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export default function CandidatsManagement() {
  const navigate = useNavigate();
  const [candidats, setCandidats] = useState<any[]>([]);
  const [concours, setConcours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterConcours, setFilterConcours] = useState<string>("");
  const [selected, setSelected] = useState<Set<number>>(new Set());

  useEffect(() => {
    Promise.all([api.getCandidats(), api.getConcours()])
      .then(([c, co]) => { setCandidats(c); setConcours(co); })
      .catch(() => toast.error("Erreur chargement"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = candidats.filter(c => {
    const matchSearch = !search ||
      c.nomPrenoms?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.ville?.toLowerCase().includes(search.toLowerCase());
    const matchConcours = !filterConcours || c.participations?.some((p: any) => String(p.concours?.id) === filterConcours);
    return matchSearch && matchConcours;
  });

  const allFilteredSelected = filtered.length > 0 && filtered.every(c => selected.has(c.id));
  const toggleSelectAll = () => {
    setSelected(prev => {
      if (allFilteredSelected) return new Set([...prev].filter(id => !filtered.some(c => c.id === id)));
      return new Set([...prev, ...filtered.map(c => c.id)]);
    });
  };
  const toggleSelectOne = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Export the current selection if any, otherwise fall back to whatever the
  // active search/filter shows — never a silent "export everything" surprise.
  const exportTargets = selected.size > 0 ? candidats.filter(c => selected.has(c.id)) : filtered;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">Candidats</h1>
          <p className="text-slate-500 text-sm mt-1">
            {candidats.length} candidat(s) inscrit(s) au total
            {filtered.length !== candidats.length && <> — {filtered.length} affiché(s)</>}
            {selected.size > 0 && <> · {selected.size} sélectionné(s)</>}
          </p>
        </div>
        <Button onClick={() => exportExcel(exportTargets)} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
          <TableProperties size={16} /> Exporter Excel ({exportTargets.length})
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Rechercher par nom, email, ville..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select
          value={filterConcours}
          onChange={e => setFilterConcours(e.target.value)}
          className="border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm bg-white dark:bg-background text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary min-w-[220px]"
        >
          <option value="">Tous les concours</option>
          {concours.map(c => <option key={c.id} value={String(c.id)}>{c.sousCategorie}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-white/5 p-16 text-center">
          <User size={40} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Aucun candidat trouvé</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/2">
                  <th className="px-5 py-3 w-10">
                    <input type="checkbox" checked={allFilteredSelected} onChange={toggleSelectAll} className="w-4 h-4 rounded" />
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Nom & Prénoms</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider hidden md:table-cell">Ville</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider hidden lg:table-cell">Téléphone</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider hidden lg:table-cell">Sexe</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Concours</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4">
                      <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleSelectOne(c.id)} className="w-4 h-4 rounded" />
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">{c.nomPrenoms}</p>
                        <p className="text-xs text-slate-400">{c.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300 hidden md:table-cell">{c.ville}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300 hidden lg:table-cell">{c.telephone}</td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <Badge variant="outline" className="text-xs">{c.sexe}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {c.participations?.length ?? 0} concours
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/candidats/${c.id}`)} className="gap-1 text-slate-500 hover:text-primary">
                        <Eye size={14} /> Voir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
