import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Upload, X, CheckSquare, Square, Loader2, Send, User, Phone, Mail, MapPin, Building, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";

const CONCOURS_LIST = [
  { categorie: "JEUNESSE – ÉDUCATION – LEADERSHIP", items: [
    "Grand Prix Jeunesse, Patrimoine et Excellence NGUON (Concours scolaires)",
    "NGUON Startup Challenge",
    "Grand Prix Sultan Ibrahim Mbombo Njoya",
  ]},
  { categorie: "ARTS – CULTURE – CRÉATIVITÉ", items: [
    "Grand Prix International des Arts et du Patrimoine Bamoun",
    "NGUON Digital Challenge 2026",
    "NGUON Remix Challenge 2026",
  ]},
  { categorie: "AMBASSADEURS CULTURELS", items: [
    "Miss NGUON 2026",
    "Mister NGUON 2026",
  ]},
  { categorie: "SPORTS ET JEUX PATRIMONIAUX", items: [
    "Festival des Jeux et Sports Traditionnels du Royaume Bamoun",
  ]},
  { categorie: "FEMME – LEADERSHIP – CULTURE", items: [
    "Grande Parade de la Femme Bamoun",
  ]},
  { categorie: "PATRIMOINE ÉQUESTRE ROYAL", items: [
    "Grand Prix Royal d'Équitation NGUON 2026",
    "Grande Parade Royale Équestre NGUON 2026",
  ]},
  { categorie: "TOURISME – NATURE – SPORTS DE PLEIN AIR", items: [
    "Heritage Run NGUON (Semi-marathon Njimom-Foumban)",
    "Ascension du Mont Mbapit",
    "Grande Marche du Patrimoine NGUON",
    "Tour Cycliste du Patrimoine NGUON",
  ]},
  { categorie: "ANIMATION COMMUNAUTAIRE", items: [
    "Carnaval Intergénérationnel du NGUON",
  ]},
];

interface DocFile { type: string; file: File | null; uploading: boolean; fileName?: string }

const DOC_TYPES = [
  { key: "CNI_OU_ACTE_NAISSANCE", label: "Photocopie CNI ou acte de naissance", required: true, hint: "PDF ou image" },
  { key: "CV_OU_PROJET", label: "CV ou présentation du projet", required: false, hint: "PDF ou image (optionnel)" },
  { key: "AUTORISATION_PARENTALE", label: "Autorisation parentale (pour mineurs)", required: false, hint: "Image ou PDF" },
  { key: "CERTIFICAT_MEDICAL", label: "Certificat médical (pour compétitions sportives)", required: false, hint: "Image ou PDF" },
];

export default function InscriptionConcours() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedId = searchParams.get("id");

  const [concoursList, setConcoursList] = useState<any[]>([]);
  const [loadingConcours, setLoadingConcours] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [form, setForm] = useState({
    nomPrenoms: "", dateNaissance: "", sexe: "",
    nationalite: "", professionEtablissement: "",
    ville: "", telephone: "", whatsapp: "", email: "",
    urgenceNom: "", urgenceTel: "",
    faitA: "", dateFait: "",
  });
  const [selectedConcours, setSelectedConcours] = useState<number[]>([]);
  const [docs, setDocs] = useState<DocFile[]>(
    DOC_TYPES.map(d => ({ type: d.key, file: null, uploading: false }))
  );
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signatureUploading, setSignatureUploading] = useState(false);
  const [signatureFileName, setSignatureFileName] = useState<string>("");

  useEffect(() => {
    api.getConcoursPublic()
      .then(list => {
        setConcoursList(list);
        if (preselectedId) {
          const id = parseInt(preselectedId);
          setSelectedConcours([id]);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingConcours(false));
  }, [preselectedId]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const toggleConcours = (id: number) => {
    setSelectedConcours(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const uploadDoc = async (idx: number, file: File) => {
    setDocs(d => d.map((x, i) => i === idx ? { ...x, file, uploading: true } : x));
    try {
      const { fileName } = await api.uploadCandidatDocument(file);
      setDocs(d => d.map((x, i) => i === idx ? { ...x, uploading: false, fileName } : x));
    } catch {
      toast.error("Erreur lors de l'upload du document");
      setDocs(d => d.map((x, i) => i === idx ? { ...x, file: null, uploading: false } : x));
    }
  };

  const uploadSignature = async (file: File) => {
    setSignatureFile(file);
    setSignatureUploading(true);
    try {
      const { fileName } = await api.uploadCandidatSignature(file);
      setSignatureFileName(fileName);
    } catch {
      toast.error("Erreur lors de l'upload de la signature");
      setSignatureFile(null);
    } finally {
      setSignatureUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nomPrenoms || !form.dateNaissance || !form.sexe || !form.telephone || !form.email) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    if (selectedConcours.length === 0) {
      toast.error("Veuillez sélectionner au moins un concours");
      return;
    }
    if (!signatureFileName) {
      toast.error("Veuillez fournir votre signature");
      return;
    }

    setSubmitting(true);
    try {
      const documents = docs
        .filter(d => d.fileName)
        .map(d => ({ typeDocument: d.type, fichier: d.fileName! }));

      await api.souscrireCandidat({
        ...form,
        concoursIds: selectedConcours,
        signature: signatureFileName,
        documents,
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'inscription");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
              <CheckSquare size={40} className="text-green-500" />
            </div>
            <h2 className="font-display text-2xl font-black text-foreground mb-3">Inscription enregistrée !</h2>
            <p className="font-body text-muted-foreground mb-8 leading-relaxed">
              Votre fiche de souscription aux concours du NGUON 2026 a été enregistrée avec succès.
              Vous serez contacté(e) prochainement.
            </p>
            <button
              onClick={() => navigate("/concours")}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-display font-bold px-6 py-3 rounded-xl mx-auto transition-all hover:scale-105"
            >
              <ArrowLeft size={16} /> Retour aux concours
            </button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const preselectedConcours = preselectedId
    ? concoursList.find(c => c.id === parseInt(preselectedId))
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="pt-28 pb-10 bg-gradient-to-br from-[#003B5C] to-[#002840]">
        <div className="container mx-auto px-4 max-w-3xl">
          <button
            onClick={() => navigate("/concours")}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 font-body text-sm"
          >
            <ArrowLeft size={16} /> Retour aux concours
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-0.5 w-10 bg-secondary rounded-full" />
            <span className="text-secondary font-body text-xs font-black uppercase tracking-[0.25em]">NGUON 2026</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black text-white mb-2">
            Fiche de Souscription
          </h1>
          <p className="font-body text-white/60 text-sm">
            {preselectedConcours
              ? `Inscription au concours : ${preselectedConcours.sousCategorie}`
              : "Concours et Défis du NGUON 2026"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="container mx-auto px-4 max-w-3xl py-10 space-y-8">

        {/* ── IDENTITÉ ── */}
        <Section title="Informations personnelles" icon={<User size={16} />}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nom et Prénoms *" span2>
              <input required value={form.nomPrenoms} onChange={set("nomPrenoms")}
                placeholder="Nom Prénom" className={input()} />
            </Field>
            <Field label="Date de naissance *">
              <input required type="date" value={form.dateNaissance} onChange={set("dateNaissance")} className={input()} />
            </Field>
            <Field label="Sexe *">
              <select required value={form.sexe} onChange={set("sexe")} className={input()}>
                <option value="">-- Sélectionner --</option>
                <option value="Masculin">Masculin</option>
                <option value="Féminin">Féminin</option>
              </select>
            </Field>
            <Field label="Nationalité">
              <input value={form.nationalite} onChange={set("nationalite")} placeholder="Ex: Camerounaise" className={input()} />
            </Field>
            <Field label="Profession / Établissement scolaire" span2>
              <input value={form.professionEtablissement} onChange={set("professionEtablissement")} placeholder="Ex: Lycée de Foumban" className={input()} />
            </Field>
            <Field label="Ville">
              <input value={form.ville} onChange={set("ville")} placeholder="Ex: Foumban" className={input()} />
            </Field>
          </div>
        </Section>

        {/* ── CONTACTS ── */}
        <Section title="Contacts" icon={<Phone size={16} />}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Téléphone *">
              <input required value={form.telephone} onChange={set("telephone")} placeholder="+237 6XX XXX XXX" className={input()} />
            </Field>
            <Field label="WhatsApp">
              <input value={form.whatsapp} onChange={set("whatsapp")} placeholder="+237 6XX XXX XXX" className={input()} />
            </Field>
            <Field label="E-mail *" span2>
              <input required type="email" value={form.email} onChange={set("email")} placeholder="exemple@email.com" className={input()} />
            </Field>
          </div>
        </Section>

        {/* ── URGENCE ── */}
        <Section title="Personne à contacter en cas d'urgence" icon={<Shield size={16} />}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nom">
              <input value={form.urgenceNom} onChange={set("urgenceNom")} placeholder="Nom de la personne" className={input()} />
            </Field>
            <Field label="Téléphone">
              <input value={form.urgenceTel} onChange={set("urgenceTel")} placeholder="+237 6XX XXX XXX" className={input()} />
            </Field>
          </div>
        </Section>

        {/* ── CONCOURS ── */}
        <Section title="Concours et Défis choisis" icon={<CheckSquare size={16} />}>
          {loadingConcours ? (
            <div className="flex items-center gap-3 py-6 text-muted-foreground">
              <Loader2 size={18} className="animate-spin" />
              <span className="font-body text-sm">Chargement des concours…</span>
            </div>
          ) : concoursList.length > 0 ? (
            /* Use live concours from API */
            <div className="space-y-5">
              {Object.entries(
                concoursList.reduce<Record<string, any[]>>((acc, c) => {
                  (acc[c.categorie] = acc[c.categorie] || []).push(c);
                  return acc;
                }, {})
              ).map(([cat, items]) => (
                <div key={cat}>
                  <p className="font-body text-xs font-black uppercase tracking-wider text-secondary mb-2">{cat}</p>
                  <div className="space-y-2">
                    {items.map((c: any) => (
                      <label key={c.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedConcours.includes(c.id)
                          ? "border-primary/40 bg-primary/5"
                          : "border-border hover:border-primary/20 hover:bg-muted/30"
                      }`}>
                        <div className="flex-shrink-0">
                          {selectedConcours.includes(c.id)
                            ? <CheckSquare size={18} className="text-primary" />
                            : <Square size={18} className="text-muted-foreground" />}
                        </div>
                        <input type="checkbox" className="sr-only" checked={selectedConcours.includes(c.id)} onChange={() => toggleConcours(c.id)} />
                        <span className="font-body text-sm text-foreground">{c.sousCategorie}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Fallback to static list */
            <div className="space-y-5">
              {CONCOURS_LIST.map(group => (
                <div key={group.categorie}>
                  <p className="font-body text-xs font-black uppercase tracking-wider text-secondary mb-2">{group.categorie}</p>
                  <div className="space-y-2">
                    {group.items.map(item => (
                      <label key={item} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/20 hover:bg-muted/30 cursor-pointer transition-all">
                        <Square size={18} className="text-muted-foreground flex-shrink-0" />
                        <span className="font-body text-sm text-foreground">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {selectedConcours.length > 0 && (
            <p className="font-body text-xs font-semibold text-primary mt-3">
              {selectedConcours.length} concours sélectionné(s)
            </p>
          )}
        </Section>

        {/* ── PIÈCES ── */}
        <Section title="Pièces à fournir" icon={<Upload size={16} />}>
          <div className="space-y-3">
            {DOC_TYPES.map((d, i) => (
              <DocUpload
                key={d.key}
                label={d.label}
                hint={d.hint}
                required={d.required}
                doc={docs[i]}
                onChange={file => uploadDoc(i, file)}
                onRemove={() => setDocs(dd => dd.map((x, j) => j === i ? { ...x, file: null, fileName: undefined } : x))}
              />
            ))}
          </div>
        </Section>

        {/* ── DÉCLARATION ── */}
        <Section title="Déclaration et Signature" icon={<Mail size={16} />}>
          <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
            Je certifie l'exactitude des informations fournies et m'engage à respecter le règlement
            des concours et activités du NGUON 2026.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <Field label="Fait à">
              <input value={form.faitA} onChange={set("faitA")} placeholder="Ville" className={input()} />
            </Field>
            <Field label="Le">
              <input type="date" value={form.dateFait} onChange={set("dateFait")} className={input()} />
            </Field>
          </div>
          <Field label="Signature du candidat (image avec nom et prénom) *">
            <DocUpload
              label="Signature"
              hint="Image (PNG, JPG)"
              required
              doc={{ type: "SIGNATURE", file: signatureFile, uploading: signatureUploading, fileName: signatureFileName }}
              onChange={uploadSignature}
              onRemove={() => { setSignatureFile(null); setSignatureFileName(""); }}
            />
          </Field>
        </Section>

        {/* ── SUBMIT ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
          <p className="font-body text-xs text-muted-foreground">
            * Champs obligatoires
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2.5 bg-secondary hover:bg-secondary/90 text-[#003B5C] font-display font-black text-base px-8 py-4 rounded-2xl shadow-lg shadow-secondary/25 transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {submitting ? "Envoi en cours…" : "Soumettre ma candidature"}
          </button>
        </div>
      </form>

      <Footer />
    </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────
function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-card border border-border rounded-2xl p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
        <h2 className="font-display font-black text-base text-foreground uppercase tracking-wide">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

function Field({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) {
  return (
    <div className={span2 ? "sm:col-span-2" : ""}>
      <label className="block font-body text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function input() {
  return "w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors";
}

function DocUpload({ label, hint, required, doc, onChange, onRemove }: {
  label: string; hint: string; required: boolean;
  doc: DocFile;
  onChange: (f: File) => void;
  onRemove: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const has = !!doc.file || !!doc.fileName;
  return (
    <div className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${has ? "border-primary/30 bg-primary/5" : "border-border bg-muted/20"}`}>
      <input ref={ref} type="file" accept=".pdf,.png,.jpg,.jpeg,.gif,.webp" className="hidden"
        onChange={e => { if (e.target.files?.[0]) onChange(e.target.files[0]); }} />
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-semibold text-foreground truncate">
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </p>
        <p className="font-body text-xs text-muted-foreground mt-0.5">
          {doc.uploading ? "Upload en cours…" : doc.file ? doc.file.name : hint}
        </p>
      </div>
      {doc.uploading ? (
        <Loader2 size={16} className="animate-spin text-primary flex-shrink-0" />
      ) : has ? (
        <button type="button" onClick={onRemove} className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors flex-shrink-0">
          <X size={14} />
        </button>
      ) : (
        <button type="button" onClick={() => ref.current?.click()}
          className="flex items-center gap-1.5 text-xs font-bold text-primary border border-primary/20 hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0">
          <Upload size={12} /> Choisir
        </button>
      )}
    </div>
  );
}
