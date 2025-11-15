"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Loader2, Package } from "lucide-react";

interface OrdersHistoryProps {
  userId: string;
}

export function OrdersHistory({ userId }: OrdersHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [userId]);

  const loadOrders = async () => {
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } else {
        // Si Supabase no está configurado, mostrar lista vacía
        setOrders([]);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-semibold mb-2">No tienes pedidos aún</h2>
        <p className="text-muted-foreground">
          Tus pedidos aparecerán aquí una vez que los realices
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Pedido #{order.id.slice(0, 8)}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(order.created_at).toLocaleDateString("es-AR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status === "pending"
                  ? "Pendiente"
                  : order.status === "completed"
                  ? "Completado"
                  : order.status}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm border-b pb-2"
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
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold">
                {formatPrice(order.total)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

