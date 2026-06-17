import { useEffect, useState } from "react";
import { Search, User, FileText, Eye, X, Download } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DOC_LABELS: Record<string, string> = {
  CNI_OU_ACTE_NAISSANCE: "CNI / Acte de naissance",
  CV_OU_PROJET: "CV / Projet",
  AUTORISATION_PARENTALE: "Autorisation parentale",
  CERTIFICAT_MEDICAL: "Certificat médical",
  AUTRE: "Autre",
};

export default function CandidatsManagement() {
  const [candidats, setCandidats] = useState<any[]>([]);
  const [concours, setConcours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterConcours, setFilterConcours] = useState<string>("");
  const [selected, setSelected] = useState<any | null>(null);
  const [selectedDocs, setSelectedDocs] = useState<any[]>([]);
  const [selectedParts, setSelectedParts] = useState<any[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    Promise.all([api.getCandidats(), api.getConcours()])
      .then(([c, co]) => { setCandidats(c); setConcours(co); })
      .catch(() => toast.error("Erreur chargement"))
      .finally(() => setLoading(false));
  }, []);

  const openDetail = async (candidat: any) => {
    setSelected(candidat);
    setLoadingDetail(true);
    try {
      const [docs, parts] = await Promise.all([
        api.getCandidatDocuments(candidat.id),
        api.getCandidatParticipations(candidat.id),
      ]);
      setSelectedDocs(docs);
      setSelectedParts(parts);
    } catch {
      toast.error("Erreur chargement détails");
    } finally {
      setLoadingDetail(false);
    }
  };

  const filtered = candidats.filter(c => {
    const matchSearch = !search || c.nomPrenoms?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.ville?.toLowerCase().includes(search.toLowerCase());
    const matchConcours = !filterConcours || c.participations?.some((p: any) => String(p.concours?.id) === filterConcours);
    return matchSearch && matchConcours;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">Candidats</h1>
        <p className="text-slate-500 text-sm mt-1">{candidats.length} candidat(s) inscrit(s)</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Rechercher par nom, email, ville..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={filterConcours}
          onChange={e => setFilterConcours(e.target.value)}
          className="border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm bg-white dark:bg-background text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary min-w-[220px]"
        >
          <option value="">Tous les concours</option>
          {concours.map(c => (
            <option key={c.id} value={String(c.id)}>{c.sousCategorie}</option>
          ))}
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
                      <Button size="sm" variant="ghost" onClick={() => openDetail(c)} className="gap-1 text-slate-500 hover:text-primary">
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

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0a1628] rounded-3xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
              <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">Fiche candidat</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelected(null)}><X size={18} /></Button>
            </div>

            {loadingDetail ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <div className="p-6 space-y-6 text-sm">
                {/* Identity */}
                <div>
                  <h3 className="font-semibold text-slate-500 uppercase text-xs tracking-wider mb-3">Identité</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ["Nom & Prénoms", selected.nomPrenoms],
                      ["Date de naissance", selected.dateNaissance],
                      ["Sexe", selected.sexe],
                      ["Nationalité", selected.nationalite],
                      ["Profession / Établ.", selected.professionEtablissement],
                      ["Ville", selected.ville],
                      ["Téléphone", selected.telephone],
                      ["WhatsApp", selected.whatsapp],
                      ["E-mail", selected.email],
                    ].map(([label, value]) => (
                      <div key={label} className="bg-slate-50 dark:bg-white/5 rounded-xl p-3">
                        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                        <p className="font-medium text-slate-700 dark:text-white">{value || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emergency */}
                <div>
                  <h3 className="font-semibold text-slate-500 uppercase text-xs tracking-wider mb-3">Contact d'urgence</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3">
                      <p className="text-xs text-slate-400 mb-0.5">Nom</p>
                      <p className="font-medium text-slate-700 dark:text-white">{selected.urgenceNom || "—"}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3">
                      <p className="text-xs text-slate-400 mb-0.5">Téléphone</p>
                      <p className="font-medium text-slate-700 dark:text-white">{selected.urgenceTel || "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Declaration */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-slate-400 mb-0.5">Fait à</p>
                    <p className="font-medium text-slate-700 dark:text-white">{selected.faitA || "—"}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3">
                    <p className="text-xs text-slate-400 mb-0.5">Le</p>
                    <p className="font-medium text-slate-700 dark:text-white">{selected.dateFait || "—"}</p>
                  </div>
                </div>

                {/* Signature */}
                {selected.signature && (
                  <div>
                    <h3 className="font-semibold text-slate-500 uppercase text-xs tracking-wider mb-3">Signature</h3>
                    <a
                      href={`${API_BASE_URL}/files/view/?path=${encodeURIComponent(selected.signature)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                    >
                      <Eye size={14} /> Voir la signature
                    </a>
                  </div>
                )}

                {/* Participations */}
                {selectedParts.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-500 uppercase text-xs tracking-wider mb-3">Concours choisis ({selectedParts.length})</h3>
                    <div className="space-y-2">
                      {selectedParts.map((p: any) => (
                        <div key={p.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-xl">
                          <div className="flex-1">
                            <p className="font-medium text-slate-700 dark:text-white text-sm">{p.concours?.sousCategorie}</p>
                            <p className="text-xs text-slate-400">{p.concours?.categorie} · {p.periode}</p>
                          </div>
                          <span className="text-xs text-slate-400">{new Date(p.inscritLe).toLocaleDateString("fr-FR")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {selectedDocs.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-500 uppercase text-xs tracking-wider mb-3">Pièces jointes ({selectedDocs.length})</h3>
                    <div className="space-y-2">
                      {selectedDocs.map((doc: any) => (
                        <div key={doc.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-xl">
                          <FileText size={16} className="text-red-400 flex-shrink-0" />
                          <span className="flex-1 font-medium text-slate-700 dark:text-white">{DOC_LABELS[doc.typeDocument] ?? doc.typeDocument}</span>
                          <a
                            href={`${API_BASE_URL}/files/view/?path=${encodeURIComponent(doc.fichier)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline text-xs flex items-center gap-1"
                          >
                            <Download size={12} /> Voir
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
