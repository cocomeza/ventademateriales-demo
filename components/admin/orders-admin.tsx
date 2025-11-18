"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle2, XCircle, Clock, Package, Truck, History } from "lucide-react";
import { OrderStatusHistoryView } from "./order-status-history";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            status_history:order_status_history(*)
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      toast({
        title: "Error",
        description: "Supabase no está configurado",
        variant: "destructive",
      });
      return;
    }

    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;

      const { data: { user } } = await supabase.auth.getUser();
      const previousStatus = order.status;

      // Si el estado cambia a "delivered", descontar stock (si no estaba entregado antes)
      if (newStatus === "delivered" && order.status !== "delivered") {
        await updateStock(order.items);
        
        // Actualizar order_id en los movimientos recién creados
        await supabase
          .from("inventory_movements")
          .update({ order_id: orderId })
          .is("order_id", null)
          .eq("user_id", user?.id || "")
          .gte("created_at", new Date(Date.now() - 5000).toISOString());
      }

      // Si se cancela un pedido entregado, restaurar stock
      if (
        (newStatus === "cancelled" || newStatus === "pending") &&
        order.status === "delivered"
      ) {
        await restoreStock(order.items);
      }

      // Actualizar estado del pedido
      const { error: updateError } = await supabase
        .from("orders")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", orderId);

      if (updateError) throw updateError;

      // Registrar cambio de estado en historial
      const { error: historyError } = await supabase
        .from("order_status_history")
        .insert({
          order_id: orderId,
          previous_status: previousStatus,
          new_status: newStatus,
          changed_by: user?.id || null,
          notes: null,
        });

      if (historyError) throw historyError;

      toast({
        title: "Pedido actualizado",
        description: `El estado del pedido se actualizó a ${newStatus}`,
      });

      loadOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el pedido",
        variant: "destructive",
      });
    }
  };

  const updateStock = async (items: any[]) => {
    if (!isSupabaseConfigured() || !supabase) return;

    const { data: { user } } = await supabase.auth.getUser();

    for (const item of items) {
      const { data: product } = await supabase
        .from("products")
        .select("stock")
        .eq("id", item.id)
        .single();

      if (product) {
        const previousStock = product.stock;
        const newStock = Math.max(0, previousStock - item.quantity);
        
        // Actualizar stock
        await (supabase
          .from("products") as any)
          .update({ stock: newStock })
          .eq("id", item.id);

        // Registrar movimiento
        await (supabase.from("inventory_movements") as any).insert({
          product_id: item.id,
          movement_type: "sale",
          quantity: item.quantity,
          previous_stock: previousStock,
          new_stock: newStock,
          reason: "Venta",
          user_id: user?.id || null,
          order_id: null, // Se actualizará después
        });
      }
    }
  };

  const restoreStock = async (items: any[]) => {
    if (!isSupabaseConfigured() || !supabase) return;

    const { data: { user } } = await supabase.auth.getUser();

    for (const item of items) {
      const { data: product } = await supabase
        .from("products")
        .select("stock")
        .eq("id", item.id)
        .single();

      if (product) {
        const previousStock = product.stock;
        const newStock = previousStock + item.quantity;
        
        // Actualizar stock
        await (supabase
          .from("products") as any)
          .update({ stock: newStock })
          .eq("id", item.id);

        // Registrar movimiento
        await (supabase.from("inventory_movements") as any).insert({
          product_id: item.id,
          movement_type: "return",
          quantity: item.quantity,
          previous_stock: previousStock,
          new_stock: newStock,
          reason: "Devolución por cancelación",
          user_id: user?.id || null,
        });
      }
    }
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      pending: <Clock className="h-4 w-4 text-yellow-600" />,
      preparing: <Clock className="h-4 w-4 text-blue-600" />,
      ready: <CheckCircle2 className="h-4 w-4 text-purple-600" />,
      shipped: <CheckCircle2 className="h-4 w-4 text-indigo-600" />,
      delivered: <CheckCircle2 className="h-4 w-4 text-green-600" />,
      cancelled: <XCircle className="h-4 w-4 text-red-600" />,
    };
    return icons[status] || <Clock className="h-4 w-4 text-gray-600" />;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendiente",
      preparing: "En Preparación",
      ready: "Listo para Enviar",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      preparing: "bg-blue-100 text-blue-800",
      ready: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No hay pedidos
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">
                      {order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {order.customer_name || "Sin nombre"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.customer_email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        onClick={() => setSelectedOrder(order)}
                      >
                        {order.items.length} producto(s)
                      </Button>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString("es-AR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          updateOrderStatus(order.id, value)
                        }
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="preparing">En Preparación</SelectItem>
                          <SelectItem value="ready">Listo para Enviar</SelectItem>
                          <SelectItem value="shipped">Enviado</SelectItem>
                          <SelectItem value="delivered">Entregado</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={selectedOrder !== null}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Pedido</DialogTitle>
            <DialogDescription>
              Pedido #{selectedOrder?.id.slice(0, 8)}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Cliente</h3>
                <p>{selectedOrder.customer_name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedOrder.customer_email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedOrder.customer_phone}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Productos</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between border-b pb-2"
                    >
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold pt-4 border-t">
                <span>Total</span>
                <span>{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

