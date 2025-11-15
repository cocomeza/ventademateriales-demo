"use client";

import { useEffect, useState } from "react";
import { CustomerPrice, Product, Customer } from "@/types";
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
import { Loader2, Plus, Edit, Trash2, DollarSign } from "lucide-react";

export function CustomerPricesAdmin() {
  const [customerPrices, setCustomerPrices] = useState<CustomerPrice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<CustomerPrice | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customer_id: "",
    product_id: "",
    price: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (isSupabaseConfigured() && supabase) {
        // Cargar precios por cliente
        const { data: pricesData, error: pricesError } = await supabase
          .from("customer_prices")
          .select(`
            *,
            customer:customers(name, email),
            product:products(name, base_price)
          `)
          .order("created_at", { ascending: false });

        if (pricesError) throw pricesError;
        setCustomerPrices(pricesData || []);

        // Cargar productos
        const { data: productsData } = await supabase
          .from("products")
          .select("id, name, base_price")
          .order("name");
        setProducts(productsData || []);

        // Cargar clientes
        const { data: customersData } = await supabase
          .from("customers")
          .select("id, name, email")
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

  const handleOpenDialog = (price?: CustomerPrice) => {
    if (price) {
      setEditingPrice(price);
      setFormData({
        customer_id: price.customer_id,
        product_id: price.product_id,
        price: price.price.toString(),
      });
    } else {
      setEditingPrice(null);
      setFormData({
        customer_id: "",
        product_id: "",
        price: "",
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

    if (!formData.customer_id || !formData.product_id || !formData.price) {
      toast({
        title: "Error",
        description: "Completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      const priceData = {
        customer_id: formData.customer_id,
        product_id: formData.product_id,
        price: parseFloat(formData.price),
      };

      if (editingPrice) {
        const { error } = await supabase
          .from("customer_prices")
          .update(priceData)
          .eq("id", editingPrice.id);

        if (error) throw error;
        toast({
          title: "Precio actualizado",
          description: "El precio se actualizó correctamente",
        });
      } else {
        const { error } = await supabase
          .from("customer_prices")
          .insert(priceData);

        if (error) throw error;
        toast({
          title: "Precio creado",
          description: "El precio se creó correctamente",
        });
      }

      setDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al guardar el precio",
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

    if (!confirm("¿Estás seguro de eliminar este precio personalizado?")) return;

    try {
      const { error } = await supabase
        .from("customer_prices")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({
        title: "Precio eliminado",
        description: "El precio se eliminó correctamente",
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el precio",
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Precios Personalizados por Cliente</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Precio Personalizado
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Precio Base</TableHead>
                <TableHead>Precio Personalizado</TableHead>
                <TableHead>Descuento</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerPrices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No hay precios personalizados
                  </TableCell>
                </TableRow>
              ) : (
                customerPrices.map((cp: any) => {
                  const customer = cp.customer;
                  const product = cp.product;
                  const discount = product?.base_price
                    ? ((product.base_price - cp.price) / product.base_price) * 100
                    : 0;

                  return (
                    <TableRow key={cp.id}>
                      <TableCell className="font-medium">
                        {customer?.name || "N/A"}
                      </TableCell>
                      <TableCell>{product?.name || "N/A"}</TableCell>
                      <TableCell>
                        {product?.base_price
                          ? formatPrice(product.base_price)
                          : "N/A"}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatPrice(cp.price)}
                      </TableCell>
                      <TableCell>
                        {discount > 0 ? (
                          <span className="text-green-600">
                            -{discount.toFixed(1)}%
                          </span>
                        ) : discount < 0 ? (
                          <span className="text-red-600">
                            +{Math.abs(discount).toFixed(1)}%
                          </span>
                        ) : (
                          "0%"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(cp)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(cp.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPrice ? "Editar Precio Personalizado" : "Nuevo Precio Personalizado"}
            </DialogTitle>
            <DialogDescription>
              {editingPrice
                ? "Modifica el precio personalizado para este cliente"
                : "Define un precio especial para un cliente específico"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="customer_id">Cliente *</Label>
              <Select
                value={formData.customer_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, customer_id: value })
                }
                disabled={!!editingPrice}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} ({customer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="product_id">Producto *</Label>
              <Select
                value={formData.product_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, product_id: value })
                }
                disabled={!!editingPrice}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - Precio base: {formatPrice(product.base_price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Precio Personalizado *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
                required
              />
              {formData.product_id && formData.price && (
                <p className="text-sm text-muted-foreground">
                  Precio base:{" "}
                  {formatPrice(
                    products.find((p) => p.id === formData.product_id)?.base_price || 0
                  )}
                  {" • "}
                  Descuento:{" "}
                  {(() => {
                    const product = products.find((p) => p.id === formData.product_id);
                    if (!product) return "0%";
                    const discount =
                      ((product.base_price - parseFloat(formData.price || "0")) /
                        product.base_price) *
                      100;
                    return `${discount.toFixed(1)}%`;
                  })()}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingPrice ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

