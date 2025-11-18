import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminNavbar } from "@/components/admin/admin-navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificar autenticación y permisos
  try {
    const supabase = await createClient();
    
    // Primero verificar la sesión
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Error getting session:", sessionError);
      redirect("/auth/login?redirect=/admin");
    }
    
    if (!session || !session.user) {
      console.log("No hay sesión activa, redirigiendo al login");
      redirect("/auth/login?redirect=/admin");
    }
    
    const user = session.user;
    console.log("Usuario autenticado en admin layout:", user.email, "ID:", user.id);

    // Verificar rol de admin o seller
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle(); // Usar maybeSingle en lugar de single para evitar error si no existe

    console.log("Datos de rol obtenidos:", roleData);
    console.log("Error al obtener rol:", roleError);

    // Si hay un error que no sea "no encontrado", redirigir
    if (roleError && roleError.code !== 'PGRST116') { // PGRST116 es "no rows returned"
      console.error("Error getting user role:", roleError);
      redirect("/?error=unauthorized");
    }

    const userRole = roleData?.role || "customer";
    console.log("Rol del usuario:", userRole);
    
    if (userRole !== "admin" && userRole !== "seller") {
      console.log("Usuario no tiene permisos de admin o seller, redirigiendo");
      redirect("/?error=unauthorized");
    }
    
    console.log("Acceso autorizado al panel de admin");
  } catch (error) {
    // Si hay un error, redirigir al login para seguridad
    console.error("Error checking admin access:", error);
    redirect("/auth/login?redirect=/admin");
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">{children}</div>
    </div>
  );
}

