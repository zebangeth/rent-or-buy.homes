import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buy vs. Rent Calculator",
  description: "Compare buying vs renting outcomes with transparent assumptions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
