import { OrdersAdmin } from "@/components/admin/orders-admin";

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Gestión de Pedidos</h1>
      <OrdersAdmin />
    </div>
  );
}

