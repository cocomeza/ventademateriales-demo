"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { X, Plus, GitCompare } from "lucide-react";
import { calculateProductPrice } from "@/lib/pricing";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useComparatorStore } from "@/store/comparator-store";

interface ProductComparatorProps {
  products: Product[];
}

export function ProductComparator({ products }: ProductComparatorProps) {
  const { products: selectedProducts, removeProduct, clearComparator, addProduct } = useComparatorStore();
  const [isOpen, setIsOpen] = useState(false);
  
  // Abrir automáticamente si hay productos seleccionados
  useEffect(() => {
    if (selectedProducts.length > 0) {
      setIsOpen(true);
    }
  }, [selectedProducts.length]);

  const handleAddProduct = (product: Product) => {
    addProduct(product);
  };

  const handleRemoveProduct = (productId: string) => {
    removeProduct(productId);
  };

  const handleClearAll = () => {
    clearComparator();
  };

  // Mostrar botón flotante si está cerrado o no hay productos
  if ((selectedProducts.length === 0 && !isOpen) || (!isOpen && selectedProducts.length > 0)) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="shadow-lg"
        >
          <GitCompare className="h-5 w-5 mr-2" />
          Comparar Productos
          {selectedProducts.length > 0 && (
            <span className="ml-2 bg-white text-primary rounded-full px-2 py-0.5 text-xs font-bold">
              {selectedProducts.length}
            </span>
          )}
        </Button>
      </div>
    );
  }
  
  // No mostrar nada si está cerrado y no hay productos
  if (selectedProducts.length === 0 && !isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-6xl">
      <Card className="shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Comparador de Productos ({selectedProducts.length}/4)
          </CardTitle>
          <div className="flex gap-2">
            {selectedProducts.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                Limpiar Todo
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {selectedProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Selecciona hasta 4 productos para comparar
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                {products.slice(0, 8).map((product) => (
                  <Button
                    key={product.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddProduct(product)}
                    className="h-auto flex-col p-2"
                  >
                    <Plus className="h-4 w-4 mb-1" />
                    <span className="text-xs line-clamp-2">{product.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-32">Imagen</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Precio Base</TableHead>
                      <TableHead>Precio Mayorista</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead className="w-20"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedProducts.map((product) => {
                      const images = product.images && product.images.length > 0
                        ? product.images.sort((a, b) => a.display_order - b.display_order).map(img => img.image_url)
                        : [];
                      const displayPrice = calculateProductPrice(product, {});

                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="relative w-16 h-16 bg-muted rounded overflow-hidden">
                              {images.length > 0 ? (
                                <Image
                                  src={images[0]}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                                  Sin imagen
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell className="font-semibold">
                            {formatPrice(displayPrice)}
                          </TableCell>
                          <TableCell>
                            {product.wholesale_price
                              ? formatPrice(product.wholesale_price)
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <span
                              className={
                                product.stock <= product.min_stock
                                  ? "text-destructive font-semibold"
                                  : ""
                              }
                            >
                              {product.stock}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {product.sku || "-"}
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveProduct(product.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {selectedProducts.length < 4 && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Agregar más productos:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {products
                      .filter((p) => !selectedProducts.find((sp) => sp.id === p.id))
                      .slice(0, 10)
                      .map((product) => (
                        <Button
                          key={product.id}
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddProduct(product)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {product.name}
                        </Button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

