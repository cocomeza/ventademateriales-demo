"use client";

import { useState, useRef, useEffect } from "react";
import { Product } from "@/types";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCarouselProps {
  products: Product[];
  itemsPerView?: number;
  className?: string;
}

export function ProductCarousel({ 
  products, 
  itemsPerView = 4,
  className 
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(itemsPerView);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Calcular items a mostrar según el tamaño de pantalla (similar a MercadoLibre)
  useEffect(() => {
    const updateItemsToShow = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsToShow(1); // Mobile: 1 producto
      } else if (width < 768) {
        setItemsToShow(2); // Tablet pequeño: 2 productos
      } else if (width < 1024) {
        setItemsToShow(3); // Tablet: 3 productos
      } else if (width < 1280) {
        setItemsToShow(4); // Notebook: 4 productos
      } else if (width < 1536) {
        setItemsToShow(5); // Desktop: 5 productos
      } else {
        setItemsToShow(6); // Desktop grande: 6 productos
      }
    };

    updateItemsToShow();
    window.addEventListener('resize', updateItemsToShow);
    return () => window.removeEventListener('resize', updateItemsToShow);
  }, [itemsPerView]);

  const maxIndex = Math.max(0, products.length - itemsToShow);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const goToPrev = () => {
    if (canGoPrev) {
      const newIndex = Math.max(0, currentIndex - itemsToShow);
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  };

  const goToNext = () => {
    if (canGoNext) {
      const newIndex = Math.min(maxIndex, currentIndex + itemsToShow);
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardElement = container.querySelector('[data-product-card]') as HTMLElement;
      if (cardElement) {
        const cardWidth = cardElement.offsetWidth;
        const gap = 16; // gap-4 = 1rem = 16px
        const scrollPosition = index * (cardWidth + gap);
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const goToPage = (pageIndex: number) => {
    const newIndex = pageIndex * itemsToShow;
    if (newIndex >= 0 && newIndex <= maxIndex) {
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  };

  const totalPages = Math.ceil(products.length / itemsToShow);
  const currentPage = Math.floor(currentIndex / itemsToShow) + 1;

  if (products.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative w-full", className)}>
      {/* Contenedor del carrusel */}
      <div className="relative overflow-hidden">
        {/* Botón anterior */}
        {canGoPrev && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg h-10 w-10 rounded-full"
            onClick={goToPrev}
            aria-label="Productos anteriores"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}

        {/* Contenedor scrolleable */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          onScroll={(e) => {
            const container = e.currentTarget;
            const scrollLeft = container.scrollLeft;
            const cardElement = container.querySelector('[data-product-card]') as HTMLElement;
            if (cardElement) {
              const cardWidth = cardElement.offsetWidth;
              const gap = 16;
              const newIndex = Math.round(scrollLeft / (cardWidth + gap));
              setCurrentIndex(Math.min(maxIndex, Math.max(0, newIndex)));
            }
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              data-product-card
              className="flex-shrink-0"
              style={{
                width: '180px', // Ancho compacto similar a MercadoLibre
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Botón siguiente */}
        {canGoNext && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg h-10 w-10 rounded-full"
            onClick={goToNext}
            aria-label="Siguientes productos"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Indicadores de página */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6" role="navigation" aria-label="Navegación de productos">
          {/* Botón anterior para indicadores */}
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrev}
            disabled={!canGoPrev}
            className="h-8 w-8"
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Números de página */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "ghost"}
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-full",
                    currentPage === pageNum 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "hover:bg-primary/10"
                  )}
                  onClick={() => goToPage(pageNum - 1)}
                  aria-label={`Ir a página ${pageNum}`}
                  aria-current={currentPage === pageNum ? "page" : undefined}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          {/* Botón siguiente para indicadores */}
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            disabled={!canGoNext}
            className="h-8 w-8"
            aria-label="Página siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

