import { CustomerPricesAdmin } from "@/components/admin/customer-prices-admin";

export default function AdminCustomerPricesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Precios por Cliente</h1>
      </div>
      <CustomerPricesAdmin />
    </div>
  );
}

