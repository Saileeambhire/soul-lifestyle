import type { Metadata } from "next";
import { Cormorant_Garamond, Bodoni_Moda, Inter, Pinyon_Script } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "THE SOUL LIFESTYLE | Wear Your Soul — French Fragrance Collection",
  description:
    "A luxury French fragrance collection created to express your individuality. Minimal, elegant, timeless haute perfumery crafted in Paris.",
  keywords: [
    "The Soul Lifestyle",
    "French Perfume",
    "Luxury Fragrance",
    "Haute Perfumery",
    "Wear Your Soul",
    "Parisian Perfume",
  ],
  authors: [{ name: "The Soul Lifestyle" }],
  openGraph: {
    title: "THE SOUL LIFESTYLE | Wear Your Soul",
    description: "A luxury French fragrance collection created to express your individuality.",
    url: "https://thesoullifestyle.com",
    siteName: "THE SOUL LIFESTYLE",
    images: [
      {
        url: "/images/hero_perfume.jpg",
        width: 1200,
        height: 800,
        alt: "The Soul Lifestyle Perfume",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${bodoni.variable} ${inter.variable} ${pinyon.variable}`}
    >
      <body className="bg-[#F8F4EC] text-[#29251F] font-sans antialiased selection:bg-[#B8862B]/20 selection:text-[#7A5515]">
        <ScrollProgress />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
