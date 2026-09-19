// Gala photos are served from this repo (public/gala) rather than hotlinked
// from Google Drive, so a sharing change in Drive cannot blank the page.
// Run scripts/fetch-gala-photos.sh once to populate public/gala, then commit
// the files. driveImage stays exported for anything still pointing at Drive.
export const driveImage = (id: string, width = 2200) =>
  `https://lh3.googleusercontent.com/d/${id}=w${width}`;

export const galaPhotos = {
  hero: {
    src: "/gala/hero.jpg",
    alt: "Guests gathered at City Center's Stories From the Center Gala in Oklahoma City",
  },
  heroSupport: {
    src: "/gala/hero-support.jpg",
    alt: "Elegant evening atmosphere at the City Center Gala",
  },
  detail: {
    src: "/gala/detail.jpg",
    alt: "Gala details from Stories From the Center",
  },
  eveningPrimary: {
    src: "/gala/evening-primary.jpg",
    alt: "Guests attending Stories From the Center, City Center's annual Gala",
  },
  eveningSecondary: {
    src: "/gala/evening-secondary.jpg",
    alt: "Dinner and gathering at City Center's annual Gala",
  },
  auctionAtmosphere: {
    src: "/gala/auction-atmosphere.jpg",
    alt: "Auction and giving moment atmosphere at the City Center Gala",
  },
} as const;
