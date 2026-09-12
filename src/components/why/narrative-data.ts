export type NarrativeStep = {
  word: string;
  title: string;
  desc: string;
  image: string;
};

export const NARRATIVE_STEPS: NarrativeStep[] = [
  {
    word: "Meet",
    title: "A social meeting point",
    desc: "Coffee naturally creates a place where attendees stop, slow down and interact with each other.",
    image: "/why/meet.png",
  },
  {
    word: "Drink",
    title: "A better event experience",
    desc: "A premium hospitality moment, brought directly into the atmosphere of your event.",
    image: "/why/drink.png",
  },
  {
    word: "Connect",
    title: "More engagement, more community",
    desc: "People stay longer and enjoy the venue — the stand becomes part of the event itself, not just a vendor.",
    image: "/why/connect.png",
  },
  {
    word: "Share",
    title: "Shareable, brandable moments",
    desc: "Beautiful drinks and setups naturally generate content — with room for sponsor and event branding.",
    image: "/why/share.png",
  },
];
