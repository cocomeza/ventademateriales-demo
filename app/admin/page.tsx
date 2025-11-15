import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  let stats = {
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  };

  try {
    const supabase = await createClient();
    
    // Obtener estadísticas
    const [productsResult, ordersResult, customersResult] = await Promise.all([
      supabase.from("products").select("id", { count: "exact" }),
      supabase.from("orders").select("id, total", { count: "exact" }),
      supabase.from("orders").select("customer_email").not("customer_email", "is", null),
    ]);

    stats.totalProducts = productsResult.count || 0;
    stats.totalOrders = ordersResult.count || 0;
    
    // Contar clientes únicos
    if (customersResult.data) {
      const uniqueCustomers = new Set(customersResult.data.map(o => o.customer_email).filter(Boolean));
      stats.totalCustomers = uniqueCustomers.size;
    }

    // Calcular ingresos totales
    if (ordersResult.data) {
      stats.totalRevenue = ordersResult.data.reduce((sum, order) => sum + (order.total || 0), 0);
    }
  } catch (error) {
    // Si hay error, mostrar dashboard con datos en 0
    console.error("Error loading stats:", error);
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Total de productos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Total de pedidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Clientes únicos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Ingresos totales</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bienvenido al Panel de Administración</CardTitle>
          <CardDescription>
            Gestiona productos, pedidos, clientes y más desde aquí
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Usa el menú de navegación superior para acceder a las diferentes secciones:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li><strong>Productos:</strong> Crear, editar, eliminar y gestionar el inventario</li>
              <li><strong>Pedidos:</strong> Ver y gestionar pedidos, actualizar estados y stock</li>
              <li><strong>Clientes:</strong> Ver información de clientes y su historial</li>
              <li><strong>Categorías:</strong> Gestionar categorías de productos</li>
              <li><strong>Alertas Stock:</strong> Ver productos con stock bajo</li>
              <li><strong>Descuentos:</strong> Crear y gestionar promociones</li>
              <li><strong>Precios Cliente:</strong> Configurar precios personalizados</li>
              <li><strong>Importar/Exportar:</strong> Exportar datos o importar productos desde CSV</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

