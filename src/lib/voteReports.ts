import { jsPDF } from "jspdf";
import type { VoteCandidateStats, VoteDayCount, VoteStatsOverview } from "@/lib/api";
import { cleanText, displayName } from "@/lib/voteText";

// A4 portrait, millimetres. Palette matches the site (navy / gold / paper).
const W = 210;
const H = 297;
const M = 16;
type RGB = [number, number, number];
const NAVY: RGB = [0, 59, 92];
const NAVY_DEEP: RGB = [0, 36, 58];
const GOLD: RGB = [255, 204, 0];
const PAPER: RGB = [247, 241, 227];
const INK: RGB = [26, 34, 48];
const MUTED: RGB = [107, 114, 128];
const RULE: RGB = [226, 221, 208];

// The built-in PDF fonts only cover Latin-1: fold everything else to its
// closest plain form so names and bios never print as garbage.
function pdfText(s: string | null | undefined): string {
  return cleanText(s ?? "")
    .replace(/[\u2018\u2019\u201B\u2032]/g, "'")
    .replace(/[\u201C\u201D\u201E\u2033]/g, '"')
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[\u00A0\u202F\u2007\u2009]/g, " ")
    .replace(/[^\n\t\u0020-\u007E\u00A1-\u00FF]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

const nf = (n: number) => pdfText(n.toLocaleString("fr-FR"));
const pct = (n: number) => pdfText(n.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })) + " %";

// Server times are already in the festival time zone (no offset in the string).
function parts(iso: string) {
  const [d, t = "00:00"] = iso.split("T");
  const [y, mo, da] = d.split("-");
  return { date: `${da}/${mo}/${y}`, time: t.slice(0, 5), short: `${da}/${mo}` };
}
const when = (iso: string | null) => (iso ? `${parts(iso).date} à ${parts(iso).time}` : "-");

const slug = (s: string) =>
  pdfText(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "candidat";

// ── Images ────────────────────────────────────────────────────────────────────

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Crops to fill w×h (like object-cover, biased to the top for portraits) on rounded corners. */
function coverJpeg(img: HTMLImageElement, wMm: number, hMm: number, pxPerMm = 9, radiusMm = 3, bg: RGB = PAPER): string | null {
  try {
    const cw = Math.round(wMm * pxPerMm);
    const ch = Math.round(hMm * pxPerMm);
    const canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = `rgb(${bg.join(",")})`;
    ctx.fillRect(0, 0, cw, ch);
    const r = radiusMm * pxPerMm;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.arcTo(cw, 0, cw, ch, r);
    ctx.arcTo(cw, ch, 0, ch, r);
    ctx.arcTo(0, ch, 0, 0, r);
    ctx.arcTo(0, 0, cw, 0, r);
    ctx.closePath();
    ctx.clip();
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (cw - dw) / 2, Math.min(0, (ch - dh) * 0.15), dw, dh);
    return canvas.toDataURL("image/jpeg", 0.86);
  } catch {
    return null; // tainted canvas (cross-origin photo): report still prints, without it
  }
}

const photoSrc = (c: VoteCandidateStats) => c.photoPresignedUrl ?? `${import.meta.env.VITE_API_BASE_URL}/files/view/${c.photoUrl}`;

let logoCache: Promise<string | null> | null = null;
function logo(): Promise<string | null> {
  logoCache ??= loadImage("/img/logo2.png").then((img) => {
    if (!img) return null;
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0);
    return c.toDataURL("image/jpeg", 0.92);
  });
  return logoCache;
}

// ── Drawing primitives ────────────────────────────────────────────────────────

function fill(doc: jsPDF, c: RGB) { doc.setFillColor(c[0], c[1], c[2]); }
function stroke(doc: jsPDF, c: RGB) { doc.setDrawColor(c[0], c[1], c[2]); }
function ink(doc: jsPDF, c: RGB) { doc.setTextColor(c[0], c[1], c[2]); }

const mix = (a: RGB, b: RGB, t: number): RGB => [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t)) as RGB;

function diamond(doc: jsPDF, cx: number, cy: number, r: number, style: "F" | "S") {
  doc.lines([[r, r], [-r, r], [-r, -r], [r, -r]], cx, cy - r, [1, 1], style, true);
}

/** Ndop lozenge lattice, as on the site: drawn in a colour pre-blended with the panel, inside its bounds. */
function lattice(doc: jsPDF, x: number, y: number, w: number, h: number, panel: RGB, color: RGB, strength: number) {
  const c = mix(panel, color, strength);
  stroke(doc, c);
  fill(doc, c);
  doc.setLineWidth(0.3);
  const step = 11, r = 4.2;
  for (let yy = y + r + 1; yy <= y + h - r; yy += step) {
    for (let xx = x + r + 1; xx <= x + w - r; xx += step) {
      diamond(doc, xx, yy, r, "S");
      diamond(doc, xx, yy, 0.8, "F");
    }
  }
}

/** Woven border strip of triangles. */
function wovenBand(doc: jsPDF, y: number, color: RGB) {
  fill(doc, color);
  const s = 4;
  for (let x = 0; x < W; x += s) {
    doc.triangle(x, y, x + s, y, x + s / 2, y + 1.8, "F");
    doc.triangle(x + s / 2, y + 3.2, x, y + 5, x + s, y + 5, "F");
  }
}

async function header(doc: jsPDF, title: string, subtitle: string) {
  fill(doc, NAVY);
  doc.rect(0, 0, W, 44, "F");
  lattice(doc, 0, 0, W, 44, NAVY, PAPER, 0.12);
  const lg = await logo();
  fill(doc, [255, 255, 255]);
  doc.roundedRect(M, 9, 26, 26, 3, 3, "F");
  if (lg) doc.addImage(lg, "JPEG", M + 1.5, 10.5, 23, 23);
  ink(doc, GOLD);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("FESTIVAL NGUON 2026 · FOUMBAN", M + 33, 16);
  ink(doc, [255, 255, 255]);
  doc.setFontSize(20);
  doc.text(pdfText(title), M + 33, 26);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  ink(doc, [205, 218, 228]);
  doc.text(pdfText(subtitle), M + 33, 33);
  fill(doc, NAVY_DEEP);
  doc.rect(0, 44, W, 6, "F");
  wovenBand(doc, 44.5, GOLD);
}

function footer(doc: jsPDF, generatedAt: string, page: number, pages: number) {
  stroke(doc, RULE);
  doc.setLineWidth(0.3);
  doc.line(M, H - 18, W - M, H - 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  ink(doc, MUTED);
  doc.text("Fondation Nguon · Festival Nguon 2026 · nguonevents.com", M, H - 12.5);
  doc.text(pdfText(`Édité le ${when(generatedAt)} (heure du Cameroun)${pages > 1 ? ` · Page ${page}/${pages}` : ""}`), W - M, H - 12.5, { align: "right" });
  doc.setFontSize(7);
  doc.text(
    "Décompte des votes confirmés par email à la date d'édition. Les résultats officiels sont annoncés par les organisateurs.",
    M, H - 8.5,
  );
}

function sectionTitle(doc: jsPDF, text: string, x: number, y: number) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  ink(doc, INK);
  doc.text(pdfText(text), x, y);
  fill(doc, GOLD);
  doc.rect(x, y + 2, 10, 0.9, "F");
}

function barChart(doc: jsPDF, days: VoteDayCount[], x: number, y: number, w: number, h: number) {
  fill(doc, PAPER);
  doc.roundedRect(x, y, w, h, 3, 3, "F");
  if (days.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    ink(doc, MUTED);
    doc.text("Aucun vote confirmé pour le moment.", x + w / 2, y + h / 2, { align: "center" });
    return;
  }
  const padL = 12, padR = 6, padT = 8, padB = 10;
  const cw = w - padL - padR;
  const ch = h - padT - padB;
  const peak = Math.max(...days.map((d) => d.votes), 1);
  const mag = 10 ** Math.floor(Math.log10(peak));
  const max = [1, 2, 2.5, 5, 10].map((k) => k * mag).find((v) => v >= peak) ?? peak;
  const ticks = [0, max / 2, max];
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  stroke(doc, RULE);
  doc.setLineWidth(0.2);
  for (const t of ticks) {
    const ty = y + padT + ch - (t / max) * ch;
    doc.line(x + padL, ty, x + padL + cw, ty);
    ink(doc, MUTED);
    doc.text(nf(t), x + padL - 2, ty + 1, { align: "right" });
  }
  const slot = cw / days.length;
  const bw = Math.min(14, slot * 0.68);
  const best = days.reduce((a, b) => (b.votes > a.votes ? b : a));
  const labelEvery = Math.ceil(days.length / 12);
  days.forEach((d, i) => {
    const bh = (d.votes / max) * ch;
    const bx = x + padL + i * slot + (slot - bw) / 2;
    fill(doc, d === best ? GOLD : NAVY);
    if (bh > 0) doc.rect(bx, y + padT + ch - bh, bw, bh, "F");
    if (days.length <= 14 && d.votes > 0) {
      ink(doc, INK);
      doc.setFont("helvetica", "bold");
      doc.text(nf(d.votes), bx + bw / 2, y + padT + ch - bh - 1.5, { align: "center" });
      doc.setFont("helvetica", "normal");
    }
    if (i % labelEvery === 0) {
      ink(doc, MUTED);
      doc.text(parts(d.date).short, bx + bw / 2, y + h - 4, { align: "center" });
    }
  });
}

function statCard(doc: jsPDF, x: number, y: number, w: number, h: number, label: string, value: string, dark = false) {
  fill(doc, dark ? NAVY : PAPER);
  doc.roundedRect(x, y, w, h, 3, 3, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  ink(doc, dark ? [205, 218, 228] : MUTED);
  doc.text(pdfText(label), x + 5, y + 7.5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(dark ? 26 : 18);
  ink(doc, dark ? GOLD : INK);
  doc.text(pdfText(value), x + 5, y + h - 5);
}

function save(doc: jsPDF, name: string) {
  doc.setProperties({ title: name, author: "Fondation Nguon", creator: "nguonevents.com" });
  doc.save(`${name}.pdf`);
}

// ── Individual candidate report ───────────────────────────────────────────────

export async function candidateReport(c: VoteCandidateStats, overview: VoteStatsOverview, opts: { showRanking: boolean }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const name = displayName(c.name);
  await header(doc, "Rapport de vote", "Élection Miss & Mister Nguon 2026");

  // Photo + identity
  const top = 60;
  const pw = 60, ph = 76;
  const img = await loadImage(photoSrc(c));
  const photo = img && coverJpeg(img, pw, ph, 9, 4, [255, 255, 255]);
  fill(doc, NAVY);
  doc.roundedRect(M + 4, top + 5, pw, ph, 4, 4, "F");
  lattice(doc, M + 4, top + 5, pw, ph, NAVY, GOLD, 0.45);
  if (photo) doc.addImage(photo, "JPEG", M, top, pw, ph);
  else {
    fill(doc, PAPER);
    doc.roundedRect(M, top, pw, ph, 4, 4, "F");
  }

  const rx = M + pw + 14;
  const rw = W - M - rx;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  ink(doc, MUTED);
  doc.text("Candidat(e)", rx, top + 4);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  ink(doc, INK);
  const nameLines = doc.splitTextToSize(pdfText(name), rw).slice(0, 3);
  doc.text(nameLines, rx, top + 13);
  let ry = top + 13 + nameLines.length * 7.5;

  const cardH = 24;
  statCard(doc, rx, ry, rw, cardH + 6, "Votes reçus", nf(c.votes), true);
  ry += cardH + 6 + 4;
  if (opts.showRanking) {
    const half = (rw - 4) / 2;
    statCard(doc, rx, ry, half, cardH, "Classement", `${c.rank}${c.rank === 1 ? "er" : "e"} / ${overview.candidates}`);
    statCard(doc, rx + half + 4, ry, half, cardH, "Part des votes", pct(c.share));
    ry += cardH + 4;
  } else {
    statCard(doc, rx, ry, rw, cardH, "Votes des dernières 24 heures", nf(c.votesLast24h));
    ry += cardH + 4;
  }
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  ink(doc, MUTED);
  doc.text(pdfText(`Lien de vote : nguonevents.com/vote/${c.id}`), rx, Math.max(ry + 4, top + ph - 1));

  // Evolution
  let y = top + ph + 15;
  sectionTitle(doc, "Évolution des votes par jour", M, y);
  barChart(doc, c.daily, M, y + 6, W - 2 * M, 40);
  y += 6 + 40 + 11;

  // Details
  sectionTitle(doc, "Détails", M, y);
  y += 8.5;
  const rows: [string, string][] = [
    ["Premier vote confirmé", when(c.firstVoteAt)],
    ["Dernier vote confirmé", when(c.lastVoteAt)],
    ["Votes des dernières 24 heures", nf(c.votesLast24h)],
    ["Meilleure journée", (() => {
      if (c.daily.length === 0) return "-";
      const b = c.daily.reduce((a, d) => (d.votes > a.votes ? d : a));
      return `${parts(b.date).date} (${nf(b.votes)} vote${b.votes > 1 ? "s" : ""})`;
    })()],
  ];
  doc.setFontSize(9.5);
  rows.forEach(([k, v], i) => {
    const ly = y + i * 6.2;
    doc.setFont("helvetica", "normal");
    ink(doc, MUTED);
    doc.text(pdfText(k), M, ly);
    doc.setFont("helvetica", "bold");
    ink(doc, INK);
    doc.text(pdfText(v), W - M, ly, { align: "right" });
    stroke(doc, RULE);
    doc.setLineWidth(0.2);
    doc.line(M, ly + 2.5, W - M, ly + 2.5);
  });
  y += rows.length * 6.2 + 7;

  // Presentation
  const bio = pdfText(c.description);
  if (bio && y < H - 36) {
    sectionTitle(doc, "Présentation", M, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    ink(doc, [60, 66, 78]);
    const maxLines = Math.max(1, Math.floor((H - 22 - (y + 8)) / 4.3));
    let lines: string[] = doc.splitTextToSize(bio, W - 2 * M);
    if (lines.length > maxLines) lines = [...lines.slice(0, Math.max(0, maxLines - 1)), lines[maxLines - 1].replace(/\s+\S*$/, "") + " ..."];
    doc.text(lines, M, y + 8, { lineHeightFactor: 1.35 });
  }

  footer(doc, overview.generatedAt, 1, 1);
  save(doc, `rapport-vote-${slug(name)}`);
}

// ── General report ────────────────────────────────────────────────────────────

async function thumbnails(list: VoteCandidateStats[], wMm: number, hMm: number): Promise<Map<number, string>> {
  const out = new Map<number, string>();
  const queue = [...list];
  const worker = async () => {
    for (let c = queue.shift(); c; c = queue.shift()) {
      const img = await loadImage(photoSrc(c));
      const data = img && coverJpeg(img, wMm, hMm, 8, 1.6, [255, 255, 255]);
      if (data) out.set(c.id, data);
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  return out;
}

export async function generalReport(overview: VoteStatsOverview) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const ranking = overview.ranking;
  const thumbs = await thumbnails(ranking, 12, 15);
  const podiumImgs = await thumbnails(ranking.slice(0, 3), 50, 58);

  await header(doc, "Rapport général des votes", "Élection Miss & Mister Nguon 2026");

  // Key figures
  let y = 60;
  const gap = 4;
  const cw = (W - 2 * M - 3 * gap) / 4;
  const rate = overview.codesRequested ? (overview.totalVotes * 100) / overview.codesRequested : 0;
  statCard(doc, M, y, cw, 26, "Votes confirmés", nf(overview.totalVotes), true);
  statCard(doc, M + (cw + gap), y, cw, 26, "Candidat(e)s", nf(overview.candidates));
  statCard(doc, M + 2 * (cw + gap), y, cw, 26, "Codes demandés", nf(overview.codesRequested));
  statCard(doc, M + 3 * (cw + gap), y, cw, 26, "Taux de confirmation", pct(rate));
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  ink(doc, MUTED);
  doc.text(
    pdfText(`Période : du ${when(overview.firstVoteAt)} au ${when(overview.lastVoteAt)} · ${nf(overview.devices)} appareils distincts`),
    M, y + 33,
  );

  // Podium
  y += 46;
  sectionTitle(doc, "Podium", M, y);
  y += 8;
  const pw = (W - 2 * M - 2 * 6) / 3;
  ranking.slice(0, 3).forEach((c, i) => {
    const px = M + i * (pw + 6);
    fill(doc, i === 0 ? NAVY : PAPER);
    doc.roundedRect(px, y, pw, 82, 4, 4, "F");
    const im = podiumImgs.get(c.id);
    if (im) doc.addImage(im, "JPEG", px + (pw - 50) / 2, y + 5, 50, 58);
    fill(doc, GOLD);
    doc.circle(px + 9, y + 9, 5.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    ink(doc, NAVY);
    doc.text(String(c.rank), px + 9, y + 10.8, { align: "center" });
    ink(doc, i === 0 ? [255, 255, 255] : INK);
    doc.setFontSize(9.5);
    const nm = doc.splitTextToSize(pdfText(displayName(c.name)), pw - 8).slice(0, 2);
    doc.text(nm, px + pw / 2, y + 68, { align: "center" });
    ink(doc, i === 0 ? GOLD : NAVY);
    doc.setFontSize(10.5);
    doc.text(`${nf(c.votes)} votes · ${pct(c.share)}`, px + pw / 2, y + 68 + nm.length * 4.2 + 1.5, { align: "center" });
  });

  // Evolution
  y += 82 + 12;
  sectionTitle(doc, "Votes confirmés par jour", M, y);
  barChart(doc, overview.daily, M, y + 7, W - 2 * M, 48);

  // Full ranking, on following pages
  const rowH = 17;
  const tableTop = 66;
  const perPage = Math.floor((H - 24 - tableTop) / rowH);
  const pages = 1 + Math.ceil(ranking.length / perPage);
  footer(doc, overview.generatedAt, 1, pages);
  const maxVotes = Math.max(...ranking.map((r) => r.votes), 1);

  for (let p = 0; p * perPage < ranking.length; p++) {
    doc.addPage();
    await header(doc, "Classement complet", "Élection Miss & Mister Nguon 2026");
    sectionTitle(doc, "Classement des candidat(e)s", M, 60);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    ink(doc, MUTED);
    doc.text("Rang", M + 1, tableTop - 1);
    doc.text("Candidat(e)", M + 30, tableTop - 1);
    doc.text("Part des votes", M + 112, tableTop - 1);
    doc.text("Votes", W - M, tableTop - 1, { align: "right" });

    ranking.slice(p * perPage, (p + 1) * perPage).forEach((c, i) => {
      const ry = tableTop + 2 + i * rowH;
      if (i % 2 === 0) {
        fill(doc, PAPER);
        doc.rect(M - 2, ry - 1, W - 2 * M + 4, rowH, "F");
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      ink(doc, c.rank <= 3 ? NAVY : MUTED);
      doc.text(String(c.rank), M + 4, ry + 9, { align: "center" });
      const th = thumbs.get(c.id);
      if (th) doc.addImage(th, "JPEG", M + 12, ry + 0.5, 12, 15);
      doc.setFontSize(9.5);
      ink(doc, INK);
      const nm = doc.splitTextToSize(pdfText(displayName(c.name)), 78).slice(0, 2);
      doc.text(nm, M + 30, ry + (nm.length > 1 ? 6.5 : 9));
      const bx = M + 112, bwMax = 34;
      fill(doc, RULE);
      doc.roundedRect(bx, ry + 6.2, bwMax, 3, 1.5, 1.5, "F");
      fill(doc, c.rank <= 3 ? GOLD : NAVY);
      const bw = Math.max(c.votes > 0 ? 1.5 : 0, (c.votes / maxVotes) * bwMax);
      if (bw > 0) doc.roundedRect(bx, ry + 6.2, bw, 3, 1.5, 1.5, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      ink(doc, MUTED);
      doc.text(pct(c.share), bx + bwMax + 3, ry + 8.6);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      ink(doc, INK);
      doc.text(nf(c.votes), W - M, ry + 9, { align: "right" });
    });
    footer(doc, overview.generatedAt, p + 2, pages);
  }

  save(doc, `rapport-general-votes-${overview.generatedAt.slice(0, 10)}`);
}
