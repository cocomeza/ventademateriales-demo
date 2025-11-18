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
    <main className="container mx-auto px-3 sm:px-4 py-3 sm:py-6 md:py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-6 md:mb-8 text-center text-primary">Contacto</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-4 sm:mb-6 md:mb-8">
          {/* Información de Contacto */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="bg-primary/5 py-3 sm:py-4 px-3 sm:px-6">
                <CardTitle className="flex items-center justify-center gap-2 text-primary text-sm sm:text-base md:text-lg">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Teléfono
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 py-3 sm:py-4">
                <p className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-foreground text-center">{contactInfo.phone}</p>
                <Button
                  asChild
                  className="w-full h-9 sm:h-10 text-sm sm:text-base"
                  variant="default"
                >
                  <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}>
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Llamar ahora
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="bg-primary/5 py-3 sm:py-4 px-3 sm:px-6">
                <CardTitle className="flex items-center justify-center gap-2 text-primary text-sm sm:text-base md:text-lg">
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 py-3 sm:py-4">
                <Button
                  asChild
                  className="w-full h-9 sm:h-10 text-sm sm:text-base"
                  variant="default"
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Abrir WhatsApp
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="bg-primary/5 py-3 sm:py-4 px-3 sm:px-6">
                <CardTitle className="flex items-center justify-center gap-2 text-primary text-sm sm:text-base md:text-lg">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 py-3 sm:py-4">
                <p className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-foreground break-all text-center">{contactInfo.email}</p>
                <Button
                  asChild
                  className="w-full h-9 sm:h-10 text-sm sm:text-base"
                  variant="default"
                >
                  <a href={`mailto:${contactInfo.email}`}>
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Enviar Email
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="bg-primary/5 py-3 sm:py-4 px-3 sm:px-6">
                <CardTitle className="flex items-center justify-center gap-2 text-primary text-sm sm:text-base md:text-lg">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Horarios de Atención
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 py-3 sm:py-4">
                <div className="space-y-1 sm:space-y-2 text-center">
                  <p className="text-xs sm:text-sm text-foreground">{contactInfo.hours.weekdays}</p>
                  <p className="text-xs sm:text-sm text-foreground">{contactInfo.hours.saturday}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{contactInfo.hours.sunday}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mapa y Dirección */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="bg-primary/5 py-3 sm:py-4 px-3 sm:px-6">
                <CardTitle className="flex items-center justify-center gap-2 text-primary text-sm sm:text-base md:text-lg">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 py-3 sm:py-4">
                <p className="text-sm sm:text-base text-foreground mb-3 sm:mb-4 text-center">{contactInfo.address}</p>
                <Button
                  asChild
                  className="w-full h-9 sm:h-10 text-sm sm:text-base"
                  variant="default"
                >
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Ver en Google Maps
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Mapa embebido */}
            <Card className="overflow-hidden border-primary/20">
              <CardContent className="p-0">
                <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] bg-muted">
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

