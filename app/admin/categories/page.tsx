import { CategoriesAdmin } from "@/components/admin/categories-admin";

export default function AdminCategoriesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Gestión de Categorías</h1>
      </div>
      <CategoriesAdmin />
    </div>
  );
}

