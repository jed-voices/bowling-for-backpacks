// Photography from City Center's Gala, served from this repo so the page never
// depends on an outside host at request time. `position` is the CSS
// object-position for each frame, chosen so faces and subjects survive the crop
// at every breakpoint.
export const galaPhotos = {
  hero: {
    src: "/gala/hero.jpg",
    alt: "Guests gathered around candlelit tables at City Center's Stories From the Center Gala",
    position: "70% 48%",
  },
  heroSupport: {
    src: "/gala/speaker.jpg",
    alt: "A City Center leader speaking to guests from the Gala stage",
    position: "50% 22%",
  },
  rallyCry: {
    src: "/gala/program.jpg",
    alt: "City Center's founder addressing the room during the Gala program",
    position: "60% 30%",
  },
  eveningPrimary: {
    src: "/gala/dance-floor.jpg",
    alt: "Guests dancing together late in the evening at the City Center Gala",
    position: "55% 45%",
  },
  eveningSecondary: {
    src: "/gala/guests.jpg",
    alt: "Two guests at their table during the City Center Gala",
    position: "50% 35%",
  },
  auctionAtmosphere: {
    src: "/gala/trophy.jpg",
    alt: "A guest holding the City Center Champion trophy during the Gala auction",
    position: "55% 35%",
  },
} as const;
