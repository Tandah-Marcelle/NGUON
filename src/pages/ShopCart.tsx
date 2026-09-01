import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowLeft,
  ShoppingBag, Check, ChevronRight, MapPin,
  CreditCard, AlertCircle, Loader2, Lock, Smartphone, Download,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";
import {
  initiateCollect, pollPaymentStatus, PaymentMethod, PaymentStatus,
  PAYMENT_METHOD_LABELS, PAYMENT_METHOD_LOGOS,
} from "@/lib/paymentService";
import { downloadReceipt, ReceiptData } from "@/lib/receipt";

const PAYMENT_METHOD_TO_BACKEND: Record<PaymentMethod, string> = {
  mobile_money: "MOBILE_MONEY",
  orange_money: "ORANGE_MONEY",
};

// ─── Steps: cart → info → payment → confirmation ─────────────────────────────
type Step = "cart" | "info" | "payment" | "done";

const STEPS: { key: Step; label: string }[] = [
  { key: "cart",    label: "Panier"      },
  { key: "info",    label: "Coordonnées" },
  { key: "payment", label: "Paiement"    },
  { key: "done",    label: "Confirmation"},
];

const StepBar = ({ current }: { current: Step }) => {
  const idx = STEPS.findIndex(s => s.key === current);
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={s.key} className="flex items-center gap-2 flex-1 last:flex-none">
            <div className={`flex items-center gap-2 ${active ? "text-primary font-black" : done ? "text-green-600 font-semibold" : "text-muted-foreground"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 ${
                active ? "border-primary bg-primary text-white" :
                done   ? "border-green-500 bg-green-500 text-white" :
                         "border-border bg-muted text-muted-foreground"
              }`}>
                {done ? <Check size={13} /> : i + 1}
              </div>
              <span className="text-xs hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px ${i < idx ? "bg-green-400" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

const ShopCart = () => {
  const { items, remove, updateQty, clear, total, count } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("cart");

  // Step 2 — info
  const [name,    setName]    = useState("");
  const [phone,   setPhone]   = useState("");
  const [email,   setEmail]   = useState("");
  const [address, setAddress] = useState("");

  // Step 3 — payment
  const [method,        setMethod]        = useState<PaymentMethod>("mobile_money");
  const [payerPhone,    setPayerPhone]    = useState("");
  const [payStatus,     setPayStatus]     = useState<PaymentStatus>("idle");
  const [payMessage,    setPayMessage]    = useState("");
  const [paymentId,     setPaymentId]     = useState("");
  const [payError,      setPayError]      = useState("");
  const [processing,    setProcessing]    = useState(false);
  const [ussdCode,      setUssdCode]      = useState("");
  // Snapshot of the cart total at payment time — the live `total` from useCart()
  // drops to 0 once clear() runs, so the confirmation screen can't read it live.
  const [paidTotal,     setPaidTotal]     = useState(0);
  const [receipt,       setReceipt]       = useState<ReceiptData | null>(null);

  const [savedOrderId, setSavedOrderId] = useState("");

  // ── Step 3: initiate payment via CamPay (MTN/Orange Mobile Money) ─────────
  //
  // The order is created up front, as PENDING, before the customer's phone is
  // even charged — using its real (server-issued) id as CamPay's
  // external_reference. That way the order always exists as a trackable
  // record, and BOTH the poll loop below and CamPay's webhook (which lands
  // server-to-server, independent of this browser tab) can finalize the same
  // order to PAID/FAILED, whichever arrives first. Previously the order was
  // only created after a successful poll, so a poll that failed to resolve
  // (network hiccup, closed tab, timeout) left a real, successful payment
  // with no order at all.
  const handlePay = async () => {
    setProcessing(true);
    setPayError("");
    setUssdCode("");

    let order: { id: string };
    try {
      order = await api.createShopOrder({
        clientName: name,
        clientPhone: phone,
        clientEmail: email || undefined,
        address,
        paymentMethod: PAYMENT_METHOD_TO_BACKEND[method],
        paymentStatus: "PENDING",
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          qty: i.qty,
          price: i.product.price,
        })),
      });
      setSavedOrderId(order.id);
    } catch {
      setPayStatus("failed");
      setPayError("Impossible d'enregistrer la commande. Veuillez réessayer.");
      setProcessing(false);
      return;
    }

    try {
      const collect = await initiateCollect({
        orderId: order.id,
        amount: total,
        customerPhone: payerPhone,
        description: `Boutique Nguon 2026 — ${count} article(s)`,
      });

      if (!collect.success || !collect.reference) {
        setPayStatus("failed");
        setPayError(collect.message ?? "Le paiement a échoué. Veuillez réessayer.");
        setProcessing(false);
        api.updateShopOrderStatus(order.id, { paymentStatus: "FAILED" }).catch(() => {});
        return;
      }

      setUssdCode(collect.ussdCode ?? "");
      setPayStatus("pending");
      setProcessing(false);
      setPaymentId(collect.reference);
      api.updateShopOrderStatus(order.id, { paymentStatus: "PROCESSING", paymentId: collect.reference }).catch(() => {});

      const result = await pollPaymentStatus(collect.reference);

      if (result.status === "paid") {
        setPayStatus("paid");
        setPaidTotal(total);

        const receiptData: ReceiptData = {
          orderId: order.id,
          date: new Date(),
          clientName: name,
          clientPhone: phone,
          clientEmail: email || undefined,
          address,
          items: items.map((i) => ({ name: i.product.name, qty: i.qty, price: i.product.price })),
          total,
          methodLabel: PAYMENT_METHOD_LABELS[method],
          paymentId: collect.reference,
        };

        try {
          await api.updateShopOrderStatus(order.id, { paymentStatus: "PAID", paymentId: collect.reference });
        } catch {
          // Payment already succeeded on CamPay's side — don't block the
          // confirmation screen. CamPay's webhook, once configured, can
          // reconcile this order's status independently if this call fails.
          toast.error("Le statut de la commande n'a pas pu être mis à jour côté serveur.");
        }

        setReceipt(receiptData);
        setStep("done");
        clear();
      } else {
        setPayStatus("failed");
        setPayError(result.message ?? "Le paiement a échoué. Veuillez réessayer.");
        api.updateShopOrderStatus(order.id, { paymentStatus: "FAILED" }).catch(() => {});
      }
    } catch {
      setPayStatus("failed");
      setPayError("Une erreur s'est produite. Veuillez réessayer.");
      setProcessing(false);
      api.updateShopOrderStatus(order.id, { paymentStatus: "FAILED" }).catch(() => {});
    }
  };

  // ── Confirmation page ─────────────────────────────────────────────────────
  if (step === "done") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-24 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md w-full"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
            >
              <Check size={48} className="text-green-600" />
            </motion.div>
            <h2 className="font-display text-3xl font-black text-foreground mb-3">Commande confirmée !</h2>
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-6 text-left space-y-1.5">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-2">Récapitulatif</p>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">N° commande</span><span className="font-black text-primary">{savedOrderId}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total payé</span><span className="font-black text-primary">{paidTotal.toLocaleString("fr-FR")} FCFA</span></div>
              <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">Méthode</span><span className="font-semibold flex items-center gap-1.5"><img src={PAYMENT_METHOD_LOGOS[method]} alt="" className="h-5 w-auto" /> {PAYMENT_METHOD_LABELS[method]}</span></div>
              {paymentId && <div className="flex justify-between text-sm"><span className="text-muted-foreground">ID paiement</span><span className="font-mono text-xs text-muted-foreground">{paymentId}</span></div>}
            </div>
            <p className="text-muted-foreground text-sm mb-6">{payMessage || "Vous recevrez une confirmation par SMS. Merci pour votre achat !"}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {receipt && (
                <button
                  onClick={() => downloadReceipt(receipt)}
                  className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary font-black px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition-all"
                >
                  <Download size={18} /> Télécharger le reçu
                </button>
              )}
              <Link to="/shop" className="inline-flex items-center justify-center gap-2 bg-primary text-white font-black px-6 py-3 rounded-xl hover:bg-primary/90 transition-all">
                <ShoppingBag size={18} /> Continuer mes achats
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden min-h-screen">
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-32 pb-6 bg-gradient-to-b from-primary/8 to-transparent">
        <div className="container mx-auto px-4">
          <ol className="flex items-center gap-2 text-sm">
            <li><Link to="/" className="text-primary font-semibold hover:underline">Accueil</Link></li>
            <li className="text-muted-foreground"><ChevronRight size={14} /></li>
            <li><Link to="/shop" className="text-primary font-semibold hover:underline">Boutique</Link></li>
            <li className="text-muted-foreground"><ChevronRight size={14} /></li>
            <li><span className="text-foreground font-bold">Panier ({count})</span></li>
          </ol>
        </div>
      </div>

      <main className="py-4 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">

          {/* Back + title */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => step === "cart" ? navigate("/shop") : setStep(step === "payment" ? "info" : "cart")}
              className="p-2 hover:bg-muted rounded-xl transition-colors"
            >
              <ArrowLeft size={22} />
            </button>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                {step === "cart" ? "Mon panier" : step === "info" ? "Vos coordonnées" : "Paiement"}
              </h1>
              <p className="text-muted-foreground mt-0.5">
                {step === "cart" ? `${count} article${count > 1 ? "s" : ""}` : ""}
              </p>
            </div>
          </div>

          {/* Step bar */}
          <StepBar current={step} />

          {/* Empty cart */}
          {items.length === 0 && step === "cart" && (
            <div className="text-center py-24">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart size={32} className="text-primary/50" />
              </div>
              <h3 className="font-display text-2xl font-black text-foreground mb-3">Votre panier est vide</h3>
              <p className="text-muted-foreground mb-6">Découvrez les produits de nos artisans partenaires</p>
              <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-white font-black px-6 py-3 rounded-xl hover:bg-primary/90 transition-all">
                <ShoppingBag size={18} /> Voir la boutique
              </Link>
            </div>
          )}

          {items.length > 0 && (
            <div className="grid lg:grid-cols-[1fr_360px] gap-10">

              {/* ── LEFT: step content ── */}
              <div>

                {/* STEP 1 — Cart items */}
                {step === "cart" && (
                  <AnimatePresence mode="wait">
                    <motion.div key="cart" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                      {items.map((item) => (
                        <motion.div
                          key={item.product.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center gap-4 bg-card border border-border/50 rounded-2xl p-4 hover:shadow-md transition-shadow"
                        >
                          <Link to={`/shop/product/${item.product.id}`} className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={item.product.media[0]?.presignedUrl ?? item.product.media[0]?.url} alt={item.product.name} className="w-full h-full object-cover hover:scale-110 transition-transform" />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link to={`/shop/product/${item.product.id}`} className="font-bold text-foreground hover:text-primary transition-colors line-clamp-1">{item.product.name}</Link>
                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs mt-0.5 mb-2">
                              <MapPin size={10} className="text-primary" /><span>{item.product.seller}</span>
                            </div>
                            <p className="font-black text-primary text-lg">{(item.product.price * item.qty).toLocaleString("fr-FR")} FCFA</p>
                            <p className="text-muted-foreground text-xs">{item.product.price.toLocaleString("fr-FR")} FCFA / {item.product.unit ?? "pièce"}</p>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <button onClick={() => remove(item.product.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1"><Trash2 size={16} /></button>
                            <div className="flex items-center gap-2">
                              <button onClick={() => updateQty(item.product.id, item.qty - 1)} className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted"><Minus size={13} /></button>
                              <span className="font-black text-base w-6 text-center">{item.qty}</span>
                              <button onClick={() => updateQty(item.product.id, item.qty + 1)} className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted"><Plus size={13} /></button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      <button onClick={clear} className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5 mt-1">
                        <Trash2 size={14} /> Vider le panier
                      </button>
                      <button
                        onClick={() => setStep("info")}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white font-black py-4 rounded-2xl hover:bg-primary/90 transition-all hover:shadow-lg text-base mt-4"
                      >
                        Continuer <ChevronRight size={18} />
                      </button>
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* STEP 2 — Info */}
                {step === "info" && (
                  <motion.div key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                      <h2 className="font-display text-xl font-black text-foreground">Vos informations</h2>
                      {[
                        { label: "Nom complet *", val: name, set: setName, placeholder: "Prénom et nom", type: "text" },
                        { label: "Téléphone *", val: phone, set: setPhone, placeholder: "+237 6XX XXX XXX", type: "tel" },
                        { label: "Email (optionnel)", val: email, set: setEmail, placeholder: "votre@email.com", type: "email" },
                      ].map(f => (
                        <div key={f.label}>
                          <label className="block text-xs font-black text-foreground/60 uppercase tracking-wider mb-1.5">{f.label}</label>
                          <input
                            required={f.label.includes("*")} type={f.type}
                            value={f.val} onChange={e => f.set(e.target.value)}
                            placeholder={f.placeholder}
                            className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                          />
                        </div>
                      ))}
                      <div>
                        <label className="block text-xs font-black text-foreground/60 uppercase tracking-wider mb-1.5">Adresse de livraison (optionnel)</label>
                        <textarea
                          rows={3} value={address} onChange={e => setAddress(e.target.value)}
                          placeholder="Ville, quartier, point de repère…"
                          className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                        />
                      </div>
                    </div>
                    <button
                      disabled={!name || !phone}
                      onClick={() => setStep("payment")}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-white font-black py-4 rounded-2xl hover:bg-primary/90 transition-all hover:shadow-lg text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Choisir le paiement <ChevronRight size={18} />
                    </button>
                  </motion.div>
                )}

                {/* STEP 3 — Payment */}
                {step === "payment" && (
                  <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">

                    {/* Method selector */}
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                      <h2 className="font-display text-xl font-black text-foreground">Mode de paiement</h2>
                      <div className="space-y-2">
                        {(["mobile_money", "orange_money"] as PaymentMethod[]).map(m => (
                          <label
                            key={m}
                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                              method === m ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                            }`}
                          >
                            <input type="radio" name="payment" value={m} checked={method === m} onChange={() => setMethod(m)} className="sr-only" />
                            <img src={PAYMENT_METHOD_LOGOS[m]} alt="" className="h-10 w-auto flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-bold text-foreground">{PAYMENT_METHOD_LABELS[m]}</p>
                              <p className="text-xs text-muted-foreground">
                                {m === "mobile_money" ? "MTN MoMo — paiement via votre numéro MTN" : "Orange Money — paiement via votre numéro Orange"}
                              </p>
                            </div>
                            {method === m && <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"><Check size={12} className="text-white" /></div>}
                          </label>
                        ))}
                      </div>

                      {/* Mobile number field */}
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-1">
                        <label className="block text-xs font-black text-foreground/60 uppercase tracking-wider mb-1.5">
                          Numéro {method === "mobile_money" ? "MTN" : "Orange"} *
                        </label>
                        <input
                          required value={payerPhone} onChange={e => setPayerPhone(e.target.value)}
                          placeholder="+237 6XX XXX XXX"
                          className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                        />
                        <p className="text-xs text-muted-foreground mt-1.5">
                          Vous recevrez une demande de confirmation sur ce numéro.
                        </p>
                      </motion.div>

                      {/* Security note */}
                      <div className="flex items-start gap-2.5 bg-muted/50 rounded-xl p-3">
                        <Lock size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">
                          Paiement sécurisé via CamPay (MTN Mobile Money / Orange Money). Vos données ne sont jamais stockées.
                        </p>
                      </div>
                    </div>

                    {/* Error */}
                    {payError && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 text-sm font-semibold">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        {payError}
                      </motion.div>
                    )}

                    {/* Processing indicator */}
                    {payStatus === "pending" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3 bg-primary/10 border border-primary/20 text-primary rounded-xl px-4 py-3 text-sm font-semibold">
                        <Loader2 size={16} className="animate-spin flex-shrink-0 mt-0.5" />
                        <div>
                          <p>Confirmez le paiement sur votre téléphone…</p>
                          {ussdCode && (
                            <p className="flex items-center gap-1.5 text-xs font-normal text-primary/80 mt-1">
                              <Smartphone size={12} /> Composez <span className="font-mono font-bold">{ussdCode}</span> si vous n'avez pas reçu de demande.
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* PAY button */}
                    <button
                      onClick={handlePay}
                      disabled={processing || payStatus === "pending" || !payerPhone}
                      className="w-full flex items-center justify-center gap-3 bg-secondary text-black font-black py-5 rounded-2xl hover:bg-secondary/90 transition-all hover:shadow-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? (
                        <><Loader2 size={20} className="animate-spin" /> Traitement…</>
                      ) : (
                        <><CreditCard size={20} /> Payer {total.toLocaleString("fr-FR")} FCFA</>
                      )}
                    </button>
                    <p className="text-center text-xs text-muted-foreground">
                      En cliquant sur "Payer", vous acceptez les conditions générales de vente de la Boutique Nguon 2026.
                    </p>
                  </motion.div>
                )}
              </div>

              {/* ── RIGHT: order summary (always visible) ── */}
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-2xl p-6 sticky top-28">
                  <h2 className="font-display text-lg font-black text-foreground mb-4">Récapitulatif</h2>
                  <div className="space-y-2.5 mb-4">
                    {items.map(item => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground truncate max-w-[180px]">{item.product.name} × {item.qty}</span>
                        <span className="font-semibold flex-shrink-0 ml-2">{(item.product.price * item.qty).toLocaleString("fr-FR")} FCFA</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3 space-y-1.5">
                    <div className="flex justify-between text-sm text-muted-foreground"><span>Sous-total</span><span>{total.toLocaleString("fr-FR")} FCFA</span></div>
                    <div className="flex justify-between text-sm text-muted-foreground"><span>Livraison</span><span className="text-green-600 font-semibold">À confirmer</span></div>
                    <div className="flex justify-between items-baseline pt-1 border-t border-border mt-1">
                      <span className="font-black text-foreground">Total</span>
                      <span className="font-display text-2xl font-black text-primary">{total.toLocaleString("fr-FR")} <span className="text-sm">FCFA</span></span>
                    </div>
                  </div>
                  {step !== "cart" && (
                    <div className="mt-4 pt-4 border-t border-border space-y-1.5">
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-2">Livraison à</p>
                      {name    && <p className="text-sm font-bold text-foreground">{name}</p>}
                      {phone   && <p className="text-sm text-muted-foreground">{phone}</p>}
                      {address && <p className="text-sm text-muted-foreground">{address}</p>}
                      {step === "payment" && <button onClick={() => setStep("info")} className="text-xs text-primary hover:underline mt-1">Modifier</button>}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopCart;
