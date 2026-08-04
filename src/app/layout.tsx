import type { Metadata } from "next";
import { Inter, Rubik_Wet_Paint } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const graffiti = Rubik_Wet_Paint({
  variable: "--font-graffiti-family",
  subsets: ["latin"],
  weight: "400",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: "DripHouse | Streetwear Reseller #1 US-AR",
    template: "%s | DripHouse",
  },
  description:
    "DripHouse - Reseller #1 US-AR. Stock, encargos y trends en streetwear, articulos 100% originales.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    siteName: "DripHouse",
    type: "website",
    locale: "es_AR",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${graffiti.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
