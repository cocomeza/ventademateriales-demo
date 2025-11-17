"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug?: string;
  imageUrl?: string;
  description?: string;
  productCount?: number;
}

interface CategoryShowcaseProps {
  categories: Category[];
  title?: string;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function CategoryShowcase({
  categories,
  title = "Categorías Destacadas",
  columns = 3,
  className,
}: CategoryShowcaseProps) {
  const gridClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section className={cn("py-8 md:py-12", className)} aria-labelledby="category-showcase-title">
      {title && (
        <h2 id="category-showcase-title" className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
          {title}
        </h2>
      )}
      <div className={cn("grid gap-6", gridClasses[columns])}>
        {categories.map((category) => {
          const categoryUrl = category.slug ? `/categorias/${category.slug}` : `/?category=${category.id}`;
          
          return (
            <Card
              key={category.id}
              className="group relative overflow-hidden hover:shadow-lg transition-all border-primary/10 hover:border-primary/30"
            >
              <Link href={categoryUrl} className="block" aria-label={`Ver categoría ${category.name}`}>
                <div className="relative h-40 sm:h-48 md:h-64 overflow-hidden">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
                      <span className="text-4xl font-bold text-muted-foreground">
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {/* Overlay con iconos */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                    <div className="bg-white/90 rounded-full p-3">
                      <ShoppingCart className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div className="bg-white/90 rounded-full p-3">
                      <Heart className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-3 sm:p-4">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  {category.productCount !== undefined && (
                    <p className="text-xs text-muted-foreground">
                      {category.productCount} {category.productCount === 1 ? "producto" : "productos"}
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full group-hover:bg-primary group-hover:text-primary-foreground"
                    asChild
                  >
                    <span>
                      Ver productos
                      <ArrowRight className="ml-2 h-4 w-4 inline" aria-hidden="true" />
                    </span>
                  </Button>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

