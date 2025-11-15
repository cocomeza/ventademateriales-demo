import { ProductsAdmin } from "@/components/admin/products-admin";

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Gestión de Productos</h1>
      </div>
      <ProductsAdmin />
    </div>
  );
}

