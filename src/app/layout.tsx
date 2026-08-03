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

export const metadata: Metadata = {
  title: "DripHouse | Streetwear Reseller #1 US-AR",
  description:
    "DripHouse - Reseller #1 US-AR. Stock, encargos y trends en streetwear, articulos 100% originales.",
  icons: {
    icon: "/favicon.ico",
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
