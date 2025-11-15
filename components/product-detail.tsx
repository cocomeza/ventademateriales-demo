"use client";

import { useState } from "react";
import { Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart, Heart, ArrowLeft, Minus, Plus } from "lucide-react";
import { calculateProductPrice } from "@/lib/pricing";
import Image from "next/image";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

interface ProductDetailProps {
  product: any; // Product with relations
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const { toast } = useToast();

  const images = product.images && product.images.length > 0
    ? product.images.sort((a: any, b: any) => a.display_order - b.display_order).map((img: any) => img.image_url)
    : [];

  const selectedVariantObj = selectedVariant 
    ? product.variants?.find((v: any) => v.id === selectedVariant)
    : null;

  const displayPrice = selectedVariantObj
    ? calculateProductPrice(product, {}) + selectedVariantObj.price_modifier
    : calculateProductPrice(product, {});

  const availableStock = selectedVariantObj ? selectedVariantObj.stock : product.stock;

  const handleAddToCart = () => {
    const productName = selectedVariantObj
      ? `${product.name} - ${selectedVariantObj.value}`
      : product.name;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: selectedVariantObj ? `${product.id}-${selectedVariantObj.id}` : product.id,
        name: productName,
        price: displayPrice,
        quantity: 1,
        image_url: images[0] || null,
      });
    }

    toast({
      title: "Producto agregado",
      description: `${quantity} x ${productName} se agregó al carrito`,
    });
  };

  const handleToggleWishlist = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para usar la lista de deseos",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para usar la lista de deseos",
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
          description: "Producto eliminado de tu lista de deseos",
        });
      } else {
        const { error } = await supabase
          .from("wishlists")
          .insert({
            user_id: user.id,
            product_id: product.id,
            variant_id: selectedVariant || null,
          });

        if (error) throw error;
        setIsInWishlist(true);
        toast({
          title: "Agregado",
          description: "Producto agregado a tu lista de deseos",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar la lista de deseos",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al catálogo
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Galería de imágenes */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full bg-muted rounded-lg overflow-hidden">
            {images.length > 0 ? (
              <>
                <Image
                  src={images[mainImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {images.length > 1 && (
                  <>
                    {mainImageIndex > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80"
                        onClick={() => setMainImageIndex(mainImageIndex - 1)}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    )}
                    {mainImageIndex < images.length - 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80"
                        onClick={() => setMainImageIndex(mainImageIndex + 1)}
                      >
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                      </Button>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Sin imagen
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setMainImageIndex(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                    mainImageIndex === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - Imagen ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            {product.category && (
              <p className="text-muted-foreground">
                Categoría: {product.category?.name || product.category}
              </p>
            )}
          </div>

          <div>
            <p className="text-3xl font-bold mb-2">{formatPrice(displayPrice)}</p>
            {product.wholesale_price && (
              <p className="text-sm text-muted-foreground">
                Precio mayorista: {formatPrice(product.wholesale_price)}
              </p>
            )}
          </div>

          {product.description && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Descripción</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {product.variants && product.variants.length > 0 && (
            <div>
              <Label className="text-base mb-2 block">Variante</Label>
              <Select value={selectedVariant || ""} onValueChange={setSelectedVariant}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una variante" />
                </SelectTrigger>
                <SelectContent>
                  {product.variants.map((variant: any) => (
                    <SelectItem key={variant.id} value={variant.id}>
                      {variant.name}: {variant.value}
                      {variant.price_modifier !== 0 && (
                        <span className="ml-2">
                          ({variant.price_modifier > 0 ? "+" : ""}
                          {formatPrice(variant.price_modifier)})
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center gap-4">
            <Label className="text-base">Cantidad</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">
              Stock disponible: {availableStock}
            </span>
          </div>

          <div className="flex gap-4">
            <Button
              className="flex-1"
              size="lg"
              onClick={handleAddToCart}
              disabled={
                product.variants && product.variants.length > 0
                  ? !selectedVariant || availableStock === 0
                  : availableStock === 0
              }
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.variants && product.variants.length > 0 && !selectedVariant
                ? "Selecciona una variante"
                : availableStock === 0
                ? "Sin stock"
                : "Agregar al carrito"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleWishlist}
            >
              <Heart
                className={`h-5 w-5 ${
                  isInWishlist ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">SKU:</span>
                  <span className="ml-2 font-mono">{product.sku || "N/A"}</span>
                </div>
                {product.barcode && (
                  <div>
                    <span className="text-muted-foreground">Código de Barras:</span>
                    <span className="ml-2 font-mono">{product.barcode}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Stock:</span>
                  <span className={`ml-2 font-semibold ${
                    availableStock <= product.min_stock ? "text-destructive" : ""
                  }`}>
                    {availableStock}
                  </span>
                </div>
                {product.min_stock && (
                  <div>
                    <span className="text-muted-foreground">Stock Mínimo:</span>
                    <span className="ml-2">{product.min_stock}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

