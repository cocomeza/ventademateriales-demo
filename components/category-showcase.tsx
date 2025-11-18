"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
    <section className={cn("py-4 md:py-6", className)} aria-labelledby="category-showcase-title">
      {title && (
        <h2 id="category-showcase-title" className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center">
          {title}
        </h2>
      )}
      <div className={cn("grid gap-3 sm:gap-4", gridClasses[columns])}>
        {categories.map((category) => {
          const categoryUrl = category.slug ? `/categorias/${category.slug}` : `/?category=${category.id}`;
          
          return (
            <Card
              key={category.id}
              className="group relative overflow-hidden hover:shadow-md transition-all border-primary/10 hover:border-primary/30"
            >
              <Link href={categoryUrl} className="block" aria-label={`Ver categoría ${category.name}`}>
                <div className="relative h-32 sm:h-36 md:h-40 overflow-hidden">
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
                      <span className="text-3xl sm:text-4xl font-bold text-muted-foreground">
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <CardContent className="p-2 sm:p-3">
                  <h3 className="font-semibold text-base sm:text-lg mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-1">
                      {category.description}
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 w-full text-xs sm:text-sm h-8 group-hover:bg-primary group-hover:text-primary-foreground"
                    asChild
                  >
                    <span>
                      Ver productos
                      <ArrowRight className="ml-1 h-3 w-3 inline" aria-hidden="true" />
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

