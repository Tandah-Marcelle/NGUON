import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Hotel, UtensilsCrossed, Star, MapPin,
  ArrowRight, Sparkles, ChevronLeft, ChevronRight,
  CalendarDays, BadgeCheck, Search, X, SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProperties, Property } from "@/data/bookingData";

import foumbanLandscape from "@/assets/foumban-landscape.jpg";
import palaceInterior from "@/assets/palace-interior.jpg";
import tradbg2 from "@/assets/tradbg2.jpg";
import cultureCeremony from "@/assets/culture-ceremony.jpg";
import artisanImg from "@/assets/artisan.jpg";
import masksImg from "@/assets/masks.png";
import masks2Img from "@/assets/masks2.png";
import dancers from "@/assets/dancers.png";

// ─── Hero slides ──────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    image: foumbanLandscape,
    eyebrow: "Nguon 2026 · Foumban",
    heading: "Trouvez les meilleurs hôtels",
    sub: "Des adresses soigneusement sélectionnées au cœur de la cité impériale.",
    cta: "Explorer les hôtels",
    ctaHref: "hotels",
    ctaVariant: "hotel" as const,
  },
  {
    image: palaceInterior,
    eyebrow: "04 — 13 Décembre 2026",
    heading: "Réservez à temps pour l'événement",
    sub: "Les meilleures chambres partent vite. Garantissez votre séjour avant la 549ème édition.",
    cta: "Réserver maintenant",
    ctaHref: "hotels",
    ctaVariant: "hotel" as const,
  },
  {
    image: cultureCeremony,
    eyebrow: "Gastronomie Bamoun",
    heading: "Déjeuner dans les meilleurs restaurants",
    sub: "Nkui, Kondré, Eru… Savourez la cuisine ancestrale Bamoun dans les meilleures tables de Foumban.",
    cta: "Voir les restaurants",
    ctaHref: "restaurants",
    ctaVariant: "restaurant" as const,
  },
  {
    image: artisanImg,
    eyebrow: "Village Gastronomique · Nguon",
    heading: "Une expérience culinaire unique",
    sub: "Le Village Gastronomique réunit les saveurs de tout le Noun en un seul lieu festif.",
    cta: "Découvrir les tables",
    ctaHref: "restaurants",
    ctaVariant: "restaurant" as const,
  },
  {
    image: tradbg2,
    eyebrow: "Patrimoine & Confort",
    heading: "Vivez le Nguon de l'intérieur",
    sub: "Hôtels, résidences et cases traditionnelles — choisissez votre hébergement idéal.",
    cta: "Voir les hébergements",
    ctaHref: "hotels",
    ctaVariant: "hotel" as const,
  },
];

// ─── Full-screen hero ─────────────────────────────────────────────────────────
const BookingHero = ({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: "all" | "hotel" | "restaurant";
  onCategoryChange: (c: "all" | "hotel" | "restaurant") => void;
}) => {
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
  const current = HERO_SLIDES[slide];

  const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const categories = [
    { key: "all" as const, label: "Tout voir" },
    { key: "hotel" as const, label: "Hôtels", icon: Hotel },
    { key: "restaurant" as const, label: "Restaurants", icon: UtensilsCrossed },
  ];

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
          <img src={current.image} alt="" className="w-full h-full object-cover select-none" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />

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
              <Sparkles size={11} /> {current.eyebrow}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-5 drop-shadow-2xl">
              {current.heading}
            </h1>
            <p className="text-white/85 text-base md:text-xl font-medium mb-8 max-w-xl leading-relaxed">
              {current.sub}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => scroll(current.ctaHref)}
                className={`inline-flex items-center gap-2.5 font-black text-base px-7 py-3.5 rounded-xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  current.ctaVariant === "hotel"
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-secondary text-black hover:bg-secondary/90"
                }`}
              >
                {current.ctaVariant === "hotel" ? <Hotel size={18} /> : <UtensilsCrossed size={18} />}
                {current.cta}
              </button>
              <button
                onClick={() => scroll("hotels")}
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

      {/* Category pills */}
      <div className="absolute bottom-8 left-6 md:left-16 flex items-center gap-2">
        {categories.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => onCategoryChange(key)}
            className={`flex items-center gap-1.5 text-xs font-black px-4 py-2 rounded-full border transition-all duration-300 ${
              activeCategory === key
                ? "bg-white text-primary border-white shadow-lg"
                : "bg-white/10 text-white/80 border-white/20 backdrop-blur-sm hover:bg-white/20"
            }`}
          >
            {Icon && <Icon size={12} />}{label}
          </button>
        ))}
      </div>
    </section>
  );
};

// ─── CTA strip ────────────────────────────────────────────────────────────────
const CTAStrip = () => (
  <div className="bg-primary py-8 px-4 relative overflow-hidden">
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg,hsl(48 100% 50%) 0,hsl(48 100% 50%) 1px,transparent 0,transparent 50%)", backgroundSize: "12px 12px" }} />
    <div className="container mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="text-center md:text-left">
        <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
          <CalendarDays size={16} className="text-secondary" />
          <span className="text-secondary text-xs font-black uppercase tracking-widest">04 — 13 Décembre 2026</span>
        </div>
        <h2 className="text-white font-display text-2xl md:text-3xl font-black">
          Réservez tôt — les meilleures places partent vite
        </h2>
      </div>
      <div className="flex flex-wrap justify-center gap-3 flex-shrink-0">
        <button onClick={() => document.getElementById("hotels")?.scrollIntoView({ behavior: "smooth" })}
          className="inline-flex items-center gap-2 bg-secondary text-black font-black px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all text-sm">
          <Hotel size={16} /> Hôtels
        </button>
        <button onClick={() => document.getElementById("restaurants")?.scrollIntoView({ behavior: "smooth" })}
          className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white font-black px-6 py-3 rounded-xl hover:bg-white/25 transition-all text-sm">
          <UtensilsCrossed size={16} /> Restaurants
        </button>
      </div>
    </div>
  </div>
);

// ─── Traditional splash divider ───────────────────────────────────────────────
const TraditionalDivider = ({
  image, label, icon: Icon, color,
}: {
  image: string; label: string; icon: typeof Hotel; color: "primary" | "secondary";
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7 }}
    className="relative rounded-3xl overflow-hidden my-16 h-56 md:h-72"
  >
    {/* Background photo */}
    <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />

    {/* Overlay */}
    <div className={`absolute inset-0 ${color === "primary" ? "bg-primary/75" : "bg-black/65"}`} />

    {/* Traditional pattern overlay — diagonal golden lines */}
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          hsl(48 100% 50%) 0,
          hsl(48 100% 50%) 1px,
          transparent 0,
          transparent 12px
        )`,
      }}
    />

    {/* Decorative border */}
    <div className="absolute inset-3 rounded-2xl border-2 border-secondary/40 pointer-events-none" />
    <div className="absolute inset-5 rounded-xl border border-white/10 pointer-events-none" />

    {/* Content */}
    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 gap-4">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl border-2 ${color === "primary" ? "bg-secondary border-secondary/50" : "bg-secondary border-secondary/50"}`}>
        <Icon size={28} className="text-black" />
      </div>
      <div>
        <p className="text-secondary text-xs font-black uppercase tracking-[0.3em] mb-1">Nguon 2026</p>
        <h3 className="font-display text-2xl md:text-4xl font-black text-white drop-shadow-lg">{label}</h3>
      </div>
      {/* Gold decorative line */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-0.5 bg-secondary/60" />
        <div className="w-2 h-2 rounded-full bg-secondary" />
        <div className="w-12 h-0.5 bg-secondary/60" />
      </div>
    </div>
  </motion.div>
);

// ─── Star rating ──────────────────────────────────────────────────────────────
const StarRating = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={14} className={i < count ? "fill-secondary text-secondary" : "text-muted-foreground/30"} />
    ))}
  </div>
);

// ─── Property card — image top, white info panel below ────────────────────────
const PropertyCard = ({ property, index }: { property: Property; index: number }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const images = property.media.filter((m) => m.type === "image");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCycle = () => {
    if (images.length > 1)
      intervalRef.current = setInterval(() => setImgIndex((p) => (p + 1) % images.length), 1400);
  };
  const stopCycle = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setImgIndex(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.09 }}
      onMouseEnter={startCycle}
      onMouseLeave={stopCycle}
      className="group flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:border-secondary transition-all duration-500 bg-card border border-border/50"
    >
      {/* ── IMAGE AREA (tall, ~55% of card) ── */}
      <div className="relative h-56 sm:h-60 overflow-hidden flex-shrink-0 bg-primary/10">
        <AnimatePresence mode="wait">
          <motion.img
            key={imgIndex}
            src={images[imgIndex]?.url}
            alt={images[imgIndex]?.alt ?? property.name}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </AnimatePresence>

        {/* NO fade — clean hard edge to white panel */}

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          {property.featured ? (
            <span className="flex items-center gap-1 bg-secondary text-black text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
              <Sparkles size={9} /> Recommandé
            </span>
          ) : <span />}
          <span className="flex items-center gap-1 bg-black/55 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            {property.category === "hotel"
              ? <><Hotel size={10} /> Hôtel</>
              : <><UtensilsCrossed size={10} /> Restaurant</>
            }
          </span>
        </div>

        {/* Image dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={() => setImgIndex(i)}
                className={`rounded-full transition-all duration-300 ${i === imgIndex ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── BLUE-THEMED INFO PANEL ── */}
      <div className="flex flex-col flex-1 p-5 bg-card border-t-4 border-primary group-hover:border-secondary transition-colors duration-300">
        {/* Stars / cuisine label */}
        <div className="mb-2">
          {property.stars
            ? <StarRating count={property.stars} />
            : property.cuisine && (
              <p className="text-secondary text-[10px] font-black uppercase tracking-widest">{property.cuisine}</p>
            )
          }
        </div>

        {/* Name */}
        <h3 className="font-display text-lg font-black text-foreground leading-tight mb-0.5 group-hover:text-primary transition-colors duration-300">
          {property.name}
        </h3>

        {/* Tagline */}
        <p className="text-secondary text-xs font-semibold italic mb-4 group-hover:text-foreground transition-colors duration-300">{property.tagline}</p>

        {/* Price */}
        {property.priceFrom && (
          <div className="flex items-baseline gap-1.5 mb-3 bg-primary/8 rounded-xl px-3 py-2">
            <span className="text-primary/70 text-[10px] font-black uppercase tracking-wider group-hover:text-secondary/80 transition-colors duration-300">Dès</span>
            <span className="font-display text-2xl font-black text-primary leading-none group-hover:text-secondary transition-colors duration-300">{property.priceFrom}</span>
            <span className="text-primary/70 text-xs font-semibold group-hover:text-secondary/80 transition-colors duration-300">{property.priceUnit}</span>
          </div>
        )}

        {/* Location */}
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-4">
          <MapPin size={12} className="text-primary flex-shrink-0" />
          <span className="truncate">{property.address.split(",")[0]}</span>
        </div>

        {/* Feature pills — blue theme */}
        <div className="flex flex-wrap gap-1.5 mb-5 flex-1">
          {property.features.slice(0, 3).map((f) => (
            <span key={f} className="flex items-center gap-1 text-[10px] bg-primary/10 border border-primary/20 text-primary font-semibold px-2.5 py-1 rounded-full">
              <BadgeCheck size={9} className="text-secondary flex-shrink-0" /> {f}
            </span>
          ))}
          {property.features.length > 3 && (
            <span className="text-[10px] text-muted-foreground bg-muted font-semibold px-2.5 py-1 rounded-full">
              +{property.features.length - 3}
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          to={`/booking/${property.category}/${property.id}`}
          className={`flex items-center justify-center gap-2 w-full font-black text-sm py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg group/btn ${
            property.category === "hotel"
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-secondary text-black hover:bg-secondary/90"
          }`}
        >
          Voir les détails
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

// ─── Sticky search + filter bar ──────────────────────────────────────────────
const PAGE_SIZE = 8; // cards per page per category

const FilterBar = ({
  query, setQuery,
  category, setCategory,
  sort, setSort,
  totalHotels, totalRestaurants,
}: {
  query: string; setQuery: (v: string) => void;
  category: "all" | "hotel" | "restaurant"; setCategory: (v: "all" | "hotel" | "restaurant") => void;
  sort: "default" | "price_asc" | "price_desc" | "stars"; setSort: (v: typeof sort) => void;
  totalHotels: number; totalRestaurants: number;
}) => {
  const [open, setOpen] = useState(false);
  const categories = [
    { key: "all" as const,        label: "Tout",        icon: null },
    { key: "hotel" as const,      label: "Hôtels",      icon: Hotel,          count: totalHotels },
    { key: "restaurant" as const, label: "Restaurants", icon: UtensilsCrossed, count: totalRestaurants },
  ];
  const sorts = [
    { key: "default"    as const, label: "Recommandés en premier" },
    { key: "price_asc"  as const, label: "Prix croissant" },
    { key: "price_desc" as const, label: "Prix décroissant" },
    { key: "stars"      as const, label: "Meilleure étoile" },
  ];

  return (
    <div className="sticky top-[72px] z-40 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">

          {/* Search input */}
          <div className="relative flex-1 min-w-0">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher un hôtel, restaurant, quartier…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {categories.map(({ key, label, icon: Icon, count }) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`flex items-center gap-1.5 text-xs font-black px-3.5 py-2.5 rounded-xl border transition-all duration-200 ${
                  category === key
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-card text-foreground/70 border-border hover:border-primary/40 hover:text-primary"
                }`}
              >
                {Icon && <Icon size={12} />}
                {label}
                {count !== undefined && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ml-0.5 ${category === key ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-2 text-xs font-black px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground/70 hover:border-primary/40 hover:text-primary transition-all"
            >
              <SlidersHorizontal size={13} />
              <span className="hidden sm:inline">{sorts.find(s => s.key === sort)?.label ?? "Trier"}</span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1.5 w-52 bg-card border border-border rounded-xl shadow-xl py-1.5 z-50"
                >
                  {sorts.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => { setSort(key); setOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors ${sort === key ? "text-primary bg-primary/8 font-black" : "text-foreground/70 hover:bg-muted hover:text-foreground"}`}
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
const PaginatedSection = ({
  id, items, icon: Icon, eyebrow, title, color,
}: {
  id: string;
  items: Property[];
  icon: typeof Hotel;
  eyebrow: string;
  title: string;
  color: "primary" | "secondary";
}) => {
  const [page, setPage] = useState(1);
  const visible = items.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < items.length;

  // Reset page when items change (filter/search)
  useEffect(() => { setPage(1); }, [items.length]);

  if (items.length === 0) return null;

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="mb-4"
    >
      <SectionHeader icon={Icon} eyebrow={eyebrow} title={title} color={color} count={items.length} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i % PAGE_SIZE} />
          ))}
        </AnimatePresence>
      </div>

      {/* Load more button */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 mt-12"
        >
          {/* Progress indicator */}
          <p className="text-muted-foreground text-sm">
            <span className="font-black text-foreground">{visible.length}</span>
            {" "}sur{" "}
            <span className="font-black text-foreground">{items.length}</span>
            {" "}établissements affichés
          </p>
          <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${color === "primary" ? "bg-primary" : "bg-secondary"}`}
              style={{ width: `${(visible.length / items.length) * 100}%` }}
            />
          </div>

          {/* Prominent "Voir plus" button */}
          <motion.button
            onClick={() => setPage((p) => p + 1)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className={`group flex items-center gap-3 font-black text-base px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
              color === "primary"
                ? "bg-primary text-white border-primary hover:bg-white hover:text-primary"
                : "bg-secondary text-black border-secondary hover:bg-white hover:text-secondary"
            }`}
          >
            <span>Voir plus</span>
            {/* Animated double chevron */}
            <span className="flex flex-col gap-[2px] group-hover:translate-y-0.5 transition-transform duration-300">
              <ChevronDown size={16} className="opacity-70" />
              <ChevronDown size={16} className="-mt-2" />
            </span>
          </motion.button>
        </motion.div>
      )}

      {/* All loaded indicator */}
      {!hasMore && items.length > PAGE_SIZE && (
        <div className="flex items-center justify-center gap-3 mt-8 text-muted-foreground text-xs">
          <div className="h-px w-16 bg-border" />
          <span className="font-semibold">Tous les {items.length} établissements affichés</span>
          <div className="h-px w-16 bg-border" />
        </div>
      )}
    </motion.section>
  );
};

// ─── Updated section header (with count badge) ────────────────────────────────
const SectionHeader = ({ icon: Icon, eyebrow, title, color, count }: {
  icon: typeof Hotel; eyebrow: string; title: string; color: "primary" | "secondary"; count?: number;
}) => (
  <div className="flex items-center gap-5 mb-10">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${color === "primary" ? "bg-primary" : "bg-secondary"}`}>
      <Icon size={26} className={color === "primary" ? "text-white" : "text-black"} />
    </div>
    <div>
      <p className={`text-xs uppercase tracking-[0.3em] font-black ${color === "primary" ? "text-primary" : "text-secondary"}`}>{eyebrow}</p>
      <div className="flex items-center gap-2">
        <h2 className="font-display text-2xl md:text-3xl font-black text-foreground">{title}</h2>
        {count !== undefined && (
          <span className={`text-xs font-black px-2.5 py-1 rounded-full ${color === "primary" ? "bg-primary/10 text-primary" : "bg-secondary/20 text-secondary"}`}>
            {count}
          </span>
        )}
      </div>
    </div>
    <div className={`flex-1 h-px ml-4 hidden md:block ${color === "primary" ? "bg-gradient-to-r from-primary/30 to-transparent" : "bg-gradient-to-r from-secondary/40 to-transparent"}`} />
  </div>
);

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = ({ query, onClear }: { query: string; onClear: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-24"
  >
    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
      <Search size={28} className="text-primary/50" />
    </div>
    <h3 className="font-display text-xl font-black text-foreground mb-2">Aucun résultat trouvé</h3>
    <p className="text-muted-foreground text-sm mb-6">
      Aucun établissement ne correspond à <span className="font-bold text-foreground">"{query}"</span>
    </p>
    <button
      onClick={onClear}
      className="inline-flex items-center gap-2 bg-primary text-white font-black px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-all text-sm"
    >
      <X size={14} /> Effacer la recherche
    </button>
  </motion.div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const BookingPage = () => {
  const [activeCategory, setActiveCategory] = useState<"all" | "hotel" | "restaurant">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"default" | "price_asc" | "price_desc" | "stars">("default");

  const allHotels = getProperties("hotel");
  const allRestaurants = getProperties("restaurant");

  // Filter by search query
  const filter = (list: Property[]) => {
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.features.some((f) => f.toLowerCase().includes(q)) ||
      (p.cuisine?.toLowerCase().includes(q) ?? false)
    );
  };

  // Sort
  const sortFn = (list: Property[]): Property[] => {
    if (sort === "price_asc")
      return [...list].sort((a, b) => parseInt(a.priceFrom?.replace(/\s/g, "") ?? "0") - parseInt(b.priceFrom?.replace(/\s/g, "") ?? "0"));
    if (sort === "price_desc")
      return [...list].sort((a, b) => parseInt(b.priceFrom?.replace(/\s/g, "") ?? "0") - parseInt(a.priceFrom?.replace(/\s/g, "") ?? "0"));
    if (sort === "stars")
      return [...list].sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));
    // default: featured first
    return [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  };

  const hotels = useMemo(() => sortFn(filter(allHotels)), [query, sort, activeCategory]);
  const restaurants = useMemo(() => sortFn(filter(allRestaurants)), [query, sort, activeCategory]);

  const showHotels = activeCategory !== "restaurant";
  const showRestaurants = activeCategory !== "hotel";
  const isEmpty = (showHotels ? hotels.length : 0) + (showRestaurants ? restaurants.length : 0) === 0;

  // Sync hero category → filter bar
  const handleCategoryChange = (c: "all" | "hotel" | "restaurant") => {
    setActiveCategory(c);
    setTimeout(() => document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="overflow-x-hidden min-h-screen">
      <Navbar />

      {/* Hero */}
      <BookingHero activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />

      {/* CTA strip */}
      <CTAStrip />

      {/* Sticky filter bar */}
      <FilterBar
        query={query} setQuery={setQuery}
        category={activeCategory} setCategory={setActiveCategory}
        sort={sort} setSort={setSort}
        totalHotels={filter(allHotels).length}
        totalRestaurants={filter(allRestaurants).length}
      />

      <main id="listings" className="py-16 md:py-20">
        <div className="container mx-auto px-4">

          {/* Empty state */}
          {isEmpty && <EmptyState query={query} onClear={() => setQuery("")} />}

          {/* Hotels */}
          <AnimatePresence>
            {showHotels && hotels.length > 0 && (
              <PaginatedSection
                key="hotels" id="hotels"
                items={hotels}
                icon={Hotel} eyebrow="Hébergement" title="Hôtels & Résidences" color="primary"
              />
            )}
          </AnimatePresence>

          {/* Traditional splash divider */}
          <AnimatePresence>
            {showHotels && showRestaurants && hotels.length > 0 && restaurants.length > 0 && (
              <TraditionalDivider
                image={dancers}
                label="Gastronomie & Saveurs du Noun"
                icon={UtensilsCrossed}
                color="secondary"
              />
            )}
          </AnimatePresence>

          {/* Restaurants */}
          <AnimatePresence>
            {showRestaurants && restaurants.length > 0 && (
              <PaginatedSection
                key="restaurants" id="restaurants"
                items={restaurants}
                icon={UtensilsCrossed} eyebrow="Gastronomie" title="Restaurants & Tables" color="secondary"
              />
            )}
          </AnimatePresence>

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
            <CalendarDays size={12} /> Nguon 2026 · 04 — 13 Décembre
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
            Ne ratez pas la 549ème édition<br className="hidden md:block" /> du Nguon à Foumban
          </h2>
          <p className="text-white/75 text-base md:text-lg mb-10 max-w-2xl mx-auto">
            Rituels de gouvernance, danses traditionnelles, gastronomie Bamoun… Assurez votre hébergement et vos tables dès maintenant.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => document.getElementById("hotels")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2.5 bg-secondary text-black font-black px-8 py-4 rounded-xl hover:bg-secondary/90 transition-all hover:scale-105 hover:shadow-2xl text-base">
              <Hotel size={20} /> Trouver un hôtel
            </button>
            <button onClick={() => document.getElementById("restaurants")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2.5 bg-white/10 border border-white/30 text-white font-black px-8 py-4 rounded-xl hover:bg-white/20 transition-all text-base">
              <UtensilsCrossed size={20} /> Réserver une table
            </button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default BookingPage;
