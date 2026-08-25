import jsPDF from "jspdf";

export type ReceiptItem = { name: string; qty: number; price: number };

export type ReceiptData = {
  orderId: string;
  date: Date;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  address: string;
  items: ReceiptItem[];
  total: number;
  methodLabel: string;
  paymentId?: string;
};

const PRIMARY: [number, number, number] = [0, 71, 171];   // matches the site's --primary blue
const SECONDARY: [number, number, number] = [230, 178, 0]; // matches the site's --secondary gold
const MUTED: [number, number, number] = [110, 110, 120];

const fcfa = (n: number) => `${n.toLocaleString("fr-FR")} FCFA`;

export function downloadReceipt(data: ReceiptData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 18;
  let y = 0;

  // ── Header band ──
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pageWidth, 32, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Boutique Nguon 2026", marginX, 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Reçu de commande", marginX, 23);

  doc.setFontSize(10);
  doc.text(data.orderId, pageWidth - marginX, 15, { align: "right" });
  doc.setFontSize(8.5);
  doc.text(
    data.date.toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" }),
    pageWidth - marginX, 21, { align: "right" }
  );

  y = 44;

  // ── Customer block ──
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text("Client", marginX, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(data.clientName, marginX, y); y += 5;
  doc.text(data.clientPhone, marginX, y); y += 5;
  if (data.clientEmail) { doc.text(data.clientEmail, marginX, y); y += 5; }
  const addressLines = doc.splitTextToSize(data.address, pageWidth - marginX * 2);
  doc.text(addressLines, marginX, y); y += addressLines.length * 5 + 6;

  // ── Items table ── (right-aligned column edges, spaced wide enough that
  // "45 000 FCFA"-sized values never collide between adjacent columns)
  const colQty   = pageWidth - marginX - 95;  // centered
  const colPrice = pageWidth - marginX - 48;  // right edge
  const colTotal = pageWidth - marginX;       // right edge
  const nameMaxWidth = colQty - (marginX + 3) - 12;

  doc.setDrawColor(220, 220, 225);
  doc.setFillColor(245, 246, 250);
  doc.rect(marginX, y, pageWidth - marginX * 2, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("ARTICLE", marginX + 3, y + 5.5);
  doc.text("QTÉ", colQty, y + 5.5, { align: "center" });
  doc.text("PRIX", colPrice, y + 5.5, { align: "right" });
  doc.text("TOTAL", colTotal, y + 5.5, { align: "right" });
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  data.items.forEach((item, i) => {
    const rowH = 8;
    if (i % 2 === 1) {
      doc.setFillColor(250, 250, 252);
      doc.rect(marginX, y, pageWidth - marginX * 2, rowH, "F");
    }
    const nameLines = doc.splitTextToSize(item.name, nameMaxWidth);
    doc.text(nameLines[0], marginX + 3, y + 5.5);
    doc.text(String(item.qty), colQty, y + 5.5, { align: "center" });
    doc.text(fcfa(item.price), colPrice, y + 5.5, { align: "right" });
    doc.text(fcfa(item.price * item.qty), colTotal, y + 5.5, { align: "right" });
    y += rowH;
  });

  y += 2;
  doc.setDrawColor(...PRIMARY);
  doc.setLineWidth(0.6);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 10;

  // ── Total ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...PRIMARY);
  doc.text("TOTAL PAYÉ", marginX, y);
  doc.text(fcfa(data.total), pageWidth - marginX, y, { align: "right" });
  y += 12;

  // ── Payment info ──
  doc.setDrawColor(230, 230, 235);
  doc.setLineWidth(0.3);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("PAIEMENT", marginX, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text(data.methodLabel, marginX, y);
  if (data.paymentId) {
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);
    doc.text(`Réf. transaction : ${data.paymentId}`, marginX, y + 5);
  }

  // ── Footer ──
  const footerY = doc.internal.pageSize.getHeight() - 22;
  doc.setDrawColor(...SECONDARY);
  doc.setLineWidth(0.8);
  doc.line(marginX, footerY, pageWidth - marginX, footerY);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(
    "Merci pour votre achat ! Cet article soutient directement les artisans et producteurs du Noun.",
    pageWidth / 2, footerY + 7, { align: "center" }
  );
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Boutique officielle — Nguon 2026, Foumban", pageWidth / 2, footerY + 12, { align: "center" });

  doc.save(`recu-${data.orderId}.pdf`);
}
