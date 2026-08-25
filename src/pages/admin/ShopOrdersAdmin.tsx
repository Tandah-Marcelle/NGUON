import { useState, useEffect, useRef } from "react";
import { Search, Eye, Check, Clock, X, MessageCircle, CreditCard, RefreshCw, Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { api } from "@/lib/api";
import logo2 from "@/assets/logo2.png";

// ─── Types — these mirror the backend's enum values (uppercase), decoupled from
// the storefront's payment-stub types in lib/paymentService.ts (lowercase). ────
type OrderItem = { productName: string; qty: number; price: number };
type OrderStatus = "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED";
type PaymentStatus = "IDLE" | "PENDING" | "PROCESSING" | "PAID" | "FAILED" | "REFUNDED";
type PaymentMethod = "MOBILE_MONEY" | "ORANGE_MONEY" | "CARD" | "CASH_ON_DELIVERY";

type Order = {
  id: string;
  createdAt: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentId?: string;
};

// ─── Config maps ───────────────────────────────────────────────────────────────
const ORDER_STATUS: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  PENDING:   { label: "En attente",  color: "bg-yellow-100 text-yellow-700 border-yellow-200",  icon: Clock },
  CONFIRMED: { label: "Confirmée",   color: "bg-blue-100 text-blue-700 border-blue-200",        icon: Check },
  DELIVERED: { label: "Livrée",      color: "bg-green-100 text-green-700 border-green-200",     icon: Check },
  CANCELLED: { label: "Annulée",     color: "bg-red-100 text-red-700 border-red-200",           icon: X },
};

const PAY_STATUS: Record<PaymentStatus, { label: string; color: string; icon: React.ElementType }> = {
  IDLE:       { label: "Non initié",  color: "bg-slate-100 text-slate-500 border-slate-200",     icon: Clock },
  PENDING:    { label: "En attente",  color: "bg-yellow-100 text-yellow-700 border-yellow-200",  icon: Clock },
  PROCESSING: { label: "En cours",   color: "bg-blue-100 text-blue-700 border-blue-200",         icon: RefreshCw },
  PAID:       { label: "Payé",        color: "bg-green-100 text-green-700 border-green-200",     icon: Check },
  FAILED:     { label: "Échoué",      color: "bg-red-100 text-red-700 border-red-200",           icon: X },
  REFUNDED:   { label: "Remboursé",  color: "bg-purple-100 text-purple-700 border-purple-200",  icon: RefreshCw },
};

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  MOBILE_MONEY: "MTN Mobile Money",
  ORANGE_MONEY: "Orange Money",
  CARD: "Carte bancaire",
  CASH_ON_DELIVERY: "Paiement à la livraison",
};

const PAYMENT_METHOD_ICONS: Record<PaymentMethod, string> = {
  MOBILE_MONEY: "📱",
  ORANGE_MONEY: "🟠",
  CARD: "💳",
  CASH_ON_DELIVERY: "💵",
};

// ─── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ cfg }: { cfg: { label: string; color: string; icon: React.ElementType } }) => {
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.color}`}>
      <Icon size={10} /> {cfg.label}
    </span>
  );
};

// ─── Printable orders — plain inline styles only: this markup is copied into a
// bare popup window with no Tailwind stylesheet loaded, so utility classes
// wouldn't render (mirrors the pattern in admin/CandidatDetail.tsx). ──────────
function PT({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: "1.5px", color: "#003B5C", borderLeft: "3px solid #f5c842", paddingLeft: "8px", marginBottom: "8px", marginTop: "4px" }}>{children}</div>;
}

function PrintableOrder({ order }: { order: Order }) {
  return (
    <div style={{ border: "1px solid #e5eaf0", borderRadius: "8px", padding: "16px 18px", marginBottom: "16px", breakInside: "avoid" as const }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
        <div style={{ fontSize: "14px", fontWeight: 900, color: "#003B5C" }}>{order.id}</div>
        <div style={{ fontSize: "10px", color: "#888" }}>{new Date(order.createdAt).toLocaleDateString("fr-FR")}</div>
      </div>

      <PT>Client</PT>
      <div style={{ fontSize: "11px", color: "#1a1a2e", marginBottom: "12px", lineHeight: 1.6 }}>
        <div style={{ fontWeight: 700 }}>{order.clientName}</div>
        <div>{order.clientPhone}{order.clientEmail ? ` · ${order.clientEmail}` : ""}</div>
        <div>{order.address}</div>
      </div>

      <PT>Articles</PT>
      <div style={{ marginBottom: "12px" }}>
        {order.items.map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", padding: "4px 0", borderBottom: i < order.items.length - 1 ? "1px solid #f0f2f5" : "none" }}>
            <span>{item.productName} × {item.qty}</span>
            <span style={{ fontWeight: 700 }}>{(item.price * item.qty).toLocaleString("fr-FR")} FCFA</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "2px solid #003B5C" }}>
        <div style={{ fontSize: "10px", color: "#555" }}>
          {PAYMENT_METHOD_ICONS[order.paymentMethod]} {PAYMENT_METHOD_LABELS[order.paymentMethod]} · {PAY_STATUS[order.paymentStatus].label} · {ORDER_STATUS[order.status].label}
        </div>
        <div style={{ fontSize: "14px", fontWeight: 900, color: "#003B5C" }}>{order.total.toLocaleString("fr-FR")} FCFA</div>
      </div>
    </div>
  );
}

function PrintableOrders({ orders }: { orders: Order[] }) {
  const total = orders.reduce((s, o) => s + o.total, 0);
  return (
    <div style={{ fontFamily: "Montserrat, Arial, sans-serif", background: "#fff", color: "#1a1a2e", padding: "32px 36px", maxWidth: "760px", margin: "0 auto", fontSize: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", borderBottom: "3px solid #003B5C", paddingBottom: "16px", marginBottom: "20px", gap: "16px" }}>
        <img src={logo2} alt="NGUON" style={{ height: "64px", width: "auto" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "18px", fontWeight: 900, color: "#003B5C", letterSpacing: "1px" }}>FONDATION NGUON</div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#b8860b", marginTop: "2px" }}>COMMANDES — BOUTIQUE NGUON 2026</div>
        </div>
        <div style={{ textAlign: "right", fontSize: "10px", color: "#888" }}>
          <div>{orders.length} commande{orders.length > 1 ? "s" : ""}</div>
          <div>Imprimé le : {new Date().toLocaleDateString("fr-FR")}</div>
        </div>
      </div>

      {orders.map(order => <PrintableOrder key={order.id} order={order} />)}

      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "10px", borderTop: "2px solid #003B5C" }}>
        <div style={{ fontSize: "13px", fontWeight: 900, color: "#003B5C" }}>Total : {total.toLocaleString("fr-FR")} FCFA</div>
      </div>

      <div style={{ marginTop: "24px", borderTop: "2px solid #003B5C", paddingTop: "10px", textAlign: "center", fontSize: "9px", color: "#aaa" }}>
        NGUON 2026 — Fondation NGUON · Foumban, Cameroun · www.nguonevents.com
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function ShopOrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [payFilter, setPayFilter] = useState<PaymentStatus | "all">("all");
  const [selected, setSelected] = useState<Order | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [printing, setPrinting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getShopOrders()
      .then(setOrders)
      .catch(() => toast.error("Impossible de charger les commandes"))
      .finally(() => setLoading(false));
  }, []);

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      const updated = await api.updateShopOrderStatus(id, { status });
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
      setSelected(prev => prev?.id === id ? updated : prev);
    } catch {
      toast.error("La mise à jour a échoué");
    }
  };

  const updatePayStatus = async (id: string, paymentStatus: PaymentStatus) => {
    try {
      const updated = await api.updateShopOrderStatus(id, { paymentStatus });
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
      setSelected(prev => prev?.id === id ? updated : prev);
    } catch {
      toast.error("La mise à jour a échoué");
    }
  };

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const mSearch = !q || o.clientName.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.clientPhone.includes(q);
    const mStatus = statusFilter === "all" || o.status === statusFilter;
    const mPay = payFilter === "all" || o.paymentStatus === payFilter;
    return mSearch && mStatus && mPay;
  });

  const revenueCollected = orders.filter(o => o.paymentStatus === "PAID").reduce((s, o) => s + o.total, 0);

  const checkedOrders = filtered.filter(o => checkedIds.has(o.id));
  const allFilteredChecked = filtered.length > 0 && checkedIds.size === filtered.length;

  const toggleChecked = (id: string) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setCheckedIds(allFilteredChecked ? new Set() : new Set(filtered.map(o => o.id)));
  };

  const printOrders = () => {
    if (!printRef.current || checkedOrders.length === 0) return;
    setPrinting(true);
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) { setPrinting(false); return; }
    win.document.write(`
      <html><head><title>Commandes — Boutique Nguon 2026</title>
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Commandes</h1>
          <p className="text-muted-foreground mt-1">Gérez les commandes et le statut des paiements.</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" onClick={toggleSelectAll} disabled={filtered.length === 0}>
            {allFilteredChecked ? "Tout désélectionner" : "Tout sélectionner"}
          </Button>
          <Button onClick={printOrders} disabled={checkedOrders.length === 0 || printing} className="gap-2">
            <Printer size={16} /> Imprimer {checkedOrders.length > 0 ? `(${checkedOrders.length})` : ""}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border/50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-foreground">{orders.length}</div>
          <div className="text-xs text-muted-foreground font-semibold mt-0.5">Total commandes</div>
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-green-600">{orders.filter(o => o.paymentStatus === "PAID").length}</div>
          <div className="text-xs text-muted-foreground font-semibold mt-0.5">Paiements reçus</div>
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-yellow-600">{orders.filter(o => o.paymentStatus === "PENDING").length}</div>
          <div className="text-xs text-muted-foreground font-semibold mt-0.5">Paiements en attente</div>
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-4 text-center">
          <div className="text-lg font-black text-primary">{revenueCollected.toLocaleString("fr-FR")}</div>
          <div className="text-xs text-muted-foreground font-semibold mt-0.5">FCFA encaissés</div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Nom, n° commande, téléphone…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-black text-muted-foreground self-center">Statut:</span>
          {(["all", "PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"] as const).map(s => (
            <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(s)}>
              {s === "all" ? "Toutes" : ORDER_STATUS[s].label}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-black text-muted-foreground self-center">Paiement:</span>
          {(["all", "PAID", "PENDING", "FAILED", "PROCESSING", "REFUNDED"] as const).map(s => (
            <Button key={s} variant={payFilter === s ? "default" : "outline"} size="sm" onClick={() => setPayFilter(s)}>
              {s === "all" ? "Tous" : PAY_STATUS[s].label}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 size={22} className="animate-spin" />
        </div>
      )}
      {!loading && (
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-muted/50 border-b border-border text-xs font-black uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 w-10">
                <input type="checkbox" checked={allFilteredChecked} onChange={toggleSelectAll} className="w-4 h-4 rounded" aria-label="Tout sélectionner" />
              </th>
              <th className="px-4 py-3">Commande</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Paiement</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">Aucune commande trouvée</td></tr>
            ) : filtered.map(order => (
              <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-4">
                  <input type="checkbox" checked={checkedIds.has(order.id)} onChange={() => toggleChecked(order.id)} className="w-4 h-4 rounded" aria-label={`Sélectionner ${order.id}`} />
                </td>
                <td className="px-4 py-4 font-mono text-sm font-bold text-primary">{order.id}</td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-foreground text-sm">{order.clientName}</p>
                  <p className="text-xs text-muted-foreground">{order.clientPhone}</p>
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</td>
                <td className="px-4 py-4 font-black text-primary text-sm">{order.total.toLocaleString("fr-FR")} FCFA</td>
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    <StatusBadge cfg={PAY_STATUS[order.paymentStatus]} />
                    <p className="text-[10px] text-muted-foreground">
                      {PAYMENT_METHOD_ICONS[order.paymentMethod]} {PAYMENT_METHOD_LABELS[order.paymentMethod]}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4"><StatusBadge cfg={ORDER_STATUS[order.status]} /></td>
                <td className="px-4 py-4 text-right">
                  <Button variant="outline" size="sm" onClick={() => setSelected(order)} className="gap-1">
                    <Eye size={13} /> Voir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {/* Detail modal */}
      <Dialog open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-black">Commande {selected?.id}</DialogTitle>
            <DialogDescription>Détails, paiement et gestion du statut</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-5 pt-1">

              {/* Client info */}
              <div className="bg-muted/40 rounded-xl p-4 space-y-1.5">
                <p className="font-bold text-foreground">{selected.clientName}</p>
                <p className="text-sm text-muted-foreground">{selected.clientPhone}</p>
                {selected.clientEmail && <p className="text-sm text-muted-foreground">{selected.clientEmail}</p>}
                <p className="text-sm text-muted-foreground">{selected.address}</p>
                <p className="text-xs text-muted-foreground">Commandé le {new Date(selected.createdAt).toLocaleDateString("fr-FR")}</p>
              </div>

              {/* Payment info */}
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 space-y-2">
                <p className="text-xs font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard size={12} /> Paiement
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{PAYMENT_METHOD_ICONS[selected.paymentMethod]} {PAYMENT_METHOD_LABELS[selected.paymentMethod]}</p>
                    {selected.paymentId && <p className="text-xs font-mono text-muted-foreground">{selected.paymentId}</p>}
                  </div>
                  <StatusBadge cfg={PAY_STATUS[selected.paymentStatus]} />
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <p className="text-xs font-black text-muted-foreground uppercase tracking-wider">Articles</p>
                {selected.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-foreground">{item.productName} × {item.qty}</span>
                    <span className="font-black text-primary">{(item.price * item.qty).toLocaleString("fr-FR")} FCFA</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 flex justify-between font-black">
                  <span>Total</span>
                  <span className="text-primary text-lg">{selected.total.toLocaleString("fr-FR")} FCFA</span>
                </div>
              </div>

              {/* Change payment status */}
              <div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-2">Statut du paiement</p>
                <div className="flex flex-wrap gap-2">
                  {(["IDLE", "PENDING", "PROCESSING", "PAID", "FAILED", "REFUNDED"] as PaymentStatus[]).map(s => (
                    <button key={s} onClick={() => updatePayStatus(selected.id, s)}
                      className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl border-2 transition-all ${
                        selected.paymentStatus === s ? "border-primary bg-primary text-white" : "border-border text-muted-foreground hover:border-primary/40"
                      }`}>
                      {PAY_STATUS[s].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Change order status */}
              <div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-2">Statut de la commande</p>
                <div className="flex flex-wrap gap-2">
                  {(["PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"] as OrderStatus[]).map(s => {
                    const cfg = ORDER_STATUS[s];
                    return (
                      <button key={s} onClick={() => updateOrderStatus(selected.id, s)}
                        className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl border-2 transition-all ${
                          selected.status === s ? "border-primary bg-primary text-white" : "border-border text-muted-foreground hover:border-primary/40"
                        }`}>
                        <cfg.icon size={11} /> {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2 border-t border-border">
                <a
                  href={`https://wa.me/${selected.clientPhone.replace(/\D/g, "")}?text=Bonjour ${selected.clientName},%20votre%20commande%20${selected.id}%20est%20${ORDER_STATUS[selected.status].label.toLowerCase()}.%20Paiement%20:%20${PAY_STATUS[selected.paymentStatus].label}.`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white font-black py-2.5 rounded-xl hover:bg-green-600 transition-all text-sm"
                >
                  <MessageCircle size={15} /> Notifier WhatsApp
                </a>
                <Button variant="outline" className="flex-1" onClick={() => setSelected(null)}>Fermer</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Hidden printable — copied into a popup window by printOrders() */}
      <div className="hidden">
        <div ref={printRef}>
          <PrintableOrders orders={checkedOrders} />
        </div>
      </div>
    </div>
  );
}
