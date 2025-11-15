"use client";

import Image from "next/image";
import { Product } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Heart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { calculateProductPrice } from "@/lib/pricing";
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
        const { error } = await supabase.from("wishlists").insert({
          user_id: user.id,
          product_id: product.id,
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
    <Card className="flex flex-col">
      <CardHeader className="p-0 relative">
        <Link href={`/products/${product.id}`}>
          <div className="relative w-full h-48 bg-muted rounded-t-lg overflow-hidden group cursor-pointer hover:opacity-90 transition-opacity">
            {images.length > 0 ? (
              <>
                <Image
                  src={images[mainImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover transition-opacity"
                />
                {images.length > 1 && (
                  <div className="absolute bottom-2 left-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white z-10"
              onClick={(e) => {
                e.preventDefault();
                handleToggleWishlist();
              }}
            >
              <Heart
                className={`h-4 w-4 ${
                  isInWishlist ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {product.description}
          </p>
        )}
        {product.variants && product.variants.length > 0 && (
          <div className="mt-2">
            <Label className="text-sm mb-1 block">Variante</Label>
            <Select value={selectedVariant || ""} onValueChange={setSelectedVariant}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una variante" />
              </SelectTrigger>
              <SelectContent>
                {product.variants.map((variant) => (
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
            Stock: {selectedVariantObj ? selectedVariantObj.stock : product.stock}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
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

