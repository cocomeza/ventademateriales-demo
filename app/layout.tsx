import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "MaterialesYA - Materiales de Construcción",
    template: "%s | MaterialesYA",
  },
  description: "Encuentra los mejores materiales de construcción para tu proyecto. Amplio catálogo de productos de calidad con precios competitivos y entrega rápida.",
  keywords: ["materiales de construcción", "construcción", "herramientas", "cemento", "ladrillos", "Argentina"],
  authors: [{ name: "MaterialesYA" }],
  creator: "MaterialesYA",
  publisher: "MaterialesYA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: "MaterialesYA",
    title: "MaterialesYA - Materiales de Construcción",
    description: "Encuentra los mejores materiales de construcción para tu proyecto. Amplio catálogo de productos de calidad con precios competitivos y entrega rápida.",
    images: [
      {
        url: "/images/logo.materiales.jpeg",
        width: 1200,
        height: 630,
        alt: "MaterialesYA - Materiales de Construcción",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MaterialesYA - Materiales de Construcción",
    description: "Encuentra los mejores materiales de construcción para tu proyecto.",
    images: ["/images/logo.materiales.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
        {/* Skip link para navegación con teclado */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Saltar al contenido principal
        </a>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

