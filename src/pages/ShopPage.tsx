import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag, ShoppingCart, Star, MapPin, ArrowRight,
  Sparkles, ChevronLeft, ChevronRight, CalendarDays,
  Search, SlidersHorizontal, ChevronDown, X, BadgeCheck,
  Plus, Minus,
} from "lucide-react";import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Product, ProductCategory, ShopCategory,
  loadShopCategories, labelOf, iconOf,
} from "@/data/shopData";
import { api } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { CategoryIcon } from "@/components/FaIconPicker";

// ─── Hero slides ──────────────────────────────────────────────────────────────
import masksImg      from "@/assets/masks.png";
import artisanImg    from "@/assets/artisan.jpg";
import tradbg2       from "@/assets/tradbg2.jpg";
import cultureCeremony from "@/assets/culture-ceremony.jpg";
import patrimoine    from "@/assets/patrimoine.jpeg";

// NOTE: these hero CTAs and the DIVIDER_IMAGES map below target specific category
// *keys*. Categories are now admin-editable — if one of these keys is renamed or
// deleted, the matching hero CTA / divider image just becomes a no-op (falls back
// to "all products"), it won't crash.
const HERO_SLIDES = [
  {
    image: masksImg,
    eyebrow: "Boutique Nguon 2026",
    heading: "L'artisanat Bamoun à portée de main",
    sub: "Masques, sculptures, textiles… Repartez avec un morceau du Royaume.",
    cta: "Découvrir l'artisanat",
    cat: "artisanat" as ProductCategory,
  },
  {
    image: tradbg2,
    eyebrow: "Vêtements & Textiles",
    heading: "Portez les couleurs du Nguon",
    sub: "Boubous royaux, pagnes Ndop authentiques tissés à la main à Foumban.",
    cta: "Voir les vêtements",
    cat: "vetements" as ProductCategory,
  },
  {
    image: artisanImg,
    eyebrow: "Gastronomie du Noun",
    heading: "Les saveurs du terroir Bamoun",
    sub: "Miel du Mont Mbapit, café arabica du Noun — des produits d'exception.",
    cta: "Voir les produits",
    cat: "gastronomie" as ProductCategory,
  },
  {
    image: cultureCeremony,
    eyebrow: "Décoration & Culture",
    heading: "Des œuvres pour sublimer votre intérieur",
    sub: "Bronzes fondus, plaques sculptées — l'art royal Bamoun chez vous.",
    cta: "Explorer la boutique",
    cat: undefined,
  },
  {
    image: patrimoine,
    eyebrow: "Édition spéciale Nguon 2026",
    heading: "Souvenirs exclusifs de la 549ème édition",
    sub: "Des pièces uniques créées pour cette édition historique célébrant 5 ans de règne.",
    cta: "Voir les exclusivités",
    cat: undefined,
  },
];

// ─── Full-screen hero ─────────────────────────────────────────────────────────
const ShopHero = ({
  onCategorySelect,
}: { onCategorySelect: (c: ProductCategory | "all") => void }) => {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
  };
  useEffect(() => {
    if (!paused) startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused]);

  const goTo = (i: number) => { setSlide(i); startTimer(); };
  const prev = () => goTo((slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const next = () => goTo((slide + 1) % HERO_SLIDES.length);
  const cur = HERO_SLIDES[slide];

  return (
    <section
      className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={slide}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img src={cur.image} alt="" className="w-full h-full object-cover select-none" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end pb-28 px-6 md:px-16 lg:px-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-secondary/90 text-black text-xs font-black px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest shadow-lg">
              <Sparkles size={11} /> {cur.eyebrow}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-5 drop-shadow-2xl">
              {cur.heading}
            </h1>
            <p className="text-white/85 text-base md:text-xl font-medium mb-8 max-w-xl leading-relaxed">
              {cur.sub}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  onCategorySelect(cur.cat ?? "all");
                  document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2.5 font-black text-base px-7 py-3.5 rounded-xl shadow-xl transition-all hover:scale-105 hover:shadow-2xl bg-primary text-white hover:bg-primary/90"
              >
                <ShoppingBag size={18} /> {cur.cta}
              </button>
              <button
                onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 text-white/80 font-bold text-sm border border-white/30 px-5 py-3.5 rounded-xl hover:bg-white/10 transition-all"
              >
                Tout explorer <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <motion.div
          key={`p-${slide}`}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: paused ? 0 : 5, ease: "linear" }}
          className="h-full bg-secondary"
        />
      </div>

      {/* Arrows + dots */}
      <div className="absolute bottom-8 right-6 md:right-16 flex items-center gap-3">
        <button onClick={prev} className="w-9 h-9 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-all">
          <ChevronLeft size={18} />
        </button>
        <div className="flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full ${i === slide ? "w-7 h-2.5 bg-secondary" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
        <button onClick={next} className="w-9 h-9 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-all">
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
};

// ─── Cart mini-badge (floating) ───────────────────────────────────────────────
const CartBadge = () => {
  const { count, total } = useCart();
  if (count === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-24 right-6 z-50"
    >
      <Link
        to="/shop/cart"
        className="flex items-center gap-2 bg-primary text-white font-black px-4 py-3 rounded-2xl shadow-2xl hover:bg-primary/90 transition-all hover:scale-105"
      >
        <ShoppingCart size={20} />
        <div className="flex flex-col leading-none">
          <span className="text-xs font-black">{count} article{count > 1 ? "s" : ""}</span>
          <span className="text-[10px] text-white/70">{total.toLocaleString("fr-FR")} FCFA</span>
        </div>
        <span className="hidden sm:inline text-sm font-black ml-1">→ Panier</span>
      </Link>
    </motion.div>
  );
};

// ─── Cart inline strip (visible when cart has items) ─────────────────────────
const CartStrip = () => {
  const { count, total, items } = useCart();
  if (count === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-primary/10 border-b border-primary/20"
    >
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <ShoppingCart size={16} className="text-primary flex-shrink-0" />
          <span className="text-sm font-black text-primary">
            {count} article{count > 1 ? "s" : ""} dans le panier
          </span>
          <span className="text-sm text-muted-foreground hidden sm:inline">·</span>
          <span className="text-sm font-black text-foreground hidden sm:inline">
            {total.toLocaleString("fr-FR")} FCFA
          </span>
          {/* First 3 thumbnails */}
          <div className="flex -space-x-2 ml-2">
            {items.slice(0, 3).map((item) => (
              <img
                key={item.product.id}
                src={item.product.media[0]?.presignedUrl ?? item.product.media[0]?.url}
                alt={item.product.name}
                className="w-7 h-7 rounded-full border-2 border-white object-cover"
              />
            ))}
            {items.length > 3 && (
              <div className="w-7 h-7 rounded-full border-2 border-white bg-primary text-white text-[10px] font-black flex items-center justify-center">
                +{items.length - 3}
              </div>
            )}
          </div>
        </div>
        <Link
          to="/shop/cart"
          className="flex-shrink-0 flex items-center gap-1.5 bg-primary text-white font-black text-xs px-4 py-2 rounded-xl hover:bg-primary/90 transition-all hover:shadow-md"
        >
          <ShoppingCart size={13} /> Voir le panier
        </Link>
      </div>
    </motion.div>
  );
};

// ─── Category splash divider ──────────────────────────────────────────────────
const CategoryDivider = ({ label, emoji, image }: { label: string; emoji: string; image: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7 }}
    className="relative rounded-3xl overflow-hidden my-14 h-48 md:h-64"
  >
    <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 bg-primary/78" />
    <div className="absolute inset-0 opacity-15" style={{
      backgroundImage: "repeating-linear-gradient(-45deg,hsl(48 100% 50%) 0,hsl(48 100% 50%) 1px,transparent 0,transparent 12px)"
    }} />
    <div className="absolute inset-3 rounded-2xl border-2 border-secondary/40 pointer-events-none" />
    <div className="relative z-10 h-full flex flex-col items-center justify-center gap-3 text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
        <CategoryIcon icon={emoji} className="w-7 h-7 text-white" />
      </div>
      <h3 className="font-display text-2xl md:text-4xl font-black text-white drop-shadow-lg">{label}</h3>
      <div className="flex items-center gap-3">
        <div className="w-10 h-0.5 bg-secondary/60" />
        <div className="w-2 h-2 rounded-full bg-secondary" />
        <div className="w-10 h-0.5 bg-secondary/60" />
      </div>
    </div>
  </motion.div>
);

// ─── Product card ─────────────────────────────────────────────────────────────
const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const { add, items } = useCart();
  const [imgIdx, setImgIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const images = product.media.filter((m) => m.type === "image");
  const cartItem = items.find((i) => i.product.id === product.id);
  const navigate = useNavigate();

  const startCycle = () => {
    if (images.length > 1)
      intervalRef.current = setInterval(() => setImgIdx((p) => (p + 1) % images.length), 1400);
  };
  const stopCycle = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setImgIdx(0);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/shop/product/${product.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={startCycle}
      onMouseLeave={stopCycle}
      onClick={() => { navigate(`/shop/product/${product.id}`); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      className="group flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:border-secondary transition-all duration-500 bg-card border border-border/50 cursor-pointer"
    >
      {/* Image area */}
      <div className="relative h-64 overflow-hidden bg-primary/5 flex-shrink-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={imgIdx}
            src={images[imgIdx]?.presignedUrl ?? images[imgIdx]?.url}
            alt={images[imgIdx]?.alt ?? product.name}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </AnimatePresence>

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          {product.badge ? (
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full shadow ${
              product.badge === "Exclusif Nguon" ? "bg-secondary text-black" :
              product.badge === "Nouveau" ? "bg-primary text-white" :
              "bg-destructive text-white"
            }`}>
              {product.badge}
            </span>
          ) : <span />}
          {discount && (
            <span className="text-[10px] font-black bg-destructive text-white px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Image dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={() => setImgIdx(i)}
                className={`rounded-full transition-all duration-300 ${i === imgIdx ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`}
              />
            ))}
          </div>
        )}

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-black text-sm bg-black/80 px-4 py-2 rounded-xl">Rupture de stock</span>
          </div>
        )}
      </div>

      {/* Info panel — blue theme */}
      <div className="flex flex-col flex-1 p-5 bg-card border-t-4 border-primary group-hover:border-secondary transition-colors duration-300">
        {/* Category label */}
        <p className="text-secondary text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
          <CategoryIcon icon={iconOf(product.category)} className="w-3 h-3" />
          {labelOf(product.category)}
        </p>

        {/* Name */}
        <h3 className="font-display text-lg font-black text-foreground leading-tight mb-0.5 group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>

        {/* Tagline */}
        <p className="text-secondary text-xs font-semibold italic mb-3 group-hover:text-foreground transition-colors duration-300">
          {product.tagline}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3 bg-primary/8 rounded-xl px-3 py-2">
          <span className="font-display text-2xl font-black text-primary leading-none group-hover:text-secondary transition-colors">
            {product.price.toLocaleString("fr-FR")}
          </span>
          <span className="text-primary/70 text-xs font-semibold group-hover:text-foreground/60 transition-colors">FCFA</span>
          {product.comparePrice && (
            <span className="text-muted-foreground text-xs line-through ml-1">
              {product.comparePrice.toLocaleString("fr-FR")}
            </span>
          )}
          {product.unit && <span className="text-muted-foreground text-[10px] ml-auto">/ {product.unit}</span>}
        </div>

        {/* Seller */}
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-4">
          <MapPin size={11} className="text-primary flex-shrink-0" />
          <span className="truncate">{product.sellerLocation.split(",")[0]}</span>
          <span className="ml-auto flex items-center gap-1 text-green-600 font-semibold">
            <BadgeCheck size={11} /> Vendeur vérifié
          </span>
        </div>

        {/* CTAs — stop propagation so they don't double-navigate */}
        <div className="flex gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`flex-1 flex items-center justify-center gap-1.5 font-black text-xs py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg ${
              added
                ? "bg-green-500 text-white"
                : "bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            {added
              ? <><BadgeCheck size={13} /> Ajouté !</>
              : <><ShoppingCart size={13} /> {cartItem ? `${cartItem.qty} au panier` : "Ajouter"}</>
            }
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center gap-1.5 border-2 border-primary text-primary font-black text-xs py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all"
          >
            <ShoppingBag size={13} /> Acheter
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Product card skeleton (loading placeholder, same footprint as ProductCard) ──
const ProductCardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden bg-card border border-border/50">
    <div className="h-64 bg-slate-200 dark:bg-white/5 animate-pulse" />
    <div className="p-5 space-y-3 border-t-4 border-primary/20">
      <div className="h-2.5 w-20 rounded-full bg-slate-200 dark:bg-white/5 animate-pulse" />
      <div className="h-4 w-3/4 rounded-full bg-slate-200 dark:bg-white/5 animate-pulse" />
      <div className="h-3 w-1/2 rounded-full bg-slate-200 dark:bg-white/5 animate-pulse" />
      <div className="h-10 rounded-xl bg-slate-200 dark:bg-white/5 animate-pulse" />
      <div className="flex gap-2">
        <div className="h-9 flex-1 rounded-xl bg-slate-200 dark:bg-white/5 animate-pulse" />
        <div className="h-9 flex-1 rounded-xl bg-slate-200 dark:bg-white/5 animate-pulse" />
      </div>
    </div>
  </div>
);

// ─── Filter bar ───────────────────────────────────────────────────────────────
const PAGE_SIZE = 8;

const FilterBar = ({
  query, setQuery,
  category, setCategory,
  sort, setSort,
  counts, categories, categoriesLoading,
}: {
  query: string; setQuery: (v: string) => void;
  category: ProductCategory | "all"; setCategory: (v: ProductCategory | "all") => void;
  sort: "default" | "price_asc" | "price_desc"; setSort: (v: "default" | "price_asc" | "price_desc") => void;
  counts: Record<string, number>;
  categories: ShopCategory[];
  categoriesLoading: boolean;
}) => {
  const [sortOpen, setSortOpen] = useState(false);
  const sorts = [
    { key: "default" as const, label: "Recommandés" },
    { key: "price_asc" as const, label: "Prix croissant" },
    { key: "price_desc" as const, label: "Prix décroissant" },
  ];

  return (
    <div className="sticky top-[72px] z-40 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher un produit, artisan, matière…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category pills — scrollable on mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 flex-shrink-0 hide-scrollbar">
            {categoriesLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-20 h-9 rounded-xl bg-slate-200 dark:bg-white/5 animate-pulse" />
              ))
            ) : (
              <>
                <button
                  onClick={() => setCategory("all")}
                  className={`flex-shrink-0 text-xs font-black px-3.5 py-2.5 rounded-xl border transition-all ${
                    category === "all" ? "bg-primary text-white border-primary shadow-md" : "bg-card text-foreground/70 border-border hover:border-primary/40"
                  }`}
                >
                  Tout ({counts.all ?? 0})
                </button>
                {categories.map((c) => (
                  <button key={c.key} onClick={() => setCategory(c.key)}
                    className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-black px-3.5 py-2.5 rounded-xl border transition-all ${
                      category === c.key ? "bg-primary text-white border-primary shadow-md" : "bg-card text-foreground/70 border-border hover:border-primary/40"
                    }`}
                  >
                    <CategoryIcon icon={c.icon} className="w-3 h-3" />
                    {c.label.split(" ")[0]}
                    {counts[c.key] !== undefined && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ml-0.5 ${category === c.key ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                        {counts[c.key]}
                      </span>
                    )}
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Sort */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-2 text-xs font-black px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground/70 hover:border-primary/40 transition-all"
            >
              <SlidersHorizontal size={13} />
              <span className="hidden sm:inline">{sorts.find(s => s.key === sort)?.label}</span>
              <ChevronDown size={12} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1.5 w-48 bg-card border border-border rounded-xl shadow-xl py-1.5 z-50"
                >
                  {sorts.map(({ key, label }) => (
                    <button key={key} onClick={() => { setSort(key); setSortOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors ${sort === key ? "text-primary bg-primary/8 font-black" : "text-foreground/70 hover:bg-muted"}`}
                    >
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Paginated section ────────────────────────────────────────────────────────
const PaginatedProducts = ({ items, title, emoji, dividerImage }: {
  items: Product[]; title: string; emoji: string; dividerImage?: string;
}) => {
  const [page, setPage] = useState(1);
  const visible = items.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < items.length;

  useEffect(() => { setPage(1); }, [items.length]);

  if (items.length === 0) return null;

  return (
    <section className="mb-4">
      {dividerImage && (
        <CategoryDivider label={title} emoji={emoji} image={dividerImage} />
      )}
      {!dividerImage && (
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <CategoryIcon icon={emoji} className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-black text-foreground">{title}</h2>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent ml-4 hidden md:block" />
          <span className="text-muted-foreground text-sm font-semibold">{items.length} article{items.length > 1 ? "s" : ""}</span>
        </div>
      )}
      {dividerImage && (
        <div className="flex items-center justify-between mb-8">
          <p className="text-muted-foreground text-sm font-semibold">{items.length} article{items.length > 1 ? "s" : ""}</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => <ProductCard key={p.id} product={p} index={i % PAGE_SIZE} />)}
        </AnimatePresence>
      </div>

      {hasMore && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 mt-12"
        >
          <p className="text-muted-foreground text-sm">
            <span className="font-black text-foreground">{visible.length}</span> sur{" "}
            <span className="font-black text-foreground">{items.length}</span> produits
          </p>
          <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(visible.length / items.length) * 100}%` }} />
          </div>
          <motion.button
            onClick={() => setPage((p) => p + 1)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center gap-3 font-black text-base px-10 py-4 rounded-2xl shadow-lg border-2 bg-primary text-white border-primary hover:bg-white hover:text-primary transition-all duration-300"
          >
            Voir plus
            <span className="flex flex-col gap-[2px] group-hover:translate-y-0.5 transition-transform">
              <ChevronDown size={16} className="opacity-70" />
              <ChevronDown size={16} className="-mt-2" />
            </span>
          </motion.button>
        </motion.div>
      )}
    </section>
  );
};

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = ({ query, onClear }: { query: string; onClear: () => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
      <ShoppingBag size={28} className="text-primary/50" />
    </div>
    <h3 className="font-display text-xl font-black text-foreground mb-2">Aucun produit trouvé</h3>
    <p className="text-muted-foreground text-sm mb-6">
      Aucun article ne correspond à <span className="font-bold text-foreground">"{query}"</span>
    </p>
    <button onClick={onClear} className="inline-flex items-center gap-2 bg-primary text-white font-black px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-all text-sm">
      <X size={14} /> Effacer la recherche
    </button>
  </motion.div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const DIVIDER_IMAGES: Partial<Record<ProductCategory, string>> = {
  artisanat: masksImg,
  vetements: tradbg2,
  gastronomie: cultureCeremony,
  decoration: patrimoine,
};

const ShopPage = () => {
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"default" | "price_asc" | "price_desc">("default");

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    api.getShopProducts()
      .then(setAllProducts)
      .finally(() => setProductsLoading(false));
    loadShopCategories()
      .then(setCategories)
      .finally(() => setCategoriesLoading(false));
  }, []);

  const filter = (list: Product[]) => {
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.seller.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      labelOf(p.category).toLowerCase().includes(q)
    );
  };

  const sortFn = (list: Product[]) => {
    if (sort === "price_asc") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") return [...list].sort((a, b) => b.price - a.price);
    return [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  };

  const allCats = useMemo(() => categories.map((c) => c.key), [categories]);

  // Build per-category filtered+sorted lists
  const categoryLists = useMemo(() => {
    const base = filter(allProducts);
    return Object.fromEntries(
      allCats.map((c) => [c, sortFn(base.filter((p) => p.category === c))])
    );
  }, [query, sort, allProducts, allCats]);

  const allFiltered = useMemo(() => sortFn(filter(allProducts)), [query, sort, allProducts]);
  const activeCatList = useMemo(() =>
    category === "all" ? null : sortFn(filter(allProducts.filter((p) => p.category === category))),
    [category, query, sort, allProducts]
  );

  // Counts for filter bar
  const counts = useMemo(() => ({
    all: filter(allProducts).length,
    ...Object.fromEntries(allCats.map((c) => [c, filter(allProducts.filter((p) => p.category === c)).length])),
  }), [query, allProducts, allCats]);

  const isEmpty = !productsLoading && (activeCatList ?? allFiltered).length === 0;

  return (
    <div className="overflow-x-hidden min-h-screen">
      <Navbar />
      <CartBadge />

      {/* Hero */}
      <ShopHero onCategorySelect={setCategory} />

      {/* CTA strip */}
      <div className="bg-primary py-7 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg,hsl(48 100% 50%) 0,hsl(48 100% 50%) 1px,transparent 0,transparent 50%)", backgroundSize: "12px 12px" }} />
        <div className="container mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays size={15} className="text-secondary" />
              <span className="text-secondary text-xs font-black uppercase tracking-widest">04 — 13 Décembre 2026 · Foumban</span>
            </div>
            <h2 className="text-white font-display text-2xl font-black">Livraison disponible — commandez avant le festival</h2>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 bg-secondary text-black font-black px-5 py-2.5 rounded-xl hover:bg-secondary/90 transition-all text-sm">
              <ShoppingBag size={15} /> Commencer mes achats
            </button>
            <Link to="/shop/cart" className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white font-black px-5 py-2.5 rounded-xl hover:bg-white/25 transition-all text-sm">
              <ShoppingCart size={15} /> Mon panier
            </Link>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar
        query={query} setQuery={setQuery}
        category={category} setCategory={setCategory}
        sort={sort} setSort={setSort}
        counts={counts}
        categories={categories}
        categoriesLoading={categoriesLoading}
      />

      <main id="products" className="py-16 md:py-20">
        <div className="container mx-auto px-4">

          {productsLoading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          )}

          {isEmpty && <EmptyState query={query} onClear={() => setQuery("")} />}

          {/* Single category view */}
          {!productsLoading && !isEmpty && activeCatList && (
            <PaginatedProducts
              items={activeCatList}
              title={labelOf(category as ProductCategory)}
              emoji={iconOf(category as ProductCategory)}
            />
          )}

          {/* All categories view — one section per category with divider */}
          {!productsLoading && !isEmpty && !activeCatList && allCats.map((cat, i) => {
            const list = categoryLists[cat] ?? [];
            if (list.length === 0) return null;
            return (
              <PaginatedProducts
                key={cat}
                items={list}
                title={labelOf(cat)}
                emoji={iconOf(cat)}
                dividerImage={i === 0 ? undefined : DIVIDER_IMAGES[cat]}
              />
            );
          })}
        </div>
      </main>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden py-20 px-4">
        <img src={masksImg} alt="" className="absolute inset-0 w-full h-full object-cover scale-110" />
        <div className="absolute inset-0 bg-[#0047AB] opacity-90" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle,hsl(48 100% 50%) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="relative z-10 container mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/40 text-secondary text-xs font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            <ShoppingBag size={12} /> Boutique Nguon 2026
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
            Repartez avec un morceau du Royaume
          </h2>
          <p className="text-white/75 text-base md:text-lg mb-10 max-w-2xl mx-auto">
            Chaque achat soutient directement les artisans et producteurs locaux de Foumban et du Noun.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2.5 bg-secondary text-black font-black px-8 py-4 rounded-xl hover:bg-secondary/90 transition-all hover:scale-105 hover:shadow-2xl text-base">
              <ShoppingBag size={20} /> Voir tous les produits
            </button>
            <Link to="/shop/cart"
              className="inline-flex items-center gap-2.5 bg-white/10 border border-white/30 text-white font-black px-8 py-4 rounded-xl hover:bg-white/20 transition-all text-base">
              <ShoppingCart size={20} /> Mon panier
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default ShopPage;
