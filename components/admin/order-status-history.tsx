"use client";

import { OrderStatusHistory } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User } from "lucide-react";

interface OrderStatusHistoryProps {
  history: OrderStatusHistory[];
}

export function OrderStatusHistoryView({ history }: OrderStatusHistoryProps) {
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

  if (history.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No hay historial de cambios
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {history.map((entry, index) => (
        <Card key={entry.id} className="text-sm">
          <CardContent className="p-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {entry.previous_status
                      ? `${getStatusLabel(entry.previous_status)} → ${getStatusLabel(entry.new_status)}`
                      : getStatusLabel(entry.new_status)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.created_at).toLocaleString("es-AR")}
                  </p>
                  {entry.notes && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {entry.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

