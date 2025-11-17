"use client";

import { useEffect, useState } from "react";
import { StockAlert } from "@/types";
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
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertTriangle, CheckCircle, Bell } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface StockAlertWithProduct extends StockAlert {
  product: {
    id: string;
    name: string;
    stock: number;
    min_stock: number;
    base_price: number;
  };
}

export function StockAlerts() {
  const [alerts, setAlerts] = useState<StockAlertWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAlerts();
    // Recargar cada 30 segundos
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = async () => {
    try {
      if (!isSupabaseConfigured() || !supabase) {
        setLoading(false);
        return;
      }

      // Obtener todos los productos y filtrar los que tienen stock bajo
      const { data: allProducts, error: productsError } = await supabase
        .from("products")
        .select("id, name, stock, min_stock, base_price");

      if (productsError) throw productsError;

      // Filtrar productos con stock <= min_stock
      const products = (allProducts || []).filter(
        (product) => product.stock <= product.min_stock
      );

      // Obtener alertas existentes
      const { data: existingAlerts, error: alertsError } = await supabase
        .from("stock_alerts")
        .select("*")
        .eq("resolved", false);

      if (alertsError) throw alertsError;

      // Crear o actualizar alertas
      const alertsToCreate: StockAlertWithProduct[] = [];
      
      for (const product of products || []) {
        const existingAlert = existingAlerts?.find(
          (a) => a.product_id === product.id
        );

        if (!existingAlert) {
          // Crear nueva alerta
          const { data: newAlert, error: createError } = await supabase
            .from("stock_alerts")
            .insert({
              product_id: product.id,
              threshold: product.min_stock,
              notified: false,
            })
            .select()
            .single();

          if (!createError && newAlert) {
            alertsToCreate.push({
              ...newAlert,
              product,
            });
          }
        } else {
          alertsToCreate.push({
            ...existingAlert,
            product,
          });
        }
      }

      // Marcar como resueltas las alertas de productos que ya no tienen stock bajo
      const resolvedProductIds = (products || []).map((p) => p.id);
      const alertsToResolve = existingAlerts?.filter(
        (a) => !resolvedProductIds.includes(a.product_id)
      ) || [];

      for (const alert of alertsToResolve) {
        await supabase
          .from("stock_alerts")
          .update({
            resolved: true,
            resolved_at: new Date().toISOString(),
          })
          .eq("id", alert.id);
      }

      setAlerts(alertsToCreate);

      // Notificar si hay nuevas alertas sin notificar
      const newAlerts = alertsToCreate.filter((a) => !a.notified);
      if (newAlerts.length > 0) {
        toast({
          title: "Alerta de Stock Bajo",
          description: `${newAlerts.length} producto(s) con stock bajo`,
          variant: "destructive",
        });

        // Marcar como notificadas
        for (const alert of newAlerts) {
          await supabase
            .from("stock_alerts")
            .update({
              notified: true,
              notified_at: new Date().toISOString(),
            })
            .eq("id", alert.id);
        }
      }
    } catch (error) {
      console.error("Error loading alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsResolved = async (alertId: string) => {
    if (!isSupabaseConfigured() || !supabase) return;

    try {
      const { error } = await supabase
        .from("stock_alerts")
        .update({
          resolved: true,
          resolved_at: new Date().toISOString(),
        })
        .eq("id", alertId);

      if (error) throw error;
      toast({
        title: "Alerta resuelta",
        description: "La alerta se marcó como resuelta",
      });
      loadAlerts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al resolver la alerta",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const activeAlerts = alerts.filter((a) => !a.resolved);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Alertas de Stock Bajo</h2>
          {activeAlerts.length > 0 && (
            <span className="bg-destructive text-destructive-foreground rounded-full px-2 py-1 text-xs font-bold">
              {activeAlerts.length}
            </span>
          )}
        </div>
        <Button variant="outline" onClick={loadAlerts}>
          Actualizar
        </Button>
      </div>

      {activeAlerts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <p className="text-muted-foreground">
              No hay alertas de stock bajo en este momento
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Stock Actual</TableHead>
                  <TableHead>Stock Mínimo</TableHead>
                  <TableHead>Diferencia</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeAlerts.map((alert) => {
                  const difference = alert.product.stock - alert.product.min_stock;
                  return (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/admin/products`}
                          className="hover:text-primary"
                        >
                          {alert.product.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-destructive">
                          {alert.product.stock}
                        </span>
                      </TableCell>
                      <TableCell>{alert.product.min_stock}</TableCell>
                      <TableCell>
                        <span className="text-destructive">
                          {difference >= 0 ? "+" : ""}
                          {difference}
                        </span>
                      </TableCell>
                      <TableCell>
                        {formatPrice(alert.product.base_price)}
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-destructive">
                          <AlertTriangle className="h-4 w-4" />
                          Crítico
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsResolved(alert.id)}
                        >
                          Marcar como Resuelta
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

