import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Download, Printer, ExternalLink, X, ZoomIn } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import logo2 from "@/assets/logo2.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const fileViewUrl = (p: string) => `${API_BASE_URL}/files/view/?path=${encodeURIComponent(p)}`;

const DOC_LABELS: Record<string, string> = {
  CNI_OU_ACTE_NAISSANCE: "CNI / Acte de naissance",
  CV_OU_PROJET: "CV / Projet",
  AUTORISATION_PARENTALE: "Autorisation parentale",
  CERTIFICAT_MEDICAL: "Certificat médical",
  AUTRE: "Autre",
};

export default function CandidatDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const [candidat, setCandidat] = useState<any>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.getCandidatById(Number(id)),
      api.getCandidatDocuments(Number(id)),
      api.getCandidatParticipations(Number(id)),
    ])
      .then(([c, d, p]) => { setCandidat(c); setDocs(d); setParts(p); })
      .catch(() => toast.error("Erreur chargement du candidat"))
      .finally(() => setLoading(false));
  }, [id]);

  const printFiche = () => {
    if (!printRef.current) return;
    setPrinting(true);
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) { setPrinting(false); return; }
    win.document.write(`
      <html><head><title>Fiche — ${candidat?.nomPrenoms}</title>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Montserrat, Arial, sans-serif; background: #fff; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style>
      </head><body>${content}</body></html>
    `);
    win.document.close();
    win.onload = () => { win.focus(); win.print(); setPrinting(false); };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (!candidat) {
    return (
      <div className="text-center py-20 text-slate-500">
        <p>Candidat introuvable.</p>
        <Button variant="ghost" onClick={() => navigate("/admin/candidats")} className="mt-4 gap-2">
          <ArrowLeft size={14} /> Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/admin/candidats")}
          className="flex items-center gap-2 text-slate-500 hover:text-primary font-body text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Retour aux candidats
        </button>
        <Button onClick={printFiche} disabled={printing} className="gap-2 bg-primary hover:bg-primary/90 text-white">
          <Printer size={14} />
          {printing ? "Impression…" : "Imprimer PDF"}
        </Button>
      </div>

      {/* Header card */}
      <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">{candidat.nomPrenoms}</h1>
            <p className="text-slate-400 text-sm mt-1">{candidat.email}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="outline">{candidat.sexe || "—"}</Badge>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              {parts.length} concours
            </span>
          </div>
        </div>
      </div>

      {/* Identity */}
      <Section title="Informations personnelles">
        <Grid items={[
          ["Nom et Prénoms", candidat.nomPrenoms],
          ["Date de naissance", candidat.dateNaissance],
          ["Sexe", candidat.sexe],
          ["Nationalité", candidat.nationalite],
          ["Profession / Établ.", candidat.professionEtablissement],
          ["Ville", candidat.ville],
          ["Téléphone", candidat.telephone],
          ["WhatsApp", candidat.whatsapp],
          ["E-mail", candidat.email],
        ]} />
      </Section>

      {/* Urgence */}
      <Section title="Contact d'urgence">
        <Grid items={[
          ["Nom", candidat.urgenceNom],
          ["Téléphone", candidat.urgenceTel],
        ]} />
      </Section>

      {/* Concours */}
      {parts.length > 0 && (
        <Section title={`Concours choisis (${parts.length})`}>
          <div className="space-y-2">
            {parts.map((p: any) => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-xl">
                <div className="flex-1">
                  <p className="font-medium text-slate-700 dark:text-white text-sm">{p.concours?.sousCategorie}</p>
                  <p className="text-xs text-slate-400">{p.concours?.categorie} · {p.periode}</p>
                </div>
                <span className="text-xs text-slate-400">
                  {p.inscritLe ? new Date(p.inscritLe).toLocaleDateString("fr-FR") : ""}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Déclaration & Signature */}
      <Section title="Déclaration">
        <Grid items={[
          ["Fait à", candidat.faitA],
          ["Le", candidat.dateFait],
        ]} />
        <div className="mt-4 bg-slate-50 dark:bg-white/5 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">Signature</p>
          <p className="font-bold text-slate-700 dark:text-white text-base">
            {candidat.signatureNom || candidat.signature || "—"}
          </p>
        </div>
      </Section>

      {/* Documents */}
      {docs.length > 0 && (
        <Section title={`Pièces jointes (${docs.length})`}>
          <div className="space-y-4">
            {docs.map((doc: any) => (
              <DocRow key={doc.id} doc={doc} />
            ))}
          </div>
        </Section>
      )}

      {/* Hidden printable */}
      <div className="hidden">
        <div ref={printRef}>
          <PrintableCard candidat={candidat} docs={docs} parts={parts} />
        </div>
      </div>
    </div>
  );
}

// ── Doc row with image preview / PDF new tab ─────────────────────────────────
const isImg = (p: string) => /\.(png|jpe?g|gif|webp|svg)$/i.test(p ?? "");

function DocRow({ doc }: { doc: any }) {
  const [preview, setPreview] = useState(false);
  const url = fileViewUrl(doc.fichier);
  const img = isImg(doc.fichier ?? "");

  return (
    <>
      <div className="rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden bg-slate-50 dark:bg-white/5">
        {/* Row header */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            img ? "bg-blue-50 dark:bg-blue-900/20" : "bg-red-50 dark:bg-red-900/20"
          }`}>
            <FileText size={16} className={img ? "text-blue-400" : "text-red-400"} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-700 dark:text-white text-sm">
              {DOC_LABELS[doc.typeDocument] ?? doc.typeDocument}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{img ? "Image" : "Document PDF"}</p>
          </div>
          {img ? (
            <button
              onClick={() => setPreview(v => !v)}
              className="flex items-center gap-1.5 text-xs font-bold text-primary border border-primary/20 hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ZoomIn size={12} /> {preview ? "Masquer" : "Aperçu"}
            </button>
          ) : (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-primary border border-primary/20 hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ExternalLink size={12} /> Ouvrir
            </a>
          )}
        </div>

        {/* Image preview panel */}
        {img && preview && (
          <div className="border-t border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-3">
            <img
              src={url}
              alt={DOC_LABELS[doc.typeDocument] ?? doc.typeDocument}
              className="max-h-80 w-full object-contain rounded-lg"
            />
            <div className="flex justify-end mt-2">
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <Download size={12} /> Télécharger
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-sm space-y-3">
      <h2 className="font-semibold text-slate-500 dark:text-slate-400 uppercase text-xs tracking-wider">{title}</h2>
      {children}
    </div>
  );
}

function Grid({ items }: { items: [string, string | undefined][] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map(([label, value]) => (
        <div key={label} className="bg-slate-50 dark:bg-white/5 rounded-xl p-3">
          <p className="text-xs text-slate-400 mb-0.5">{label}</p>
          <p className="font-medium text-slate-700 dark:text-white text-sm">{value || "—"}</p>
        </div>
      ))}
    </div>
  );
}

// ── Printable PDF card ────────────────────────────────────────────────────────
function PrintableCard({ candidat, docs, parts }: { candidat: any; docs: any[]; parts: any[] }) {
  return (
    <div style={{ fontFamily: "Montserrat, Arial, sans-serif", background: "#fff", color: "#1a1a2e", padding: "32px 36px", maxWidth: "760px", margin: "0 auto", fontSize: "12px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", borderBottom: "3px solid #003B5C", paddingBottom: "16px", marginBottom: "20px", gap: "16px" }}>
        <img src={logo2} alt="NGUON" style={{ height: "64px", width: "auto" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "18px", fontWeight: 900, color: "#003B5C", letterSpacing: "1px" }}>FONDATION NGUON</div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#b8860b", marginTop: "2px" }}>FICHE UNIQUE DE SOUSCRIPTION</div>
          <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>Concours et Défis du NGUON 2026</div>
        </div>
        <div style={{ textAlign: "right", fontSize: "10px", color: "#888" }}>
          <div>N° Candidat : {candidat.id}</div>
          <div>Imprimé le : {new Date().toLocaleDateString("fr-FR")}</div>
        </div>
      </div>

      <PT>Informations personnelles</PT>
      <PC items={[["Nom et Prénoms", candidat.nomPrenoms], ["Date de naissance", candidat.dateNaissance], ["Sexe", candidat.sexe], ["Nationalité", candidat.nationalite], ["Profession / Établissement", candidat.professionEtablissement], ["Ville", candidat.ville], ["Téléphone", candidat.telephone], ["WhatsApp", candidat.whatsapp], ["E-mail", candidat.email]]} />

      <PT>Personne à contacter en cas d'urgence</PT>
      <PC items={[["Nom", candidat.urgenceNom], ["Téléphone", candidat.urgenceTel]]} />

      {parts.length > 0 && (
        <>
          <PT>Concours et Défis choisis ({parts.length})</PT>
          <div style={{ marginBottom: "16px" }}>
            {parts.map((p: any, i: number) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", borderRadius: "6px", background: i % 2 === 0 ? "#f0f5fa" : "#fff", marginBottom: "4px", border: "1px solid #e5eaf0" }}>
                <div>
                  <span style={{ fontWeight: 700, color: "#003B5C" }}>{p.concours?.sousCategorie}</span>
                  <span style={{ color: "#888", fontSize: "10px", marginLeft: "8px" }}>{p.concours?.categorie}</span>
                </div>
                <span style={{ color: "#555", fontSize: "10px" }}>{p.inscritLe ? new Date(p.inscritLe).toLocaleDateString("fr-FR") : ""}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {docs.length > 0 && (
        <>
          <PT>Pièces fournies</PT>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
            {docs.map((d: any, i: number) => (
              <span key={i} style={{ background: "#fff3e0", color: "#b8860b", border: "1px solid #f5c87a", borderRadius: "20px", padding: "3px 10px", fontSize: "10px", fontWeight: 700 }}>
                {DOC_LABELS[d.typeDocument] ?? d.typeDocument}
              </span>
            ))}
          </div>
        </>
      )}

      <PT>Déclaration</PT>
      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "12px 14px", marginBottom: "16px", fontStyle: "italic", color: "#555" }}>
        Je certifie l'exactitude des informations fournies et m'engage à respecter le règlement des concours et activités du NGUON 2026.
      </div>
      <PC items={[["Fait à", candidat.faitA], ["Le", candidat.dateFait]]} />

      <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
        <div style={{ textAlign: "center", minWidth: "200px" }}>
          <div style={{ fontSize: "10px", color: "#888", marginBottom: "8px" }}>Signature du candidat</div>
          <div style={{ border: "1px solid #003B5C", borderRadius: "8px", padding: "14px 24px", minHeight: "48px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#003B5C", fontSize: "13px" }}>
            {candidat.signatureNom || candidat.signature || "—"}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "24px", borderTop: "2px solid #003B5C", paddingTop: "10px", textAlign: "center", fontSize: "9px", color: "#aaa" }}>
        NGUON 2026 — Fondation NGUON · Foumban, Cameroun · www.nguonevents.com
      </div>
    </div>
  );
}

function PT({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: "1.5px", color: "#003B5C", borderLeft: "3px solid #f5c842", paddingLeft: "8px", marginBottom: "8px", marginTop: "4px" }}>{children}</div>;
}
function PC({ items }: { items: [string, string | undefined][] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "14px" }}>
      {items.map(([label, value]) => (
        <div key={label} style={{ background: "#f8fafc", borderRadius: "6px", padding: "7px 10px", border: "1px solid #e5eaf0" }}>
          <div style={{ fontSize: "9px", color: "#94a3b8", marginBottom: "2px", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{label}</div>
          <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "11px" }}>{value || "—"}</div>
        </div>
      ))}
    </div>
  );
}
