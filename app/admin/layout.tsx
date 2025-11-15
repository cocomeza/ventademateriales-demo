import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, Users, ShoppingBag, FileDown, FileUp, Home, Warehouse, Tag, DollarSign, FolderTree, Bell } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificar autenticación y permisos
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      redirect("/auth/login?redirect=/admin");
    }

    // Verificar rol de admin o seller
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    const userRole = roleData?.role || "customer";
    
    if (userRole !== "admin" && userRole !== "seller") {
      redirect("/?error=unauthorized");
    }
  } catch (error) {
    // Si Supabase no está configurado, permitir acceso para desarrollo
    console.error("Error checking admin access:", error);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-2xl font-bold">
                Panel de Administración
              </Link>
              <nav className="flex items-center space-x-4">
                <Link href="/admin/products">
                  <Button variant="ghost" size="sm">
                    <Package className="h-4 w-4 mr-2" />
                    Productos
                  </Button>
                </Link>
                <Link href="/admin/orders">
                  <Button variant="ghost" size="sm">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Pedidos
                  </Button>
                </Link>
                <Link href="/admin/customers">
                  <Button variant="ghost" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Clientes
                  </Button>
                </Link>
                <Link href="/admin/inventory">
                  <Button variant="ghost" size="sm">
                    <Warehouse className="h-4 w-4 mr-2" />
                    Inventario
                  </Button>
                </Link>
                <Link href="/admin/stock-alerts">
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-4 w-4 mr-2" />
                    Alertas Stock
                  </Button>
                </Link>
                <Link href="/admin/categories">
                  <Button variant="ghost" size="sm">
                    <FolderTree className="h-4 w-4 mr-2" />
                    Categorías
                  </Button>
                </Link>
                <Link href="/admin/discounts">
                  <Button variant="ghost" size="sm">
                    <Tag className="h-4 w-4 mr-2" />
                    Descuentos
                  </Button>
                </Link>
                <Link href="/admin/customer-prices">
                  <Button variant="ghost" size="sm">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Precios Cliente
                  </Button>
                </Link>
                <Link href="/admin/import-export">
                  <Button variant="ghost" size="sm">
                    <FileDown className="h-4 w-4 mr-2" />
                    Importar/Exportar
                  </Button>
                </Link>
              </nav>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Volver al sitio
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
}

