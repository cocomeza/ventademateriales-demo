import { CustomersAdmin } from "@/components/admin/customers-admin";

export default function AdminCustomersPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Gestión de Clientes</h1>
      <CustomersAdmin />
    </div>
  );
}

