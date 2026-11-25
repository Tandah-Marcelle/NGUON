import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3, Download, ExternalLink, FileText, Loader2, RefreshCw, Search, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, type VoteCandidateStats, type VoteCategory, type VoteStatsOverview } from "@/lib/api";
import { displayName } from "@/lib/voteText";

const fr = (n: number) => n.toLocaleString("fr-FR");
const pct = (n: number) => `${n.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
const shortDate = (iso: string) => { const [, m, d] = iso.slice(0, 10).split("-"); return `${d}/${m}`; };
const dateTime = (iso: string | null) => {
  if (!iso) return "—";
  const [d, t] = iso.split("T");
  const [y, m, da] = d.split("-");
  return `${da}/${m}/${y} à ${t.slice(0, 5)}`;
};

export default function VoteAnalytics() {
  const [data, setData] = useState<VoteStatsOverview | null>(null);
  const [state, setState] = useState<"loading" | "error" | "ready">("loading");
  const [query, setQuery] = useState("");
  const [showRanking, setShowRanking] = useState(true);
  const [busy, setBusy] = useState<number | "general" | "category" | null>(null);
  const [category, setCategory] = useState<VoteCategory>("MISS");

  const load = () => {
    setState((s) => (s === "ready" ? s : "loading"));
    api.getVoteStats()
      .then((d) => { setData(d); setState("ready"); })
      .catch(() => setState("error"));
  };
  useEffect(load, []);

  const current = data?.categories?.find((k) => k.category === category);
  const rows = useMemo(() => {
    const list = current?.ranking ?? [];
    const q = query.trim().toLowerCase();
    return q ? list.filter((c) => displayName(c.name).toLowerCase().includes(q)) : list;
  }, [current, query]);

  // jsPDF is only needed when a report is printed, so it loads on demand.
  const printCandidate = async (c: VoteCandidateStats) => {
    if (!data) return;
    setBusy(c.id);
    try {
      const { candidateReport } = await import("@/lib/voteReports");
      await candidateReport(c, data, { showRanking });
    } catch {
      toast.error("Impossible de générer le rapport. Réessayez.");
    } finally {
      setBusy(null);
    }
  };

  const printGeneral = async (only?: VoteCategory) => {
    if (!data) return;
    setBusy(only ? "category" : "general");
    try {
      const { generalReport } = await import("@/lib/voteReports");
      await generalReport(data, only);
    } catch {
      toast.error("Impossible de générer le rapport. Réessayez.");
    } finally {
      setBusy(null);
    }
  };

  const maxVotes = Math.max(1, ...(current?.ranking.map((c) => c.votes) ?? [1]));
  const rate = data && data.codesRequested ? (data.totalVotes * 100) / data.codesRequested : 0;
  const daily = current?.daily ?? [];
  const bestDay = daily.length ? daily.reduce((a, d) => (d.votes > a.votes ? d : a)) : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Résultats des votes</h1>
          <p className="text-muted-foreground mt-1">
            Votes confirmés par candidat(e), évolution et rapports PDF.
            {data && <> Mis à jour le {dateTime(data.generatedAt)}.</>}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={load} className="gap-2"><RefreshCw size={16} /> Actualiser</Button>
          <Button onClick={() => printGeneral()} disabled={!data || busy !== null} className="gap-2">
            {busy === "general" ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Rapport général Miss & Mister (PDF)
          </Button>
        </div>
      </div>

      {state === "loading" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />)}
        </div>
      )}

      {state === "error" && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <p className="font-semibold text-foreground">Impossible de charger les résultats.</p>
          <p className="text-sm text-muted-foreground mt-1">Vérifiez votre connexion ou reconnectez-vous, puis réessayez.</p>
          <Button onClick={load} className="mt-5 gap-2"><RefreshCw size={16} /> Réessayer</Button>
        </div>
      )}

      {state === "ready" && data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-navy p-5 text-white">
              <p className="text-sm text-white/70">Votes confirmés</p>
              <p className="mt-1 font-display text-3xl font-black text-secondary tabular-nums">{fr(data.totalVotes)}</p>
            </div>
            {[
              ...(data.categories ?? []).map((k) => ({ label: `Votes ${k.label}`, value: fr(k.totalVotes), hint: `${k.candidates} candidat(e)s` })),
              { label: "Codes demandés", value: fr(data.codesRequested), hint: `${pct(rate)} confirmés · ${fr(data.devices)} appareils` },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border/60 bg-card p-5">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="mt-1 font-display text-3xl font-black text-foreground tabular-nums">{s.value}</p>
                {s.hint && <p className="mt-0.5 text-xs text-muted-foreground">{s.hint}</p>}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div role="tablist" aria-label="Catégorie" className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1 sm:inline-grid">
              {(data.categories ?? []).map((k) => (
                <button
                  key={k.category}
                  role="tab"
                  aria-selected={category === k.category}
                  onClick={() => { setCategory(k.category); setQuery(""); }}
                  className={`flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 font-bold transition ${
                    category === k.category ? "bg-navy text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {k.label}
                  <span className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${category === k.category ? "bg-secondary text-navy" : "bg-background"}`}>{fr(k.totalVotes)}</span>
                </button>
              ))}
            </div>
            <Button variant="outline" onClick={() => printGeneral(category)} disabled={busy !== null} className="gap-2">
              {busy === "category" ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              Rapport {current?.label ?? ""} (PDF)
            </Button>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5 md:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
              <h2 className="font-bold text-foreground flex items-center gap-2"><BarChart3 size={18} className="text-primary" /> Votes {current?.label} confirmés par jour</h2>
              {bestDay && (
                <p className="text-sm text-muted-foreground">
                  Meilleure journée : <span className="font-semibold text-foreground">{shortDate(bestDay.date)} ({fr(bestDay.votes)} votes)</span>
                </p>
              )}
            </div>
            {daily.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">Aucun vote confirmé pour le moment.</p>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={daily} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tickFormatter={shortDate} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: "hsl(var(--muted))" }}
                      labelFormatter={(l) => shortDate(String(l))}
                      formatter={(v) => [fr(Number(v)), "Votes"]}
                    />
                    <Bar dataKey="votes" radius={[6, 6, 0, 0]} maxBarSize={72}>
                      {daily.map((d) => (
                        <Cell key={d.date} fill={d === bestDay ? "hsl(var(--secondary))" : "hsl(var(--navy))"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border/60 bg-card">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 md:p-6 border-b border-border/60">
              <h2 className="font-bold text-foreground flex items-center gap-2"><Trophy size={18} className="text-primary" /> Classement {current?.label}</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
                  <input type="checkbox" checked={showRanking} onChange={(e) => setShowRanking(e.target.checked)} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                  Inclure le rang et la part des votes dans les rapports individuels
                </label>
                <div className="relative sm:w-64">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Rechercher un(e) candidat(e)…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
                </div>
              </div>
            </div>

            {rows.length === 0 ? (
              <p className="p-10 text-center text-sm text-muted-foreground">
                {(current?.ranking.length ?? 0) === 0 ? "Aucun profil dans cette catégorie." : `Aucun(e) candidat(e) ne correspond à « ${query} ».`}
              </p>
            ) : (
              <ul className="divide-y divide-border/60">
                {rows.map((c) => (
                  <li key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 md:px-6 py-4">
                    <span className={`w-8 text-center font-display text-xl font-black tabular-nums ${c.rank <= 3 ? "text-primary" : "text-muted-foreground"}`}>{c.rank}</span>
                    <div className="h-14 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={c.photoPresignedUrl ?? `${import.meta.env.VITE_API_BASE_URL}/files/view/${c.photoUrl}`}
                        alt="" loading="lazy" className="h-full w-full object-cover object-top"
                      />
                    </div>
                    <div className="min-w-0 flex-1 basis-48">
                      <p className="font-bold text-foreground truncate">{displayName(c.name)}</p>
                      <div className="mt-1.5 flex items-center gap-3">
                        <div className="h-2 flex-1 max-w-56 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full ${c.rank <= 3 ? "bg-secondary" : "bg-navy"}`} style={{ width: `${(c.votes / maxVotes) * 100}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground tabular-nums">{pct(c.share)}</span>
                      </div>
                      {!c.published && <span className="mt-1 inline-block text-[11px] font-semibold text-muted-foreground">Profil masqué</span>}
                    </div>
                    <div className="text-right">
                      <p className="font-display text-2xl font-black text-foreground tabular-nums">{fr(c.votes)}</p>
                      <p className="text-xs text-muted-foreground tabular-nums">+{fr(c.votesLast24h)} en 24 h</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button variant="outline" size="sm" asChild className="gap-1.5">
                        <Link to={`/vote/${c.id}`} target="_blank"><ExternalLink size={14} /> Page</Link>
                      </Button>
                      <Button size="sm" onClick={() => printCandidate(c)} disabled={busy !== null} className="gap-1.5 flex-1 sm:flex-none">
                        {busy === c.id ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />} Rapport PDF
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Les rapports ne contiennent aucune adresse email de votant. Seuls les votes confirmés par code sont comptés.
          </p>
        </>
      )}
    </div>
  );
}
