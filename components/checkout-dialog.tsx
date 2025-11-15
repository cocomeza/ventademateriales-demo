"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CartItem } from "@/types";
import { formatPrice, formatWhatsAppMessage } from "@/lib/utils";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cart-store";
import { useToast } from "@/components/ui/use-toast";

interface CheckoutDialogProps {
  items: CartItem[];
  total: number;
  subtotal: number;
  discountAmount: number;
}

export function CheckoutDialog({ items, total, subtotal, discountAmount }: CheckoutDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const { toast } = useToast();
  const clearCart = useCartStore((state) => state.clearCart);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  useEffect(() => {
    // Cargar datos del usuario si está autenticado
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setCustomerEmail(user.email || "");
          setCustomerName(user.user_metadata?.full_name || "");
        }
      });
    }
  }, []);

  const handleCheckout = async () => {
    if (!customerName || !customerPhone || !customerEmail) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Guardar orden en Supabase si está configurado y el usuario está autenticado
      if (isSupabaseConfigured() && supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        
        const orderData = {
          user_id: user?.id || null,
          items: items,
          subtotal: subtotal,
          discount_amount: discountAmount,
          total: total,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail,
          status: "pending",
        };

        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert(orderData)
          .select()
          .single();

        if (orderError) throw orderError;

        // Nota: El stock se descuenta automáticamente cuando el administrador marca el pedido como "completed"
        // Esto permite que el admin revise el pedido antes de descontar stock
      }

      // Generar mensaje de WhatsApp
      const message = formatWhatsAppMessage(
        items,
        subtotal,
        discountAmount,
        total,
        customerName,
        customerPhone,
        customerEmail
      );

      // Limpiar carrito
      clearCart();

      // Cerrar diálogo
      setOpen(false);

      // Redirigir a WhatsApp
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");

      toast({
        title: "Pedido enviado",
        description: "Redirigiendo a WhatsApp...",
      });
    } catch (error) {
      console.error("Error en checkout:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al procesar el pedido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          Enviar pedido por WhatsApp
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Completa tus datos</DialogTitle>
          <DialogDescription>
            Ingresa tu información para enviar el pedido por WhatsApp
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Juan Pérez"
            />
          </div>
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+54 11 1234-5678"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="juan@example.com"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCheckout} disabled={loading}>
            {loading ? "Enviando..." : "Enviar pedido"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

