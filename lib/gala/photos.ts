export const driveImage = (id: string, width = 2200) =>
  `https://lh3.googleusercontent.com/d/${id}=w${width}`;

export const galaPhotos = {
  hero: {
    src: driveImage("1FXIA91WavmA3vEPLMRW_p9KjmPSP_9in"),
    alt: "Guests gathered at City Center's Stories From the Center Gala in Oklahoma City",
  },
  heroSupport: {
    src: driveImage("1DdB-i0Ky5jOlt2XADXY_BBrb_Ai9uvNV", 1600),
    alt: "Elegant evening atmosphere at the City Center Gala",
  },
  detail: {
    src: driveImage("1aJOtReJfkADBNpLbqSJ9VzzmS55q-24x", 1600),
    alt: "Gala details from Stories From the Center",
  },
  eveningPrimary: {
    src: driveImage("1FCPevUmzzT4HsVhXLvRysdxZCHtw-1iB", 1600),
    alt: "Guests attending Stories From the Center, City Center's annual Gala",
  },
  eveningSecondary: {
    src: driveImage("1VnK8kaV4__D2qtKX7L9rF_JULqEmy2IR", 1600),
    alt: "Dinner and gathering at City Center's annual Gala",
  },
  auctionAtmosphere: {
    src: driveImage("12HbW3z3GAj_eM7osr6FcuWWEU2sGVsIf", 1800),
    alt: "Auction and giving moment atmosphere at the City Center Gala",
  },
} as const;
