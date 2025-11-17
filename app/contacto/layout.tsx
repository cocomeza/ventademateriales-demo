import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contáctanos para consultas sobre productos, pedidos o cualquier otra inquietud. Estamos disponibles por teléfono, WhatsApp, email o visita nuestro local.",
  alternates: {
    canonical: "/contacto",
  },
  openGraph: {
    title: "Contacto - MaterialesYA",
    description: "Contáctanos para consultas sobre productos, pedidos o cualquier otra inquietud.",
    url: "/contacto",
  },
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

