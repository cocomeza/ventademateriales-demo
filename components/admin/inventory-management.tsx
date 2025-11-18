"use client";

import { useEffect, useState } from "react";
import { Product, InventoryMovement } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, Package, TrendingUp, TrendingDown, Loader2, Plus, History } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export function InventoryManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const [adjustmentData, setAdjustmentData] = useState({
    quantity: "",
    reason: "",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        const [productsResult, movementsResult] = await Promise.all([
          supabase.from("products").select("*").order("name"),
          supabase
            .from("inventory_movements")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(100),
        ]);

        if (productsResult.error) throw productsResult.error;
        if (movementsResult.error) throw movementsResult.error;

        setProducts(productsResult.data || []);
        setMovements(movementsResult.data || []);
        checkStockAlerts(productsResult.data || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkStockAlerts = async (productsList: Product[]) => {
    if (!isSupabaseConfigured() || !supabase) return;

    for (const product of productsList) {
      if (product.stock <= product.min_stock && product.stock >= 0) {
        // Verificar si ya existe una alerta activa
        const { data: existingAlert } = await supabase
          .from("stock_alerts")
          .select("*")
          .eq("product_id", product.id)
          .eq("resolved", false)
          .single();

        if (!existingAlert) {
          // Crear nueva alerta
          await (supabase.from("stock_alerts") as any).insert({
            product_id: product.id,
            threshold: product.min_stock,
            notified: false,
          });
        }
      } else if (product.stock > product.min_stock) {
        // Resolver alertas si el stock se recuperó
        await supabase
          .from("stock_alerts")
          .update({
            resolved: true,
            resolved_at: new Date().toISOString(),
          })
          .eq("product_id", product.id)
          .eq("resolved", false);
      }
    }
  };

  const handleAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !isSupabaseConfigured() || !supabase) return;

    const quantityChange = parseInt(adjustmentData.quantity);
    if (isNaN(quantityChange) || quantityChange === 0) {
      toast({
        title: "Error",
        description: "La cantidad debe ser un número diferente de cero",
        variant: "destructive",
      });
      return;
    }

    const previousStock = selectedProduct.stock;
    const newStock = Math.max(0, previousStock + quantityChange);

    try {
      // Actualizar stock del producto
      const { error: updateError } = await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id", selectedProduct.id);

      if (updateError) throw updateError;

      // Registrar movimiento
      const { data: { user } } = await supabase.auth.getUser();
      const { error: movementError } = await supabase
        .from("inventory_movements")
        .insert({
          product_id: selectedProduct.id,
          movement_type: quantityChange > 0 ? "entry" : "exit",
          quantity: Math.abs(quantityChange),
          previous_stock: previousStock,
          new_stock: newStock,
          reason: adjustmentData.reason || null,
          notes: adjustmentData.notes || null,
          user_id: user?.id || null,
        });

      if (movementError) throw movementError;

      toast({
        title: "Ajuste realizado",
        description: `Stock actualizado de ${previousStock} a ${newStock}`,
      });

      setAdjustmentDialogOpen(false);
      setAdjustmentData({ quantity: "", reason: "", notes: "" });
      setSelectedProduct(null);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al realizar el ajuste",
        variant: "destructive",
      });
    }
  };

  const loadProductHistory = async (productId: string) => {
    if (!isSupabaseConfigured() || !supabase) return;

    try {
      const { data, error } = await supabase
        .from("inventory_movements")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error loading history:", error);
      return [];
    }
  };

  const getMovementTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      entry: "Entrada",
      exit: "Salida",
      adjustment: "Ajuste",
      sale: "Venta",
      return: "Devolución",
    };
    return labels[type] || type;
  };

  const getMovementTypeIcon = (type: string) => {
    if (type === "entry" || type === "return") {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    }
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const lowStockProducts = products.filter((p) => p.stock <= p.min_stock);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alertas de stock bajo */}
      {lowStockProducts.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Stock Bajo
            </CardTitle>
            <CardDescription>
              {lowStockProducts.length} producto(s) con stock por debajo del mínimo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-destructive/5"
                >
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Stock: {product.stock} / Mínimo: {product.min_stock}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedProduct(product);
                      setAdjustmentDialogOpen(true);
                    }}
                  >
                    Ajustar Stock
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="movements">Movimientos Recientes</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Productos con Control de Inventario</CardTitle>
              <CardDescription>
                Gestiona el stock, SKU y códigos de barras de tus productos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Código de Barras</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Mínimo</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No hay productos
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {product.sku || "-"}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {product.barcode || "-"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              product.stock <= product.min_stock
                                ? "text-destructive font-semibold"
                                : product.stock <= product.min_stock * 2
                                ? "text-yellow-600 font-semibold"
                                : ""
                            }
                          >
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell>{product.min_stock}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                setSelectedProduct(product);
                                const history = await loadProductHistory(product.id);
                                setMovements(history);
                                setHistoryDialogOpen(true);
                              }}
                            >
                              <History className="h-4 w-4 mr-2" />
                              Historial
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedProduct(product);
                                setAdjustmentDialogOpen(true);
                              }}
                            >
                              Ajustar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Movimientos de Inventario</CardTitle>
              <CardDescription>
                Historial de entradas, salidas y ajustes de stock
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Stock Anterior</TableHead>
                    <TableHead>Stock Nuevo</TableHead>
                    <TableHead>Motivo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No hay movimientos registrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    movements.map((movement) => {
                      const product = products.find((p) => p.id === movement.product_id);
                      return (
                        <TableRow key={movement.id}>
                          <TableCell>
                            {new Date(movement.created_at).toLocaleString("es-AR")}
                          </TableCell>
                          <TableCell className="font-medium">
                            {product?.name || "Producto eliminado"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getMovementTypeIcon(movement.movement_type)}
                              {getMovementTypeLabel(movement.movement_type)}
                            </div>
                          </TableCell>
                          <TableCell
                            className={
                              movement.movement_type === "entry" ||
                              movement.movement_type === "return"
                                ? "text-green-600 font-semibold"
                                : "text-red-600 font-semibold"
                            }
                          >
                            {movement.movement_type === "entry" ||
                            movement.movement_type === "return"
                              ? "+"
                              : "-"}
                            {movement.quantity}
                          </TableCell>
                          <TableCell>{movement.previous_stock}</TableCell>
                          <TableCell className="font-semibold">
                            {movement.new_stock}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {movement.reason || "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de ajuste de inventario */}
      <Dialog open={adjustmentDialogOpen} onOpenChange={setAdjustmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajustar Inventario</DialogTitle>
            <DialogDescription>
              {selectedProduct?.name} - Stock actual: {selectedProduct?.stock}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdjustment}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">
                  Cantidad (positivo para entrada, negativo para salida)
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={adjustmentData.quantity}
                  onChange={(e) =>
                    setAdjustmentData({ ...adjustmentData, quantity: e.target.value })
                  }
                  placeholder="Ej: +10 o -5"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reason">Motivo *</Label>
                <Select
                  value={adjustmentData.reason}
                  onValueChange={(value) =>
                    setAdjustmentData({ ...adjustmentData, reason: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compra">Compra de proveedor</SelectItem>
                    <SelectItem value="devolucion">Devolución de cliente</SelectItem>
                    <SelectItem value="perdida">Pérdida o daño</SelectItem>
                    <SelectItem value="conteo">Ajuste por conteo físico</SelectItem>
                    <SelectItem value="traslado">Traslado entre almacenes</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notas adicionales</Label>
                <Input
                  id="notes"
                  value={adjustmentData.notes}
                  onChange={(e) =>
                    setAdjustmentData({ ...adjustmentData, notes: e.target.value })
                  }
                  placeholder="Información adicional sobre el ajuste"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAdjustmentDialogOpen(false);
                  setSelectedProduct(null);
                  setAdjustmentData({ quantity: "", reason: "", notes: "" });
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">Aplicar Ajuste</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de historial */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Historial de Movimientos - {selectedProduct?.name}
            </DialogTitle>
            <DialogDescription>
              Stock actual: {selectedProduct?.stock} | Mínimo: {selectedProduct?.min_stock}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {movements.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay movimientos registrados
              </p>
            ) : (
              movements.map((movement) => (
                <Card key={movement.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getMovementTypeIcon(movement.movement_type)}
                        <div>
                          <p className="font-semibold">
                            {getMovementTypeLabel(movement.movement_type)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(movement.created_at).toLocaleString("es-AR")}
                          </p>
                          {movement.reason && (
                            <p className="text-sm mt-1">Motivo: {movement.reason}</p>
                          )}
                          {movement.notes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {movement.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={
                            movement.movement_type === "entry" ||
                            movement.movement_type === "return"
                              ? "text-green-600 font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {movement.movement_type === "entry" ||
                          movement.movement_type === "return"
                            ? "+"
                            : "-"}
                          {movement.quantity}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {movement.previous_stock} → {movement.new_stock}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

