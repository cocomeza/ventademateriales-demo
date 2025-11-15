"use client";

import { useEffect, useState } from "react";
import { WishlistItem, Product } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { calculateProductPrice } from "@/lib/pricing";
import Image from "next/image";
import Link from "next/link";

export function WishlistView() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const addToCart = useCartStore((state) => state.addToCart);
  const setProducts = useCartStore((state) => state.setProducts);

  useEffect(() => {
    loadWishlist();
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data } = await supabase.from("products").select("*");
        if (data) setProducts(data);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const loadWishlist = async () => {
    try {
      if (!isSupabaseConfigured() || !supabase) {
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("wishlists")
        .select(`
          *,
          product:products(*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWishlistItems(data || []);
    } catch (error) {
      console.error("Error loading wishlist:", error);
      toast({
        title: "Error",
        description: "Error al cargar la lista de deseos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (itemId: string) => {
    if (!isSupabaseConfigured() || !supabase) return;

    try {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      toast({
        title: "Eliminado",
        description: "Producto eliminado de tu lista de deseos",
      });
      loadWishlist();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el producto",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = (product: Product) => {
    const displayPrice = calculateProductPrice(product, {});
    const images = product.images && product.images.length > 0
      ? product.images.sort((a, b) => a.display_order - b.display_order).map(img => img.image_url)
      : [];

    addToCart({
      id: product.id,
      name: product.name,
      price: displayPrice,
      quantity: 1,
      image_url: images[0] || null,
    });

    toast({
      title: "Producto agregado",
      description: `${product.name} se agregó al carrito`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isSupabaseConfigured() || !supabase) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-semibold mb-2">Debes iniciar sesión</h2>
        <p className="text-muted-foreground mb-6">
          Inicia sesión para ver tu lista de deseos
        </p>
        <Button asChild>
          <Link href="/auth/login">Iniciar Sesión</Link>
        </Button>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-semibold mb-2">Tu lista de deseos está vacía</h2>
        <p className="text-muted-foreground mb-6">
          Agrega productos desde el catálogo haciendo clic en el corazón
        </p>
        <Button asChild>
          <Link href="/">Ver Productos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => {
          const product = item.product as Product;
          if (!product) return null;

          const images = product.images && product.images.length > 0
            ? product.images.sort((a, b) => a.display_order - b.display_order).map(img => img.image_url)
            : [];
          const displayPrice = calculateProductPrice(product, {});

          return (
            <Card key={item.id} className="flex flex-col">
              <CardHeader className="p-0">
                <div className="relative w-full h-48 bg-muted rounded-t-lg overflow-hidden">
                  {images.length > 0 ? (
                    <Image
                      src={images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Sin imagen
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {product.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="text-2xl font-bold">{formatPrice(displayPrice)}</span>
                    {product.wholesale_price && (
                      <span className="text-xs text-muted-foreground block">
                        Mayorista: {formatPrice(product.wholesale_price)}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Stock: {product.stock}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveFromWishlist(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

