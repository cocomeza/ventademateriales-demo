"use client";

import { useEffect, useState } from "react";
import { Discount, Product, Customer } from "@/types";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Edit, Trash2, Tag } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function DiscountsAdmin() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discount_type: "percentage" as "percentage" | "fixed" | "volume",
    discount_value: "",
    min_quantity: "",
    min_amount: "",
    product_id: "",
    category: "",
    customer_id: "",
    start_date: "",
    end_date: "",
    active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (isSupabaseConfigured() && supabase) {
        // Cargar descuentos
        const { data: discountsData, error: discountsError } = await supabase
          .from("discounts")
          .select("*")
          .order("created_at", { ascending: false });

        if (discountsError) throw discountsError;
        setDiscounts(discountsData || []);

        // Cargar productos
        const { data: productsData } = await supabase
          .from("products")
          .select("id, name, category")
          .order("name");
        setProducts(productsData || []);

        // Cargar clientes
        const { data: customersData } = await supabase
          .from("customers")
          .select("id, name")
          .order("name");
        setCustomers(customersData || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Error al cargar los datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (discount?: Discount) => {
    if (discount) {
      setEditingDiscount(discount);
      setFormData({
        name: discount.name,
        description: discount.description || "",
        discount_type: discount.discount_type,
        discount_value: discount.discount_value.toString(),
        min_quantity: discount.min_quantity?.toString() || "",
        min_amount: discount.min_amount?.toString() || "",
        product_id: discount.product_id || "",
        category: discount.category || "",
        customer_id: discount.customer_id || "",
        start_date: discount.start_date
          ? new Date(discount.start_date).toISOString().slice(0, 16)
          : "",
        end_date: discount.end_date
          ? new Date(discount.end_date).toISOString().slice(0, 16)
          : "",
        active: discount.active,
      });
    } else {
      setEditingDiscount(null);
      setFormData({
        name: "",
        description: "",
        discount_type: "percentage",
        discount_value: "",
        min_quantity: "",
        min_amount: "",
        product_id: "",
        category: "",
        customer_id: "",
        start_date: "",
        end_date: "",
        active: true,
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      toast({
        title: "Error",
        description: "Supabase no está configurado",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.discount_value) {
      toast({
        title: "Error",
        description: "Completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      const discountData = {
        name: formData.name,
        description: formData.description || null,
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        min_quantity: formData.min_quantity
          ? parseInt(formData.min_quantity)
          : null,
        min_amount: formData.min_amount ? parseFloat(formData.min_amount) : null,
        product_id: formData.product_id || null,
        category: formData.category || null,
        customer_id: formData.customer_id || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        active: formData.active,
      };

      if (editingDiscount) {
        const { error } = await supabase
          .from("discounts")
          .update(discountData)
          .eq("id", editingDiscount.id);

        if (error) throw error;
        toast({
          title: "Descuento actualizado",
          description: "El descuento se actualizó correctamente",
        });
      } else {
        const { error } = await supabase.from("discounts").insert(discountData);

        if (error) throw error;
        toast({
          title: "Descuento creado",
          description: "El descuento se creó correctamente",
        });
      }

      setDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al guardar el descuento",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      toast({
        title: "Error",
        description: "Supabase no está configurado",
        variant: "destructive",
      });
      return;
    }

    if (!confirm("¿Estás seguro de eliminar este descuento?")) return;

    try {
      const { error } = await supabase.from("discounts").delete().eq("id", id);

      if (error) throw error;
      toast({
        title: "Descuento eliminado",
        description: "El descuento se eliminó correctamente",
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el descuento",
        variant: "destructive",
      });
    }
  };

  const getDiscountTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      percentage: "Porcentaje",
      fixed: "Monto fijo",
      volume: "Por volumen",
    };
    return labels[type] || type;
  };

  const categories = Array.from(
    new Set(products.map((p) => p.category))
  ).filter(Boolean);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Descuentos y Promociones</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Descuento
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Aplicación</TableHead>
                <TableHead>Fechas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No hay descuentos
                  </TableCell>
                </TableRow>
              ) : (
                discounts.map((discount) => (
                  <TableRow key={discount.id}>
                    <TableCell className="font-medium">
                      {discount.name}
                    </TableCell>
                    <TableCell>
                      {getDiscountTypeLabel(discount.discount_type)}
                    </TableCell>
                    <TableCell>
                      {discount.discount_type === "percentage"
                        ? `${discount.discount_value}%`
                        : formatPrice(discount.discount_value)}
                    </TableCell>
                    <TableCell>
                      {discount.product_id
                        ? `Producto específico`
                        : discount.category
                        ? `Categoría: ${discount.category}`
                        : discount.customer_id
                        ? `Cliente específico`
                        : "General"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {discount.start_date || discount.end_date ? (
                        <div>
                          {discount.start_date && (
                            <div>
                              Desde:{" "}
                              {new Date(discount.start_date).toLocaleDateString(
                                "es-AR"
                              )}
                            </div>
                          )}
                          {discount.end_date && (
                            <div>
                              Hasta:{" "}
                              {new Date(discount.end_date).toLocaleDateString(
                                "es-AR"
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        "Sin límite"
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          discount.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {discount.active ? "Activo" : "Inactivo"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(discount)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(discount.id)}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDiscount ? "Editar Descuento" : "Nuevo Descuento"}
            </DialogTitle>
            <DialogDescription>
              {editingDiscount
                ? "Modifica los datos del descuento"
                : "Completa los datos para crear un nuevo descuento"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ej: Descuento de verano"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descripción del descuento"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="discount_type">Tipo de Descuento *</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, discount_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                    <SelectItem value="fixed">Monto Fijo</SelectItem>
                    <SelectItem value="volume">Por Volumen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="discount_value">Valor *</Label>
                <Input
                  id="discount_value"
                  type="number"
                  step="0.01"
                  value={formData.discount_value}
                  onChange={(e) =>
                    setFormData({ ...formData, discount_value: e.target.value })
                  }
                  placeholder={
                    formData.discount_type === "percentage" ? "10" : "1000"
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="min_quantity">Cantidad Mínima</Label>
                <Input
                  id="min_quantity"
                  type="number"
                  value={formData.min_quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, min_quantity: e.target.value })
                  }
                  placeholder="Ej: 10"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="min_amount">Monto Mínimo</Label>
                <Input
                  id="min_amount"
                  type="number"
                  step="0.01"
                  value={formData.min_amount}
                  onChange={(e) =>
                    setFormData({ ...formData, min_amount: e.target.value })
                  }
                  placeholder="Ej: 50000"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="product_id">Producto Específico</Label>
                <Select
                  value={formData.product_id}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      product_id: value,
                      category: "",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los productos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los productos</SelectItem>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      category: value,
                      product_id: "",
                    })
                  }
                  disabled={!!formData.product_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las categorías</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="customer_id">Cliente Específico</Label>
                <Select
                  value={formData.customer_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, customer_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los clientes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los clientes</SelectItem>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_date">Fecha de Inicio</Label>
                <Input
                  id="start_date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="end_date">Fecha de Fin</Label>
                <Input
                  id="end_date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
                className="h-4 w-4"
              />
              <Label htmlFor="active">Descuento activo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingDiscount ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

