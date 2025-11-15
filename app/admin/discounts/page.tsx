import { DiscountsAdmin } from "@/components/admin/discounts-admin";

export default function AdminDiscountsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Gestión de Descuentos</h1>
      </div>
      <DiscountsAdmin />
    </div>
  );
}

