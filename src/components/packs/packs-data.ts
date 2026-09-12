export type PackId = "corner" | "signature" | "activation";

export type PackIcon = "clock" | "users" | "cup" | "sparkle" | "file";

export type PackMeta = {
  icon: PackIcon;
  label: string;
  value: string;
};

export type Pack = {
  id: PackId;
  index: string;
  name: string;
  tagline: string;
  description: string;
  meta: PackMeta[];
  featuresIntro?: string;
  features: string[];
  useCase: string;
  cta: string;
  featured?: boolean;
};

export const PACKS: Pack[] = [
  {
    id: "corner",
    index: "01",
    name: "Corner",
    tagline: "Un bar, un barista, du bon café.",
    description:
      "Notre format le plus simple. Idéal quand vous voulez un vrai café servi à vos invités, sans transformer votre événement en salon.",
    meta: [
      { icon: "clock", label: "Durée", value: "2h30" },
      { icon: "users", label: "Personnel", value: "1 barista" },
      { icon: "cup", label: "Boissons", value: "80" },
    ],
    features: [
      "Bar installé une heure avant vos invités, démonté après leur départ",
      "Café de spécialité, moulu sur place à chaque commande",
      "Espresso, americano, cappuccino, latte et une boisson glacée",
      "Lait entier et boisson d'avoine pour ceux qui ne prennent pas de lait",
      "Gobelets à votre prénom, votre date ou votre logo",
      "Barista en tenue, service souriant, poste propre du début à la fin",
    ],
    useCase: "Pour les anniversaires, baby showers, soutenances et ouvertures de boutique.",
    cta: "Choisir Corner",
  },
  {
    id: "signature",
    index: "02",
    name: "Signature",
    tagline: "Une boisson qui porte votre nom.",
    description:
      "Vous venez déguster, vous choisissez votre café, on crée la boisson de votre journée. Deux baristas pour que personne n'attende au moment du rush.",
    meta: [
      { icon: "clock", label: "Durée", value: "4h" },
      { icon: "users", label: "Personnel", value: "2 baristas" },
      { icon: "cup", label: "Boissons", value: "200" },
    ],
    featuresIntro: "Tout ce que comprend le Corner, et :",
    features: [
      "Dégustation avant le jour J : vous choisissez votre café et votre boisson",
      "Boisson créée et baptisée pour vous, annoncée sur le menu",
      "Deux baristas en parallèle, aucune file d'attente à l'ouverture du bar",
      "Bar habillé à vos couleurs, décor accordé avec votre organisateur",
      "Votre monogramme dessiné sur la mousse",
      "Gobelets, manchons et serviettes personnalisés",
      "Menu imprimé, en français et en anglais",
      "Visite du lieu avant l'événement, emplacement validé avec vous",
      "Photos et vidéo courte de votre bar, envoyées dans la semaine",
    ],
    useCase: "Pour les mariages, fiançailles, soirées de henné et grandes réceptions de famille.",
    cta: "Choisir Signature",
    featured: true,
  },
  {
    id: "activation",
    index: "03",
    name: "Brand Experience",
    tagline: "Votre marque dans la main de chaque visiteur.",
    description:
      "Un dispositif construit avec vous, filmé par ARNO Media, et mesuré après l'événement. On vous propose un plan une fois qu'on connaît votre lieu et votre objectif.",
    meta: [
      { icon: "sparkle", label: "Format", value: "Sur mesure" },
      { icon: "file", label: "Devis", value: "Sous 48h" },
    ],
    features: [
      "Bar entièrement habillé aux couleurs de votre marque",
      "Votre logo dessiné sur la mousse, QR code imprimé sur chaque gobelet",
      "Reels, photos et vidéo courte produits par ARNO Media",
      "Bilan après l'événement : boissons servies, heures de forte affluence, portée des contenus",
      "Un seul interlocuteur, du premier appel jusqu'au bilan",
    ],
    useCase: "Pour les séminaires, salons, lancements produit et activations de marque.",
    cta: "Demander un devis",
  },
];
