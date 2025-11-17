"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { mockProducts } from "@/lib/mock-data";
import { ProductCarousel } from "@/components/product-carousel";
import { ProductListView } from "@/components/product-list-view";
import { Pagination } from "@/components/pagination";
import { ViewToggle } from "@/components/view-toggle";
import { useViewStore } from "@/store/view-store";
import { Loader2 } from "lucide-react";

interface SearchProductCatalogProps {
  searchTerm: string;
}

export function SearchProductCatalog({ searchTerm }: SearchProductCatalogProps) {
  const { viewMode } = useViewStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        if (isSupabaseConfigured() && supabase && searchTerm) {
          const { data, error } = await supabase
            .from("products")
            .select(`
              *,
              images:product_images(*),
              variants:product_variants(*)
            `)
            .ilike("name", `%${searchTerm}%`)
            .eq("active", true)
            .order("created_at", { ascending: false });

          if (!error && data) {
            setProducts(data as Product[]);
          } else {
            // Fallback a mock data
            const filtered = mockProducts.filter(p =>
              p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setProducts(filtered);
          }
        } else if (searchTerm) {
          // Fallback a mock data
          const filtered = mockProducts.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setProducts(filtered);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error searching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!searchTerm) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          Ingresa un término de búsqueda para encontrar productos.
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No se encontraron productos para "{searchTerm}".
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <p className="text-sm sm:text-base text-muted-foreground">
          {products.length} {products.length === 1 ? "producto encontrado" : "productos encontrados"}
        </p>
        <ViewToggle />
      </div>
      
      {viewMode === "grid" ? (
        <ProductCarousel 
          products={paginatedProducts} 
          itemsPerView={4}
          className="mt-4"
        />
      ) : (
        <ProductListView products={paginatedProducts} />
      )}
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          itemsPerPage={itemsPerPage}
          totalItems={products.length}
        />
      )}
    </div>
  );
}

