"use client";

import Link from "next/link";
import { Facebook, Instagram, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-primary/5 to-white border-t border-primary/20 mt-auto">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6">
          {/* Redes Sociales */}
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-base sm:text-lg mb-3 text-primary flex items-center justify-center sm:justify-start gap-2">
              <span className="h-0.5 w-6 bg-primary rounded-full"></span>
              Síguenos
            </h3>
            <div className="flex gap-2 justify-center sm:justify-start">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-primary/20 text-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/40 transition-all shadow-sm hover:shadow"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
                <span className="hidden sm:inline text-sm font-medium">Facebook</span>
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-primary/20 text-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/40 transition-all shadow-sm hover:shadow"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
                <span className="hidden sm:inline text-sm font-medium">Instagram</span>
              </a>
            </div>
          </div>

          {/* Información Legal */}
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-base sm:text-lg mb-3 text-primary flex items-center justify-center sm:justify-start gap-2">
              <span className="h-0.5 w-6 bg-primary rounded-full"></span>
              Información Legal
            </h3>
            <div className="flex flex-col gap-2 items-center sm:items-start">
              <Button
                variant="ghost"
                size="sm"
                className="justify-center sm:justify-start h-auto py-1 px-2 text-xs sm:text-sm text-foreground hover:text-primary hover:bg-primary/5"
                asChild
              >
                <Link href="/terminos-y-condiciones">
                  Términos y Condiciones
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-center sm:justify-start h-auto py-1 px-2 text-xs sm:text-sm text-foreground hover:text-primary hover:bg-primary/5"
                asChild
              >
                <Link href="/privacidad">
                  Términos de Privacidad
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-center sm:justify-start h-auto py-1 px-2 text-xs sm:text-sm text-foreground hover:text-primary hover:bg-primary/5"
                asChild
              >
                <a
                  href="https://www.argentina.gob.ar/defensadelconsumidor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  Defensa al Consumidor
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>

          {/* Contacto */}
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-base sm:text-lg mb-3 text-primary flex items-center justify-center sm:justify-start gap-2">
              <span className="h-0.5 w-6 bg-primary rounded-full"></span>
              Contacto
            </h3>
            <div className="bg-white rounded-md p-3 border border-primary/20 shadow-sm">
              <p className="text-foreground text-xs sm:text-sm font-medium mb-0.5">
                ¿Tienes alguna pregunta?
              </p>
              <p className="text-foreground text-xs text-muted-foreground">
                Estamos aquí para ayudarte.
              </p>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-primary/20 pt-4 mt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            {/* Copyright */}
            <p className="text-xs sm:text-sm text-foreground font-medium text-center md:text-left">
              © {currentYear} MaterialesYA. Todos los derechos reservados.
            </p>

            {/* Desarrollador */}
            <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end">
              <span className="text-xs sm:text-sm text-muted-foreground">
                Desarrollado por
              </span>
              <a
                href="https://botoncreativo.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-all bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-md border border-primary/30 shadow-sm hover:shadow"
              >
                Botón Creativo
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

