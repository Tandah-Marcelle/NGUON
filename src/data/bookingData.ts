// Static booking data — hotels & restaurants for Nguon 2026
// Admin management will feed this via API; for now we use static data.

export type MediaItem = {
  type: "image" | "video";
  url: string;
  alt?: string;
};

export type Property = {
  id: string;
  category: "hotel" | "restaurant";
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  priceFrom?: string;
  priceTo?: string;
  priceUnit?: string; // "per night", "per person", etc.
  stars?: number; // hotels only
  cuisine?: string; // restaurants only
  openingHours?: string;
  features: string[];
  media: MediaItem[];
  // Branding
  accentColor?: string; // custom hex for card accent
  logoUrl?: string;
  featured?: boolean;
};

import foumbanLandscape from "@/assets/foumban-landscape.jpg";
import palaceInterior from "@/assets/palace-interior.jpg";
import museeImg from "@/assets/musee-du-palais.jpg";
import artisanImg from "@/assets/artisan.jpg";
import cultureCeremony from "@/assets/culture-ceremony.jpg";
import appropos1 from "@/assets/apropos1.jpeg";
import appropos2 from "@/assets/apropos2.jpeg";
import appropos3 from "@/assets/apropos3.jpeg";
import bg2 from "@/assets/bg2.jpg";
import bg3 from "@/assets/bg3.jpg";
import tradbg from "@/assets/tradbg.png";
import tradbg2 from "@/assets/tradbg2.jpg";
import masks from "@/assets/masks.png";
import majesty from "@/assets/majesty.jpg";
import dancersImg from "@/assets/dancers.png";

export const properties: Property[] = [
  // ── HOTELS ──────────────────────────────────────────────────────────────────
  {
    id: "hotel-palais-royal",
    category: "hotel",
    name: "Hôtel Palais Royal",
    tagline: "Au cœur de la cité impériale",
    description:
      "Niché à deux pas du Palais des Rois Bamoun, l'Hôtel Palais Royal vous offre un séjour alliant confort moderne et authenticité culturelle. Profitez d'une vue imprenable sur la ville de Foumban et d'un accueil chaleureux ancré dans la tradition Bamoun.",
    address: "Avenue du Palais, Foumban, Cameroun",
    phone: "+237 622 000 001",
    whatsapp: "+237 622 000 001",
    email: "contact@hotel-palais-royal.cm",
    priceFrom: "25 000",
    priceTo: "80 000",
    priceUnit: "FCFA / nuit",
    stars: 4,
    features: [
      "WiFi gratuit",
      "Climatisation",
      "Restaurant traditionnel",
      "Parking sécurisé",
      "Service de conciergerie",
      "Vue sur le Palais",
    ],
    media: [
      { type: "image", url: foumbanLandscape, alt: "Vue panoramique de Foumban" },
      { type: "image", url: palaceInterior, alt: "Intérieur du palais" },
      { type: "image", url: appropos1, alt: "Chambres confortables" },
    ],
    accentColor: "#0047AB",
    featured: true,
  },
  {
    id: "hotel-nguon-village",
    category: "hotel",
    name: "Résidence Nguon Village",
    tagline: "L'hospitalité Bamoun au cœur du festival",
    description:
      "À l'intérieur même du Village Nguon (21 hectares), la Résidence Nguon Village propose des hébergements traditionnels revisités. Idéalement placée pour vivre le festival de l'intérieur, elle accueille les festivaliers dans des cases rénovées alliant artisanat local et confort contemporain.",
    address: "Village Nguon, Foumban, Cameroun",
    phone: "+237 652 000 002",
    whatsapp: "+237 652 000 002",
    priceFrom: "15 000",
    priceTo: "45 000",
    priceUnit: "FCFA / nuit",
    stars: 3,
    features: [
      "Ambiance festival",
      "Décoration traditionnelle",
      "Petit-déjeuner inclus",
      "Animations culturelles",
      "Accès direct aux sites",
    ],
    media: [
      { type: "image", url: tradbg2, alt: "Village Nguon" },
      { type: "image", url: tradbg, alt: "Décoration traditionnelle" },
      { type: "image", url: appropos2, alt: "Cases traditionnelles" },
    ],
    accentColor: "#D4A017",
    featured: true,
  },
  {
    id: "hotel-equinox-foumban",
    category: "hotel",
    name: "Équinox Hôtel Foumban",
    tagline: "Élégance et sérénité à Foumban",
    description:
      "L'Équinox Hôtel est l'adresse de référence pour un séjour haut de gamme à Foumban. Ses chambres spacieuses, sa piscine et son spa vous offrent un havre de paix après les festivités du Nguon. À 5 minutes du Palais Royal et des principaux sites culturels.",
    address: "Quartier Administratif, Foumban, Cameroun",
    phone: "+237 699 000 003",
    whatsapp: "+237 699 000 003",
    email: "reservation@equinox-foumban.cm",
    priceFrom: "45 000",
    priceTo: "150 000",
    priceUnit: "FCFA / nuit",
    stars: 5,
    features: [
      "Piscine",
      "Spa & Bien-être",
      "Restaurant gastronomique",
      "Salle de conférence",
      "Transfer aéroport",
      "WiFi haut débit",
      "Room service 24h",
    ],
    media: [
      { type: "image", url: bg2, alt: "Vue de l'hôtel" },
      { type: "image", url: bg3, alt: "Piscine" },
      { type: "image", url: appropos3, alt: "Chambre de luxe" },
    ],
    accentColor: "#1B4F72",
    featured: false,
  },
  {
    id: "hotel-abbaye-koutaba",
    category: "hotel",
    name: "Lodge de l'Abbaye — Koutaba",
    tagline: "Entre monastère et nature verdoyante",
    description:
      "Adossé au site historique de l'Abbaye de Koutaba, ce lodge propose une expérience unique de tranquillité. Idéal pour explorer les activités sportives du Mont Mbapit, il offre des bungalows immergés dans la verdure avec vue sur les collines de Foumbot.",
    address: "Koutaba, Région de l'Ouest, Cameroun",
    phone: "+237 677 000 004",
    priceFrom: "18 000",
    priceTo: "55 000",
    priceUnit: "FCFA / nuit",
    stars: 3,
    features: [
      "Bungalows en pleine nature",
      "Randonnées guidées",
      "Accès Mont Mbapit",
      "Repas traditionnels",
      "Parking",
    ],
    media: [
      { type: "image", url: majesty, alt: "Abbaye de Koutaba" },
      { type: "image", url: museeImg, alt: "Environnement naturel" },
    ],
    accentColor: "#2E7D32",
    featured: false,
  },

  // ── RESTAURANTS ──────────────────────────────────────────────────────────────
  {
    id: "resto-mfon-royal",
    category: "restaurant",
    name: "Mfon Royal",
    tagline: "La gastronomie Bamoun à l'honneur",
    description:
      "Le Mfon Royal est LA table de référence pour découvrir la cuisine Bamoun dans toute sa splendeur. Poulet DG, Nkui, Kondré, Eru… des recettes transmises de génération en génération, sublimées par des chefs locaux passionnés. Une expérience culinaire et culturelle inoubliable.",
    address: "Rue du Marché Central, Foumban, Cameroun",
    phone: "+237 677 111 001",
    whatsapp: "+237 677 111 001",
    priceFrom: "3 000",
    priceTo: "15 000",
    priceUnit: "FCFA / personne",
    cuisine: "Cuisine Bamoun traditionnelle",
    openingHours: "Lun–Dim : 11h00 – 23h00",
    features: [
      "Cuisine traditionnelle Bamoun",
      "Terrasse panoramique",
      "Groupes & privatisation",
      "Animations musicales le soir",
      "Espace enfants",
    ],
    media: [
      { type: "image", url: cultureCeremony, alt: "Ambiance du restaurant" },
      { type: "image", url: artisanImg, alt: "Plats traditionnels" },
      { type: "image", url: dancersImg, alt: "Soirée culturelle" },
    ],
    accentColor: "#D4A017",
    featured: true,
  },
  {
    id: "resto-village-gastro",
    category: "restaurant",
    name: "Village Gastronomique",
    tagline: "Tous les saveurs du Noun réunis",
    description:
      "Au cœur du Village Nguon, le Village Gastronomique rassemble une vingtaine de stands de restauration proposant les meilleures spécialités régionales. Poisson fumé du Lac Mbapit, arachides grillées, vins de raphia, miel sauvage… Un tour du monde culinaire du Noun en un seul lieu.",
    address: "Village Nguon, Foumban, Cameroun",
    phone: "+237 655 111 002",
    priceFrom: "500",
    priceTo: "5 000",
    priceUnit: "FCFA / plat",
    cuisine: "Spécialités régionales du Noun",
    openingHours: "Durant le festival (04–13 Déc.) : 08h00 – 00h00",
    features: [
      "20+ stands de restauration",
      "Produits locaux",
      "Vins de raphia",
      "Animation culturelle",
      "Aire de jeux pour enfants",
    ],
    media: [
      { type: "image", url: tradbg2, alt: "Village gastronomique" },
      { type: "image", url: masks, alt: "Artisanat et culture" },
      { type: "image", url: appropos1, alt: "Spécialités locales" },
    ],
    accentColor: "#C0392B",
    featured: true,
  },
  {
    id: "resto-cour-apparat",
    category: "restaurant",
    name: "La Cour d'Apparat",
    tagline: "Dîner sous les étoiles de la royauté Bamoun",
    description:
      "Restaurant gastronomique d'exception situé dans les environs de la Cour d'Apparat, La Cour d'Apparat propose une fusion subtile entre la gastronomie Bamoun et les influences culinaires internationales. Cadre royal, service soigné, cave à vins sélectionnée.",
    address: "Cour d'Apparat, Foumban, Cameroun",
    phone: "+237 691 111 003",
    email: "reservation@la-cour-dapparat.cm",
    priceFrom: "12 000",
    priceTo: "40 000",
    priceUnit: "FCFA / personne",
    cuisine: "Gastronomie fusion Bamoun–Internationale",
    openingHours: "Mar–Dim : 12h00 – 15h00, 19h00 – 23h00",
    features: [
      "Menu dégustation",
      "Cave à vins",
      "Réservation conseillée",
      "Privatisation possible",
      "Cadre historique",
    ],
    media: [
      { type: "image", url: palaceInterior, alt: "Cadre royal" },
      { type: "image", url: foumbanLandscape, alt: "Soirée gastronomique" },
    ],
    accentColor: "#6C3483",
    featured: false,
  },
  {
    id: "resto-artisanat-saveurs",
    category: "restaurant",
    name: "Artisanat & Saveurs",
    tagline: "L'art et la table réunis",
    description:
      "Restaurant-galerie au cœur du Village Artisanal, Artisanat & Saveurs propose une expérience totale où vous dégustez les spécialités Bamoun entourés d'œuvres d'artisans locaux à vendre. Un concept unique alliant art, culture et gastronomie.",
    address: "Village Artisanal, Foumban, Cameroun",
    phone: "+237 699 111 004",
    priceFrom: "2 500",
    priceTo: "10 000",
    priceUnit: "FCFA / personne",
    cuisine: "Cuisine Bamoun & Fusion",
    openingHours: "Lun–Dim : 10h00 – 22h00",
    features: [
      "Galerie d'art intégrée",
      "Œuvres en vente",
      "Cours de cuisine",
      "Menu végétarien disponible",
    ],
    media: [
      { type: "image", url: artisanImg, alt: "Artisanat local" },
      { type: "image", url: museeImg, alt: "Galerie d'art" },
    ],
    accentColor: "#0047AB",
    featured: false,
  },
];

export const getProperties = (category?: "hotel" | "restaurant"): Property[] =>
  category ? properties.filter((p) => p.category === category) : properties;

export const getFeaturedProperties = (category?: "hotel" | "restaurant"): Property[] =>
  properties.filter((p) => p.featured && (!category || p.category === category));

export const getPropertyById = (id: string): Property | undefined =>
  properties.find((p) => p.id === id);
