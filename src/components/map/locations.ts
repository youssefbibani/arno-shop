export type EventCategory = "sport" | "corporate" | "lifestyle" | "private";

export const EVENT_CATEGORIES: {
  id: EventCategory;
  label: string;
  examples: string[];
}[] = [
  {
    id: "sport",
    label: "Sport",
    examples: ["Running races", "Fitness competitions", "Sports tournaments"],
  },
  {
    id: "corporate",
    label: "Corporate",
    examples: ["Company events", "Team events", "Conferences"],
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
    examples: ["Festivals", "Launches", "Community events"],
  },
  {
    id: "private",
    label: "Private",
    examples: ["Weddings", "Celebrations", "Private experiences"],
  },
];

export type ArnoLocation = {
  id: string;
  name: string;
  region: string;
  /** position within the map's 0 0 600 900 viewBox */
  x: number;
  y: number;
  /** which side the text label sits on — lets tightly-clustered cities avoid overlap */
  labelSide?: "left" | "right";
  categories: EventCategory[];
  blurb: string;
};

/**
 * Placeholder coverage data for development — NOT confirmed active
 * ARNO locations. Swap via CMS/config before launch.
 */
export const LOCATIONS: ArnoLocation[] = [
  {
    id: "tunis",
    name: "Tunis",
    region: "Capital",
    x: 322,
    y: 172,
    labelSide: "left",
    categories: ["corporate", "lifestyle", "private"],
    blurb: "Capital-city launches, conferences and brand activations.",
  },
  {
    id: "la-marsa",
    name: "La Marsa",
    region: "Greater Tunis",
    x: 398,
    y: 118,
    categories: ["sport", "lifestyle", "private"],
    blurb: "Beachfront lifestyle events and private experiences.",
  },
  {
    id: "carthage",
    name: "Carthage",
    region: "Greater Tunis",
    x: 386,
    y: 148,
    categories: ["lifestyle", "private"],
    blurb: "Heritage-site gatherings and private celebrations.",
  },
  {
    id: "hammamet",
    name: "Hammamet",
    region: "Cap Bon",
    x: 404,
    y: 258,
    categories: ["lifestyle", "private", "corporate"],
    blurb: "Resort events, weddings and destination celebrations.",
  },
  {
    id: "nabeul",
    name: "Nabeul",
    region: "Cap Bon",
    x: 419,
    y: 214,
    categories: ["lifestyle", "sport"],
    blurb: "Community festivals and regional lifestyle events.",
  },
  {
    id: "sousse",
    name: "Sousse",
    region: "Sahel",
    x: 423,
    y: 340,
    categories: ["sport", "corporate", "lifestyle"],
    blurb: "Regional sports meets and corporate activations.",
  },
  {
    id: "monastir",
    name: "Monastir",
    region: "Sahel",
    x: 431,
    y: 366,
    labelSide: "left",
    categories: ["sport", "private"],
    blurb: "Coastal races and private experiences.",
  },
];
