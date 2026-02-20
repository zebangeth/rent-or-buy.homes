import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rent-or-buy.homes"),
  title: {
    default: "Buy vs. Rent Calculator | rent-or-buy.homes",
    template: "%s | rent-or-buy.homes",
  },
  description:
    "Compare buying vs renting with transparent assumptions, taxes, and opportunity-cost investing scenarios.",
  applicationName: "rent-or-buy.homes",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "buy vs rent calculator",
    "rent vs buy",
    "home affordability",
    "mortgage vs rent",
    "financial planning",
    "real estate calculator",
  ],
  openGraph: {
    type: "website",
    url: "/",
    siteName: "rent-or-buy.homes",
    title: "Buy vs. Rent Calculator | rent-or-buy.homes",
    description:
      "Instantly compare long-term net worth outcomes between buying and renting with transparent assumptions.",
    images: [
      {
        url: "/title3.png",
        alt: "rent-or-buy.homes calculator preview",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy vs. Rent Calculator | rent-or-buy.homes",
    description:
      "See whether buying or renting leaves you with higher net worth across 10-30 year scenarios.",
    images: ["/title3.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
