"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

export default function ContactoPage() {
  // Información de contacto - puedes mover esto a variables de entorno
  const contactInfo = {
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+54 9 11 1234-5678",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5491112345678",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contacto@materialesya.com",
    address: process.env.NEXT_PUBLIC_STORE_ADDRESS || "Av. Principal 1234, Buenos Aires, Argentina",
    // Coordenadas para el mapa (lat, lng) - Ejemplo: Buenos Aires
    mapLat: process.env.NEXT_PUBLIC_MAP_LAT || "-34.6037",
    mapLng: process.env.NEXT_PUBLIC_MAP_LNG || "-58.3816",
    hours: {
      weekdays: "Lunes a Viernes: 8:00 - 18:00",
      saturday: "Sábados: 9:00 - 13:00",
      sunday: "Domingos: Cerrado",
    },
  };

  const whatsappUrl = `https://wa.me/${contactInfo.whatsapp}`;
  const mapUrl = `https://www.google.com/maps?q=${contactInfo.mapLat},${contactInfo.mapLng}`;

  return (
    <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8 text-center text-primary">Contacto</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {/* Información de Contacto */}
          <div className="space-y-6">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Phone className="h-5 w-5 text-primary" />
                  Teléfono
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold mb-2 text-foreground">{contactInfo.phone}</p>
                <Button
                  asChild
                  className="w-full"
                  variant="default"
                >
                  <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Llamar ahora
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  className="w-full"
                  variant="default"
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Abrir WhatsApp
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Mail className="h-5 w-5 text-primary" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold mb-2 text-foreground">{contactInfo.email}</p>
                <Button
                  asChild
                  className="w-full"
                  variant="default"
                >
                  <a href={`mailto:${contactInfo.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar Email
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Clock className="h-5 w-5 text-primary" />
                  Horarios de Atención
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-foreground">{contactInfo.hours.weekdays}</p>
                  <p className="text-sm text-foreground">{contactInfo.hours.saturday}</p>
                  <p className="text-sm text-muted-foreground">{contactInfo.hours.sunday}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mapa y Dirección */}
          <div className="space-y-6">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <MapPin className="h-5 w-5 text-primary" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">{contactInfo.address}</p>
                <Button
                  asChild
                  className="w-full"
                  variant="default"
                >
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin className="h-4 w-4 mr-2" />
                    Ver en Google Maps
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Mapa embebido */}
            <Card className="overflow-hidden border-primary/20">
              <CardContent className="p-0">
                <div className="relative w-full h-[400px] bg-muted">
                  {/* Mapa usando OpenStreetMap (gratis, sin API key) */}
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(contactInfo.mapLng) - 0.01},${parseFloat(contactInfo.mapLat) - 0.01},${parseFloat(contactInfo.mapLng) + 0.01},${parseFloat(contactInfo.mapLat) + 0.01}&layer=mapnik&marker=${contactInfo.mapLat},${contactInfo.mapLng}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación de MaterialesYA"
                    className="absolute inset-0"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </main>
  );
}

