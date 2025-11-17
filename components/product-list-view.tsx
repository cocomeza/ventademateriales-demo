"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { calculateProductPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ProductListViewProps {
  products: Product[];
}

export function ProductListView({ products }: ProductListViewProps) {
  const addToCart = useCartStore((state) => state.addItem);
  const { toast } = useToast();
  const [wishlistStatus, setWishlistStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Cargar estado de wishlist para todos los productos
    const loadWishlistStatus = async () => {
      if (!isSupabaseConfigured() || !supabase) return;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("wishlists")
          .select("product_id")
          .eq("user_id", user.id);

        if (data) {
          const status: Record<string, boolean> = {};
          products.forEach((product) => {
            status[product.id] = data.some((item) => item.product_id === product.id);
          });
          setWishlistStatus(status);
        }
      } catch (error) {
        console.error("Error loading wishlist status:", error);
      }
    };

    loadWishlistStatus();
  }, [products]);

  const handleAddToCart = (product: Product) => {
    const images = product.images && product.images.length > 0
      ? product.images.sort((a, b) => a.display_order - b.display_order).map(img => img.image_url)
      : [];
    const displayPrice = calculateProductPrice(product, {});

    addToCart({
      id: product.id,
      name: product.name,
      price: displayPrice,
      quantity: 1,
      image_url: images[0] || null,
    });
    toast({
      title: "Agregado al carrito",
      description: `${product.name} agregado correctamente`,
    });
  };

  const handleToggleWishlist = async (product: Product) => {
    if (!isSupabaseConfigured() || !supabase) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para usar favoritos",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para usar favoritos",
          variant: "destructive",
        });
        return;
      }

      const isInWishlist = wishlistStatus[product.id];

      if (isInWishlist) {
        const { error } = await supabase
          .from("wishlists")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", product.id);

        if (error) throw error;
        
        setWishlistStatus((prev) => ({ ...prev, [product.id]: false }));
        toast({
          title: "Eliminado",
          description: `${product.name} eliminado de favoritos`,
        });
      } else {
        const { error } = await supabase
          .from("wishlists")
          .insert({
            user_id: user.id,
            product_id: product.id,
          });

        if (error) throw error;
        
        setWishlistStatus((prev) => ({ ...prev, [product.id]: true }));
        toast({
          title: "Agregado",
          description: `${product.name} agregado a favoritos`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar favoritos",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {products.map((product) => {
        const images = product.images && product.images.length > 0
          ? product.images.sort((a, b) => a.display_order - b.display_order).map(img => img.image_url)
          : [];
        const displayPrice = calculateProductPrice(product, {});
        const isOutOfStock = product.stock <= 0;
        const inWishlist = wishlistStatus[product.id] || false;

        return (
          <Card
            key={product.id}
            className="border-primary/10 hover:border-primary/30 transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex flex-col sm:flex-row gap-4 p-4">
              {/* Imagen */}
              <Link href={`/products/${product.id}`} className="flex-shrink-0">
                <div className="relative w-full sm:w-32 h-48 sm:h-32 bg-muted rounded-lg overflow-hidden group cursor-pointer hover:opacity-90 transition-opacity">
                  {images.length > 0 ? (
                    <Image
                      src={images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 128px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                      Sin imagen
                    </div>
                  )}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-md text-sm font-semibold">
                        Sin Stock
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Contenido */}
              <div className="flex-1 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <div>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="text-lg font-semibold text-primary hover:underline line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(displayPrice)}
                      </span>
                      {product.wholesale_price && (
                        <p className="text-xs text-muted-foreground">
                          Mayorista: {formatPrice(product.wholesale_price)}
                        </p>
                      )}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Stock: </span>
                      <span className={product.stock <= product.min_stock ? "text-destructive font-semibold" : "font-semibold"}>
                        {product.stock}
                      </span>
                    </div>
                    {product.sku && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">SKU: </span>
                        <span className="font-mono">{product.sku}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex sm:flex-col gap-2 sm:min-w-[140px]">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={isOutOfStock}
                    className="flex-1 sm:w-full"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                  <Button
                    variant={inWishlist ? "default" : "outline"}
                    onClick={() => handleToggleWishlist(product)}
                    className="flex-1 sm:w-full"
                    size="sm"
                  >
                    <Heart className={`h-4 w-4 mr-2 ${inWishlist ? "fill-current" : ""}`} />
                    {inWishlist ? "En Favoritos" : "Favoritos"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

