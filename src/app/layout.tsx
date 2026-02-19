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
      <body>{children}</body>
    </html>
  );
}
