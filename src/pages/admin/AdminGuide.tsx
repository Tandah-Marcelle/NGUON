import { useState } from "react";
import {
  ShoppingBag, Hotel, Star, ChevronDown, Eye, EyeOff, Tag,
  ClipboardList, Printer, ImagePlus, Mail, KeyRound, Share2,
  Trash2, Users, CheckCircle2, Info,
} from "lucide-react";

type Section = { title: string; body: React.ReactNode };

const Accordion = ({ sections, accent }: { sections: Section[]; accent: string }) => {
  const [open, setOpen] = useState(0);
  return (
    <div className="space-y-3">
      {sections.map((s, i) => (
        <div key={s.title} className="bg-card border border-border/50 rounded-2xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-muted/40 transition-colors"
          >
            <span className="font-bold text-foreground text-sm">{s.title}</span>
            <ChevronDown size={16} className={`text-muted-foreground flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && (
            <div className={`px-5 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed space-y-3 border-t border-border/50 ${accent}`}>
              {s.body}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const Step = ({ n, children }: { n: number; children: React.ReactNode }) => (
  <div className="flex gap-3">
    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-black flex items-center justify-center mt-0.5">{n}</span>
    <p className="flex-1">{children}</p>
  </div>
);

const Badge = ({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-muted px-2.5 py-1 rounded-full">
    <Icon size={12} /> {children}
  </span>
);

const TABS = [
  { key: "shop", label: "Boutique", icon: ShoppingBag },
  { key: "booking", label: "Réservations", icon: Hotel },
  { key: "votes", label: "Votes — Miss & Mister", icon: Star },
] as const;

export default function AdminGuide() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("shop");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Guide d'utilisation</h1>
        <p className="text-muted-foreground mt-1">Comment gérer la Boutique, les Réservations et les Votes depuis ce panneau d'administration.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
              tab === t.key ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
            }`}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* ── BOUTIQUE ── */}
      {tab === "shop" && (
        <Accordion
          accent=""
          sections={[
            {
              title: "1. Catégories — Boutique › Catégories",
              body: (
                <>
                  <Step n={1}>Chaque catégorie a une <strong>clé</strong> (utilisée en interne, non modifiable après coup si des produits l'utilisent déjà), un <strong>libellé</strong> affiché aux clients, une <strong>icône</strong> et un <strong>ordre d'affichage</strong>.</Step>
                  <Step n={2}>Créez une catégorie avec <strong>+ Nouvelle catégorie</strong>, modifiez-la avec <strong>Modifier</strong>.</Step>
                  <div className="flex items-start gap-2 bg-primary/5 border border-primary/10 rounded-xl p-3 mt-2">
                    <Info size={15} className="text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs">Supprimer une catégorie ne supprime <strong>pas</strong> les produits qui l'utilisaient — ils gardent l'ancien nom de catégorie, simplement affiché tel quel.</p>
                  </div>
                </>
              ),
            },
            {
              title: "2. Produits — Boutique › Produits",
              body: (
                <>
                  <Step n={1}>Cliquez <strong>+ Nouveau produit</strong>, choisissez sa catégorie, renseignez nom, accroche, description, prix (et prix barré optionnel), stock, vendeur et coordonnées.</Step>
                  <Step n={2}>Ajoutez une ou plusieurs photos/vidéos avec <ImagePlus size={13} className="inline -mt-0.5" /> <em>Ajouter des images ou vidéos</em> — elles s'envoient au moment d'enregistrer le produit.</Step>
                  <Step n={3}>Cochez <strong>Recommandé</strong> pour le mettre en avant, et choisissez un badge (Nouveau, Promo, Exclusif) si besoin.</Step>
                  <Step n={4}>Le bouton <Eye size={13} className="inline -mt-0.5" />/<EyeOff size={13} className="inline -mt-0.5" /> sur chaque ligne bascule le produit entre <Badge icon={CheckCircle2}>Publié</Badge> (visible sur la boutique) et <Badge icon={EyeOff}>Masqué</Badge> (invisible aux clients, mais toujours modifiable ici).</Step>
                  <div className="flex items-start gap-2 bg-primary/5 border border-primary/10 rounded-xl p-3 mt-2">
                    <Info size={15} className="text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs">Un produit masqué n'apparaît jamais sur le site public, même s'il est en stock — utile pour préparer un produit à l'avance avant de le publier.</p>
                  </div>
                </>
              ),
            },
            {
              title: "3. Commandes — Boutique › Commandes",
              body: (
                <>
                  <Step n={1}>La liste affiche chaque commande avec son statut de <strong>paiement</strong> (En attente / En cours / Payé / Échoué / Remboursé) et son statut de <strong>livraison</strong> (En attente / Confirmée / Livrée / Annulée) — ce sont deux choses séparées : un paiement réussi ne fait pas automatiquement avancer la livraison.</Step>
                  <Step n={2}>Filtrez par statut ou recherchez par nom/numéro/téléphone avec la barre de recherche.</Step>
                  <Step n={3}>Cochez une ou plusieurs commandes (ou <strong>Tout sélectionner</strong>) puis cliquez <Printer size={13} className="inline -mt-0.5" /> <strong>Imprimer</strong> pour générer un récapitulatif imprimable des commandes sélectionnées.</Step>
                  <Step n={4}>Ouvrez <strong>Voir</strong> sur une commande pour changer son statut manuellement (par exemple la marquer Livrée une fois le colis remis).</Step>
                </>
              ),
            },
          ]}
        />
      )}

      {/* ── RÉSERVATIONS ── */}
      {tab === "booking" && (
        <Accordion
          accent=""
          sections={[
            {
              title: "1. Hôtels & Restaurants — gérer les établissements",
              body: (
                <>
                  <Step n={1}>Chaque établissement a une <strong>catégorie</strong> (Hôtel ou Restaurant), un nom, une description, une localisation et des médias (photos).</Step>
                  <Step n={2}>Créez ou modifiez un établissement via <strong>+ Nouveau</strong> / <strong>Modifier</strong>, en ajoutant ses photos comme pour un produit de la boutique.</Step>
                  <Step n={3}>Comme pour les produits, le bouton <Eye size={13} className="inline -mt-0.5" />/<EyeOff size={13} className="inline -mt-0.5" /> bascule l'établissement entre <Badge icon={CheckCircle2}>Publié</Badge> et <Badge icon={EyeOff}>Masqué</Badge> sur la page publique <em>Réservations</em>.</Step>
                  <div className="flex items-start gap-2 bg-primary/5 border border-primary/10 rounded-xl p-3 mt-2">
                    <Info size={15} className="text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs">Ce module gère la <strong>liste des établissements</strong> proposés aux visiteurs (hôtels et restaurants partenaires) — il ne gère pas des réservations individuelles avec des dates ; les visiteurs consultent la liste et contactent l'établissement de leur choix.</p>
                  </div>
                </>
              ),
            },
          ]}
        />
      )}

      {/* ── VOTES ── */}
      {tab === "votes" && (
        <Accordion
          accent=""
          sections={[
            {
              title: "1. Créer et gérer un profil — Votes",
              body: (
                <>
                  <Step n={1}>Cliquez <strong>+ Nouveau profil</strong>, ajoutez une photo (obligatoire), un nom, et une description (optionnelle).</Step>
                  <Step n={2}>Cochez <strong>Visible sur la page Concours</strong> pour le publier — comme pour la boutique, un profil non coché reste invisible aux visiteurs mais reste modifiable.</Step>
                  <Step n={3}>Le bouton <Users size={13} className="inline -mt-0.5" /> <strong>Voir</strong> ouvre le détail du profil avec le <strong>tableau des emails</strong> ayant voté pour lui, et la date de confirmation de chaque vote.</Step>
                  <div className="flex items-start gap-2 bg-destructive/5 border border-destructive/10 rounded-xl p-3 mt-2">
                    <Trash2 size={15} className="text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-xs"><strong>Supprimer</strong> un profil supprime aussi tous les votes qui lui sont associés — cette action est irréversible.</p>
                  </div>
                </>
              ),
            },
            {
              title: "2. Comment un visiteur vote",
              body: (
                <>
                  <Step n={1}>Sur la page Concours publique, le visiteur clique <strong>Voter</strong> sur le profil de son choix et saisit son adresse email.</Step>
                  <Step n={2}><Mail size={13} className="inline -mt-0.5" /> Un code de confirmation à 6 caractères (lettres et chiffres) est envoyé par email, valable 10 minutes.</Step>
                  <Step n={3}><KeyRound size={13} className="inline -mt-0.5" /> Le visiteur saisit le code — dès que les 6 cases sont remplies, le vote est validé automatiquement, sans bouton à cliquer.</Step>
                  <div className="flex items-start gap-2 bg-primary/5 border border-primary/10 rounded-xl p-3 mt-2">
                    <Info size={15} className="text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs"><strong>Une adresse email = un seul vote, pour l'ensemble du concours</strong> (et non par profil) — une fois confirmé, cette adresse ne peut plus voter pour aucun autre profil.</p>
                  </div>
                </>
              ),
            },
            {
              title: "3. Partage d'un profil",
              body: (
                <>
                  <Step n={1}>Sur la page publique, l'icône <Share2 size={13} className="inline -mt-0.5" /> en haut de chaque photo copie un lien direct vers ce profil précis.</Step>
                  <Step n={2}>Ouvrir ce lien fait défiler la page jusqu'à la section Votes et met brièvement en surbrillance le profil concerné — pratique pour partager un candidat spécifique sur les réseaux sociaux.</Step>
                </>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
