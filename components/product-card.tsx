"use client";

import Image from "next/image";
import { Product } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Heart, Package, Tag, TrendingUp, CheckCircle2, AlertCircle, GitCompare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { calculateProductPrice } from "@/lib/pricing";
import { getUserRole, type UserRole } from "@/lib/auth";
import { useComparatorStore } from "@/store/comparator-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { toast } = useToast();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  
  // Comparador
  const { addProduct, removeProduct, isInComparator, canAddMore } = useComparatorStore();
  const isInComparatorState = isInComparator(product.id);

  useEffect(() => {
    getUserRole().then(setUserRole);
  }, []);

  const images = product.images && product.images.length > 0
    ? product.images.sort((a, b) => a.display_order - b.display_order).map(img => img.image_url)
    : product.image_url ? [product.image_url] : [];

  const selectedVariantObj = selectedVariant 
    ? product.variants?.find(v => v.id === selectedVariant)
    : null;

  const displayPrice = selectedVariantObj
    ? calculateProductPrice(product, {}) + selectedVariantObj.price_modifier
    : calculateProductPrice(product, {});

  const handleAddToCart = () => {
    const productName = selectedVariantObj
      ? `${product.name} - ${selectedVariantObj.value}`
      : product.name;

    addToCart({
      id: selectedVariantObj ? `${product.id}-${selectedVariantObj.id}` : product.id,
      name: productName,
      price: displayPrice,
      quantity: 1,
      image_url: images[0] || null,
    });

    toast({
      title: "Producto agregado",
      description: `${productName} se agregó al carrito`,
    });
  };

  const handleToggleComparator = () => {
    if (isInComparatorState) {
      removeProduct(product.id);
      toast({
        title: "Eliminado",
        description: `${product.name} eliminado del comparador`,
      });
    } else {
      if (!canAddMore()) {
        toast({
          title: "Límite alcanzado",
          description: "Puedes comparar hasta 4 productos a la vez",
          variant: "destructive",
        });
        return;
      }
      addProduct(product);
      toast({
        title: "Agregado",
        description: `${product.name} agregado al comparador`,
      });
    }
  };

  const handleToggleWishlist = async () => {
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

      if (isInWishlist) {
        const { error } = await supabase
          .from("wishlists")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", product.id);

        if (error) throw error;
        setIsInWishlist(false);
        toast({
          title: "Eliminado",
          description: "Producto eliminado de tus favoritos",
        });
      } else {
        const { error } = await supabase.from("wishlists").insert({
          user_id: user.id,
          product_id: product.id,
        });

        if (error) throw error;
        setIsInWishlist(true);
        toast({
          title: "Agregado",
          description: "Producto agregado a tus favoritos",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar tus favoritos",
        variant: "destructive",
      });
    }
  };

  const stock = selectedVariantObj ? selectedVariantObj.stock : product.stock;
  const isOutOfStock = stock === 0;

  return (
    <Card className={`flex flex-col h-full border-primary/10 hover:border-primary/30 transition-all shadow-sm hover:shadow-lg ${isOutOfStock ? 'opacity-75' : ''}`} data-testid="product-card">
      <CardHeader className="p-0 relative">
        <Link href={`/products/${product.id}`}>
          <div className="relative w-full h-40 sm:h-44 bg-muted rounded-t-lg overflow-hidden group cursor-pointer hover:opacity-90 transition-opacity">
            {images.length > 0 ? (
              <>
                <Image
                  src={images[mainImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover transition-opacity"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {images.length > 1 && (
                  <div className="absolute bottom-2 left-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" role="group" aria-label="Navegación de imágenes">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.preventDefault();
                          setMainImageIndex(idx);
                        }}
                        className={`flex-1 h-1 rounded ${
                          idx === mainImageIndex ? "bg-white" : "bg-white/50"
                        }`}
                        aria-label={`Ver imagen ${idx + 1} de ${images.length}`}
                        aria-pressed={idx === mainImageIndex}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Sin imagen
              </div>
            )}
            {/* Botones de acción rápida */}
            <div className="absolute top-2 right-2 flex gap-2 z-10">
              {/* Botón comparar - siempre visible */}
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/90 hover:bg-white shadow-md hover:shadow-lg transition-all rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  handleToggleComparator();
                }}
                aria-label={isInComparatorState ? `Quitar ${product.name} del comparador` : `Agregar ${product.name} al comparador`}
              >
                <GitCompare
                  className={`h-4 w-4 transition-all ${
                    isInComparatorState ? "fill-primary text-primary scale-110" : "hover:scale-110"
                  }`}
                  aria-hidden="true"
                />
              </Button>
              
              {/* Ocultar botón de favoritos para admin y seller */}
              {userRole !== "admin" && userRole !== "seller" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/90 hover:bg-white shadow-md hover:shadow-lg transition-all rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    handleToggleWishlist();
                  }}
                  aria-label={isInWishlist ? `Quitar ${product.name} de favoritos` : `Agregar ${product.name} a favoritos`}
                >
                  <Heart
                    className={`h-4 w-4 transition-all ${
                      isInWishlist ? "fill-red-500 text-red-500 scale-110" : "hover:scale-110"
                    }`}
                    aria-hidden="true"
                  />
                </Button>
              )}
            </div>
            {/* Badge de stock en la imagen */}
            {isOutOfStock && (
              <div className="absolute top-2 left-2 z-10">
                <div className="bg-destructive text-destructive-foreground px-2.5 py-1 rounded-md text-xs font-bold shadow-md">
                  Agotado
                </div>
              </div>
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-1 p-3 sm:p-4 space-y-3">
        {/* Título y categoría */}
        <div>
          <Link href={`/products/${product.id}`}>
            <h3 className="font-bold text-sm sm:text-base mb-1 hover:text-primary transition-colors cursor-pointer line-clamp-2 leading-tight">
              {product.name}
            </h3>
          </Link>
          {product.category && (
            <div className="flex items-center gap-1 mt-0.5">
              <Tag className="h-2.5 w-2.5 text-primary" />
              <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                {product.category}
              </span>
            </div>
          )}
        </div>

        {/* Descripción - Ocultada en cards pequeñas para ahorrar espacio */}
        {product.description && (
          <div className="space-y-1 hidden sm:block">
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Variantes - Más compacto */}
        {product.variants && product.variants.length > 0 && (
          <div className="space-y-1.5">
            <Label className="text-[10px] font-semibold text-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              Variante
            </Label>
            <Select value={selectedVariant || ""} onValueChange={setSelectedVariant}>
              <SelectTrigger className="h-8 border-primary/20 text-xs">
                <SelectValue placeholder="Variante" />
              </SelectTrigger>
              <SelectContent>
                {product.variants.map((variant) => (
                  <SelectItem key={variant.id} value={variant.id} className="text-xs">
                    <div className="flex items-center justify-between w-full">
                      <span>{variant.name}: {variant.value}</span>
                      {variant.price_modifier !== 0 && (
                        <span className="ml-2 text-[10px] text-primary font-medium">
                          {variant.price_modifier > 0 ? "+" : ""}
                          {formatPrice(variant.price_modifier)}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Precio y Stock - Más compacto */}
        <div className="space-y-2 pt-2 border-t border-primary/10">
          {/* Precio */}
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-bold text-primary" data-testid="product-price">
                {formatPrice(displayPrice)}
              </span>
            </div>
            {product.wholesale_price && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Tag className="h-2.5 w-2.5" />
                <span className="font-medium">Mayorista: <span className="text-primary font-semibold">{formatPrice(product.wholesale_price)}</span></span>
              </div>
            )}
          </div>

          {/* Stock - Más compacto */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              {(() => {
                const stock = selectedVariantObj ? selectedVariantObj.stock : product.stock;
                const isLowStock = stock > 0 && stock <= (product.min_stock || 10);
                const isOutOfStock = stock === 0;
                
                return (
                  <>
                    {isOutOfStock ? (
                      <div className="flex items-center gap-1 px-1.5 py-0.5 bg-destructive/10 text-destructive rounded text-[10px] font-semibold">
                        <AlertCircle className="h-3 w-3" />
                        Agotado
                      </div>
                    ) : isLowStock ? (
                      <div className="flex items-center gap-1 px-1.5 py-0.5 bg-yellow-500/10 text-yellow-600 rounded text-[10px] font-semibold">
                        <AlertCircle className="h-3 w-3" />
                        Poco
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-500/10 text-green-600 rounded text-[10px] font-semibold">
                        <CheckCircle2 className="h-3 w-3" />
                        Stock
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Package className="h-3 w-3" />
              <span className="font-medium">
                {selectedVariantObj ? selectedVariantObj.stock : product.stock}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0">
        <Button
          className="w-full h-9 text-sm font-semibold shadow-sm hover:shadow-md transition-all"
          onClick={handleAddToCart}
          disabled={
            product.variants && product.variants.length > 0
              ? !selectedVariant || (selectedVariantObj ? selectedVariantObj.stock === 0 : false)
              : product.stock === 0
          }
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.variants && product.variants.length > 0 && !selectedVariant
            ? "Selecciona una variante"
            : (selectedVariantObj ? selectedVariantObj.stock === 0 : product.stock === 0)
            ? "Sin stock"
            : "Agregar al carrito"}
        </Button>
      </CardFooter>
    </Card>
  );
}

