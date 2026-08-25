import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, ShoppingBag, MapPin, Phone,
  ChevronLeft, ChevronRight, Check, BadgeCheck, ArrowLeft,
  Sparkles, Plus, Minus, CreditCard,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { loadShopCategories, labelOf, iconOf, Product } from "@/data/shopData";
import { api } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import WhatsAppOrderButton from "@/components/shop/WhatsAppOrderButton";

// ─── Media gallery ─────────────────────────────────────────────────────────────
const Gallery = ({ media, name }: { media: Product["media"]; name: string }) => {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const prev = () => setActive((a) => (a - 1 + media.length) % media.length);
  const next = () => setActive((a) => (a + 1) % media.length);

  if (media.length === 0) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-primary/5 aspect-[4/3] flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <ShoppingBag size={40} className="opacity-40" />
        <span className="text-sm font-semibold">Image non disponible</span>
      </div>
    );
  }

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden bg-black/5 aspect-[4/3] group">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={media[active].presignedUrl ?? media[active].url}
            alt={media[active].alt ?? name}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full object-cover cursor-zoom-in"
            onClick={() => setLightbox(true)}
          />
        </AnimatePresence>
        {media.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60">
              <ChevronLeft size={18} />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60">
              <ChevronRight size={18} />
            </button>
          </>
        )}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {active + 1} / {media.length}
        </div>
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="flex gap-2 mt-3">
          {media.map((m, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${i === active ? "border-primary scale-105" : "border-transparent opacity-60 hover:opacity-100"}`}>
              <img src={m.presignedUrl ?? m.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/92 flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
          >
            <motion.img
              src={media[active].presignedUrl ?? media[active].url}
              alt={media[active].alt}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="max-w-full max-h-full object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={() => setLightbox(false)} className="absolute top-5 right-5 text-white/70 hover:text-white text-2xl font-bold">✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Related card ───────────────────────────────────────────────────────────────
const RelatedCard = ({ product }: { product: Product }) => (
  <Link
    to={`/shop/product/${product.id}`}
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    className="group flex items-center gap-4 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
  >
    <div className="w-16 h-14 rounded-lg overflow-hidden flex-shrink-0">
      <img src={product.media[0]?.presignedUrl ?? product.media[0]?.url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">{product.name}</p>
      <p className="text-xs font-black text-primary">{product.price.toLocaleString("fr-FR")} FCFA</p>
    </div>
    <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary flex-shrink-0" />
  </Link>
);

// ─── Buy panel ─────────────────────────────────────────────────────────────────
const BuyPanel = ({ product }: { product: Product }) => {
  const { add, items } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [waHover, setWaHover] = useState(false);
  const cartItem = items.find((i) => i.product.id === product.id);
  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null;

  const handleAdd = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    // Add to cart then go directly to payment step
    add(product, qty);
    navigate("/shop/cart?step=payment");
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden lg:sticky lg:top-28">
      {/* Price */}
      <div className="bg-primary px-6 py-5">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-4xl font-black text-white">{product.price.toLocaleString("fr-FR")}</span>
          <span className="text-white/80 text-base font-semibold">FCFA</span>
          {product.unit && <span className="text-white/60 text-sm ml-1">/ {product.unit}</span>}
        </div>
        {product.comparePrice && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-white/50 text-sm line-through">{product.comparePrice.toLocaleString("fr-FR")} FCFA</span>
            <span className="bg-destructive text-white text-xs font-black px-2 py-0.5 rounded-full">-{discount}%</span>
          </div>
        )}
        <div className={`text-xs font-semibold mt-2 ${product.inStock ? "text-green-300" : "text-red-300"}`}>
          {product.inStock
            ? product.stockQty && product.stockQty < 5
              ? `⚡ Plus que ${product.stockQty} en stock`
              : "✓ En stock — livraison rapide"
            : "✗ Rupture de stock"}
        </div>
      </div>

      <div className="p-6 space-y-3">
        {/* Qty picker */}
        {product.inStock && (
          <div>
            <p className="text-xs font-black text-foreground/60 uppercase tracking-wider mb-2">Quantité</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors">
                <Minus size={16} />
              </button>
              <span className="font-black text-xl w-8 text-center">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stockQty ?? 99, qty + 1))}
                className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors">
                <Plus size={16} />
              </button>
              {cartItem && (
                <span className="text-xs text-muted-foreground ml-1">{cartItem.qty} déjà dans le panier</span>
              )}
            </div>
          </div>
        )}

        {/* ── PRIMARY: Payer maintenant ── */}
        <div className="relative h-14">
          <button
            onClick={handleBuyNow}
            disabled={!product.inStock}
            className={`absolute left-0 top-0 h-14 flex items-center justify-center bg-secondary text-black font-black rounded-xl hover:bg-secondary/90 transition-all duration-300 ease-out hover:shadow-xl text-base disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${
              waHover ? "w-14 px-0" : "w-[calc(100%-64px)] gap-2"
            }`}
          >
            <CreditCard size={18} className="flex-shrink-0" />
            <span className={`whitespace-nowrap overflow-hidden transition-[max-width,opacity] duration-200 ${
              waHover ? "max-w-0 opacity-0" : "max-w-[220px] opacity-100"
            }`}>
              Payer maintenant
            </span>
          </button>
          {product.whatsapp && (
            <WhatsAppOrderButton
              phone={product.whatsapp}
              message={`Bonjour, je suis intéressé(e) par votre produit : ${product.name}`}
              onHoverChange={setWaHover}
            />
          )}
        </div>

        {/* ── SECONDARY: Add to cart ── */}
        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          className={`w-full flex items-center justify-center gap-2 font-black py-3 rounded-xl transition-all duration-300 text-sm border-2 ${
            added
              ? "border-green-500 bg-green-50 text-green-700"
              : "border-primary text-primary hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          }`}
        >
          {added ? <><Check size={16} /> Ajouté au panier</> : <><ShoppingCart size={16} /> Ajouter au panier</>}
        </button>

        {product.phone && (
          <a href={`tel:${product.phone}`}
            className="w-full flex items-center justify-center gap-2 bg-muted text-foreground font-semibold py-2.5 rounded-xl hover:bg-muted/70 transition-all text-sm">
            <Phone size={15} /> Appeler directement
          </a>
        )}

        {/* Seller info */}
        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
          <p className="text-xs font-black text-primary uppercase tracking-wider mb-1">Vendu par</p>
          <p className="font-bold text-foreground">{product.seller}</p>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs mt-1">
            <MapPin size={11} className="text-primary" />
            <span>{product.sellerLocation}</span>
          </div>
          <div className="flex items-center gap-1.5 text-green-600 text-xs mt-1 font-semibold">
            <BadgeCheck size={12} /> Vendeur vérifié Nguon 2026
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">Livraison disponible · Nguon 2026</p>
      </div>
    </div>
  );
};

// ─── Detail page ────────────────────────────────────────────────────────────────
const ShopProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null | undefined>(undefined); // undefined = loading, null = not found
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    loadShopCategories();
    const numericId = Number(id);
    if (!id || Number.isNaN(numericId)) { setProduct(null); return; }

    setProduct(undefined);
    api.getShopProductById(numericId)
      .then(async (p: Product) => {
        setProduct(p);
        const all: Product[] = await api.getShopProducts();
        setRelated(all.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4));
      })
      .catch(() => setProduct(null));
  }, [id]);

  if (product === undefined) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-24">
            <p className="text-muted-foreground text-xl mb-4">Produit introuvable.</p>
            <Link to="/shop" className="text-primary font-bold hover:underline">← Retour à la boutique</Link>
          </div>
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
          <nav aria-label="breadcrumb">
            <ol className="flex items-center gap-2 text-sm flex-wrap">
              <li><Link to="/" className="text-primary font-semibold hover:underline">Accueil</Link></li>
              <li className="text-muted-foreground"><ChevronRight size={14} /></li>
              <li><Link to="/shop" className="text-primary font-semibold hover:underline">Boutique</Link></li>
              <li className="text-muted-foreground"><ChevronRight size={14} /></li>
              <li><span className="text-foreground font-bold truncate max-w-[200px] inline-block">{product.name}</span></li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="py-4 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_380px] gap-12">

            {/* LEFT */}
            <div>
              {/* Back */}
              <button onClick={() => navigate("/shop")}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-semibold mb-6">
                <ArrowLeft size={16} /> Retour à la boutique
              </button>

              {/* Header */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-sm font-black bg-primary/10 text-primary px-4 py-1.5 rounded-full flex items-center gap-1.5">
                    <span className="text-base">{iconOf(product.category)}</span>
                    {labelOf(product.category)}
                  </span>
                  {product.badge && (
                    <span className={`text-sm font-black px-4 py-1.5 rounded-full flex items-center gap-1.5 ${
                      product.badge === "Exclusif Nguon" ? "bg-secondary text-black" :
                      product.badge === "Nouveau" ? "bg-primary text-white" : "bg-destructive text-white"
                    }`}>
                      <Sparkles size={12} /> {product.badge}
                    </span>
                  )}
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-black text-foreground mb-2">{product.name}</h1>
                <p className="text-secondary font-semibold italic text-lg mb-1">{product.tagline}</p>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <MapPin size={13} className="text-primary" />
                  <span>{product.seller} · {product.sellerLocation}</span>
                </div>
              </motion.div>

              {/* Gallery */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
                <Gallery media={product.media} name={product.name} />
              </motion.div>

              {/* Description */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
                <h2 className="font-display text-xl font-black text-foreground mb-4 flex items-center gap-2">
                  <span className="w-6 h-1 bg-primary rounded-full" /> Description
                </h2>
                <p className="text-foreground/80 leading-relaxed">{product.description}</p>
              </motion.div>

              {/* Tags */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
                <h2 className="font-display text-xl font-black text-foreground mb-4 flex items-center gap-2">
                  <span className="w-6 h-1 bg-secondary rounded-full" /> Mots-clés
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span key={tag} className="text-sm bg-primary/10 border border-primary/20 text-primary font-semibold px-3 py-1.5 rounded-full">#{tag}</span>
                  ))}
                </div>
              </motion.div>

              {/* Buy panel — inline on mobile, right before the festival banner */}
              <div className="lg:hidden mb-8">
                <BuyPanel product={product} />
              </div>

              {/* Festival banner */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-white flex items-start gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <p className="font-black text-lg mb-1">Boutique officielle Nguon 2026</p>
                  <p className="text-white/80 text-sm">Cet article est vendu par un artisan ou producteur partenaire du festival. Votre achat soutient directement l'économie locale de Foumban.</p>
                </div>
              </motion.div>

              {/* Related */}
              {related.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <h2 className="font-display text-xl font-black text-foreground mb-4 flex items-center gap-2">
                    <span className="w-6 h-1 bg-primary rounded-full" /> Articles similaires
                  </h2>
                  <div className="space-y-3">
                    {related.map((r) => <RelatedCard key={r.id} product={r} />)}
                  </div>
                  <div className="mt-4 text-center">
                    <Link to="/shop" className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline">
                      Voir tous les produits <ChevronRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>

            {/* RIGHT — sticky buy panel (desktop only) */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hidden lg:block">
              <BuyPanel product={product} />
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShopProductDetail;
