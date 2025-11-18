"use client";

import { Product } from "@/types";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  showViewAll?: boolean;
  viewAllUrl?: string;
  maxItems?: number;
  className?: string;
}

export function FeaturedProducts({
  products,
  title = "Productos Destacados",
  showViewAll = true,
  viewAllUrl = "/",
  maxItems = 8,
  className,
}: FeaturedProductsProps) {
  const displayedProducts = products.slice(0, maxItems);

  if (displayedProducts.length === 0) {
    return null;
  }

  return (
    <section className={className} aria-labelledby="featured-products-title">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-4">
        <h2 id="featured-products-title" className="text-xl sm:text-2xl font-bold">
          {title}
        </h2>
        {showViewAll && (
          <Button variant="outline" size="sm" asChild>
            <Link href={viewAllUrl}>
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

