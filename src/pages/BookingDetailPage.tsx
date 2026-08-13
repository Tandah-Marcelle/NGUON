import { useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Hotel, UtensilsCrossed, Star, MapPin, Phone, Mail, Globe,
  Clock, ArrowLeft, ChevronLeft, ChevronRight, Check,
  MessageCircle, ExternalLink, Sparkles, CalendarDays,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPropertyById, getProperties, Property } from "@/data/bookingData";

// ─── Star rating ──────────────────────────────────────────────────────────────
const StarRating = ({ count }: { count: number }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={16} className={i < count ? "fill-secondary text-secondary" : "text-muted-foreground/30"} />
    ))}
  </div>
);

// ─── Media gallery ────────────────────────────────────────────────────────────
const MediaGallery = ({ media, name }: { media: Property["media"]; name: string }) => {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = () => setActive((a) => (a - 1 + media.length) % media.length);
  const next = () => setActive((a) => (a + 1) % media.length);

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden bg-black/10 aspect-video group">
        <AnimatePresence mode="wait">
          {media[active].type === "image" ? (
            <motion.img
              key={active}
              src={(media[active] as any).presignedUrl ?? media[active].url}
              alt={media[active].alt ?? name}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full object-cover cursor-zoom-in"
              onClick={() => setLightbox(true)}
            />
          ) : (
            <motion.video
              key={active}
              src={(media[active] as any).presignedUrl ?? media[active].url}
              controls
              className="w-full h-full object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>

        {/* Navigation arrows */}
        {media.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {active + 1} / {media.length}
        </div>
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {media.map((m, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                i === active ? "border-primary scale-105" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              {m.type === "image" ? (
                <img src={(m as any).presignedUrl ?? m.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                  Vidéo
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && media[active].type === "image" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
          >
            <motion.img
              src={(media[active] as any).presignedUrl ?? media[active].url}
              alt={media[active].alt}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-5 right-5 text-white/70 hover:text-white text-2xl font-bold"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Booking form / contact card ──────────────────────────────────────────────
const ContactCard = ({ property }: { property: Property }) => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production this would call the booking API
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl border border-border p-8 text-center shadow-lg"
      >
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-green-600" />
        </div>
        <h3 className="font-display text-xl font-black text-foreground mb-2">Demande envoyée !</h3>
        <p className="text-muted-foreground text-sm">
          L'établissement vous contactera sous 24h pour confirmer votre réservation.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden sticky top-28">
      {/* Price banner */}
      {property.priceFrom && (
        <div className="bg-primary px-6 py-4">
          <p className="text-white/70 text-xs font-semibold">À partir de</p>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-black text-white">{property.priceFrom}</span>
            <span className="text-white/80 text-sm font-semibold">{property.priceUnit}</span>
          </div>
          {property.priceTo && (
            <p className="text-white/60 text-xs mt-1">Jusqu'à {property.priceTo} {property.priceUnit}</p>
          )}
        </div>
      )}

      <div className="p-6 space-y-5">
        {/* Contact buttons */}
        <div className="space-y-3">
          {property.phone && (
            <a
              href={`tel:${property.phone}`}
              className="flex items-center gap-3 w-full bg-primary text-white font-black py-3 px-4 rounded-xl hover:bg-primary/90 transition-all hover:shadow-lg"
            >
              <Phone size={18} />
              Appeler maintenant
            </a>
          )}
          {property.whatsapp && (
            <a
              href={`https://wa.me/${property.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full bg-green-500 text-white font-black py-3 px-4 rounded-xl hover:bg-green-600 transition-all hover:shadow-lg"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          )}
          {property.website && (
            <a
              href={property.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full bg-muted text-foreground font-semibold py-3 px-4 rounded-xl hover:bg-muted/70 transition-all"
            >
              <Globe size={18} />
              Visiter le site web
              <ExternalLink size={14} className="ml-auto" />
            </a>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-3 text-xs text-muted-foreground font-semibold">ou envoyer une demande</span>
          </div>
        </div>

        {/* Quick booking form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            required
            placeholder="Votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          />
          <input
            type="email"
            required
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min="2026-12-04"
            max="2026-12-13"
            className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          />
          <textarea
            rows={3}
            placeholder="Votre message ou demande spéciale..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
          />
          <button
            type="submit"
            className="w-full bg-secondary text-foreground font-black py-3 rounded-xl hover:bg-secondary/90 transition-all hover:shadow-lg flex items-center justify-center gap-2"
          >
            <CalendarDays size={18} />
            Envoyer la demande
          </button>
        </form>

        <p className="text-xs text-muted-foreground text-center">
          Réponse garantie sous 24h · Nguon 2026
        </p>
      </div>
    </div>
  );
};

// ─── Related cards ────────────────────────────────────────────────────────────
const RelatedCard = ({ property }: { property: Property }) => (
  <Link
    to={`/booking/${property.category}/${property.id}`}
    className="group flex items-center gap-4 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
  >
    <div className="w-16 h-14 rounded-lg overflow-hidden flex-shrink-0">
      <img
        src={property.media[0]?.url}
        alt={property.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
        {property.name}
      </p>
      <p className="text-xs text-muted-foreground truncate">{property.tagline}</p>
      {property.priceFrom && (
        <p className="text-xs font-black text-primary mt-0.5">
          Dès {property.priceFrom} {property.priceUnit}
        </p>
      )}
    </div>
    <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
  </Link>
);

// ─── Detail page ──────────────────────────────────────────────────────────────
const BookingDetailPage = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const property = id ? getPropertyById(id) : undefined;

  const related = property
    ? getProperties(property.category).filter((p) => p.id !== property.id).slice(0, 3)
    : [];

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-24">
            <p className="text-muted-foreground text-xl mb-4">Établissement introuvable.</p>
            <Link to="/booking" className="text-primary font-bold hover:underline">
              ← Retour aux réservations
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden min-h-screen">
      <Navbar />

      {/* Breadcrumb + back — pushed well below navbar */}
      <div className="pt-32 pb-6 bg-gradient-to-b from-primary/8 to-transparent">
        <div className="container mx-auto px-4">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center gap-2 text-sm flex-wrap">
              <li>
                <Link
                  to="/"
                  className="text-primary font-semibold hover:text-primary/80 hover:underline transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li className="text-muted-foreground">
                <ChevronRight size={14} />
              </li>
              <li>
                <Link
                  to="/booking"
                  className="text-primary font-semibold hover:text-primary/80 hover:underline transition-colors"
                >
                  Réservations
                </Link>
              </li>
              <li className="text-muted-foreground">
                <ChevronRight size={14} />
              </li>
              <li>
                <span className="text-foreground font-bold truncate max-w-[200px] inline-block">
                  {property.name}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="py-4 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_360px] gap-10">

            {/* LEFT: main content */}
            <div>
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-black px-3 py-1 rounded-full">
                    {property.category === "hotel"
                      ? <><Hotel size={12} /> Hôtel</>
                      : <><UtensilsCrossed size={12} /> Restaurant</>
                    }
                  </span>
                  {property.featured && (
                    <span className="inline-flex items-center gap-1 bg-secondary text-foreground text-xs font-black px-3 py-1 rounded-full">
                      <Sparkles size={10} /> Recommandé
                    </span>
                  )}
                </div>

                <h1 className="font-display text-3xl md:text-4xl font-black text-foreground mb-2">
                  {property.name}
                </h1>

                {property.stars && <div className="mb-2"><StarRating count={property.stars} /></div>}
                {property.cuisine && (
                  <p className="text-secondary font-semibold text-sm mb-2">{property.cuisine}</p>
                )}

                <p className="text-muted-foreground italic text-lg">{property.tagline}</p>
              </motion.div>

              {/* Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-8"
              >
                <MediaGallery media={property.media} name={property.name} />
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mb-8"
              >
                <h2 className="font-display text-xl font-black text-foreground mb-4 flex items-center gap-2">
                  <span className="w-6 h-1 bg-primary rounded-full inline-block" />
                  À propos
                </h2>
                <p className="text-foreground/80 leading-relaxed text-base">{property.description}</p>
              </motion.div>

              {/* Info grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid sm:grid-cols-2 gap-4 mb-8"
              >
                {property.address && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-black text-foreground/60 uppercase tracking-wider mb-0.5">Adresse</p>
                      <p className="text-sm font-semibold text-foreground">{property.address}</p>
                    </div>
                  </div>
                )}
                {property.phone && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <Phone size={18} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-black text-foreground/60 uppercase tracking-wider mb-0.5">Téléphone</p>
                      <a href={`tel:${property.phone}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                        {property.phone}
                      </a>
                    </div>
                  </div>
                )}
                {property.email && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <Mail size={18} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-black text-foreground/60 uppercase tracking-wider mb-0.5">Email</p>
                      <a href={`mailto:${property.email}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors break-all">
                        {property.email}
                      </a>
                    </div>
                  </div>
                )}
                {property.openingHours && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <Clock size={18} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-black text-foreground/60 uppercase tracking-wider mb-0.5">Horaires</p>
                      <p className="text-sm font-semibold text-foreground">{property.openingHours}</p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Features / Amenities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mb-8"
              >
                <h2 className="font-display text-xl font-black text-foreground mb-4 flex items-center gap-2">
                  <span className="w-6 h-1 bg-secondary rounded-full inline-block" />
                  {property.category === "hotel" ? "Équipements & Services" : "Points forts"}
                </h2>
                <div className="grid sm:grid-cols-2 gap-2">
                  {property.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5 text-sm text-foreground/80">
                      <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-secondary" />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Festival info banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-white flex items-start gap-4 mb-8"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <p className="font-black text-lg mb-1">Nguon 2026 · 04 — 13 Décembre</p>
                  <p className="text-white/80 text-sm">
                    Cet établissement est partenaire du festival Nguon 2026. Réservez tôt pour garantir votre place durant la 549ème édition à Foumban.
                  </p>
                </div>
              </motion.div>

              {/* Related */}
              {related.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                >
                  <h2 className="font-display text-xl font-black text-foreground mb-4 flex items-center gap-2">
                    <span className="w-6 h-1 bg-primary rounded-full inline-block" />
                    {property.category === "hotel" ? "Autres hôtels" : "Autres restaurants"}
                  </h2>
                  <div className="space-y-3">
                    {related.map((r) => <RelatedCard key={r.id} property={r} />)}
                  </div>
                  <div className="mt-4 text-center">
                    <Link
                      to="/booking"
                      className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline"
                    >
                      Voir tous les {property.category === "hotel" ? "hôtels" : "restaurants"}
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>

            {/* RIGHT: sticky contact/booking card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ContactCard property={property} />
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingDetailPage;
