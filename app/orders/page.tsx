import { OrdersHistory } from "@/components/orders-history";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect("/auth/login");
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Mis Pedidos</h1>
        <OrdersHistory userId={user.id} />
      </div>
    );
  } catch (error) {
    // Si Supabase no está configurado, redirigir al login
    redirect("/auth/login");
  }
}

