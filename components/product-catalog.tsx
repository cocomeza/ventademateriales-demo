"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { Product } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { mockProducts } from "@/lib/mock-data";
import { ProductCard } from "@/components/product-card";
import { ProductCarousel } from "@/components/product-carousel";
import { ProductListView } from "@/components/product-list-view";
import { Pagination } from "@/components/pagination";
import { ViewToggle } from "@/components/view-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Search, Filter, X, SlidersHorizontal, CheckCircle2 } from "lucide-react";
import { ProductComparator } from "@/components/product-comparator";
import { Label } from "@/components/ui/label";
import { useViewStore } from "@/store/view-store";

export function ProductCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { viewMode } = useViewStore();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [categoryFilter, setCategoryFilter] = useState<string>(searchParams.get("category") || "all");
  const [priceFilter, setPriceFilter] = useState<string>(searchParams.get("price") || "all");
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sort") || "newest");
  const [minPrice, setMinPrice] = useState<string>(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get("maxPrice") || "");
  const [minStock, setMinStock] = useState<string>(searchParams.get("minStock") || "");
  const [maxStock, setMaxStock] = useState<string>(searchParams.get("maxStock") || "");
  const [inStockOnly, setInStockOnly] = useState(searchParams.get("inStock") === "true");
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 12;

  const hasActiveFilters = searchTerm || categoryFilter !== "all" || priceFilter !== "all" || minPrice || maxPrice || minStock || maxStock || inStockOnly;

  // Actualizar URL cuando cambian los filtros
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    if (priceFilter !== "all") params.set("price", priceFilter);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minStock) params.set("minStock", minStock);
    if (maxStock) params.set("maxStock", maxStock);
    if (inStockOnly) params.set("inStock", "true");
    if (sortBy !== "newest") params.set("sort", sortBy);
    if (currentPage > 1) params.set("page", currentPage.toString());

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  }, [searchTerm, categoryFilter, priceFilter, minPrice, maxPrice, minStock, maxStock, inStockOnly, sortBy, currentPage, router]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setPriceFilter("all");
    setMinPrice("");
    setMaxPrice("");
    setMinStock("");
    setMaxStock("");
    setInStockOnly(false);
    setSortBy("newest");
    setCurrentPage(1);
    router.replace(window.location.pathname, { scroll: false });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
    // Solo resetear página si cambian los filtros (no cuando cambia la página manualmente)
    const pageParam = searchParams.get("page");
    if (!pageParam || pageParam === "1") {
      setCurrentPage(1);
    }
  }, [products, searchTerm, categoryFilter, priceFilter, sortBy, minPrice, maxPrice, minStock, maxStock, inStockOnly, searchParams]);

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

        if (error) {
          // Si es un error de autenticación, mostrar mensaje más claro
          if (error.message?.includes('Invalid API key') || error.message?.includes('JWT')) {
            console.error("Error de autenticación de Supabase:", error.message);
            console.error("Verifica que NEXT_PUBLIC_SUPABASE_ANON_KEY sea correcta en tu archivo .env.local");
          }
          throw error;
        }
        setProducts(data || []);
      } else {
        // Usar datos mock si Supabase no está configurado
        console.warn("Supabase no está configurado, usando datos mock");
        setProducts(mockProducts);
      }
    } catch (error: any) {
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
    
    // Filtrar por rango de stock
    if (minStock) {
      const min = parseFloat(minStock);
      if (!isNaN(min)) {
        filtered = filtered.filter((product) => product.stock >= min);
      }
    }
    if (maxStock) {
      const max = parseFloat(maxStock);
      if (!isNaN(max)) {
        filtered = filtered.filter((product) => product.stock <= max);
      }
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Barra de búsqueda y filtros principales */}
      <Card className="mb-6 border-2 border-primary/20 shadow-md">
        <CardContent className="p-4 sm:p-6">
          {/* Búsqueda y botones principales */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar productos, SKU, código de barras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 border-primary/20 focus:border-primary focus:ring-primary/20"
              />
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-primary/20 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchTerm(suggestion);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-primary/5 transition-colors text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2">
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="h-11"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtros
                {hasActiveFilters && (
                  <span className="ml-2 h-5 w-5 rounded-full bg-primary-foreground text-primary text-xs flex items-center justify-center">
                    {[searchTerm, categoryFilter !== "all", priceFilter !== "all", minPrice, maxPrice, inStockOnly].filter(Boolean).length}
                  </span>
                )}
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="h-11"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Filtros expandibles */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-primary/20 pt-4 mt-4 space-y-4 overflow-hidden"
              >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Categoría */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary" />
                    Categoría
                  </Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-10 border-primary/20">
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

                {/* Precio predefinido */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary" />
                    Rango de Precio
                  </Label>
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger className="h-10 border-primary/20">
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

                {/* Precio mínimo */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Precio Mínimo</Label>
                  <Input
                    type="number"
                    placeholder="Mínimo"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="h-10 border-primary/20 focus:border-primary focus:ring-primary/20"
                  />
                </div>

                {/* Precio máximo */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Precio Máximo</Label>
                  <Input
                    type="number"
                    placeholder="Máximo"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="h-10 border-primary/20 focus:border-primary focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Filtros adicionales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Solo en stock */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="inStockOnly"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-primary/20 text-primary focus:ring-primary/20 focus:ring-2"
                  />
                  <Label htmlFor="inStockOnly" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Solo productos en stock
                  </Label>
                </div>

                {/* Ordenar */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                    Ordenar por
                  </Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-10 border-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Más recientes</SelectItem>
                      <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
                      <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
                      <SelectItem value="name">Nombre A-Z</SelectItem>
                      <SelectItem value="stock">Stock disponible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filtros activos (chips) */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-primary/20">
              <span className="text-sm font-semibold text-muted-foreground">Filtros activos:</span>
              {searchTerm && (
                <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Búsqueda: &quot;{searchTerm}&quot;
                  <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-primary/80">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {categoryFilter !== "all" && (
                <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Categoría: {categoryFilter}
                  <button onClick={() => setCategoryFilter("all")} className="ml-1 hover:text-primary/80">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {priceFilter !== "all" && (
                <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Precio: {priceFilter === "low" ? "Menos de $10,000" : priceFilter === "medium" ? "$10,000 - $50,000" : "Más de $50,000"}
                  <button onClick={() => setPriceFilter("all")} className="ml-1 hover:text-primary/80">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {(minPrice || maxPrice) && (
                <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Precio: ${minPrice || "0"} - ${maxPrice || "∞"}
                  <button onClick={() => { setMinPrice(""); setMaxPrice(""); }} className="ml-1 hover:text-primary/80">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {(minStock || maxStock) && (
                <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Stock: {minStock || "0"} - {maxStock || "∞"}
                  <button onClick={() => { setMinStock(""); setMaxStock(""); }} className="ml-1 hover:text-primary/80">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {inStockOnly && (
                <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Solo en stock
                  <button onClick={() => setInStockOnly(false)} className="ml-1 hover:text-primary/80">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {filteredProducts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-dashed border-primary/20">
              <CardContent className="py-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <Search className="h-8 w-8 text-primary" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
                <p className="text-muted-foreground mb-4">
                  No hay productos que coincidan con los filtros seleccionados.
                </p>
                {hasActiveFilters && (
                  <Button onClick={clearFilters} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Limpiar filtros
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
        <>
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full"></div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Mostrando <span className="text-primary">{paginatedProducts.length}</span> de <span className="text-primary">{filteredProducts.length}</span> productos
                </p>
                {totalPages > 1 && (
                  <p className="text-xs text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ViewToggle />
              {!showFilters && (
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(true)}
                  className="h-9"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Mostrar filtros
                </Button>
              )}
            </div>
          </div>
          
          {/* Vista de productos según el modo seleccionado */}
          {viewMode === "grid" ? (
            <ProductCarousel 
              products={paginatedProducts} 
              itemsPerView={4}
              className="mt-4"
            />
          ) : (
            <ProductListView products={paginatedProducts} />
          )}
          
          {/* Paginación */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            itemsPerPage={itemsPerPage}
            totalItems={filteredProducts.length}
          />
          
          <ProductComparator products={filteredProducts} />
        </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

