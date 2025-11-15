"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { CheckoutDialog } from "@/components/checkout-dialog";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { mockProducts } from "@/lib/mock-data";
import { Product, Discount } from "@/types";

export function CartView() {
  const items = useCartStore((state) => state.items);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const total = useCartStore((state) => state.getTotal());
  const discountAmount = useCartStore((state) => state.getDiscountAmount());
  const setProducts = useCartStore((state) => state.setProducts);
  const setDiscounts = useCartStore((state) => state.setDiscounts);
  const { toast } = useToast();

  useEffect(() => {
    loadProductsAndDiscounts();
  }, []);

  const loadProductsAndDiscounts = async () => {
    try {
      let products: Product[] = [];
      let discounts: Discount[] = [];

      if (isSupabaseConfigured() && supabase) {
        // Cargar productos
        const { data: productsData } = await supabase
          .from("products")
          .select("*");
        products = productsData || [];

        // Cargar descuentos activos
        const now = new Date().toISOString();
        const { data: discountsData } = await supabase
          .from("discounts")
          .select("*")
          .eq("active", true)
          .or(`start_date.is.null,end_date.is.null,start_date.lte.${now},end_date.gte.${now}`);
        discounts = discountsData || [];
      } else {
        products = mockProducts;
      }

      setProducts(products);
      setDiscounts(discounts);
    } catch (error) {
      console.error("Error loading products/discounts:", error);
      setProducts(mockProducts);
    }
  };

  const handleRemove = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast({
      title: "Producto eliminado",
      description: `${productName} se eliminó del carrito`,
    });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-semibold mb-2">Tu carrito está vacío</h2>
        <p className="text-muted-foreground mb-6">
          Agrega productos desde el catálogo
        </p>
        <Button asChild>
          <Link href="/">Ver productos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                      Sin imagen
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                  <p className="text-lg font-bold mb-4">
                    {formatPrice(item.price)}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => decrement(item.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => increment(item.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(item.id, item.name)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Resumen del pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuento</span>
                <span className="font-medium">-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <CheckoutDialog items={items} total={total} subtotal={subtotal} discountAmount={discountAmount} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

