import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchProductCatalog } from "@/components/search-product-catalog";

export const metadata: Metadata = {
  title: "Buscar Productos - MaterialesYA",
  description: "Busca productos de construcción en MaterialesYA",
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const searchTerm = searchParams.q || "";

  return (
    <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          {searchTerm ? `Resultados para "${searchTerm}"` : "Buscar Productos"}
        </h1>
        {searchTerm && (
          <p className="text-sm sm:text-base text-muted-foreground">
            Encuentra los productos que buscas
          </p>
        )}
      </div>
      <Suspense fallback={<div>Cargando...</div>}>
        <SearchProductCatalog searchTerm={searchTerm} />
      </Suspense>
    </main>
  );
}

