// Text of the privacy policy and terms of use pages, in French and English.
// Each section: a heading and paragraphs; a paragraph starting with "- " is
// a list item. Keep both languages in step when editing.

export type LegalSection = { title: string; body: string[] };
export type LegalDoc = { title: string; intro: string; sections: LegalSection[] };

export const LEGAL_UPDATED = { fr: "25 novembre 2026", en: "25 November 2026" };
export const LEGAL_CONTACT = "Contact@fondationnguon.org";

const privacyFr: LegalDoc = {
  title: "Politique de confidentialité",
  intro:
    "Cette politique explique quelles données personnelles le site nguonevents.com collecte, pourquoi, avec qui elles sont partagées, combien de temps elles sont conservées et comment exercer vos droits.",
  sections: [
    {
      title: "Qui sommes-nous",
      body: [
        "Le site nguonevents.com est édité par la Fondation Nguon, organisatrice du festival Nguon, Grandes Journées Traditionnelles, Culturelles et Économiques du peuple Bamoun, à Foumban (Région de l'Ouest, Cameroun). La Fondation Nguon est responsable des données collectées sur ce site.",
        `Pour toute question relative à vos données : ${LEGAL_CONTACT}.`,
      ],
    },
    {
      title: "Les données que nous collectons et pourquoi",
      body: [
        "Nous collectons uniquement les données que vous nous transmettez vous-même, pour le service que vous demandez :",
        "- Vote Miss & Mister : votre adresse email, le code de confirmation qui vous est envoyé, la date du vote, le profil choisi et un identifiant aléatoire enregistré par votre navigateur. Ces données servent à vérifier que chaque vote vient d'une vraie personne et à n'accepter qu'un seul vote par adresse email et par appareil.",
        "- Formulaire de contact : votre nom, votre adresse email et votre message, pour vous répondre.",
        "- Inscription aux concours : votre identité (nom et prénoms, date de naissance, sexe, nationalité), votre profession ou établissement, votre ville, vos numéros de téléphone et WhatsApp, votre email, une personne à contacter en cas d'urgence, votre signature et les documents demandés (pièce d'identité ou acte de naissance, CV ou présentation du projet, autorisation parentale pour les mineurs, certificat médical pour les compétitions sportives). Ces données servent à examiner et gérer votre candidature.",
        "- Boutique : votre nom, votre téléphone, votre email, votre adresse de livraison, les articles commandés et la référence du paiement, pour traiter et livrer votre commande.",
        "- Mesure d'audience : des statistiques de visite collectées par Google Analytics (pages consultées, type d'appareil, pays), pour comprendre l'utilisation du site et l'améliorer.",
        "La rubrique Réservations présente des hôtels et restaurants partenaires. Les réservations se font directement auprès de ces établissements (téléphone, WhatsApp ou email) : la Fondation Nguon ne reçoit pas ces échanges.",
      ],
    },
    {
      title: "Emails que nous envoyons",
      body: [
        "Nous envoyons uniquement des emails liés à une action que vous venez de faire : le code de confirmation de votre vote ou la réponse à votre message. Nous n'envoyons ni newsletter ni publicité, et nous ne vendons, ne louons et n'échangeons jamais vos données.",
      ],
    },
    {
      title: "Avec qui vos données sont partagées",
      body: [
        "Vos données sont accessibles uniquement à l'équipe de la Fondation Nguon chargée du service concerné, et aux prestataires techniques qui nous aident à faire fonctionner le site, chacun pour sa mission :",
        "- notre hébergeur, qui exploite le serveur où sont stockées les données du site ;",
        "- Google (service Gmail pour l'envoi d'emails, Google Analytics pour les statistiques de visite) ;",
        "- Mailgun (groupe Sinch), pour l'envoi des emails de confirmation ;",
        "- CamPay, pour le paiement par Mobile Money (MTN MoMo, Orange Money) des commandes de la boutique ; nous ne recevons ni votre code secret ni vos identifiants de paiement ;",
        "- OVHcloud, pour la gestion du nom de domaine.",
        "Certains de ces prestataires peuvent traiter les données en dehors du Cameroun, notamment en Europe et aux États-Unis.",
      ],
    },
    {
      title: "Combien de temps nous les conservons",
      body: [
        "- Données de vote : jusqu'à la proclamation des résultats du concours, puis 6 mois au plus, avant suppression.",
        "- Messages du formulaire de contact : 1 an après notre dernier échange.",
        "- Dossiers d'inscription aux concours : pendant le concours, puis 1 an au plus.",
        "- Commandes de la boutique : le temps nécessaire au traitement de la commande et au respect de nos obligations comptables et légales.",
      ],
    },
    {
      title: "Cookies et stockage sur votre appareil",
      body: [
        "Le site enregistre quelques informations dans votre navigateur :",
        "- votre langue et votre thème d'affichage (clair ou sombre) ;",
        "- le contenu de votre panier, pendant votre visite de la boutique ;",
        "- un identifiant aléatoire, qui permet de n'accepter qu'un seul vote par appareil ; il ne contient aucune information sur vous ;",
        "- les cookies de Google Analytics, pour les statistiques de visite.",
        "Vous pouvez effacer ces informations à tout moment depuis les réglages de votre navigateur.",
      ],
    },
    {
      title: "Sécurité",
      body: [
        "Le site est accessible uniquement en connexion chiffrée (HTTPS). L'accès à l'espace d'administration est réservé aux membres autorisés de l'équipe, avec identifiant et mot de passe. Les documents des candidats ne sont accessibles qu'à l'équipe chargée des concours.",
      ],
    },
    {
      title: "Vos droits",
      body: [
        `Vous pouvez à tout moment demander à consulter, corriger ou supprimer vos données, ou vous opposer à leur utilisation, en écrivant à ${LEGAL_CONTACT}. Nous vous répondrons dans un délai d'un mois.`,
        "La suppression des données d'un vote entraîne l'annulation de ce vote.",
      ],
    },
    {
      title: "Mineurs",
      body: [
        "Les mineurs qui s'inscrivent à un concours doivent joindre une autorisation parentale.",
      ],
    },
    {
      title: "Modifications",
      body: [
        "Nous pouvons mettre à jour cette politique. La date de dernière mise à jour est indiquée en haut de la page.",
      ],
    },
  ],
};

const privacyEn: LegalDoc = {
  title: "Privacy Policy",
  intro:
    "This policy explains which personal data nguonevents.com collects, why, who it is shared with, how long it is kept and how to exercise your rights.",
  sections: [
    {
      title: "Who we are",
      body: [
        "nguonevents.com is published by the Fondation Nguon, organizer of the Nguon festival, the Great Traditional, Cultural and Economic Days of the Bamoun people, in Foumban (West Region, Cameroon). The Fondation Nguon is responsible for the data collected on this site.",
        `For any question about your data: ${LEGAL_CONTACT}.`,
      ],
    },
    {
      title: "What we collect and why",
      body: [
        "We only collect data you give us yourself, for the service you request:",
        "- Miss & Mister vote: your email address, the confirmation code sent to you, the date of the vote, the profile you chose and a random identifier stored by your browser. This lets us check that each vote comes from a real person and accept only one vote per email address and per device.",
        "- Contact form: your name, your email address and your message, so we can reply.",
        "- Contest registration: your identity (full name, date of birth, sex, nationality), your occupation or institution, your city, your phone and WhatsApp numbers, your email, an emergency contact, your signature and the requested documents (ID card or birth certificate, CV or project presentation, parental authorization for minors, medical certificate for sports competitions). This data is used to review and manage your application.",
        "- Shop: your name, phone, email, delivery address, the items ordered and the payment reference, to process and deliver your order.",
        "- Audience measurement: visit statistics collected by Google Analytics (pages viewed, device type, country), to understand how the site is used and improve it.",
        "The Booking section lists partner hotels and restaurants. Bookings are made directly with those establishments (phone, WhatsApp or email): the Fondation Nguon does not receive these exchanges.",
      ],
    },
    {
      title: "Emails we send",
      body: [
        "We only send emails related to something you just did: your vote confirmation code or the reply to your message. We send no newsletters or advertising, and we never sell, rent or trade your data.",
      ],
    },
    {
      title: "Who your data is shared with",
      body: [
        "Your data is only accessible to the Fondation Nguon team in charge of the service concerned, and to the technical providers that help us run the site, each for its own task:",
        "- our hosting provider, which runs the server where the site's data is stored;",
        "- Google (Gmail for sending emails, Google Analytics for visit statistics);",
        "- Mailgun (Sinch group), for sending confirmation emails;",
        "- CamPay, for Mobile Money payments (MTN MoMo, Orange Money) of shop orders; we never receive your PIN or payment credentials;",
        "- OVHcloud, for managing the domain name.",
        "Some of these providers may process data outside Cameroon, including in Europe and the United States.",
      ],
    },
    {
      title: "How long we keep it",
      body: [
        "- Vote data: until the contest results are announced, then at most 6 months, before deletion.",
        "- Contact form messages: 1 year after our last exchange.",
        "- Contest applications: for the duration of the contest, then at most 1 year.",
        "- Shop orders: as long as needed to process the order and meet our accounting and legal obligations.",
      ],
    },
    {
      title: "Cookies and storage on your device",
      body: [
        "The site stores a few items in your browser:",
        "- your language and display theme (light or dark);",
        "- the contents of your shop cart, during your visit;",
        "- a random identifier that allows only one vote per device; it contains no information about you;",
        "- Google Analytics cookies, for visit statistics.",
        "You can clear these at any time from your browser settings.",
      ],
    },
    {
      title: "Security",
      body: [
        "The site is only reachable over an encrypted connection (HTTPS). The administration area is restricted to authorized team members with a username and password. Applicants' documents are only accessible to the team in charge of the contests.",
      ],
    },
    {
      title: "Your rights",
      body: [
        `You can ask at any time to access, correct or delete your data, or object to its use, by writing to ${LEGAL_CONTACT}. We will reply within one month.`,
        "Deleting the data of a vote cancels that vote.",
      ],
    },
    {
      title: "Minors",
      body: ["Minors registering for a contest must attach a parental authorization."],
    },
    {
      title: "Changes",
      body: ["We may update this policy. The date of the last update is shown at the top of the page."],
    },
  ],
};

const termsFr: LegalDoc = {
  title: "Conditions d'utilisation",
  intro:
    "Ces conditions s'appliquent à toute personne qui utilise le site nguonevents.com. En utilisant le site, vous les acceptez.",
  sections: [
    {
      title: "Objet du site",
      body: [
        "Le site nguonevents.com est le site officiel du festival Nguon, édité par la Fondation Nguon (Foumban, Cameroun). Il présente le festival et son programme, et permet de voter pour les candidats Miss & Mister, de s'inscrire aux concours, de commander des articles de la boutique et de trouver un hébergement ou un restaurant.",
      ],
    },
    {
      title: "Vote Miss & Mister",
      body: [
        "- Le vote est gratuit et ouvert à tous.",
        "- Chaque personne peut voter une seule fois : un seul vote est accepté par adresse email et par appareil.",
        "- Pour voter, vous devez utiliser une adresse email qui vous appartient et saisir le code de confirmation reçu. Ce code est personnel et valable 10 minutes.",
        "- Sont interdits : l'utilisation d'adresses email qui ne vous appartiennent pas, l'utilisation de robots ou de scripts, le contournement de la règle d'un vote par appareil, ainsi que l'achat ou la vente de votes.",
        "- La Fondation Nguon peut annuler tout vote obtenu de manière frauduleuse.",
        "- Le nombre de votes affiché sur le site peut évoluer. Les résultats officiels sont annoncés par les organisateurs du festival.",
      ],
    },
    {
      title: "Inscription aux concours",
      body: [
        "Les informations et documents fournis lors d'une inscription doivent être exacts et authentiques. Chaque concours est soumis à ses propres règles, présentées dans sa fiche descriptive sur la page Concours. La Fondation Nguon peut refuser ou annuler une candidature incomplète, inexacte ou non conforme à ces règles.",
      ],
    },
    {
      title: "Boutique",
      body: [
        "Les prix sont indiqués en francs CFA (FCFA). Le paiement se fait par Mobile Money (MTN MoMo ou Orange Money) via notre prestataire de paiement CamPay. Une commande est confirmée une fois le paiement validé. Pour toute question sur une commande, sa livraison ou un retour, contactez-nous à l'adresse indiquée ci-dessous.",
      ],
    },
    {
      title: "Réservations",
      body: [
        "Les informations sur les hôtels et restaurants (description, prix, disponibilités, coordonnées) sont fournies par ces établissements. Les réservations se concluent directement entre vous et l'établissement ; la Fondation Nguon n'est pas partie à ce contrat.",
      ],
    },
    {
      title: "Propriété intellectuelle",
      body: [
        "Les textes, photographies, vidéos, logos et éléments graphiques du site appartiennent à la Fondation Nguon ou à leurs auteurs. Toute reproduction ou réutilisation sans autorisation est interdite. Le partage des liens du site sur les réseaux sociaux est autorisé et encouragé.",
      ],
    },
    {
      title: "Utilisation du site",
      body: [
        "Vous vous engagez à ne pas perturber le fonctionnement du site, à ne pas tenter d'accéder à l'espace d'administration sans autorisation et à ne pas publier de contenu illicite ou injurieux par le formulaire de contact.",
      ],
    },
    {
      title: "Responsabilité",
      body: [
        "Nous faisons notre possible pour que le site soit disponible et que ses informations soient exactes, mais nous ne pouvons garantir l'absence d'interruptions ou d'erreurs. Le programme du festival peut être modifié par les organisateurs.",
      ],
    },
    {
      title: "Données personnelles",
      body: [
        "L'utilisation de vos données personnelles est décrite dans notre politique de confidentialité, accessible depuis le bas de chaque page.",
      ],
    },
    {
      title: "Droit applicable et contact",
      body: [
        "Ces conditions sont soumises au droit camerounais.",
        `Pour toute question : ${LEGAL_CONTACT}.`,
      ],
    },
  ],
};

const termsEn: LegalDoc = {
  title: "Terms of Use",
  intro: "These terms apply to anyone using nguonevents.com. By using the site, you accept them.",
  sections: [
    {
      title: "Purpose of the site",
      body: [
        "nguonevents.com is the official website of the Nguon festival, published by the Fondation Nguon (Foumban, Cameroon). It presents the festival and its program, and lets visitors vote for the Miss & Mister candidates, register for contests, order items from the shop and find accommodation or restaurants.",
      ],
    },
    {
      title: "Miss & Mister vote",
      body: [
        "- Voting is free and open to everyone.",
        "- Each person may vote only once: one vote is accepted per email address and per device.",
        "- To vote, you must use an email address that belongs to you and enter the confirmation code you receive. The code is personal and valid for 10 minutes.",
        "- The following are prohibited: using email addresses that are not yours, using bots or scripts, circumventing the one-vote-per-device rule, and buying or selling votes.",
        "- The Fondation Nguon may cancel any vote obtained fraudulently.",
        "- The vote counts shown on the site may change. Official results are announced by the festival organizers.",
      ],
    },
    {
      title: "Contest registration",
      body: [
        "Information and documents provided when registering must be accurate and authentic. Each contest has its own rules, set out in its description sheet on the Contests page. The Fondation Nguon may refuse or cancel an application that is incomplete, inaccurate or does not follow those rules.",
      ],
    },
    {
      title: "Shop",
      body: [
        "Prices are shown in CFA francs (FCFA). Payment is made by Mobile Money (MTN MoMo or Orange Money) through our payment provider CamPay. An order is confirmed once payment is validated. For any question about an order, its delivery or a return, contact us at the address below.",
      ],
    },
    {
      title: "Booking",
      body: [
        "Information about hotels and restaurants (description, prices, availability, contact details) is provided by those establishments. Bookings are made directly between you and the establishment; the Fondation Nguon is not a party to that agreement.",
      ],
    },
    {
      title: "Intellectual property",
      body: [
        "The texts, photographs, videos, logos and graphic elements of the site belong to the Fondation Nguon or their authors. Any reproduction or reuse without permission is prohibited. Sharing links to the site on social media is allowed and encouraged.",
      ],
    },
    {
      title: "Use of the site",
      body: [
        "You agree not to disrupt the operation of the site, not to attempt to access the administration area without authorization, and not to send unlawful or abusive content through the contact form.",
      ],
    },
    {
      title: "Liability",
      body: [
        "We do our best to keep the site available and its information accurate, but we cannot guarantee it will be free of interruptions or errors. The festival program may be changed by the organizers.",
      ],
    },
    {
      title: "Personal data",
      body: ["How we use your personal data is described in our privacy policy, linked at the bottom of every page."],
    },
    {
      title: "Applicable law and contact",
      body: ["These terms are governed by Cameroonian law.", `For any question: ${LEGAL_CONTACT}.`],
    },
  ],
};

export const LEGAL_DOCS = {
  privacy: { fr: privacyFr, en: privacyEn },
  terms: { fr: termsFr, en: termsEn },
};
