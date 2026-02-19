import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "rent-or-buy.homes",
    short_name: "RentOrBuy",
    description: "Compare buying and renting outcomes with transparent long-term financial projections.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#1e293b",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
