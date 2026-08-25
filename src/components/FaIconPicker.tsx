/**
 * FaIconPicker — a searchable Font Awesome icon selector.
 * Uses individual icon imports (NOT library.add(fas)) to avoid
 * registering the full library synchronously at module load.
 */
import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Search, X } from "lucide-react";

// ─── Individual icon imports (tree-shakeable) ─────────────────────────────────
import {
  faShop, faStore, faBagShopping, faCartShopping, faTags, faTag,
  faMoneyBill, faCreditCard, faReceipt, faBarcode,
  faUtensils, faBowlFood, faDrumstickBite, faCakeCandles, faMugHot,
  faBottleWater, faJar, faMortarPestle, faPepperHot,
  faPalette, faPaintbrush, faScissors, faHammer, faScrewdriver,
  faPencil, faPenNib, faDraftingCompass, faRulerCombined,
  faLandmark, faMonument, faMask, faTheaterMasks, faScroll,
  faBook, faBookOpen, faFeather,
  faShirt, faHatCowboy, faMitten, faSocks,
  faLeaf, faSeedling, faTree, faWheatAwn, faSun, faStar,
  faMoon, faCloud, faFire, faDroplet, faSnowflake,
  faGem, faRing, faCrown, faWandSparkles,
  faAward, faCertificate, faMedal,
  faMusic, faDrum, faGuitar, faMicrophone, faRecordVinyl,
  faUsers, faPerson, faChild, faHandHoldingHeart, faHandsHolding,
  faHandshake, faPeopleGroup,
  faMapLocationDot, faMapPin, faMountainSun, faTent, faHouse,
  faBuilding, faChurch, faMosque,
  faMobileScreen, faLaptop, faCamera, faVideo, faImage,
  faHeart, faGift, faBox, faBoxesStacked, faTruck,
  faCalendarDays, faClock, faBell, faEnvelope, faGlobe,
  faShield, faLock, faKey, faInfinity, faBed, faConciergeBell,
} from "@fortawesome/free-solid-svg-icons";

// ─── Icon registry: name → IconDefinition ─────────────────────────────────────
const ICON_MAP: Record<string, IconDefinition> = {
  "shop": faShop, "store": faStore, "bag-shopping": faBagShopping,
  "cart-shopping": faCartShopping, "tags": faTags, "tag": faTag,
  "money-bill": faMoneyBill, "credit-card": faCreditCard,
  "receipt": faReceipt, "barcode": faBarcode,
  "utensils": faUtensils, "bowl-food": faBowlFood,
  "drumstick-bite": faDrumstickBite, "cake-candles": faCakeCandles,
  "mug-hot": faMugHot, "bottle-water": faBottleWater, "jar": faJar,
  "mortar-pestle": faMortarPestle, "pepper-hot": faPepperHot,
  "palette": faPalette, "paintbrush": faPaintbrush, "scissors": faScissors,
  "hammer": faHammer, "screwdriver": faScrewdriver, "pencil": faPencil,
  "pen-nib": faPenNib, "drafting-compass": faDraftingCompass,
  "ruler-combined": faRulerCombined,
  "landmark": faLandmark, "monument": faMonument, "mask": faMask,
  "theater-masks": faTheaterMasks, "scroll": faScroll,
  "book": faBook, "book-open": faBookOpen, "feather": faFeather,
  "shirt": faShirt, "hat-cowboy": faHatCowboy,
  "mitten": faMitten, "socks": faSocks,
  "leaf": faLeaf, "seedling": faSeedling, "tree": faTree,
  "wheat-awn": faWheatAwn, "sun": faSun, "star": faStar,
  "moon": faMoon, "cloud": faCloud, "fire": faFire,
  "droplet": faDroplet, "snowflake": faSnowflake,
  "gem": faGem, "ring": faRing, "crown": faCrown,
  "wand-sparkles": faWandSparkles,
  "award": faAward, "certificate": faCertificate, "medal": faMedal,
  "music": faMusic, "drum": faDrum, "guitar": faGuitar,
  "microphone": faMicrophone, "record-vinyl": faRecordVinyl,
  "users": faUsers, "person": faPerson, "child": faChild,
  "hand-holding-heart": faHandHoldingHeart,
  "hands-holding": faHandsHolding, "handshake": faHandshake,
  "people-group": faPeopleGroup,
  "map-location-dot": faMapLocationDot, "map-pin": faMapPin,
  "mountain-sun": faMountainSun, "tent": faTent, "house": faHouse,
  "building": faBuilding, "church": faChurch, "mosque": faMosque,
  "mobile-screen": faMobileScreen, "laptop": faLaptop,
  "camera": faCamera, "video": faVideo, "image": faImage,
  "heart": faHeart, "gift": faGift, "box": faBox,
  "boxes-stacked": faBoxesStacked, "truck": faTruck,
  "calendar-days": faCalendarDays, "clock": faClock,
  "bell": faBell, "envelope": faEnvelope, "globe": faGlobe,
  "shield": faShield, "lock": faLock, "key": faKey,
  "infinity": faInfinity, "bed": faBed,
  "concierge-bell": faConciergeBell,
};

export const FA_ICON_LIST = Object.keys(ICON_MAP);

// ─── Render a single FA icon by name ─────────────────────────────────────────
export function FaIcon({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
  const icon = ICON_MAP[name];
  if (!icon) return null;
  return <FontAwesomeIcon icon={icon} className={className} />;
}

// ─── CategoryIcon — renders FA icon or falls back gracefully ─────────────────
export function CategoryIcon({ icon, className = "w-5 h-5" }: { icon: string; className?: string }) {
  const def = ICON_MAP[icon];
  if (def) return <FontAwesomeIcon icon={def} className={className} />;
  // Fallback: emoji or unknown
  return <span className="text-xl leading-none">{icon || "🏷️"}</span>;
}

// ─── Picker component ─────────────────────────────────────────────────────────
interface FaIconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  label?: string;
}

export default function FaIconPicker({ value, onChange, label = "Icône" }: FaIconPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return FA_ICON_LIST;
    const q = query.toLowerCase();
    return FA_ICON_LIST.filter(n => n.includes(q));
  }, [query]);

  const selectedDef = value ? ICON_MAP[value] : null;

  return (
    <div className="relative">
      {label && (
        <p className="text-xs font-black text-foreground/60 uppercase tracking-wider mb-1.5">{label}</p>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-3 w-full border border-input rounded-xl px-4 py-3 bg-background hover:border-primary/50 transition-all text-sm"
      >
        {selectedDef ? (
          <>
            <FontAwesomeIcon icon={selectedDef} className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="font-semibold text-foreground">{value}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Choisir une icône…</span>
        )}
        <span className="ml-auto text-muted-foreground text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                placeholder="Rechercher…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-8 pr-8 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Icon grid */}
          <div className="grid grid-cols-8 gap-1 p-3 max-h-56 overflow-y-auto">
            {filtered.map(name => {
              const def = ICON_MAP[name];
              if (!def) return null;
              const active = value === name;
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => { onChange(name); setOpen(false); setQuery(""); }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all hover:bg-primary/10 group ${
                    active ? "bg-primary text-white" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <FontAwesomeIcon icon={def} className="w-4 h-4" />
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-8 text-center py-5 text-muted-foreground text-sm">
                Aucune icône pour "{query}"
              </div>
            )}
          </div>

          {/* Selected name + close */}
          <div className="px-3 pb-3 pt-1 border-t border-border flex items-center justify-between">
            {value && ICON_MAP[value] ? (
              <span className="text-xs text-primary font-mono font-semibold">{value}</span>
            ) : <span />}
            <button type="button" onClick={() => setOpen(false)} className="text-xs text-muted-foreground hover:text-foreground">
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
