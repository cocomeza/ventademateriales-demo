"use client";

import { useEffect, useState } from "react";
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
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Pencil, Trash2, Eye, Package, Calendar, DollarSign } from "lucide-react";
import { Customer, Order } from "@/types";

export function CustomersAdmin() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      if (isSupabaseConfigured() && supabase) {
        // Cargar clientes de la tabla customers
        const { data: customersData, error: customersError } = await supabase
          .from("customers")
          .select("*")
          .order("created_at", { ascending: false });

        if (customersError) throw customersError;

        setCustomers(customersData || []);
      }
    } catch (error) {
      console.error("Error loading customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomerOrders = async (customer: Customer) => {
    if (!isSupabaseConfigured() || !supabase) return;

    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          status_history:order_status_history(*)
        `)
        .or(`customer_email.eq.${customer.email},customer_id.eq.${customer.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCustomerOrders(data || []);
      setHistoryDialogOpen(true);
    } catch (error) {
      console.error("Error loading customer orders:", error);
      toast({
        title: "Error",
        description: "Error al cargar el historial de pedidos",
        variant: "destructive",
      });
    }
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

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || "",
        address: customer.address || "",
        notes: customer.notes || "",
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSupabaseConfigured() || !supabase) {
      toast({
        title: "Error",
        description: "Supabase no está configurado",
        variant: "destructive",
      });
      return;
    }

    try {
      const customerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        address: formData.address || null,
        notes: formData.notes || null,
      };

      if (editingCustomer) {
        const { error } = await supabase
          .from("customers")
          .update(customerData)
          .eq("id", editingCustomer.id);

        if (error) throw error;
        toast({
          title: "Cliente actualizado",
          description: "El cliente se actualizó correctamente",
        });
      } else {
        const { error } = await supabase.from("customers").insert(customerData);

        if (error) throw error;
        toast({
          title: "Cliente creado",
          description: "El cliente se creó correctamente",
        });
      }

      setDialogOpen(false);
      loadCustomers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al guardar el cliente",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.")) return;

    if (!isSupabaseConfigured() || !supabase) {
      toast({
        title: "Error",
        description: "Supabase no está configurado",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("customers").delete().eq("id", id);

      if (error) throw error;
      toast({
        title: "Cliente eliminado",
        description: "El cliente se eliminó correctamente",
      });
      loadCustomers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el cliente",
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

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCustomer ? "Editar Cliente" : "Nuevo Cliente"}
              </DialogTitle>
              <DialogDescription>
                {editingCustomer
                  ? "Modifica los datos del cliente"
                  : "Completa los datos del nuevo cliente"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    disabled={!!editingCustomer}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notas</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Información adicional sobre el cliente"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingCustomer ? "Actualizar" : "Crear"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Último Pedido</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No hay clientes
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.name}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone || "N/A"}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      {customer.created_at
                        ? new Date(customer.created_at).toLocaleDateString(
                            "es-AR"
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            loadCustomerOrders(customer);
                          }}
                          title="Ver pedidos"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(customer)}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(customer.id)}
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
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

      <Dialog
        open={historyDialogOpen && selectedCustomer !== null}
        onOpenChange={(open) => {
          setHistoryDialogOpen(open);
          if (!open) setSelectedCustomer(null);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Historial Completo - {selectedCustomer?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedCustomer?.email} • {selectedCustomer?.phone || "Sin teléfono"}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Resumen del cliente */}
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Cliente registrado el {selectedCustomer.created_at
                        ? new Date(selectedCustomer.created_at).toLocaleDateString("es-AR")
                        : "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de pedidos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pedidos</h3>
                {customerOrders.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Este cliente aún no tiene pedidos registrados
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  customerOrders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-semibold text-lg">
                              Pedido #{order.id.slice(0, 8)}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(order.created_at).toLocaleDateString(
                                "es-AR",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                            {order.tracking_number && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Tracking: {order.tracking_number}
                              </p>
                            )}
                            {order.shipping_address && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Dirección: {order.shipping_address}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-xl mb-1">
                              {formatPrice(order.total)}
                            </p>
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                            {order.discount_amount && order.discount_amount > 0 && (
                              <p className="text-xs text-green-600 mt-1">
                                Descuento: -{formatPrice(order.discount_amount)}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="border-t pt-3 mt-3">
                          <p className="text-sm font-medium mb-2">Productos:</p>
                          <div className="space-y-1">
                            {order.items.map((item: any, index: number) => (
                              <div
                                key={index}
                                className="flex justify-between text-sm"
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
                          <div className="flex justify-between text-sm mt-2 pt-2 border-t">
                            <span>Subtotal:</span>
                            <span>{formatPrice(order.subtotal || order.total)}</span>
                          </div>
                        </div>

                        {order.notes && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm font-medium mb-1">Notas:</p>
                            <p className="text-sm text-muted-foreground">{order.notes}</p>
                          </div>
                        )}

                        {order.status_history && order.status_history.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm font-medium mb-2">Historial de Estados:</p>
                            <div className="space-y-1">
                              {order.status_history.map((history: any) => (
                                <div key={history.id} className="text-xs text-muted-foreground">
                                  <span className="font-medium">
                                    {getStatusLabel(history.new_status)}
                                  </span>
                                  {" - "}
                                  {new Date(history.created_at).toLocaleString("es-AR")}
                                  {history.notes && ` - ${history.notes}`}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

