"use client";

import { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FileDown, FileUp, Loader2 } from "lucide-react";
import { exportToCSV, parseCSV } from "@/lib/utils";
import { Product } from "@/types";

export function ImportExportAdmin() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const exportProducts = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      toast({
        title: "Error",
        description: "Supabase no está configurado",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) throw error;

      if (data && data.length > 0) {
        exportToCSV(data, `productos_${new Date().toISOString().split("T")[0]}.csv`);
        toast({
          title: "Exportación exitosa",
          description: `Se exportaron ${data.length} productos`,
        });
      } else {
        toast({
          title: "Sin datos",
          description: "No hay productos para exportar",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al exportar productos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportOrders = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      toast({
        title: "Error",
        description: "Supabase no está configurado",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*");

      if (error) throw error;

      if (data && data.length > 0) {
        exportToCSV(data, `pedidos_${new Date().toISOString().split("T")[0]}.csv`);
        toast({
          title: "Exportación exitosa",
          description: `Se exportaron ${data.length} pedidos`,
        });
      } else {
        toast({
          title: "Sin datos",
          description: "No hay pedidos para exportar",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al exportar pedidos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isSupabaseConfigured() || !supabase) {
      toast({
        title: "Error",
        description: "Supabase no está configurado",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const text = await file.text();
      const data = parseCSV(text);

      if (data.length === 0) {
        toast({
          title: "Error",
          description: "El archivo CSV está vacío o es inválido",
          variant: "destructive",
        });
        return;
      }

      // Validar que tenga las columnas necesarias
      const requiredColumns = ["name", "price", "stock", "category"];
      const columns = Object.keys(data[0]);
      const missingColumns = requiredColumns.filter(
        (col) => !columns.includes(col)
      );

      if (missingColumns.length > 0) {
        toast({
          title: "Error",
          description: `Faltan columnas: ${missingColumns.join(", ")}`,
          variant: "destructive",
        });
        return;
      }

      // Preparar datos para insertar
      const productsToInsert: Partial<Product>[] = data.map((row) => ({
        name: row.name,
        description: row.description || null,
        price: parseFloat(row.price),
        stock: parseInt(row.stock),
        category: row.category,
        image_url: row.image_url || null,
      }));

      const { error } = await supabase
        .from("products")
        .insert(productsToInsert);

      if (error) throw error;

      toast({
        title: "Importación exitosa",
        description: `Se importaron ${productsToInsert.length} productos`,
      });

      // Limpiar input
      event.target.value = "";
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al importar productos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Exportar Datos</CardTitle>
          <CardDescription>
            Descarga los datos en formato CSV
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={exportProducts}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4 mr-2" />
            )}
            Exportar Productos
          </Button>
          <Button
            onClick={exportOrders}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4 mr-2" />
            )}
            Exportar Pedidos
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Importar Productos</CardTitle>
          <CardDescription>
            Importa productos desde un archivo CSV
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                El archivo CSV debe tener las siguientes columnas:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>name (requerido)</li>
                <li>price (requerido)</li>
                <li>stock (requerido)</li>
                <li>category (requerido)</li>
                <li>description (opcional)</li>
                <li>image_url (opcional)</li>
              </ul>
            </div>
            <div>
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                disabled={loading}
                className="hidden"
                id="csv-import"
              />
              <Button
                onClick={() => document.getElementById("csv-import")?.click()}
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileUp className="h-4 w-4 mr-2" />
                )}
                Seleccionar Archivo CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

