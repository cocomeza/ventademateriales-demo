"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Product } from "@/types";

export function CartView() {
  const items = useCartStore((state) => state.items);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const total = useCartStore((state) => state.getTotal());
  const setProducts = useCartStore((state) => state.setProducts);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      let products: Product[] = [];

      if (isSupabaseConfigured() && supabase) {
        // Cargar productos
        const { data: productsData } = await supabase
          .from("products")
          .select("*");
        products = productsData || [];
      } else {
        products = mockProducts;
      }

      setProducts(products);
    } catch (error) {
      console.error("Error loading products:", error);
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-semibold mb-2"
        >
          Tu carrito está vacío
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground mb-6"
        >
          Agrega productos desde el catálogo
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button asChild>
            <Link href="/">Ver productos</Link>
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
    >
      <div className="lg:col-span-2 space-y-3 sm:space-y-4">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              layout
            >
              <Card>
                <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative w-full sm:w-24 h-48 sm:h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
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

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-1">{item.name}</h3>
                    <p className="text-base sm:text-lg font-bold mb-2 sm:mb-4">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => decrement(item.id)}
                        aria-label="Disminuir cantidad"
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
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="text-base sm:text-lg font-bold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(item.id, item.name)}
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="lg:col-span-1"
      >
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Resumen del pedido</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <CheckoutDialog items={items} total={total} subtotal={subtotal} discountAmount={0} />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

