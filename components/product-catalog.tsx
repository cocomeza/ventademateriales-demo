"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { mockProducts } from "@/lib/mock-data";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ProductComparator } from "@/components/product-comparator";

export function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, searchTerm, categoryFilter, priceFilter, sortBy, minPrice, maxPrice, inStockOnly]);

  useEffect(() => {
    // Generar sugerencias de búsqueda
    if (searchTerm.length > 2) {
      const suggestions = products
        .map((p) => p.name)
        .filter((name) =>
          name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5);
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, products]);

  const loadProducts = async () => {
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
          .from("products")
          .select(`
            *,
            images:product_images(*),
            variants:product_variants(*)
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } else {
        // Usar datos mock si Supabase no está configurado
        setProducts(mockProducts);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      // En caso de error, usar datos mock
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filtrar por búsqueda (nombre, descripción, SKU, código de barras)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.sku?.toLowerCase().includes(searchLower) ||
          product.barcode?.toLowerCase().includes(searchLower)
      );
    }

    // Filtrar por categoría
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter || 
        (product.category_id && product.category_id === categoryFilter)
      );
    }

    // Filtrar por precio (rango)
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        filtered = filtered.filter((product) => product.base_price >= min);
      }
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        filtered = filtered.filter((product) => product.base_price <= max);
      }
    }

    // Filtrar por precio (categorías predefinidas)
    if (priceFilter !== "all") {
      filtered = filtered.filter((product) => {
        const price = product.base_price;
        switch (priceFilter) {
          case "low":
            return price < 10000;
          case "medium":
            return price >= 10000 && price < 50000;
          case "high":
            return price >= 50000;
          default:
            return true;
        }
      });
    }

    // Filtrar por stock
    if (inStockOnly) {
      filtered = filtered.filter((product) => product.stock > 0);
    }

    // Ordenar productos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.base_price - b.base_price;
        case "price-high":
          return b.base_price - a.base_price;
        case "name":
          return a.name.localeCompare(b.name);
        case "stock":
          return b.stock - a.stock;
        case "newest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredProducts(filtered);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = Array.from(
    new Set(products.map((p) => p.category))
  ).filter(Boolean);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Buscar producto
              </label>
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Categoría</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Precio</label>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los precios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los precios</SelectItem>
                  <SelectItem value="low">Menos de $10,000</SelectItem>
                  <SelectItem value="medium">$10,000 - $50,000</SelectItem>
                  <SelectItem value="high">Más de $50,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No se encontraron productos que coincidan con los filtros.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            Mostrando {paginatedProducts.length} de {filteredProducts.length} productos
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
          
          <ProductComparator products={filteredProducts} />
        </>
      )}
    </div>
  );
}

