"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Heart, Tag, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromotionalBannerProps {
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  linkUrl?: string;
  linkText?: string;
  badge?: string;
  variant?: "default" | "large" | "small";
  className?: string;
}

export function PromotionalBanner({
  title,
  description,
  imageUrl,
  imageAlt,
  linkUrl,
  linkText = "Ver más",
  badge,
  variant = "default",
  className,
}: PromotionalBannerProps) {
  const [imageError, setImageError] = useState(false);
  
  const variantClasses = {
    default: "h-64 md:h-80",
    large: "h-80 md:h-96",
    small: "h-48 md:h-64",
  };

  const handleClick = () => {
    if (linkUrl) {
      window.location.href = linkUrl;
    }
  };
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card 
      className={cn("relative overflow-hidden group", variantClasses[variant], className, linkUrl && "cursor-pointer")}
      onClick={linkUrl ? handleClick : undefined}
      role={linkUrl ? "button" : undefined}
      tabIndex={linkUrl ? 0 : undefined}
      onKeyDown={linkUrl ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      } : undefined}
      aria-label={linkUrl ? `${title} - ${linkText}` : title}
    >
      {/* Imagen de fondo */}
      {imageUrl && !imageError ? (
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={variant === "large"}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            onError={handleImageError}
          />
          {/* Overlay oscuro para mejor legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 gradient-orange">
          {/* Patrón decorativo de construcción con estilo de las imágenes */}
          <div className="absolute inset-0 pattern-dots opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-primary/20"></div>
          {/* Elementos decorativos SVG más sutiles */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400">
              {/* Herramientas estilizadas */}
              <rect x="100" y="150" width="80" height="60" rx="4" fill="currentColor" opacity="0.4"/>
              <circle cx="250" cy="180" r="25" fill="currentColor" opacity="0.3"/>
              <polygon points="400,200 450,150 500,200" fill="currentColor" opacity="0.3"/>
              {/* Patrón de ladrillos */}
              <rect x="600" y="200" width="100" height="50" rx="2" fill="currentColor" opacity="0.2"/>
              <rect x="700" y="200" width="100" height="50" rx="2" fill="currentColor" opacity="0.2"/>
              <rect x="650" y="250" width="100" height="50" rx="2" fill="currentColor" opacity="0.2"/>
            </svg>
          </div>
        </div>
      )}

      {/* Badge */}
      {badge && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Tag className="h-3 w-3" aria-hidden="true" />
            {badge}
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="relative z-10 h-full flex flex-col justify-end p-4 sm:p-6 md:p-8">
        <div className="max-w-2xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg">
            {title}
          </h2>
          {description && (
            <p className="text-white/90 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 drop-shadow-md line-clamp-2 sm:line-clamp-none">
              {description}
            </p>
          )}
          {linkUrl && (
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Link href={linkUrl}>
                {linkText}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

