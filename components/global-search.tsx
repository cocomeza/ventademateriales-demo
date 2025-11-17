"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";
import { Product } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { mockProducts } from "@/lib/mock-data";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export function GlobalSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      setLoading(true);
      const timeoutId = setTimeout(async () => {
        try {
          if (isSupabaseConfigured() && supabase) {
            const { data, error } = await supabase
              .from("products")
              .select(`
                *,
                images:product_images(*),
                variants:product_variants(*)
              `)
              .ilike("name", `%${searchTerm}%`)
              .eq("active", true)
              .limit(5);

            if (!error && data) {
              setSuggestions(data as Product[]);
            } else {
              // Fallback a mock data
              const filtered = mockProducts.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
              ).slice(0, 5);
              setSuggestions(filtered);
            }
          } else {
            // Fallback a mock data
            const filtered = mockProducts.filter(p =>
              p.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).slice(0, 5);
            setSuggestions(filtered);
          }
        } catch (error) {
          console.error("Error searching products:", error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
      setLoading(false);
    }
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleSuggestionClick = (productId: string) => {
    router.push(`/products/${productId}`);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="search"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pr-10"
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0 h-full px-3"
          aria-label="Buscar"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </form>

      {/* Dropdown de sugerencias */}
      {isOpen && (searchTerm.length >= 2 || suggestions.length > 0) && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 text-center">
                <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary" />
              </div>
            ) : suggestions.length > 0 ? (
              <div className="py-2">
                {suggestions.map((product) => {
                  const images = product.images && product.images.length > 0
                    ? product.images.sort((a, b) => a.display_order - b.display_order).map(img => img.image_url)
                    : [];
                  
                  return (
                    <button
                      key={product.id}
                      onClick={() => handleSuggestionClick(product.id)}
                      className="w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors flex items-center gap-3"
                    >
                      {images.length > 0 && (
                        <div className="relative w-12 h-12 flex-shrink-0 bg-muted rounded overflow-hidden">
                          <img
                            src={images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        {product.category && (
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
                <div className="border-t pt-2 px-4 pb-2">
                  <Link
                    href={`/buscar?q=${encodeURIComponent(searchTerm)}`}
                    className="text-sm text-primary hover:underline font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Ver todos los resultados
                  </Link>
                </div>
              </div>
            ) : searchTerm.length >= 2 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No se encontraron productos
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

